import {
  BarChart3,
  BookOpen,
  Compass,
  FileText,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  X,
} from 'lucide-react';
import { AppView } from '../types/quiz';
import { ASSETS } from '../data/initialData';
import { Avatar } from './Avatar';

interface SidebarProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onCreateQuiz: () => void;
  onSignOut: () => void;
  educatorName: string;
  roleTitle: string;
  pendingReviewCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  activeView,
  onNavigate,
  onCreateQuiz,
  onSignOut,
  educatorName,
  roleTitle,
  pendingReviewCount,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const workspaceLinks: {
    id: AppView;
    label: string;
    icon: typeof LayoutDashboard;
    count?: number;
  }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'quizzes', label: 'Quizzes', icon: FileText },
    { id: 'question-bank', label: 'Question bank', icon: BookOpen },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      count: pendingReviewCount > 0 ? pendingReviewCount : undefined,
    },
  ];

  const portalLinks: {
    id: AppView;
    label: string;
    icon: typeof Compass;
  }[] = [
    { id: 'learner-portal', label: 'Learner portal', icon: Compass },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (view: AppView) => {
    onNavigate(view);
    onCloseMobile();
  };

  const sidebarBody = (
    <div className="flex flex-col h-full bg-[#102a43] text-[#f7f8f7] px-3.5 py-6">
      <div className="flex items-center justify-between px-2.5 mb-7">
        <button
          type="button"
          onClick={() => handleSelect('overview')}
          className="flex items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2ee6a6] rounded-md"
        >
          <span className="w-8 h-8 rounded-lg bg-[#2ee6a6] text-[#102a43] flex items-center justify-center shrink-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="4" y="4" width="16" height="16" rx="3" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
            Quizly
          </span>
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="lg:hidden p-1.5 rounded-lg text-[#b1c3d1] hover:text-white hover:bg-[#193b5c] focus-visible:outline-2 focus-visible:outline-[#2ee6a6]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          onCreateQuiz();
          onCloseMobile();
        }}
        className="w-full mb-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#2ee6a6] text-[#102a43] font-semibold text-sm hover:bg-[#49edb3] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2ee6a6]"
      >
        <Plus className="w-4 h-4 shrink-0" />
        <span>Create quiz</span>
      </button>

      <nav aria-label="Workspace navigation" className="flex-1 space-y-6">
        <div>
          <p className="px-3 pb-2 text-xs font-medium text-[#8ba3b8]">
            Workspace
          </p>
          <div className="space-y-1">
            {workspaceLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeView === item.id ||
                (item.id === 'quizzes' && activeView === 'editor');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#2ee6a6] ${
                    isActive
                      ? 'bg-[#1a3a58] text-white'
                      : 'text-[#c4d3e0] hover:text-white hover:bg-[#163450]'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-[#2ee6a6]' : 'text-[#8ba3b8]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.count !== undefined && (
                    <span className="font-mono-num text-xs text-[#2ee6a6]">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="px-3 pb-2 text-xs font-medium text-[#8ba3b8]">
            Control Center
          </p>
          <div className="space-y-1">
            {portalLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#2ee6a6] ${
                    isActive
                      ? 'bg-[#1a3a58] text-white'
                      : 'text-[#c4d3e0] hover:text-white hover:bg-[#163450]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#2ee6a6]' : 'text-[#8ba3b8]'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="pt-4 mt-4 border-t border-[#1e4263]">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <Avatar src={ASSETS.mayaAvatar} name={educatorName} size="md" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">
              {educatorName}
            </p>
            <p className="text-xs text-[#9eb3c6] truncate">{roleTitle}</p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            title="Sign out"
            aria-label="Sign out"
            className="p-2 rounded-lg text-[#9eb3c6] hover:text-white hover:bg-[#193b5c] transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-[#2ee6a6]"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-[240px] z-30">
        {sidebarBody}
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-[#102a43]/50 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative w-[264px] max-w-[82vw] h-full z-10">
            {sidebarBody}
          </aside>
        </div>
      )}
    </>
  );
}
