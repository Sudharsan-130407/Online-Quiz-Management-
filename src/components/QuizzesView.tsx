import { useMemo, useState } from 'react';
import {
  Copy,
  Edit3,
  Play,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { Quiz, SubjectCategory } from '../types/quiz';

interface QuizzesViewProps {
  quizzes: Quiz[];
  onCreateQuiz: () => void;
  onEditQuiz: (quizId: string) => void;
  onPreviewQuiz: (quizId: string) => void;
  onDuplicateQuiz: (quizId: string) => void;
  onDeleteQuiz: (quizId: string) => void;
  onTogglePublish: (quizId: string) => void;
}

const SUBJECTS: ('All' | SubjectCategory)[] = [
  'All',
  'Design',
  'Strategy',
  'Science',
  'General',
];

export function QuizzesView({
  quizzes,
  onCreateQuiz,
  onEditQuiz,
  onPreviewQuiz,
  onDuplicateQuiz,
  onDeleteQuiz,
  onTogglePublish,
}: QuizzesViewProps) {
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState<'All' | SubjectCategory>('All');
  const [status, setStatus] = useState<'All' | 'Live' | 'Draft'>('All');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return quizzes.filter((item) => {
      if (subject !== 'All' && item.subject !== subject) return false;
      if (status !== 'All' && item.status !== status) return false;
      if (
        q &&
        !item.title.toLowerCase().includes(q) &&
        !item.description.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [quizzes, search, subject, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#102a43]">
            Quizzes
          </h1>
          <p className="mt-1 text-sm text-[#64778c]">
            Build assessments, organize question flows, and publish to learners.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateQuiz}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#102a43] text-white text-sm font-medium hover:bg-[#1a3e5e] transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4 text-[#2ee6a6]" />
          <span>Create quiz</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white border border-[#e6ebf0] rounded-[14px] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#64778c] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quizzes..."
              className="pl-9 pr-3 py-2 w-60 rounded-lg border border-[#d8e0e8] bg-[#f7f8f7] text-sm text-[#102a43] placeholder:text-[#7b8fa3] focus:outline-none focus:bg-white focus:border-[#102a43]"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#f7f8f7] border border-[#e6ebf0] rounded-lg">
            {SUBJECTS.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSubject(sub)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  subject === sub
                    ? 'bg-white text-[#102a43] shadow-xs'
                    : 'text-[#64778c] hover:text-[#102a43]'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#f7f8f7] border border-[#e6ebf0] rounded-lg">
          {(['All', 'Live', 'Draft'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatus(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                status === tab
                  ? 'bg-white text-[#102a43] shadow-xs'
                  : 'text-[#64778c] hover:text-[#102a43]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#e6ebf0] rounded-[14px] px-6 py-14 text-center">
          <p className="text-base font-semibold text-[#102a43]">
            No quizzes found
          </p>
          <p className="text-sm text-[#64778c] mt-1">
            Adjust your filters or create a new quiz to get started.
          </p>
          <button
            type="button"
            onClick={onCreateQuiz}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#102a43] text-white text-sm font-medium hover:bg-[#1a3e5e] transition-colors"
          >
            <Plus className="w-4 h-4 text-[#2ee6a6]" />
            <span>Create your next quiz</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((quiz) => (
            <article
              key={quiz.id}
              className="bg-white border border-[#e6ebf0] rounded-[14px] p-6 flex flex-col justify-between gap-5"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs text-[#64778c]">
                    <span>{quiz.subject}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{quiz.difficulty}</span>
                    <span aria-hidden="true"> · </span>
                    <span>
                      {quiz.timeLimitMinutes === 0
                        ? 'Untimed'
                        : `${quiz.timeLimitMinutes} min`}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => onTogglePublish(quiz.id)}
                    className={`text-xs font-semibold whitespace-nowrap shrink-0 ${
                      quiz.status === 'Live'
                        ? 'text-[#0a8f63] hover:text-[#076d4b]'
                        : 'text-[#64778c] hover:text-[#102a43]'
                    }`}
                  >
                    {quiz.status === 'Live' ? 'Live' : 'Draft'}
                  </button>
                </div>

                <h2 className="mt-2 font-display text-lg font-bold text-[#102a43]">
                  <button
                    type="button"
                    onClick={() => onEditQuiz(quiz.id)}
                    className="text-left hover:text-[#0a8f63] transition-colors"
                  >
                    {quiz.title}
                  </button>
                </h2>

                <p className="mt-1.5 text-sm text-[#64778c] line-clamp-2">
                  {quiz.description || 'No quiz description added yet.'}
                </p>
              </div>

              <div className="pt-4 border-t border-[#e6ebf0] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs text-[#64778c]">
                  <span className="tabular-nums">
                    <strong className="font-mono-num text-[#102a43]">
                      {quiz.questions.length}
                    </strong>{' '}
                    questions
                  </span>
                  <span className="tabular-nums">
                    <strong className="font-mono-num text-[#102a43]">
                      {quiz.attemptsCount}
                    </strong>{' '}
                    attempts
                  </span>
                  <span className="tabular-nums">
                    <strong className="font-mono-num text-[#102a43]">
                      {quiz.attemptsCount > 0 ? `${quiz.avgScore}%` : '—'}
                    </strong>{' '}
                    avg.
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onPreviewQuiz(quiz.id)}
                    title="Preview quiz as learner"
                    className="p-2 rounded-lg text-[#36536e] hover:text-[#0a8f63] hover:bg-[#e1fbf1] transition-colors"
                    aria-label={`Preview ${quiz.title}`}
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDuplicateQuiz(quiz.id)}
                    title="Duplicate quiz"
                    className="p-2 rounded-lg text-[#36536e] hover:text-[#102a43] hover:bg-[#f7f8f7] transition-colors"
                    aria-label={`Duplicate ${quiz.title}`}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteQuiz(quiz.id)}
                    title="Delete quiz"
                    className="p-2 rounded-lg text-[#64778c] hover:text-[#d95d47] hover:bg-[#fff0ed] transition-colors"
                    aria-label={`Delete ${quiz.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditQuiz(quiz.id)}
                    className="ml-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#d8e0e8] bg-white text-xs font-medium text-[#102a43] hover:bg-[#f7f8f7] transition-colors whitespace-nowrap shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit quiz</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
