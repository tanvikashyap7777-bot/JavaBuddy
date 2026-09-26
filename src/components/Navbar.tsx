import React from 'react';
import { ActiveTab, UserProgress } from '../types';
import { 
  BookOpen, 
  Code2, 
  Flame, 
  Award,
  CheckCircle2,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  progress: UserProgress;
  onToggleCurriculum?: () => void;
  isCurriculumOpen?: boolean;
  canGoBack?: boolean;
  onBack?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  progress,
  onToggleCurriculum,
  isCurriculumOpen,
  canGoBack = false,
  onBack
}) => {
  const totalLessons = 12;
  const completedCount = progress.completedLessonIds.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLessons) * 100));

  return (
    <>
      {/* Top Header */}
      <header className="bg-[#8B0000] border-b-4 border-black text-white sticky top-0 z-30 shadow-[0_4px_0px_0px_rgba(0,0,0,1)] safe-top">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between h-14 sm:h-18 lg:h-20">
          
          {/* Brand & Back Button */}
          <div className="flex items-center space-x-2 sm:space-x-3 select-none">
            {/* In-App Back Button if available */}
            {canGoBack && onBack && (
              <button
                id="header-back-button"
                onClick={onBack}
                aria-label="Go Back"
                className="p-1.5 sm:p-2 bg-white text-[#8B0000] border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] brutal-btn hover:bg-rose-50 flex items-center justify-center flex-shrink-0"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>
            )}

            <div 
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group" 
              onClick={() => setActiveTab('learn')}
            >
              <div className="w-8 h-8 sm:w-11 sm:h-11 bg-white rounded-xl sm:rounded-2xl border-2 border-black rotate-2 group-hover:rotate-6 transition-transform flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[#8B0000] flex-shrink-0">
                <span className="font-black text-lg sm:text-2xl">J</span>
              </div>
              <div>
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="font-black text-base sm:text-xl tracking-tight text-white whitespace-nowrap">
                    Java Explorer
                  </span>
                  <span className="text-[9px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md bg-white text-black border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                    JDK 21
                  </span>
                </div>
                <p className="text-xs font-bold text-rose-100 hidden sm:block">Interactive Lessons & Compiler</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-2.5">
            <button
              id="nav-tab-learn"
              onClick={() => setActiveTab('learn')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold border-2 border-black transition-all brutal-btn ${
                activeTab === 'learn'
                  ? 'bg-white text-[#8B0000] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-[#6A0000] text-white hover:bg-[#5A0000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Lessons</span>
            </button>

            <button
              id="nav-tab-compiler"
              onClick={() => setActiveTab('compiler')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold border-2 border-black transition-all brutal-btn ${
                activeTab === 'compiler'
                  ? 'bg-white text-[#8B0000] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-[#6A0000] text-white hover:bg-[#5A0000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Compiler</span>
            </button>
          </nav>

          {/* User Stats & Progress */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Progress Bar (Desktop & Tablet) */}
            <div className="hidden sm:flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-xs font-bold text-black flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8B0000]" />
                <span>{completedCount}/{totalLessons}</span>
              </span>
              <div className="w-20 lg:w-24 h-2.5 sm:h-3 bg-rose-100 border border-black rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#8B0000] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-black font-mono">{progressPercent}%</span>
            </div>

            {/* Streak & XP */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[11px] sm:text-xs font-bold text-black">
              <div className="flex items-center space-x-1 text-[#8B0000]">
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#8B0000]" />
                <span>{progress.currentStreak}d</span>
              </div>
              <div className="w-0.5 h-3 sm:h-3.5 bg-black" />
              <div className="flex items-center space-x-1 text-[#8B0000]">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{progress.xp} XP</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Mobile Floating / Fixed Bottom Navigation Bar */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#8B0000] border-t-4 border-black px-3 py-2 safe-bottom shadow-[0_-4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-around gap-2"
      >
        <button
          id="mobile-nav-learn"
          onClick={() => setActiveTab('learn')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-2 rounded-2xl text-xs font-black border-2 border-black transition-all brutal-btn ${
            activeTab === 'learn'
              ? 'bg-white text-[#8B0000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-[1.02]'
              : 'bg-[#6A0000] text-white hover:bg-[#5A0000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Lessons</span>
          {activeTab === 'learn' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000] ml-0.5 animate-pulse" />
          )}
        </button>

        {activeTab === 'learn' && onToggleCurriculum && (
          <button
            id="mobile-nav-curriculum"
            onClick={onToggleCurriculum}
            className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-2xl text-xs font-black border-2 border-black transition-all brutal-btn ${
              isCurriculumOpen
                ? 'bg-white text-[#8B0000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-[#6A0000] text-white hover:bg-[#5A0000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Modules</span>
          </button>
        )}

        <button
          id="mobile-nav-compiler"
          onClick={() => setActiveTab('compiler')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-2 rounded-2xl text-xs font-black border-2 border-black transition-all brutal-btn ${
            activeTab === 'compiler'
              ? 'bg-white text-[#8B0000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-[1.02]'
              : 'bg-[#6A0000] text-white hover:bg-[#5A0000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Compiler</span>
          {activeTab === 'compiler' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000] ml-0.5 animate-pulse" />
          )}
        </button>
      </nav>
    </>
  );
};


