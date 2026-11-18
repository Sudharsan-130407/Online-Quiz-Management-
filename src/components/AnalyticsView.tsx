import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { Quiz, Submission } from '../types/quiz';
import { Avatar } from './Avatar';

interface AnalyticsViewProps {
  quizzes: Quiz[];
  submissions: Submission[];
  onReviewSubmission: (submission: Submission) => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function AnalyticsView({
  quizzes,
  submissions,
  onReviewSubmission,
}: AnalyticsViewProps) {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'all'>('30d');
  const [quizFilter, setQuizFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<
    'All' | 'Completed' | 'Needs review'
  >('All');

  const liveQuizzes = useMemo(
    () => quizzes.filter((q) => q.attemptsCount > 0 || q.status === 'Live'),
    [quizzes],
  );

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      if (quizFilter !== 'all' && sub.quizId !== quizFilter) return false;
      if (statusFilter !== 'All' && sub.status !== statusFilter) return false;
      return true;
    });
  }, [submissions, quizFilter, statusFilter]);

  const distribution = useMemo(() => {
    const buckets = [
      { label: '90–100%', count: 0 },
      { label: '80–89%', count: 0 },
      { label: '70–79%', count: 0 },
      { label: 'Below 70%', count: 0 },
    ];
    submissions.forEach((s) => {
      if (s.scorePercent >= 90) buckets[0].count += 1;
      else if (s.scorePercent >= 80) buckets[1].count += 1;
      else if (s.scorePercent >= 70) buckets[2].count += 1;
      else buckets[3].count += 1;
    });
    const maxCount = Math.max(...buckets.map((b) => b.count), 1);
    return buckets.map((b) => ({
      ...b,
      widthPct: Math.round((b.count / maxCount) * 100),
    }));
  }, [submissions]);

  const avgTimeSeconds = useMemo(() => {
    if (submissions.length === 0) return 0;
    return Math.round(
      submissions.reduce((sum, s) => sum + s.timeSpentSeconds, 0) /
        submissions.length,
    );
  }, [submissions]);

  const handleExportCsv = () => {
    const headers = [
      'Learner',
      'Email',
      'Quiz',
      'Score (%)',
      'Points',
      'Time Spent',
      'Status',
      'Submitted',
    ];
    const rows = filteredSubmissions.map((s) => [
      s.learnerName,
      s.learnerEmail,
      s.quizTitle,
      String(s.scorePercent),
      `${s.pointsEarned}/${s.totalPoints}`,
      formatDuration(s.timeSpentSeconds),
      s.status,
      s.submittedAt,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(','),
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quizly-analytics-${timeframe}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#102a43]">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-[#64778c]">
            Track cohort scores, review learner responses, and export results.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-white border border-[#e6ebf0] rounded-lg">
            {[
              { id: '7d', label: 'Last 7 days' },
              { id: '30d', label: 'Last 30 days' },
              { id: 'all', label: 'All time' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setTimeframe(item.id as '7d' | '30d' | 'all')
                }
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  timeframe === item.id
                    ? 'bg-[#102a43] text-white'
                    : 'text-[#64778c] hover:text-[#102a43]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#d8e0e8] bg-white text-xs font-medium text-[#102a43] hover:bg-[#f7f8f7] transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export report</span>
          </button>
        </div>
      </div>

      {/* 3-Panel Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_0.9fr_0.9fr] gap-5">
        {/* Average Score by Quiz */}
        <section className="bg-white border border-[#e6ebf0] rounded-[14px] p-6">
          <h2 className="font-display text-base font-bold text-[#102a43]">
            Average score by quiz
          </h2>
          <p className="text-xs text-[#64778c] mt-0.5 mb-5">
            Performance across published assessments
          </p>

          <div className="space-y-4">
            {liveQuizzes.map((qz) => (
              <div key={qz.id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-medium text-[#102a43] truncate">
                    {qz.title}
                  </span>
                  <span className="font-mono-num font-semibold text-[#102a43] shrink-0">
                    {qz.attemptsCount > 0 ? `${qz.avgScore}%` : '—'}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#f0f3f6] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#2ee6a6]"
                    style={{
                      width: `${qz.attemptsCount > 0 ? qz.avgScore : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Score Distribution */}
        <section className="bg-white border border-[#e6ebf0] rounded-[14px] p-6">
          <h2 className="font-display text-base font-bold text-[#102a43]">
            Score distribution
          </h2>
          <p className="text-xs text-[#64778c] mt-0.5 mb-5">
            Recent submission spread
          </p>

          <div className="space-y-4">
            {distribution.map((bucket) => (
              <div key={bucket.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#36536e]">{bucket.label}</span>
                  <span className="font-mono-num font-medium text-[#102a43]">
                    {bucket.count}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#f0f3f6] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#102a43]"
                    style={{ width: `${bucket.widthPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Engagement Summary */}
        <section className="bg-white border border-[#e6ebf0] rounded-[14px] p-6 flex flex-col justify-between gap-4">
          <div>
            <h2 className="font-display text-base font-bold text-[#102a43]">
              Engagement & pace
            </h2>
            <p className="text-xs text-[#64778c] mt-0.5">
              Completion speed and review queue
            </p>
          </div>

          <div className="space-y-4">
            <div className="pb-3 border-b border-[#e6ebf0]">
              <p className="text-xs text-[#64778c]">Average time spent</p>
              <p className="mt-1 font-mono-num text-2xl font-bold text-[#102a43]">
                {formatDuration(avgTimeSeconds)}
              </p>
              <p className="text-xs text-[#0a8f63] mt-0.5">
                2 min faster than quiz limit
              </p>
            </div>

            <div>
              <p className="text-xs text-[#64778c]">Submissions logged</p>
              <p className="mt-1 font-mono-num text-2xl font-bold text-[#102a43]">
                {submissions.length}
              </p>
              <p className="text-xs text-[#64778c] mt-0.5">
                {submissions.filter((s) => s.status === 'Needs review').length}{' '}
                awaiting short-answer review
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Submissions Table */}
      <section className="bg-white border border-[#e6ebf0] rounded-[14px] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e6ebf0] flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-base font-bold text-[#102a43]">
            Learner submissions
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <select
              aria-label="Filter by quiz"
              value={quizFilter}
              onChange={(e) => setQuizFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#d8e0e8] bg-white text-xs font-medium text-[#102a43]"
            >
              <option value="all">All quizzes</option>
              {quizzes.map((qz) => (
                <option key={qz.id} value={qz.id}>
                  {qz.title}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1 p-1 bg-[#f7f8f7] border border-[#e6ebf0] rounded-lg">
              {(['All', 'Completed', 'Needs review'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    statusFilter === tab
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

        <div className="hidden md:grid grid-cols-[1.2fr_1.4fr_0.6fr_0.6fr_0.75fr_110px] gap-4 px-6 py-3 border-b border-[#e6ebf0] text-xs font-medium text-[#64778c]">
          <span>Learner</span>
          <span>Quiz</span>
          <span className="text-right">Score</span>
          <span className="text-right">Time</span>
          <span>Status</span>
          <span className="text-right">Review</span>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#64778c]">
            No matching submissions found.
          </div>
        ) : (
          <div className="divide-y divide-[#e6ebf0]">
            {filteredSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="px-6 py-4 grid grid-cols-1 md:grid-cols-[1.2fr_1.4fr_0.6fr_0.6fr_0.75fr_110px] items-center gap-3 md:gap-4 hover:bg-[#f7f8f7]/60 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar
                    src={sub.learnerAvatar}
                    name={sub.learnerName}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#102a43] truncate">
                      {sub.learnerName}
                    </p>
                    <p className="text-xs text-[#64778c] truncate">
                      {sub.submittedAt}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-[#36536e] truncate">
                  {sub.quizTitle}
                </p>

                <p className="font-mono-num text-sm font-semibold text-[#102a43] md:text-right">
                  {sub.scorePercent}%
                </p>

                <p className="font-mono-num text-sm text-[#64778c] md:text-right">
                  {formatDuration(sub.timeSpentSeconds)}
                </p>

                <p
                  className={`text-xs font-medium ${
                    sub.status === 'Completed'
                      ? 'text-[#0a8f63]'
                      : 'text-[#c98a18]'
                  }`}
                >
                  {sub.status}
                </p>

                <div className="flex md:justify-end">
                  <button
                    type="button"
                    onClick={() => onReviewSubmission(sub)}
                    className="px-3 py-1.5 rounded-lg border border-[#d8e0e8] bg-white text-xs font-medium text-[#102a43] hover:bg-[#f7f8f7] transition-colors whitespace-nowrap shrink-0"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
