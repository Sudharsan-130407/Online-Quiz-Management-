import { useEffect, useState } from 'react';
import {
  INITIAL_QUESTIONS,
  INITIAL_QUIZZES,
  INITIAL_SETTINGS,
  INITIAL_SUBMISSIONS,
} from './data/initialData';
import {
  AppView,
  AuthRole,
  Question,
  Quiz,
  Submission,
  WorkspaceSettings,
} from './types/quiz';
import { AnalyticsView } from './components/AnalyticsView';
import { CommandPalette } from './components/CommandPalette';
import { LearnerPortalView } from './components/LearnerPortalView';
import { LoginView } from './components/LoginView';
import { OverviewView } from './components/OverviewView';
import { QuestionBankView } from './components/QuestionBankView';
import { QuizEditorView } from './components/QuizEditorView';
import { QuizzesView } from './components/QuizzesView';
import { SettingsView } from './components/SettingsView';
import { Sidebar } from './components/Sidebar';
import { SubmissionReviewModal } from './components/SubmissionReviewModal';
import { TopBar } from './components/TopBar';

const STORAGE_KEY = 'quizly-workspace-state-v1';

interface PersistedState {
  quizzes: Quiz[];
  questions: Question[];
  submissions: Submission[];
  settings: WorkspaceSettings;
}

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      if (
        Array.isArray(parsed.quizzes) &&
        Array.isArray(parsed.questions) &&
        Array.isArray(parsed.submissions) &&
        parsed.settings
      ) {
        return {
          quizzes: parsed.quizzes,
          questions: parsed.questions,
          submissions: parsed.submissions,
          settings: parsed.settings,
        };
      }
    }
  } catch {
    // Fallback to initial seed data
  }
  return {
    quizzes: INITIAL_QUIZZES,
    questions: INITIAL_QUESTIONS,
    submissions: INITIAL_SUBMISSIONS,
    settings: INITIAL_SETTINGS,
  };
}

export default function App() {
  const [initial] = useState<PersistedState>(() => loadInitialState());
  const [quizzes, setQuizzes] = useState<Quiz[]>(initial.quizzes);
  const [questions, setQuestions] = useState<Question[]>(initial.questions);
  const [submissions, setSubmissions] = useState<Submission[]>(
    initial.submissions,
  );
  const [settings, setSettings] = useState<WorkspaceSettings>(
    initial.settings,
  );

  const [authRole, setAuthRole] = useState<AuthRole>('educator');
  const [activeView, setActiveView] = useState<AppView>('overview');
  const [editingQuizId, setEditingQuizId] = useState<string>(
    initial.quizzes[0]?.id ?? '',
  );
  const [previewQuizId, setPreviewQuizId] = useState<string | null>(null);
  const [reviewingSubmission, setReviewingSubmission] =
    useState<Submission | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ quizzes, questions, submissions, settings }),
      );
    } catch {
      // Ignore storage quota issues
    }
  }, [quizzes, questions, submissions, settings]);

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const handleCreateQuiz = () => {
    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: 'Untitled Assessment',
      description: 'Add clear instructions so learners know what to expect.',
      subject: 'Design',
      status: settings.autoPublishQuizzes ? 'Live' : 'Draft',
      difficulty: 'Medium',
      timeLimitMinutes: settings.defaultTimeLimit,
      questions: [],
      attemptsCount: 0,
      avgScore: 0,
      completionRate: 0,
      lastEdited: 'Just now',
      settings: {
        allowNewAttempts: settings.allowNewAttempts,
        reviewCorrectAnswers: settings.reviewCorrectAnswers,
        showLearnerFeedback: true,
      },
    };
    setQuizzes((prev) => [newQuiz, ...prev]);
    setEditingQuizId(newQuiz.id);
    setActiveView('editor');
  };

  const handleEditQuiz = (quizId: string) => {
    setEditingQuizId(quizId);
    setActiveView('editor');
  };

  const handleSaveQuiz = (updated: Quiz) => {
    setQuizzes((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q)),
    );
  };

  const handleTogglePublish = (quizId: string) => {
    setQuizzes((prev) =>
      prev.map((q) => {
        if (q.id !== quizId) return q;
        const nextStatus = q.status === 'Live' ? 'Draft' : 'Live';
        return {
          ...q,
          status: nextStatus,
          lastEdited: 'Just now',
          settings: {
            ...q.settings,
            allowNewAttempts:
              nextStatus === 'Live' ? true : q.settings.allowNewAttempts,
          },
        };
      }),
    );
  };

  const handleDuplicateQuiz = (quizId: string) => {
    const source = quizzes.find((q) => q.id === quizId);
    if (!source) return;
    const copy: Quiz = {
      ...source,
      id: `quiz-${Date.now()}`,
      title: `${source.title} (Copy)`,
      status: 'Draft',
      attemptsCount: 0,
      avgScore: 0,
      completionRate: 0,
      lastEdited: 'Just now',
    };
    setQuizzes((prev) => [copy, ...prev]);
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    if (editingQuizId === quizId) {
      setActiveView('quizzes');
    }
  };

  const handlePreviewQuiz = (quizId: string) => {
    setPreviewQuizId(quizId);
    setActiveView('learner-portal');
  };

  const handleAddBankQuestion = (question: Question) => {
    setQuestions((prev) => [question, ...prev]);
  };

  const handleDeleteBankQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const handleAssignQuestionToQuiz = (question: Question, quizId: string) => {
    const clone: Question = {
      ...question,
      id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    };
    setQuizzes((prev) =>
      prev.map((qz) =>
        qz.id === quizId
          ? {
              ...qz,
              questions: [...qz.questions, clone],
              lastEdited: 'Just now',
            }
          : qz,
      ),
    );
  };

  const handleSubmitLearnerQuiz = (submission: Submission) => {
    setSubmissions((prev) => [submission, ...prev]);
    setQuizzes((prev) =>
      prev.map((qz) => {
        if (qz.id !== submission.quizId) return qz;
        const nextAttempts = qz.attemptsCount + 1;
        const nextAvg = Math.round(
          (qz.avgScore * qz.attemptsCount + submission.scorePercent) /
            nextAttempts,
        );
        return {
          ...qz,
          attemptsCount: nextAttempts,
          avgScore: nextAvg,
          completionRate: Math.min(100, Math.max(qz.completionRate, 92)),
        };
      }),
    );
  };

  const handleUpdateSubmission = (updated: Submission) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s)),
    );
  };

  if (authRole === 'signed-out') {
    return (
      <LoginView
        onSignInEducator={(email) => {
          if (email) {
            setSettings((prev) => ({ ...prev, educatorEmail: email }));
          }
          setAuthRole('educator');
          setActiveView('overview');
        }}
        onSignInLearner={() => {
          setAuthRole('learner');
          setPreviewQuizId(null);
        }}
      />
    );
  }

  if (authRole === 'learner') {
    return (
      <div className="min-h-screen bg-[#f7f8f7]">
        <header className="h-[68px] border-b border-[#e6ebf0] bg-white px-6 sm:px-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#102a43] text-[#2ee6a6] flex items-center justify-center shrink-0">
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
            <span className="font-display text-lg font-bold text-[#102a43]">
              Quizly
            </span>
          </div>

          <button
            type="button"
            onClick={() => setAuthRole('educator')}
            className="text-xs font-medium text-[#36536e] hover:text-[#102a43]"
          >
            Switch to Educator Workspace
          </button>
        </header>

        <main className="px-5 sm:px-10 py-10">
          <LearnerPortalView
            quizzes={quizzes}
            submissions={submissions}
            learnerName="Alex Kim"
            learnerEmail="alex.kim@studio.edu"
            isPreviewMode={false}
            onSignOut={() => setAuthRole('signed-out')}
            onSubmitQuiz={handleSubmitLearnerQuiz}
          />
        </main>
      </div>
    );
  }

  const editingQuiz =
    quizzes.find((q) => q.id === editingQuizId) ?? quizzes[0];
  const pendingReviewCount = submissions.filter(
    (s) => s.status === 'Needs review',
  ).length;

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#102a43]">
      <Sidebar
        activeView={activeView}
        onNavigate={(view) => {
          if (view !== 'learner-portal') {
            setPreviewQuizId(null);
          }
          setActiveView(view);
        }}
        onCreateQuiz={handleCreateQuiz}
        onSignOut={() => setAuthRole('signed-out')}
        educatorName={settings.educatorName}
        roleTitle={settings.roleTitle}
        pendingReviewCount={pendingReviewCount}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="lg:pl-[240px] min-h-screen flex flex-col">
        <TopBar
          activeView={activeView}
          activeQuizTitle={
            activeView === 'editor' ? editingQuiz?.title : undefined
          }
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onCreateQuiz={handleCreateQuiz}
        />

        <main className="flex-1 px-5 sm:px-8 py-8 max-w-[1440px] w-full mx-auto">
          {activeView === 'overview' && (
            <OverviewView
              educatorName={settings.educatorName}
              quizzes={quizzes}
              submissions={submissions}
              onNavigate={setActiveView}
              onEditQuiz={handleEditQuiz}
              onPreviewQuiz={handlePreviewQuiz}
              onTogglePublish={handleTogglePublish}
              onReviewSubmission={setReviewingSubmission}
              onCreateQuiz={handleCreateQuiz}
            />
          )}

          {activeView === 'quizzes' && (
            <QuizzesView
              quizzes={quizzes}
              onCreateQuiz={handleCreateQuiz}
              onEditQuiz={handleEditQuiz}
              onPreviewQuiz={handlePreviewQuiz}
              onDuplicateQuiz={handleDuplicateQuiz}
              onDeleteQuiz={handleDeleteQuiz}
              onTogglePublish={handleTogglePublish}
            />
          )}

          {activeView === 'editor' && editingQuiz && (
            <QuizEditorView
              key={editingQuiz.id}
              quiz={editingQuiz}
              questionBank={questions}
              onSaveQuiz={handleSaveQuiz}
              onBack={() => setActiveView('quizzes')}
              onPreviewQuiz={(qz) => handlePreviewQuiz(qz.id)}
            />
          )}

          {activeView === 'question-bank' && (
            <QuestionBankView
              questions={questions}
              quizzes={quizzes}
              onAddQuestion={handleAddBankQuestion}
              onDeleteQuestion={handleDeleteBankQuestion}
              onAssignToQuiz={handleAssignQuestionToQuiz}
            />
          )}

          {activeView === 'analytics' && (
            <AnalyticsView
              quizzes={quizzes}
              submissions={submissions}
              onReviewSubmission={setReviewingSubmission}
            />
          )}

          {activeView === 'learner-portal' && (
            <LearnerPortalView
              quizzes={quizzes}
              submissions={submissions}
              initialQuizId={previewQuizId}
              learnerName="Alex Kim"
              learnerEmail="alex.kim@studio.edu"
              isPreviewMode={true}
              onExitToWorkspace={() => {
                setPreviewQuizId(null);
                setActiveView('overview');
              }}
              onSubmitQuiz={handleSubmitLearnerQuiz}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={setSettings}
              onSignOut={() => setAuthRole('signed-out')}
            />
          )}
        </main>
      </div>

      <CommandPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        quizzes={quizzes}
        questions={questions}
        onNavigate={setActiveView}
        onOpenQuizEditor={handleEditQuiz}
      />

      {reviewingSubmission && (
        <SubmissionReviewModal
          submission={reviewingSubmission}
          onClose={() => setReviewingSubmission(null)}
          onUpdateSubmission={handleUpdateSubmission}
        />
      )}
    </div>
  );
}
