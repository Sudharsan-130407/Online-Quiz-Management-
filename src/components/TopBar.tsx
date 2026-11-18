import { Menu, Search } from 'lucide-react';
import { AppView } from '../types/quiz';

interface TopBarProps {
  activeView: AppView;
  activeQuizTitle?: string;
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onCreateQuiz: () => void;
}

const VIEW_TITLES: Record<AppView, { section: string; label: string }> = {
  overview: { section: 'Workspace', label: 'Overview' },
  quizzes: { section: 'Workspace', label: 'Quizzes' },
  editor: { section: 'Quizzes', label: 'Quiz Builder' },
  'question-bank': { section: 'Workspace', label: 'Question bank' },
  analytics: { section: 'Workspace', label: 'Analytics' },
  'learner-portal': { section: 'Control Center', label: 'Learner portal' },
  settings: { section: 'Control Center', label: 'Profile & preferences' },
};

export function TopBar({
  activeView,
  activeQuizTitle,
  onOpenMobileMenu,
  onOpenSearch,
  onCreateQuiz,
}: TopBarProps) {
  const meta = VIEW_TITLES[activeView];

  return (
    <header className="sticky top-0 z-20 h-[68px] border-b border-[#e6ebf0] bg-[#f7f8f7]/92 backdrop-blur-md px-5 sm:px-8 flex items-center justify-between gap-6">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 -ml-2 rounded-lg text-[#102a43] hover:bg-[#e6ebf0]/70 transition-colors focus-visible:outline-2 focus-visible:outline-[#102a43]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sm min-w-0">
          <span className="text-[#64778c] whitespace-nowrap shrink-0">
            {meta.section}
          </span>
          <span className="text-[#9eb0c0]" aria-hidden="true">
            /
          </span>
          <span className="font-medium text-[#102a43] truncate">
            {activeView === 'editor' && activeQuizTitle
              ? activeQuizTitle
              : meta.label}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg border border-[#d8e0e8] bg-white text-sm text-[#64778c] hover:text-[#102a43] hover:border-[#b9c6d2] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#102a43]"
        >
          <Search className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Search workspace</span>
          <kbd className="hidden md:inline font-mono-num text-xs text-[#64778c] pl-1">
            ⌘K
          </kbd>
        </button>

        {activeView !== 'editor' && (
          <button
            type="button"
            onClick={onCreateQuiz}
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-[#102a43] text-white text-sm font-medium hover:bg-[#1b3e5f] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#102a43]"
          >
            New quiz
          </button>
        )}
      </div>
    </header>
  );
}
