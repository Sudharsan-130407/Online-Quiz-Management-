import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Edit3,
  Play,
  Plus,
  Search,
} from 'lucide-react';
import { ACTIVITY_30_DAYS, ACTIVITY_7_DAYS } from '../data/initialData';
import { AppView, Quiz, Submission } from '../types/quiz';
import { Avatar } from './Avatar';

interface OverviewViewProps {
  educatorName: string;
  quizzes: Quiz[];
  submissions: Submission[];
  onNavigate: (view: AppView) => void;
  onEditQuiz: (quizId: string) => void;
  onPreviewQuiz: (quizId: string) => void;
  onTogglePublish: (quizId: string) => void;
  onReviewSubmission: (submission: Submission) => void;
  onCreateQuiz: () => void;
}

export function OverviewView({
  educatorName,
  quizzes,
  submissions,
  onNavigate,
  onEditQuiz,
  onPreviewQuiz,
  onTogglePublish,
  onReviewSubmission,
  onCreateQuiz,
}: OverviewViewProps) {
  const [pulseWindow, setPulseWindow] = useState<'7d' | '30d'>('7d');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [quizFilter, setQuizFilter] = useState<'All' | 'Live' | 'Draft'>('All');
  const [quizQuery, setQuizQuery] = useState('');

  const firstName = educatorName.split(' ')[0] || 'Maya';

  const metrics = useMemo(() => {
    const liveQuizzes = quizzes.filter((q) => q.status === 'Live');
    const totalAttempts = quizzes.reduce((s, q) => s + q.attemptsCount, 0);
    const scoredQuizzes = liveQuizzes.filter((q) => q.attemptsCount > 0);
    const avgScore = scoredQuizzes.length
      ? Math.round(
          scoredQuizzes.reduce((s, q) => s + q.avgScore, 0) /
            scoredQuizzes.length,
        )
      : 0;
    const avgCompletion = scoredQuizzes.length
      ? Math.round(
          scoredQuizzes.reduce((s, q) => s + q.completionRate, 0) /
            scoredQuizzes.length,
        )
      : 0;

    return {
      activeCount: liveQuizzes.length,
      draftCount: quizzes.length - liveQuizzes.length,
      totalAttempts,
      avgScore,
      avgCompletion,
    };
  }, [quizzes]);

  const pulseData = pulseWindow === '7d' ? ACTIVITY_7_DAYS : ACTIVITY_30_DAYS;
  const maxAttempts = Math.max(...pulseData.map((d) => d.attempts), 1);

  const filteredQuizzes = useMemo(() => {
    const q = quizQuery.trim().toLowerCase();
    return quizzes.filter((item) => {
      if (quizFilter !== 'All' && item.status !== quizFilter) return false;
      if (
        q &&
        !item.title.toLowerCase().includes(q) &&
        !item.subject.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [quizzes, quizFilter, quizQuery]);

  const pendingSubmissions = submissions.filter(
    (s) => s.status === 'Needs review',
  );
  const draftQuizzes = quizzes.filter((q) => q.status === 'Draft');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#102a43] text-balance">
            Good morning, {firstName}
          </h1>
          <p className="mt-1 text-sm sm:text-base text-[#64778c]">
            Pick up where you left off with your learners and active assessments.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('learner-portal')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#d8e0e8] bg-white text-sm font-medium text-[#102a43] hover:bg-[#f7f8f7] transition-colors whitespace-nowrap shrink-0"
          >
            <Play className="w-3.5 h-3.5 text-[#0a8f63]" />
            <span>Learner portal</span>
          </button>
          <button
            type="button"
            onClick={onCreateQuiz}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#102a43] text-white text-sm font-medium hover:bg-[#1a3e5e] transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 text-[#2ee6a6]" />
            <span>Create quiz</span>
          </button>
        </div>
      </div>

      {/* 4-Column Metric Strip */}
      <section
        aria-label="Workspace metrics"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        <div className="bg-white border border-[#e6ebf0] rounded-[14px] p-5">
          <p className="text-xs font-medium text-[#64778c]">Active quizzes</p>
          <p className="mt-2 font-display text-3xl font-bold text-[#102a43] tabular-nums">
            {metrics.activeCount}
          </p>
          <p className="mt-1.5 text-xs text-[#64778c]">
            {metrics.draftCount} draft waiting to publish
          </p>
        </div>

        <div className="bg-white border border-[#e6ebf0] rounded-[14px] p-5">
          <p className="text-xs font-medium text-[#64778c]">
            Attempts this month
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-[#102a43] tabular-nums">
            {metrics.totalAttempts}
          </p>
          <p className="mt-1.5 text-xs text-[#0a8f63] font-medium">
            +8.1% vs last month
          </p>
        </div>

        <div className="bg-white border border-[#e6ebf0] rounded-[14px] p-5">
          <p className="text-xs font-medium text-[#64778c]">Average score</p>
          <p className="mt-2 font-display text-3xl font-bold text-[#102a43] tabular-nums">
            {metrics.avgScore}%
          </p>
          <p className="mt-1.5 text-xs text-[#64778c]">
            Across {quizzes.length} total quizzes
          </p>
        </div>

        <div className="bg-white border border-[#e6ebf0] rounded-[14px] p-5">
          <p className="text-xs font-medium text-[#64778c]">Completion rate</p>
          <p className="mt-2 font-display text-3xl font-bold text-[#102a43] tabular-nums">
            {metrics.avgCompletion}%
          </p>
          <p className="mt-1.5 text-xs text-[#64778c]">
            11 active learners this week
          </p>
        </div>
      </section>

      {/* Main Dashboard Split Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.53fr)_minmax(310px,0.9fr)] gap-6 items-start">
        {/* Left Column: Activity Pulse + Recent Quizzes */}
        <div className="space-y-6 min-w-0">
          <section className="bg-white border border-[#e6ebf0] rounded-[14px] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-base font-bold text-[#102a43]">
                  Activity pulse
                </h2>
                <p className="text-xs text-[#64778c] mt-0.5">
                  {pulseWindow === '7d'
                    ? 'Attempts over the past seven days'
                    : 'Weekly attempts over the past 30 days'}
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 bg-[#f7f8f7] border border-[#e6ebf0] rounded-lg">
                <button
                  type="button"
                  onClick={() => setPulseWindow('7d')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    pulseWindow === '7d'
                      ? 'bg-white text-[#102a43] shadow-xs'
                      : 'text-[#64778c] hover:text-[#102a43]'
                  }`}
                >
                  Last 7 days
                </button>
                <button
                  type="button"
                  onClick={() => setPulseWindow('30d')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    pulseWindow === '30d'
                      ? 'bg-white text-[#102a43] shadow-xs'
                      : 'text-[#64778c] hover:text-[#102a43]'
                  }`}
                >
                  Last 30 days
                </button>
              </div>
            </div>

            <div
              className={`grid gap-3 items-end h-44 pt-4 ${
                pulseWindow === '7d' ? 'grid-cols-7' : 'grid-cols-4'
              }`}
            >
              {pulseData.map((day, idx) => {
                const heightPercent = Math.max(
                  14,
                  Math.round((day.attempts / maxAttempts) * 100),
                );
                const isHovered = hoveredIdx === idx;
                return (
                  <div
                    key={day.label}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="flex flex-col items-center justify-end h-full group cursor-pointer"
                  >
                    <div className="text-[11px] font-mono-num text-[#36536e] mb-1.5 transition-opacity">
                      {isHovered
                        ? `${day.attempts} · ${day.avgScore}%`
                        : day.attempts}
                    </div>
                    <div className="w-full max-w-[44px] flex-1 flex items-end">
                      <div
                        className={`w-full rounded-t-lg transition-colors duration-150 ${
                          isHovered
                            ? 'bg-[#102a43]'
                            : idx === pulseData.length - 1
                              ? 'bg-[#2ee6a6]'
                              : 'bg-[#d8e0e8]'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="mt-2.5 text-xs font-medium text-[#64778c]">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Quizzes Quick Table */}
          <section className="bg-white border border-[#e6ebf0] rounded-[14px] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#e6ebf0] flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-base font-bold text-[#102a43]">
                  Recent quizzes
                </h2>
                <p className="text-xs text-[#64778c] mt-0.5">
                  Manage publishing status, edit questions, or preview learner
                  flow.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#64778c] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={quizQuery}
                    onChange={(e) => setQuizQuery(e.target.value)}
                    placeholder="Filter quizzes..."
                    className="pl-8 pr-3 py-1.5 w-44 rounded-lg border border-[#d8e0e8] bg-[#f7f8f7] text-xs text-[#102a43] placeholder:text-[#7b8fa3] focus:outline-none focus:bg-white focus:border-[#102a43]"
                  />
                </div>

                <div className="flex items-center gap-1 p-1 bg-[#f7f8f7] border border-[#e6ebf0] rounded-lg">
                  {(['All', 'Live', 'Draft'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setQuizFilter(tab)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        quizFilter === tab
                          ? 'bg-white text-[#102a43] shadow-xs'
                          : 'text-[#64778c] hover:text-[#102a43]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredQuizzes.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm font-medium text-[#102a43]">
                  No quizzes found
                </p>
                <p className="text-xs text-[#64778c] mt-1">
                  Try clearing your search or create a new quiz.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#e6ebf0]">
                {filteredQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#f7f8f7]/70 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => onEditQuiz(quiz.id)}
                          className="font-medium text-sm text-[#102a43] hover:text-[#0a8f63] text-left truncate transition-colors"
                        >
                          {quiz.title}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-[#64778c]">
                        <span>{quiz.subject}</span>
                        <span aria-hidden="true"> · </span>
                        <span className="tabular-nums">
                          {quiz.questions.length} questions
                        </span>
                        <span aria-hidden="true"> · </span>
                        <span>Edited {quiz.lastEdited}</span>
                        <span aria-hidden="true"> · </span>
                        <span
                          className={
                            quiz.status === 'Live'
                              ? 'text-[#0a8f63] font-medium'
                              : 'text-[#64778c] font-medium'
                          }
                        >
                          {quiz.status}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                      <div className="flex items-center gap-5 text-right">
                        <div>
                          <p className="text-[11px] text-[#64778c]">Attempts</p>
                          <p className="font-mono-num text-sm font-medium text-[#102a43]">
                            {quiz.attemptsCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-[#64778c]">
                            Avg. score
                          </p>
                          <p className="font-mono-num text-sm font-medium text-[#102a43]">
                            {quiz.attemptsCount > 0 ? `${quiz.avgScore}%` : '—'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEditQuiz(quiz.id)}
                          title="Edit quiz"
                          className="px-3 py-1.5 rounded-lg border border-[#d8e0e8] bg-white text-xs font-medium text-[#102a43] hover:bg-[#f7f8f7] transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        {quiz.status === 'Live' ? (
                          <button
                            type="button"
                            onClick={() => onPreviewQuiz(quiz.id)}
                            title="Take or preview quiz"
                            className="px-3 py-1.5 rounded-lg bg-[#e1fbf1] text-xs font-medium text-[#0a8f63] hover:bg-[#c9f7e5] transition-colors whitespace-nowrap shrink-0"
                          >
                            Preview
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onTogglePublish(quiz.id)}
                            className="px-3 py-1.5 rounded-lg bg-[#102a43] text-xs font-medium text-white hover:bg-[#1a3e5e] transition-colors whitespace-nowrap shrink-0"
                          >
                            Publish
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Needs Your Attention + Latest Submissions */}
        <div className="space-y-6">
          <section className="bg-white border border-[#e6ebf0] rounded-[14px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-base font-bold text-[#102a43]">
                Needs your attention
              </h2>
              <span className="font-mono-num text-xs text-[#64778c]">
                {pendingSubmissions.length + draftQuizzes.length} items
              </span>
            </div>

            {pendingSubmissions.length === 0 && draftQuizzes.length === 0 ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="w-6 h-6 text-[#0a8f63] mx-auto mb-2" />
                <p className="text-sm font-medium text-[#102a43]">
                  All caught up
                </p>
                <p className="text-xs text-[#64778c] mt-1">
                  Every short-answer submission has been reviewed.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#e6ebf0]">
                {pendingSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#102a43] truncate">
                        Review {sub.learnerName}&apos;s response
                      </p>
                      <p className="text-xs text-[#64778c] mt-0.5 truncate">
                        {sub.quizTitle} · {sub.submittedAt}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onReviewSubmission(sub)}
                      className="px-3 py-1.5 rounded-lg border border-[#d8e0e8] bg-white text-xs font-medium text-[#102a43] hover:bg-[#f7f8f7] transition-colors whitespace-nowrap shrink-0"
                    >
                      Grade
                    </button>
                  </div>
                ))}

                {draftQuizzes.map((draft) => (
                  <div
                    key={draft.id}
                    className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#102a43] truncate">
                        Finish draft: {draft.title}
                      </p>
                      <p className="text-xs text-[#64778c] mt-0.5">
                        {draft.questions.length} question
                        {draft.questions.length === 1 ? '' : 's'} · Edited{' '}
                        {draft.lastEdited}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onEditQuiz(draft.id)}
                      className="px-3 py-1.5 rounded-lg border border-[#d8e0e8] bg-white text-xs font-medium text-[#102a43] hover:bg-[#f7f8f7] transition-colors whitespace-nowrap shrink-0"
                    >
                      Open
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white border border-[#e6ebf0] rounded-[14px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-base font-bold text-[#102a43]">
                Latest submissions
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('analytics')}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#36536e] hover:text-[#102a43] transition-colors whitespace-nowrap shrink-0"
              >
                <span>View all</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#e6ebf0]">
              {submissions.slice(0, 4).map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => onReviewSubmission(sub)}
                  className="w-full py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-left hover:opacity-85 transition-opacity"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      src={sub.learnerAvatar}
                      name={sub.learnerName}
                      size="md"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#102a43] truncate">
                        {sub.learnerName}
                      </p>
                      <p className="text-xs text-[#64778c] truncate">
                        {sub.quizTitle}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-mono-num text-sm font-semibold text-[#102a43]">
                      {sub.scorePercent}%
                    </p>
                    <p className="text-[11px] text-[#64778c] inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{sub.submittedAt}</span>
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
