import React, { useState, useMemo } from 'react';
import { Lesson, UserProgress } from '../types';
import { CURRICULUM_MODULES } from '../data/curriculum';
import { 
  CheckCircle, 
  Circle, 
  BookOpen, 
  Play, 
  HelpCircle, 
  Code2, 
  ChevronRight, 
  ChevronDown, 
  Clock, 
  Check, 
  X, 
  Lightbulb, 
  Sparkles, 
  Terminal, 
  FileCode, 
  Copy, 
  Target, 
  Bookmark, 
  Code,
  ArrowLeft,
  ArrowRight,
  ListFilter
} from 'lucide-react';

interface LessonViewProps {
  currentLesson: Lesson;
  onSelectLesson: (lesson: Lesson) => void;
  onOpenInCompiler: (code: string) => void;
  progress: UserProgress;
  onCompleteLesson: (lessonId: string, xpGained: number) => void;
  isCurriculumOpen?: boolean;
  onToggleCurriculum?: () => void;
  onCloseCurriculum?: () => void;
}

// Inline Markdown Parser for bold, code tokens, and italics
const renderFormattedInlineText = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('`') && token.endsWith('`')) {
      const codeVal = token.slice(1, -1);
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 mx-0.5 rounded-md bg-rose-50 text-[#8B0000] font-mono text-[11px] sm:text-xs font-bold border border-rose-200">
          {codeVal}
        </code>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      const boldVal = token.slice(2, -2);
      parts.push(
        <strong key={match.index} className="font-bold text-black">
          {boldVal}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      const italicVal = token.slice(1, -1);
      parts.push(
        <em key={match.index} className="italic text-slate-700">
          {italicVal}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts.length > 0 ? parts : text;
};

// Prominent Boxed Code Snippet with Line Numbers, Copy, and Run in IDE
const ProgramCodeBox: React.FC<{
  filename?: string;
  code: string;
  onOpenInCompiler: (code: string) => void;
  title?: string;
}> = ({ filename = 'Main.java', code, onOpenInCompiler, title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  return (
    <div className="my-3 sm:my-4 border-2 sm:border-4 border-black rounded-2xl sm:rounded-3xl overflow-hidden bg-[#18181B] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      {/* Box Window Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-[#27272A] border-b-2 border-black gap-2">
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Window dots */}
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF5F56] border border-black/40" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFBD2E] border border-black/40" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27C93F] border border-black/40" />
          </div>
          <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-rose-300 truncate">
            <FileCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF8A8A] flex-shrink-0" />
            <span className="truncate">{filename}</span>
            {title && <span className="text-slate-400 font-normal ml-1 hidden xs:inline">({title})</span>}
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2 self-end sm:self-auto">
          <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[9px] sm:text-[10px] font-mono font-bold text-slate-300">
            Java 21
          </span>
          <button
            onClick={handleCopy}
            title="Copy Code"
            className="flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-slate-200 text-[11px] sm:text-xs font-bold border border-zinc-600 transition-colors brutal-btn"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-[#49BE25]" />
                <span className="text-[#49BE25]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-300" />
                <span>Copy</span>
              </>
            )}
          </button>
          <button
            onClick={() => onOpenInCompiler(code)}
            className="flex items-center space-x-1 sm:space-x-1.5 bg-[#8B0000] hover:bg-[#700000] text-white font-black uppercase px-2.5 sm:px-3.5 py-1 rounded-xl border-2 border-black text-[11px] sm:text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] brutal-btn"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Run</span>
          </button>
        </div>
      </div>

      {/* Code Box Body with Line Numbers */}
      <div className="p-3 sm:p-4 overflow-x-auto text-xs font-mono leading-relaxed flex bg-[#18181B]">
        <div className="select-none text-zinc-600 text-right pr-3 sm:pr-4 border-r border-zinc-800 font-mono space-y-0.5 text-[11px] sm:text-xs">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="pl-3 sm:pl-4 text-[#FDFCF0] overflow-x-auto whitespace-pre font-mono flex-1 text-[11px] sm:text-xs">
          {code}
        </pre>
      </div>
    </div>
  );
};

// Structured Content Block Renderer
interface StructuredContentProps {
  content: string;
  onOpenInCompiler: (code: string) => void;
}

const StructuredLessonContent: React.FC<StructuredContentProps> = ({ content, onOpenInCompiler }) => {
  const blocks = content.split('\n\n');

  return (
    <div className="space-y-3 sm:space-y-4 text-[#1A1A1A] text-xs sm:text-sm leading-relaxed">
      {blocks.map((block, blockIdx) => {
        const trimmed = block.trim();

        // Level 3 Main Section Header
        if (trimmed.startsWith('### ')) {
          const heading = trimmed.replace('### ', '');
          return (
            <div key={blockIdx} className="pt-2 pb-1">
              <div className="flex items-center space-x-2 sm:space-x-2.5 p-2.5 sm:p-3 bg-white border-2 border-black rounded-xl sm:rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B0000] stroke-[2.5] flex-shrink-0" />
                <h3 className="text-sm sm:text-base md:text-lg font-black text-black tracking-tight">
                  {heading}
                </h3>
              </div>
            </div>
          );
        }

        // Level 4 Section Subheading & structured list
        if (trimmed.startsWith('#### ')) {
          const lines = trimmed.split('\n');
          const headerText = lines[0].replace('#### ', '');
          const bodyLines = lines.slice(1);

          return (
            <div key={blockIdx} className="space-y-2 my-2 sm:my-3">
              {/* Structured Header Banner */}
              <div className="flex items-center space-x-2 py-1.5 sm:py-2 px-3 bg-rose-50 border-l-4 border-[#8B0000] rounded-r-xl sm:rounded-r-2xl border-y border-r border-rose-200">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#8B0000] flex-shrink-0" />
                <h4 className="text-xs sm:text-sm font-bold text-[#8B0000] tracking-tight">{headerText}</h4>
              </div>

              {/* Body lines beneath heading */}
              {bodyLines.length > 0 && (
                <div className="grid gap-1.5 sm:gap-2 pl-1 sm:pl-2">
                  {bodyLines.map((line, lIdx) => {
                    const cleanLine = line.trim();
                    if (!cleanLine) return null;

                    // Bullet item
                    if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ')) {
                      const itemText = cleanLine.replace(/^[-*]\s+/, '');
                      return (
                        <div 
                          key={lIdx} 
                          className="flex items-start space-x-2 p-2 sm:p-2.5 bg-white border border-black/15 rounded-xl hover:border-[#8B0000]/40 transition-colors shadow-[1px_1px_0px_0px_rgba(0,0,0,0.05)]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000] mt-1.5 flex-shrink-0" />
                          <div className="text-xs text-slate-800 leading-relaxed font-medium flex-1">
                            {renderFormattedInlineText(itemText)}
                          </div>
                        </div>
                      );
                    }

                    // Numbered item
                    if (/^\d+\.\s/.test(cleanLine)) {
                      const match = cleanLine.match(/^(\d+)\.\s+(.*)$/);
                      const num = match ? match[1] : `${lIdx + 1}`;
                      const itemText = match ? match[2] : cleanLine;
                      return (
                        <div 
                          key={lIdx} 
                          className="flex items-start space-x-2 p-2 sm:p-2.5 bg-white border border-black/15 rounded-xl hover:border-[#8B0000]/40 transition-colors shadow-[1px_1px_0px_0px_rgba(0,0,0,0.05)]"
                        >
                          <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-lg bg-rose-100 text-[#8B0000] font-bold text-[10px] sm:text-[11px] flex items-center justify-center flex-shrink-0 font-mono">
                            {num}
                          </span>
                          <div className="text-xs text-slate-800 leading-relaxed font-medium flex-1">
                            {renderFormattedInlineText(itemText)}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <p key={lIdx} className="text-xs text-slate-800 leading-relaxed font-medium pl-1">
                        {renderFormattedInlineText(cleanLine)}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        // Code block inside markdown content
        if (trimmed.startsWith('```java') || trimmed.startsWith('```')) {
          const code = trimmed.replace(/```(?:java)?\n?|```/g, '');
          return (
            <ProgramCodeBox
              key={blockIdx}
              code={code}
              filename="Snippet.java"
              title="Definition Code"
              onOpenInCompiler={onOpenInCompiler}
            />
          );
        }

        // Standalone list (bullet or numbered)
        const lines = trimmed.split('\n');
        const isListBlock = lines.every(l => l.trim().startsWith('- ') || l.trim().startsWith('* ') || /^\d+\.\s/.test(l.trim()));
        if (isListBlock && lines.length > 0) {
          return (
            <div key={blockIdx} className="grid gap-1.5 sm:gap-2 my-2">
              {lines.map((line, lIdx) => {
                const clean = line.trim();
                const isNumbered = /^\d+\.\s/.test(clean);
                const numMatch = clean.match(/^(\d+)\.\s+(.*)$/);
                const itemText = isNumbered ? (numMatch ? numMatch[2] : clean) : clean.replace(/^[-*]\s+/, '');
                const num = isNumbered ? (numMatch ? numMatch[1] : `${lIdx + 1}`) : null;

                return (
                  <div 
                    key={lIdx} 
                    className="flex items-start space-x-2 p-2 sm:p-2.5 bg-white border border-black/15 rounded-xl shadow-[1px_1px_0px_0px_rgba(0,0,0,0.05)]"
                  >
                    {isNumbered ? (
                      <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-lg bg-rose-100 text-[#8B0000] font-bold text-[10px] sm:text-[11px] flex items-center justify-center flex-shrink-0 font-mono">
                        {num}
                      </span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000] mt-1.5 flex-shrink-0" />
                    )}
                    <div className="text-xs text-slate-800 leading-relaxed font-medium flex-1">
                      {renderFormattedInlineText(itemText)}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }

        // Standard Paragraph with inline formatting
        return (
          <p key={blockIdx} className="text-slate-800 font-medium leading-relaxed">
            {renderFormattedInlineText(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

export const LessonView: React.FC<LessonViewProps> = ({
  currentLesson,
  onSelectLesson,
  onOpenInCompiler,
  progress,
  onCompleteLesson,
  isCurriculumOpen = false,
  onToggleCurriculum,
  onCloseCurriculum
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<boolean>(false);
  const [openModuleId, setOpenModuleId] = useState<string>(currentLesson.moduleId);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // Synchronize drawer state with parent prop if provided
  const isDrawerActive = isCurriculumOpen || mobileDrawerOpen;

  // Flatten all lessons for previous / next pagination
  const allLessons = useMemo(() => {
    return CURRICULUM_MODULES.flatMap(m => m.lessons);
  }, []);

  const currentLessonIndex = allLessons.findIndex(l => l.id === currentLesson.id);
  const previousLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  const isCompleted = progress.completedLessonIds.includes(currentLesson.id);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    setShowQuizResults(prev => ({ ...prev, [questionId]: true }));
  };

  const handleFinishLesson = () => {
    if (!isCompleted) {
      onCompleteLesson(currentLesson.id, 50);
    }
  };

  const handleSelectLessonFromMenu = (lesson: Lesson) => {
    onSelectLesson(lesson);
    setMobileDrawerOpen(false);
    if (onCloseCurriculum) onCloseCurriculum();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Curriculum Sidebar / Drawer Component
  const CurriculumContent = (
    <div className="flex flex-col h-full bg-white">
      <div className="p-3.5 sm:p-4 bg-[#8B0000] border-b-4 border-black text-white flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2 font-black uppercase text-xs sm:text-sm">
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          <span>Curriculum ({allLessons.length})</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] sm:text-xs font-black text-black bg-white border-2 border-black px-2 py-0.5 rounded-full shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            {progress.completedLessonIds.length}/{allLessons.length}
          </span>
          {/* Close button on mobile drawer */}
          <button
            onClick={() => {
              setMobileDrawerOpen(false);
              if (onCloseCurriculum) onCloseCurriculum();
            }}
            className="lg:hidden p-1 bg-white text-[#8B0000] border-2 border-black rounded-lg brutal-btn"
            title="Close Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-2 text-xs bg-[#FAFAFB]">
        {CURRICULUM_MODULES.map((mod, modIdx) => {
          const isOpen = openModuleId === mod.id;
          const completedInModule = mod.lessons.filter(l => progress.completedLessonIds.includes(l.id)).length;

          return (
            <div key={mod.id} className="border-2 border-black rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {/* Module Accordion Header */}
              <button
                onClick={() => setOpenModuleId(isOpen ? '' : mod.id)}
                className="w-full flex items-center justify-between p-2.5 sm:p-3 text-left hover:bg-rose-50 transition-colors"
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[#8B0000] text-white font-black border-2 border-black flex items-center justify-center text-[10px] sm:text-xs shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                    {modIdx + 1}
                  </span>
                  <span className="font-bold text-black text-xs truncate">{mod.title}</span>
                </div>
                <div className="flex items-center space-x-1 text-black font-bold flex-shrink-0 ml-1">
                  <span className="text-[10px]">{completedInModule}/{mod.lessons.length}</span>
                  {isOpen ? <ChevronDown className="w-3.5 h-3.5 stroke-[3]" /> : <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>

              {/* Lessons in Module */}
              {isOpen && (
                <div className="p-1.5 sm:p-2 space-y-1 bg-rose-50/50 border-t-2 border-black">
                  {mod.lessons.map((lesson) => {
                    const isCur = lesson.id === currentLesson.id;
                    const isDone = progress.completedLessonIds.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleSelectLessonFromMenu(lesson)}
                        className={`w-full flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all text-left border-2 border-black ${
                          isCur
                            ? 'bg-[#8B0000] text-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-white text-black hover:bg-rose-50 font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          {isDone ? (
                            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#49BE25] flex-shrink-0 fill-black stroke-white" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                          )}
                          <span className="truncate text-xs">{lesson.title}</span>
                        </div>
                        <span className={`text-[10px] font-mono font-bold ml-1.5 flex-shrink-0 ${isCur ? 'text-rose-200' : 'text-slate-500'}`}>
                          {lesson.durationMinutes}m
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 sm:gap-5 max-w-7xl mx-auto w-full pb-16 md:pb-6">
      
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:flex w-80 bg-white border-4 border-black rounded-3xl overflow-hidden flex-col flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-[calc(100vh-140px)] sticky top-24">
        {CurriculumContent}
      </div>

      {/* Mobile Curriculum Drawer Modal / Sheet */}
      {isDrawerActive && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="absolute inset-0"
            onClick={() => {
              setMobileDrawerOpen(false);
              if (onCloseCurriculum) onCloseCurriculum();
            }}
          />
          <div className="relative z-10 w-full max-h-[85vh] bg-white border-t-4 border-black rounded-t-3xl overflow-hidden shadow-[0_-6px_0px_0px_rgba(0,0,0,1)] flex flex-col">
            {CurriculumContent}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 bg-white border-2 sm:border-4 border-black rounded-2xl sm:rounded-3xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 text-[#1A1A1A]">
        
        {/* Mobile Quick Bar to open curriculum */}
        <div className="lg:hidden flex items-center justify-between bg-rose-50 border-2 border-black p-2.5 rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <button
            onClick={() => {
              if (onToggleCurriculum) onToggleCurriculum();
              else setMobileDrawerOpen(true);
            }}
            className="flex items-center space-x-1.5 text-xs font-black text-white bg-[#8B0000] border-2 border-black px-3 py-1 rounded-xl shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] brutal-btn"
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>All Lessons ({progress.completedLessonIds.length}/{allLessons.length})</span>
          </button>
          <span className="text-[11px] font-bold text-slate-700 font-mono">
            {currentLessonIndex + 1} of {allLessons.length}
          </span>
        </div>

        {/* Lesson Header Banner */}
        <div className="border-b-2 sm:border-b-4 border-black pb-4 sm:pb-5 space-y-2.5 sm:space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-xl text-[10px] sm:text-xs font-bold bg-[#8B0000] text-white border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                {currentLesson.difficulty}
              </span>
              <span className="flex items-center space-x-1 text-black font-bold text-[10px] sm:text-xs bg-slate-100 border-2 border-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl">
                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#8B0000]" />
                <span>{currentLesson.durationMinutes} min read</span>
              </span>
            </div>

            {isCompleted ? (
              <div className="flex items-center space-x-1.5 sm:space-x-2 text-[11px] sm:text-xs text-black bg-[#49BE25] border-2 border-black px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Completed (+50 XP)</span>
              </div>
            ) : (
              <button
                onClick={handleFinishLesson}
                className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold bg-[#49BE25] hover:bg-[#3ea61f] text-black border-2 border-black transition-all brutal-btn shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                <span>Complete Lesson (+50 XP)</span>
              </button>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-black tracking-tight leading-snug">
            {currentLesson.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            {currentLesson.description}
          </p>
        </div>

        {/* 1. DEFINITION & CORE CONCEPTS */}
        <div className="space-y-2">
          <StructuredLessonContent 
            content={currentLesson.content} 
            onOpenInCompiler={onOpenInCompiler} 
          />
        </div>

        {/* 2. PROGRAM JUST AFTER EVERY DEFINITION */}
        <div className="space-y-2.5 sm:space-y-3 pt-2">
          {/* Header Banner for Program */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2 py-1.5 sm:py-2 px-3 bg-rose-50 border-l-4 border-[#8B0000] rounded-r-xl sm:rounded-r-2xl border-y border-r border-rose-200">
              <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8B0000] flex-shrink-0" />
              <span className="font-bold text-xs sm:text-sm text-[#8B0000]">
                Program for this Definition (Live Executable Code)
              </span>
            </div>

            <button
              onClick={() => onOpenInCompiler(currentLesson.starterCode)}
              className="flex items-center space-x-1.5 px-3 py-1 sm:py-1.5 rounded-xl bg-[#8B0000] hover:bg-[#700000] text-white font-bold text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] brutal-btn"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Run in IDE</span>
            </button>
          </div>

          {/* Program Code Box */}
          <ProgramCodeBox
            filename="Main.java"
            title="Demonstration Program"
            code={currentLesson.starterCode}
            onOpenInCompiler={onOpenInCompiler}
          />

          {/* Expected Output Box */}
          {currentLesson.expectedOutput && (
            <div className="p-3 sm:p-4 bg-[#FAFAFB] rounded-2xl border-2 border-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-1.5 sm:space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-[#8B0000] text-xs">
                <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8B0000]" />
                <span className="uppercase tracking-wider font-mono text-[10px] sm:text-xs">Expected Console Output</span>
              </div>
              <pre className="text-black font-mono text-[11px] sm:text-xs whitespace-pre-wrap font-bold bg-white p-2.5 sm:p-3 rounded-xl border border-black/20 shadow-inner">
                {currentLesson.expectedOutput}
              </pre>
            </div>
          )}
        </div>

        {/* 3. TASK AT THE END OF EACH PROGRAM */}
        {currentLesson.exercise && (
          <div className="bg-[#FFF5F5] border-2 sm:border-4 border-black rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black/15 pb-2.5 sm:pb-3">
              {/* Task Badge & Title */}
              <div className="flex items-center space-x-1.5 sm:space-x-2 py-1 sm:py-1.5 px-2.5 sm:px-3.5 bg-[#8B0000] border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2.5]" />
                <span className="font-black text-[10px] sm:text-xs uppercase tracking-wider text-white">
                  Task at End of Program
                </span>
              </div>

              <button
                onClick={() => onOpenInCompiler(currentLesson.exercise!.starterCode)}
                className="flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#8B0000] hover:bg-[#700000] text-white font-bold text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] brutal-btn"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Solve in Compiler</span>
              </button>
            </div>

            {/* Task Instructions */}
            <div className="p-3 sm:p-4 bg-white border-2 border-black rounded-xl sm:rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1">
              <div className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs font-black text-[#8B0000] uppercase tracking-wider">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#8B0000]" />
                <span>Task Instructions</span>
              </div>
              <p className="text-xs sm:text-sm text-black font-bold leading-relaxed pt-0.5">
                {renderFormattedInlineText(currentLesson.exercise.instruction)}
              </p>
            </div>

            {/* Task Starter Code Box */}
            <div className="space-y-1 sm:space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700">
                <span className="flex items-center space-x-1 text-[11px] sm:text-xs">
                  <Code className="w-3 h-3 text-black" />
                  <span>Task Template:</span>
                </span>
                <span className="text-[10px] text-slate-500 font-normal">Click "Solve in Compiler" to run</span>
              </div>
              <pre className="p-2.5 sm:p-3.5 bg-[#18181B] rounded-xl sm:rounded-2xl border-2 border-black font-mono text-[11px] sm:text-xs text-[#FDFCF0] overflow-x-auto shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {currentLesson.exercise.starterCode}
              </pre>
            </div>

            {/* Hint Accordion */}
            {currentLesson.exercise.hint && (
              <div className="pt-1">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs font-bold text-black hover:text-[#8B0000] flex items-center space-x-1 underline underline-offset-4"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-[#8B0000]" />
                  <span>{showHint ? 'Hide Task Hint' : '💡 Need a Hint? Click to reveal'}</span>
                </button>

                {showHint && (
                  <div className="mt-2 p-3 bg-rose-50 rounded-xl sm:rounded-2xl border-2 border-[#8B0000]/40 text-xs text-black font-medium space-y-1 shadow-[2px_2px_0px_0px_rgba(139,0,0,0.15)]">
                    <div className="flex items-center space-x-1.5 font-bold text-[#8B0000] text-xs">
                      <Lightbulb className="w-3.5 h-3.5 text-[#8B0000]" />
                      <span>Task Hint</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed pl-4 font-semibold">
                      {renderFormattedInlineText(currentLesson.exercise.hint)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 4. KNOWLEDGE CHECK QUIZ */}
        {currentLesson.quiz && currentLesson.quiz.length > 0 && (
          <div className="bg-[#FAFAFB] border-2 sm:border-4 border-black rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center space-x-2 py-1.5 sm:py-2 px-3 bg-rose-50 border-l-4 border-[#8B0000] rounded-r-xl sm:rounded-r-2xl border-y border-r border-rose-200 w-fit">
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8B0000]" />
              <span className="font-bold text-xs sm:text-sm text-[#8B0000]">Knowledge Check Quiz</span>
            </div>

            {currentLesson.quiz.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[q.id];
              const isAnswered = showQuizResults[q.id];
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div key={q.id} className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border-2 border-black space-y-2.5 sm:space-y-3 text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="font-bold text-black text-xs sm:text-sm">
                    {qIdx + 1}. {q.question}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isThisSelected = selectedOpt === optIdx;
                      let btnStyle = 'bg-white text-black border-2 border-black hover:bg-rose-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]';

                      if (isAnswered) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-[#49BE25] text-black border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]';
                        } else if (isThisSelected && !isCorrect) {
                          btnStyle = 'bg-[#8B0000] text-white border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left p-2.5 sm:p-3 rounded-xl transition-all flex items-center justify-between font-bold text-xs brutal-btn ${btnStyle}`}
                        >
                          <span className="flex-1">{opt}</span>
                          {isAnswered && optIdx === q.correctIndex && (
                            <Check className="w-4 h-4 text-black stroke-[3] flex-shrink-0 ml-2" />
                          )}
                          {isAnswered && isThisSelected && !isCorrect && (
                            <X className="w-4 h-4 text-white stroke-[3] flex-shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div className={`p-2.5 sm:p-3 rounded-xl text-xs font-bold border-2 border-black leading-relaxed ${
                      isCorrect ? 'bg-[#49BE25]/20 text-black' : 'bg-[#8B0000]/10 text-black'
                    }`}>
                      <span className="font-bold">{isCorrect ? '✓ Correct! ' : 'Explanation: '}</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 5. PREVIOUS & NEXT LESSON PAGINATION FOOTER */}
        <div className="pt-4 border-t-2 sm:border-t-4 border-black flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {previousLesson ? (
            <button
              onClick={() => handleSelectLessonFromMenu(previousLesson)}
              className="flex-1 flex items-center justify-start space-x-2 p-3 rounded-2xl bg-white hover:bg-slate-50 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] brutal-btn text-left"
            >
              <ArrowLeft className="w-4 h-4 text-[#8B0000] flex-shrink-0" />
              <div className="truncate">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Previous</div>
                <div className="text-xs font-bold truncate">{previousLesson.title}</div>
              </div>
            </button>
          ) : <div className="hidden sm:block flex-1" />}

          {/* Middle Complete Button */}
          {!isCompleted ? (
            <button
              onClick={handleFinishLesson}
              className="flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-[#49BE25] hover:bg-[#3ea61f] text-black font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] brutal-btn"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Complete & Earn 50 XP</span>
            </button>
          ) : (
            <div className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-2xl bg-[#49BE25]/30 text-black font-bold text-xs border-2 border-black">
              <CheckCircle className="w-4 h-4 text-[#49BE25] fill-black stroke-white" />
              <span>Lesson Completed!</span>
            </div>
          )}

          {nextLesson ? (
            <button
              onClick={() => handleSelectLessonFromMenu(nextLesson)}
              className="flex-1 flex items-center justify-end space-x-2 p-3 rounded-2xl bg-[#8B0000] hover:bg-[#700000] text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] brutal-btn text-right"
            >
              <div className="truncate">
                <div className="text-[10px] text-rose-200 font-bold uppercase">Next Up</div>
                <div className="text-xs font-bold truncate">{nextLesson.title}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-white flex-shrink-0" />
            </button>
          ) : (
            <div className="flex-1 text-center p-3 text-xs font-bold text-slate-500">
              🎉 You've reached the end of the curriculum!
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

