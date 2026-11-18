import { useMemo, useState } from 'react';
import { Plus, Search, Trash2, X } from 'lucide-react';
import {
  DifficultyLevel,
  Question,
  QuestionType,
  Quiz,
  SubjectCategory,
} from '../types/quiz';

interface QuestionBankViewProps {
  questions: Question[];
  quizzes: Quiz[];
  onAddQuestion: (question: Question) => void;
  onDeleteQuestion: (questionId: string) => void;
  onAssignToQuiz: (question: Question, quizId: string) => void;
}

export function QuestionBankView({
  questions,
  quizzes,
  onAddQuestion,
  onDeleteQuestion,
  onAssignToQuiz,
}: QuestionBankViewProps) {
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<'All' | SubjectCategory>(
    'All',
  );
  const [difficultyFilter, setDifficultyFilter] = useState<
    'All' | DifficultyLevel
  >('All');
  const [showCreate, setShowCreate] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [feedbackBanner, setFeedbackBanner] = useState('');

  // Form state for new question
  const [prompt, setPrompt] = useState('');
  const [subject, setSubject] = useState<SubjectCategory>('Design');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [type, setType] = useState<QuestionType>('multiple-choice');
  const [points, setPoints] = useState(2);
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [shortRef, setShortRef] = useState('');
  const [explanation, setExplanation] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return questions.filter((item) => {
      if (subjectFilter !== 'All' && item.subject !== subjectFilter) {
        return false;
      }
      if (difficultyFilter !== 'All' && item.difficulty !== difficultyFilter) {
        return false;
      }
      if (
        q &&
        !item.prompt.toLowerCase().includes(q) &&
        !item.subject.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [questions, search, subjectFilter, difficultyFilter]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const options =
      type === 'multiple-choice'
        ? [optA || 'Option A', optB || 'Option B', optC || 'Option C', optD || 'Option D']
        : [];
    const correctAnswer =
      type === 'multiple-choice'
        ? options[correctIdx] ?? options[0]
        : shortRef || 'Educator rubric evaluation';

    const created: Question = {
      id: `qb-${Date.now()}`,
      prompt: prompt.trim(),
      type,
      subject,
      difficulty,
      points,
      options,
      correctAnswer,
      explanation: explanation.trim(),
      usageCount: 0,
      updatedAt: 'Just now',
    };

    onAddQuestion(created);
    setPrompt('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setShortRef('');
    setExplanation('');
    setShowCreate(false);
    setFeedbackBanner('Question saved to bank.');
    setTimeout(() => setFeedbackBanner(''), 2500);
  };

  const handleAddToQuiz = (question: Question, quizId: string) => {
    onAssignToQuiz(question, quizId);
    setAssigningId(null);
    const quizTitle = quizzes.find((q) => q.id === quizId)?.title ?? 'quiz';
    setFeedbackBanner(`Added question to "${quizTitle}".`);
    setTimeout(() => setFeedbackBanner(''), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#102a43]">
            Question bank
          </h1>
          <p className="mt-1 text-sm text-[#64778c]">
            Keep your best questions reusable, organized, and easy to insert
            into any quiz.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#102a43] text-white text-sm font-medium hover:bg-[#1a3e5e] transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4 text-[#2ee6a6]" />
          <span>Add question</span>
        </button>
      </div>

      {feedbackBanner && (
        <div className="px-4 py-2.5 rounded-lg bg-[#e1fbf1] border border-[#b4eed8] text-xs font-medium text-[#0a8f63]">
          {feedbackBanner}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white border border-[#e6ebf0] rounded-[14px] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#64778c] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="pl-9 pr-3 py-2 w-64 rounded-lg border border-[#d8e0e8] bg-[#f7f8f7] text-sm text-[#102a43] placeholder:text-[#7b8fa3] focus:outline-none focus:bg-white focus:border-[#102a43]"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#f7f8f7] border border-[#e6ebf0] rounded-lg">
            {(['All', 'Design', 'Strategy', 'Science', 'General'] as const).map(
              (sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSubjectFilter(sub)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    subjectFilter === sub
                      ? 'bg-white text-[#102a43] shadow-xs'
                      : 'text-[#64778c] hover:text-[#102a43]'
                  }`}
                >
                  {sub}
                </button>
              ),
            )}
          </div>
        </div>

        <select
          aria-label="Filter by difficulty"
          value={difficultyFilter}
          onChange={(e) =>
            setDifficultyFilter(e.target.value as 'All' | DifficultyLevel)
          }
          className="px-3 py-2 rounded-lg border border-[#d8e0e8] bg-white text-xs font-medium text-[#102a43]"
        >
          <option value="All">All difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Question Table */}
      <div className="bg-white border border-[#e6ebf0] rounded-[14px] overflow-hidden">
        <div className="hidden md:grid grid-cols-[minmax(280px,2.3fr)_0.85fr_0.85fr_0.6fr_0.6fr_130px] gap-4 px-6 py-3 border-b border-[#e6ebf0] text-xs font-medium text-[#64778c]">
          <span>Question</span>
          <span>Subject</span>
          <span>Type</span>
          <span>Difficulty</span>
          <span className="text-right">Points</span>
          <span className="text-right">Actions</span>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-medium text-[#102a43]">
              No questions found
            </p>
            <p className="text-xs text-[#64778c] mt-1">
              Try adjusting your search or add a new question to the bank.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#e6ebf0]">
            {filtered.map((q, index) => (
              <div
                key={q.id}
                className="px-6 py-4 grid grid-cols-1 md:grid-cols-[minmax(280px,2.3fr)_0.85fr_0.85fr_0.6fr_0.6fr_130px] items-center gap-3 md:gap-4 hover:bg-[#f7f8f7]/60 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="font-mono-num text-xs font-medium text-[#0a8f63] bg-[#f1f5f5] px-2 py-1 rounded-md shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#102a43] line-clamp-2">
                      {q.prompt}
                    </p>
                    <p className="text-xs text-[#64778c] mt-1 md:hidden">
                      {q.subject} ·{' '}
                      {q.type === 'multiple-choice'
                        ? 'Multiple choice'
                        : 'Short answer'}{' '}
                      · {q.difficulty} · {q.points} pts
                    </p>
                  </div>
                </div>

                <span className="hidden md:block text-sm text-[#36536e]">
                  {q.subject}
                </span>

                <span className="hidden md:block text-sm text-[#36536e]">
                  {q.type === 'multiple-choice'
                    ? 'Multiple choice'
                    : 'Short answer'}
                </span>

                <span className="hidden md:block text-sm text-[#36536e]">
                  {q.difficulty}
                </span>

                <span className="hidden md:block font-mono-num text-sm text-[#102a43] text-right">
                  {q.points}
                </span>

                <div className="flex items-center justify-end gap-2 relative">
                  <button
                    type="button"
                    onClick={() =>
                      setAssigningId(assigningId === q.id ? null : q.id)
                    }
                    className="px-3 py-1.5 rounded-lg border border-[#d8e0e8] bg-white text-xs font-medium text-[#102a43] hover:bg-[#f7f8f7] transition-colors whitespace-nowrap shrink-0"
                  >
                    Add to quiz
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteQuestion(q.id)}
                    aria-label="Delete question from bank"
                    className="p-1.5 rounded-lg text-[#64778c] hover:text-[#d95d47] hover:bg-[#fff0ed] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {assigningId === q.id && (
                    <div className="absolute right-0 top-10 z-30 w-60 bg-white border border-[#d8e0e8] rounded-xl shadow-lg p-2">
                      <p className="px-2.5 py-1.5 text-xs font-medium text-[#64778c]">
                        Select target quiz
                      </p>
                      <div className="space-y-0.5 max-h-48 overflow-y-auto">
                        {quizzes.map((qz) => (
                          <button
                            key={qz.id}
                            type="button"
                            onClick={() => handleAddToQuiz(q, qz.id)}
                            className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium text-[#102a43] hover:bg-[#f7f8f7] truncate"
                          >
                            {qz.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create New Bank Question Modal */}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102a43]/45 backdrop-blur-xs"
          onClick={() => setShowCreate(false)}
        >
          <form
            onSubmit={handleCreateSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white border border-[#d8e0e8] rounded-[14px] shadow-xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-[#e6ebf0] flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-[#102a43]">
                New bank question
              </h2>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="p-1.5 rounded-lg text-[#64778c] hover:text-[#102a43]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-[#36536e] mb-1.5">
                  Question prompt
                </label>
                <textarea
                  required
                  rows={2}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your question..."
                  className="w-full px-3.5 py-2 rounded-lg border border-[#d8e0e8] text-sm text-[#102a43] focus:outline-none focus:border-[#102a43]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#36536e] mb-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) =>
                      setSubject(e.target.value as SubjectCategory)
                    }
                    className="w-full px-2.5 py-2 rounded-lg border border-[#d8e0e8] text-xs text-[#102a43]"
                  >
                    <option value="Design">Design</option>
                    <option value="Strategy">Strategy</option>
                    <option value="Science">Science</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#36536e] mb-1">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as QuestionType)}
                    className="w-full px-2.5 py-2 rounded-lg border border-[#d8e0e8] text-xs text-[#102a43]"
                  >
                    <option value="multiple-choice">Multiple choice</option>
                    <option value="short-answer">Short answer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#36536e] mb-1">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) =>
                      setDifficulty(e.target.value as DifficultyLevel)
                    }
                    className="w-full px-2.5 py-2 rounded-lg border border-[#d8e0e8] text-xs text-[#102a43]"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#36536e] mb-1">
                    Points
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-lg border border-[#d8e0e8] font-mono-num text-xs text-[#102a43]"
                  />
                </div>
              </div>

              {type === 'multiple-choice' ? (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-[#36536e]">
                    Options (select the correct one)
                  </p>
                  {[
                    { val: optA, set: setOptA, label: 'Option A' },
                    { val: optB, set: setOptB, label: 'Option B' },
                    { val: optC, set: setOptC, label: 'Option C' },
                    { val: optD, set: setOptD, label: 'Option D' },
                  ].map((item, idx) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct-option"
                        checked={correctIdx === idx}
                        onChange={() => setCorrectIdx(idx)}
                        className="accent-[#0a8f63]"
                      />
                      <input
                        type="text"
                        value={item.val}
                        onChange={(e) => item.set(e.target.value)}
                        placeholder={item.label}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-[#d8e0e8] text-sm text-[#102a43]"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-[#36536e] mb-1">
                    Reference answer
                  </label>
                  <textarea
                    rows={2}
                    value={shortRef}
                    onChange={(e) => setShortRef(e.target.value)}
                    placeholder="Key points for grading..."
                    className="w-full px-3 py-2 rounded-lg border border-[#d8e0e8] text-sm text-[#102a43]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#36536e] mb-1">
                  Explanation (optional)
                </label>
                <input
                  type="text"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Why this answer is correct..."
                  className="w-full px-3 py-2 rounded-lg border border-[#d8e0e8] text-sm text-[#102a43]"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#e6ebf0] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 rounded-lg border border-[#d8e0e8] text-xs font-medium text-[#36536e] hover:bg-[#f7f8f7]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#102a43] text-white text-xs font-medium hover:bg-[#1a3e5e]"
              >
                Save to question bank
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
