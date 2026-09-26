import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ActiveTab, Lesson, UserProgress, CompilationResult } from './types';
import { CURRICULUM_MODULES } from './data/curriculum';
import { Navbar } from './components/Navbar';
import { JavaEditor } from './components/JavaEditor';
import { ConsoleOutput } from './components/ConsoleOutput';
import { LessonView } from './components/LessonView';
import { Code2, Terminal, CheckCircle2, XCircle, Info } from 'lucide-react';

const STORAGE_KEY = 'javamaster_user_progress_v1';

const DEFAULT_STARTER_CODE = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java Explorer!");
        
        // Let's create an array and compute the sum
        int[] numbers = {10, 20, 30, 40, 50};
        int sum = 0;
        
        for (int n : numbers) {
            sum += n;
        }
        
        System.out.println("Sum of array elements: " + sum);
    }
}`;

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('learn');
  const [code, setCode] = useState<string>(DEFAULT_STARTER_CODE);
  const [stdin, setStdin] = useState<string>('');
  const [result, setResult] = useState<CompilationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeExecutionLine, setActiveExecutionLine] = useState<number | undefined>(undefined);
  const [currentLesson, setCurrentLesson] = useState<Lesson>(CURRICULUM_MODULES[0].lessons[0]);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState<boolean>(false);
  const [mobileCompilerView, setMobileCompilerView] = useState<'editor' | 'console'>('editor');
  
  // History stack for lesson navigation
  const [lessonHistory, setLessonHistory] = useState<string[]>([]);
  const [showExitToast, setShowExitToast] = useState<boolean>(false);
  const lastBackPressRef = useRef<number>(0);

  // User Progress state with LocalStorage persistence
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load user progress:', e);
    }
    return {
      completedLessonIds: [],
      completedChallengeIds: [],
      quizScores: {},
      savedSnippets: [],
      currentStreak: 1,
      lastActiveDate: new Date().toDateString(),
      xp: 100,
      bookmarkedLessons: []
    };
  });

  // Persist progress to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  }, [progress]);

  // Daily Streak checker
  useEffect(() => {
    const today = new Date().toDateString();
    if (progress.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const isConsecutive = progress.lastActiveDate === yesterday;
      setProgress(prev => ({
        ...prev,
        currentStreak: isConsecutive ? prev.currentStreak + 1 : 1,
        lastActiveDate: today
      }));
    }
  }, []);

  // Back Navigation Handler
  // Returns true if the back action was consumed, or false if at root level
  const handleBack = useCallback((): boolean => {
    // 1. If Curriculum Drawer modal is open -> Close it
    if (isCurriculumOpen) {
      setIsCurriculumOpen(false);
      return true;
    }

    // 2. If in Compiler tab and on mobile showing Console -> Switch back to Code Editor
    if (activeTab === 'compiler' && mobileCompilerView === 'console') {
      setMobileCompilerView('editor');
      return true;
    }

    // 3. If in Compiler tab -> Navigate back to Lessons (Learn)
    if (activeTab === 'compiler') {
      setActiveTab('learn');
      return true;
    }

    // 4. If in Learn tab and have previous lesson in history -> Go back to previous lesson
    if (lessonHistory.length > 0) {
      const previousLessonId = lessonHistory[lessonHistory.length - 1];
      setLessonHistory(prev => prev.slice(0, -1));
      const allLessons = CURRICULUM_MODULES.flatMap(m => m.lessons);
      const found = allLessons.find(l => l.id === previousLessonId);
      if (found) {
        setCurrentLesson(found);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return true;
      }
    }

    // 5. At Root Screen -> Return false so system/Capacitor exit logic can trigger
    return false;
  }, [isCurriculumOpen, activeTab, mobileCompilerView, lessonHistory]);

  // Determine if the app can go back (for in-app UI back button)
  const canGoBack = isCurriculumOpen || activeTab === 'compiler' || (activeTab === 'compiler' && mobileCompilerView === 'console') || lessonHistory.length > 0;

  // Handle Lesson Selection with History Tracking
  const handleSelectLesson = (lesson: Lesson) => {
    if (lesson.id !== currentLesson.id) {
      setLessonHistory(prev => [...prev, currentLesson.id]);
      setCurrentLesson(lesson);
    }
    setIsCurriculumOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Capacitor Android Hardware / Gesture Back Button Listener
  useEffect(() => {
    let removeListener: (() => void) | null = null;

    const initCapacitorBack = async () => {
      try {
        const capacitorApp = (window as any).Capacitor?.Plugins?.App;
        if (capacitorApp && typeof capacitorApp.addListener === 'function') {
          const handle = await capacitorApp.addListener('backButton', () => {
            const handled = handleBack();
            if (!handled) {
              const now = Date.now();
              if (now - lastBackPressRef.current < 2000) {
                capacitorApp.exitApp?.();
              } else {
                lastBackPressRef.current = now;
                setShowExitToast(true);
                setTimeout(() => setShowExitToast(false), 2000);
              }
            }
          });
          removeListener = () => handle.remove();
        }
      } catch (e) {
        console.warn('Capacitor backButton initialization:', e);
      }
    };

    initCapacitorBack();

    return () => {
      if (removeListener) removeListener();
    };
  }, [handleBack]);

  // Browser Popstate (History Back / Forward) Support
  useEffect(() => {
    const handlePopState = () => {
      handleBack();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handleBack]);

  // Run/Compile Java Code
  const handleRunCode = async () => {
    setIsLoading(true);
    setActiveExecutionLine(undefined);
    setResult(null);

    // On mobile, auto-switch to console view so user immediately sees results
    if (window.innerWidth < 1024) {
      setMobileCompilerView('console');
    }

    try {
      const res = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, stdin })
      });
      const data: CompilationResult = await res.json();
      setResult(data);

      // Award 10 XP on successful compilation
      if (data.success) {
        setProgress(prev => ({ ...prev, xp: prev.xp + 10 }));
      }
    } catch (err) {
      console.error('Failed to compile:', err);
      setResult({
        success: false,
        stdout: '',
        stderr: 'Network or execution failure. Please check connection and try again.',
        exitCode: 1,
        executionTimeMs: 0,
        compilationErrors: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle lesson completion
  const handleCompleteLesson = (lessonId: string, xpGained: number) => {
    setProgress(prev => ({
      ...prev,
      completedLessonIds: prev.completedLessonIds.includes(lessonId) 
        ? prev.completedLessonIds 
        : [...prev.completedLessonIds, lessonId],
      xp: prev.xp + xpGained
    }));
  };

  // Load code into compiler
  const handleLoadCodeToCompiler = (newCode: string) => {
    setCode(newCode);
    setActiveTab('compiler');
    setMobileCompilerView('editor');
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#8B0000] selection:text-white antialiased">
      {/* Top Navigation Bar with Back Button Support */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        progress={progress}
        onToggleCurriculum={() => setIsCurriculumOpen(prev => !prev)}
        isCurriculumOpen={isCurriculumOpen}
        canGoBack={canGoBack}
        onBack={() => handleBack()}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 p-2.5 sm:p-4 md:p-5 max-w-7xl w-full mx-auto flex flex-col pb-20 md:pb-6">
        {activeTab === 'learn' && (
          <LessonView
            currentLesson={currentLesson}
            onSelectLesson={handleSelectLesson}
            onOpenInCompiler={handleLoadCodeToCompiler}
            progress={progress}
            onCompleteLesson={handleCompleteLesson}
            isCurriculumOpen={isCurriculumOpen}
            onToggleCurriculum={() => setIsCurriculumOpen(prev => !prev)}
            onCloseCurriculum={() => setIsCurriculumOpen(false)}
          />
        )}

        {activeTab === 'compiler' && (
          <div className="flex-1 flex flex-col gap-3 sm:gap-4">
            {/* Mobile View Toggle Segment: [ Code Editor ] | [ Console & Output ] */}
            <div className="lg:hidden flex items-center bg-white p-1 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] gap-1">
              <button
                onClick={() => setMobileCompilerView('editor')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-black transition-all brutal-btn ${
                  mobileCompilerView === 'editor'
                    ? 'bg-[#8B0000] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border border-black'
                    : 'text-black hover:bg-rose-50'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>Code Editor</span>
              </button>

              <button
                onClick={() => setMobileCompilerView('console')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-black transition-all brutal-btn ${
                  mobileCompilerView === 'console'
                    ? 'bg-[#6A0000] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border border-black'
                    : 'text-black hover:bg-rose-50'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>Console & Output</span>
                {result && (
                  <span className="ml-1">
                    {result.success ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#49BE25] inline" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-[#FF521B] inline" />
                    )}
                  </span>
                )}
              </button>
            </div>

            {/* Split / Responsive Compiler Layout */}
            <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-5 min-h-[550px] lg:min-h-[600px]">
              {/* Editor Pane (Always visible on Desktop, toggled on Mobile) */}
              <div className={`flex-1 flex flex-col ${mobileCompilerView === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
                <JavaEditor
                  code={code}
                  onChange={setCode}
                  onRun={handleRunCode}
                  isLoading={isLoading}
                  activeLine={activeExecutionLine}
                  errorLines={result?.compilationErrors.map(e => e.line)}
                  onReset={() => setCode(DEFAULT_STARTER_CODE)}
                />
              </div>

              {/* Console & Visualizer Pane (Always visible on Desktop, toggled on Mobile) */}
              <div className={`w-full lg:w-[460px] xl:w-[500px] flex flex-col flex-shrink-0 ${mobileCompilerView === 'console' ? 'flex' : 'hidden lg:flex'}`}>
                <ConsoleOutput
                  result={result}
                  isLoading={isLoading}
                  stdin={stdin}
                  setStdin={setStdin}
                  onClear={() => {
                    setResult(null);
                    setActiveExecutionLine(undefined);
                  }}
                  onStepChange={setActiveExecutionLine}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Double-Tap to Exit Toast (For Android / Native Back Button) */}
      {showExitToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#8B0000] text-white px-4 py-2.5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center space-x-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Info className="w-4 h-4 text-white" />
          <span>Press back again to exit</span>
        </div>
      )}
    </div>
  );
}


