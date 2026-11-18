import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, FileText, Search, X } from 'lucide-react';
import { AppView, Question, Quiz } from '../types/quiz';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  quizzes: Quiz[];
  questions: Question[];
  onNavigate: (view: AppView) => void;
  onOpenQuizEditor: (quizId: string) => void;
}

export function CommandPalette({
  open,
  onClose,
  quizzes,
  questions,
  onNavigate,
  onOpenQuizEditor,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) {
      setQuery('');
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const trimmed = query.trim().toLowerCase();

  const matchedQuizzes = useMemo(() => {
    if (!trimmed) return quizzes.slice(0, 4);
    return quizzes.filter(
      (q) =>
        q.title.toLowerCase().includes(trimmed) ||
        q.subject.toLowerCase().includes(trimmed),
    );
  }, [quizzes, trimmed]);

  const matchedQuestions = useMemo(() => {
    if (!trimmed) return questions.slice(0, 3);
    return questions.filter(
      (q) =>
        q.prompt.toLowerCase().includes(trimmed) ||
        q.subject.toLowerCase().includes(trimmed),
    );
  }, [questions, trimmed]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 bg-[#102a43]/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search workspace"
        className="w-full max-w-xl bg-white border border-[#d8e0e8] rounded-[14px] shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#e6ebf0]">
          <Search className="w-4 h-4 text-[#64778c] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a quiz, question, or workspace section..."
            className="w-full text-sm text-[#102a43] placeholder:text-[#7b8fa3] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 rounded-md text-[#64778c] hover:text-[#102a43] hover:bg-[#f7f8f7]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[380px] overflow-y-auto divide-y divide-[#e6ebf0]">
          <div className="p-3">
            <p className="px-2 pb-1.5 text-xs font-medium text-[#64778c]">
              Quizzes
            </p>
            {matchedQuizzes.length === 0 ? (
              <p className="px-2 py-2 text-sm text-[#64778c]">
                No matching quizzes found.
              </p>
            ) : (
              <div className="space-y-0.5">
                {matchedQuizzes.map((quiz) => (
                  <button
                    key={quiz.id}
                    type="button"
                    onClick={() => {
                      onOpenQuizEditor(quiz.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between gap-3 px-2.5 py-2 rounded-lg text-left hover:bg-[#f7f8f7] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-[#36536e] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#102a43] truncate">
                          {quiz.title}
                        </p>
                        <p className="text-xs text-[#64778c]">
                          {quiz.subject} · {quiz.questions.length} questions ·{' '}
                          {quiz.status}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#64778c] shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-3">
            <p className="px-2 pb-1.5 text-xs font-medium text-[#64778c]">
              Question bank
            </p>
            {matchedQuestions.length === 0 ? (
              <p className="px-2 py-2 text-sm text-[#64778c]">
                No matching questions found.
              </p>
            ) : (
              <div className="space-y-0.5">
                {matchedQuestions.map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      onNavigate('question-bank');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between gap-3 px-2.5 py-2 rounded-lg text-left hover:bg-[#f7f8f7] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BookOpen className="w-4 h-4 text-[#0a8f63] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-[#102a43] truncate">
                          {q.prompt}
                        </p>
                        <p className="text-xs text-[#64778c]">
                          {q.subject} · {q.difficulty} · {q.points} pts
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#64778c] shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
