import { useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BookOpen,
  Check,
  CheckCircle2,
  Circle,
  Play,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import {
  DifficultyLevel,
  Question,
  QuestionType,
  Quiz,
  SubjectCategory,
  TimeLimitOption,
} from '../types/quiz';

interface QuizEditorViewProps {
  quiz: Quiz;
  questionBank: Question[];
  onSaveQuiz: (updated: Quiz) => void;
  onBack: () => void;
  onPreviewQuiz: (quiz: Quiz) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function QuizEditorView({
  quiz,
  questionBank,
  onSaveQuiz,
  onBack,
  onPreviewQuiz,
}: QuizEditorViewProps) {
  const [draft, setDraft] = useState<Quiz>(quiz);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(
    quiz.questions[0]?.id ?? '',
  );
  const [showBankPicker, setShowBankPicker] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const activeQuestion =
    draft.questions.find((q) => q.id === selectedQuestionId) ??
    draft.questions[0] ??
    null;

  const commitChange = (updated: Quiz, message?: string) => {
    const next: Quiz = {
      ...updated,
      lastEdited: 'Just now',
    };
    setDraft(next);
    onSaveQuiz(next);
    if (message) {
      setSaveMessage(message);
      setTimeout(() => setSaveMessage(''), 2200);
    }
  };

  const updateQuestion = (questionId: string, patch: Partial<Question>) => {
    const nextQuestions = draft.questions.map((q) =>
      q.id === questionId ? { ...q, ...patch, updatedAt: 'Just now' } : q,
    );
    commitChange({ ...draft, questions: nextQuestions });
  };

  const addNewQuestion = () => {
    const newId = `q-${Date.now()}`;
    const newQuestion: Question = {
      id: newId,
      prompt: 'New assessment question',
      type: 'multiple-choice',
      subject: draft.subject,
      difficulty: 'Medium',
      points: 2,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A',
      explanation: '',
      usageCount: 1,
      updatedAt: 'Just now',
    };
    const next = {
      ...draft,
      questions: [...draft.questions, newQuestion],
    };
    commitChange(next, 'Question added');
    setSelectedQuestionId(newId);
  };

  const deleteQuestion = (questionId: string) => {
    const nextQuestions = draft.questions.filter((q) => q.id !== questionId);
    const next = { ...draft, questions: nextQuestions };
    commitChange(next, 'Question removed');
    if (selectedQuestionId === questionId) {
      setSelectedQuestionId(nextQuestions[0]?.id ?? '');
    }
  };

  const moveQuestion = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= draft.questions.length) return;
    const copy = [...draft.questions];
    const [removed] = copy.splice(index, 1);
    copy.splice(target, 0, removed);
    commitChange({ ...draft, questions: copy });
  };

  const importFromBank = (bankQ: Question) => {
    const clone: Question = {
      ...bankQ,
      id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    };
    const next = {
      ...draft,
      questions: [...draft.questions, clone],
    };
    commitChange(next, 'Imported from question bank');
    setSelectedQuestionId(clone.id);
    setShowBankPicker(false);
  };

  const handleOptionEdit = (idx: number, value: string) => {
    if (!activeQuestion) return;
    const oldVal = activeQuestion.options[idx];
    const nextOptions = activeQuestion.options.map((opt, i) =>
      i === idx ? value : opt,
    );
    const nextCorrect =
      activeQuestion.correctAnswer === oldVal
        ? value
        : activeQuestion.correctAnswer;
    updateQuestion(activeQuestion.id, {
      options: nextOptions,
      correctAnswer: nextCorrect,
    });
  };

  const addOption = () => {
    if (!activeQuestion || activeQuestion.options.length >= 6) return;
    const letter = OPTION_LETTERS[activeQuestion.options.length] ?? 'X';
    updateQuestion(activeQuestion.id, {
      options: [...activeQuestion.options, `Option ${letter}`],
    });
  };

  const removeOption = (idx: number) => {
    if (!activeQuestion || activeQuestion.options.length <= 2) return;
    const removedVal = activeQuestion.options[idx];
    const nextOptions = activeQuestion.options.filter((_, i) => i !== idx);
    const nextCorrect =
      activeQuestion.correctAnswer === removedVal
        ? nextOptions[0] ?? ''
        : activeQuestion.correctAnswer;
    updateQuestion(activeQuestion.id, {
      options: nextOptions,
      correctAnswer: nextCorrect,
    });
  };

  const hasDetails =
    draft.title.trim().length > 2 && draft.description.trim().length > 2;
  const hasQuestion = draft.questions.length >= 1;
  const isLive = draft.status === 'Live';
  const checklistCount =
    (hasDetails ? 1 : 0) + (hasQuestion ? 1 : 0) + 1 + (isLive ? 1 : 0);

  const totalPoints = draft.questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="max-w-[1320px] mx-auto space-y-6">
      {/* Editor Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d8e0e8] bg-white text-xs font-medium text-[#36536e] hover:text-[#102a43] hover:bg-[#f7f8f7] transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to quizzes</span>
          </button>

          <span className="text-xs text-[#64778c] tabular-nums">
            {saveMessage || `Status: ${draft.status}`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onPreviewQuiz(draft)}
            disabled={draft.questions.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#d8e0e8] bg-white text-xs font-medium text-[#102a43] hover:bg-[#f7f8f7] disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
          >
            <Play className="w-3.5 h-3.5 text-[#0a8f63]" />
            <span>Preview as learner</span>
          </button>

          <button
            type="button"
            onClick={() =>
              commitChange(
                { ...draft, status: 'Draft' },
                'Saved to drafts',
              )
            }
            className="px-3.5 py-2 rounded-lg border border-[#d8e0e8] bg-white text-xs font-medium text-[#36536e] hover:text-[#102a43] hover:bg-[#f7f8f7] transition-colors whitespace-nowrap shrink-0"
          >
            Save draft
          </button>

          <button
            type="button"
            onClick={() =>
              commitChange(
                {
                  ...draft,
                  status: draft.status === 'Live' ? 'Draft' : 'Live',
                  settings: {
                    ...draft.settings,
                    allowNewAttempts:
                      draft.status === 'Live'
                        ? draft.settings.allowNewAttempts
                        : true,
                  },
                },
                draft.status === 'Live'
                  ? 'Moved back to draft'
                  : 'Quiz is now live',
              )
            }
            disabled={!hasQuestion && draft.status === 'Draft'}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              draft.status === 'Live'
                ? 'bg-[#e1fbf1] text-[#0a8f63] hover:bg-[#c8f5e3]'
                : 'bg-[#102a43] text-white hover:bg-[#1a3e5e] disabled:opacity-50'
            }`}
          >
            {draft.status === 'Live' ? 'Live · Unpublish' : 'Make quiz live'}
          </button>
        </div>
      </div>

      {/* Main 2-Column Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
        <div className="space-y-6 min-w-0">
          {/* Quiz Details Card */}
          <section className="bg-white border border-[#e6ebf0] rounded-[14px] p-6 space-y-5">
            <div>
              <p className="text-xs font-medium text-[#64778c]">
                01. Quiz details
              </p>
              <h2 className="mt-1 font-display text-lg font-bold text-[#102a43]">
                Title & configuration
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="quiz-title"
                  className="block text-xs font-medium text-[#36536e] mb-1.5"
                >
                  Quiz title
                </label>
                <input
                  id="quiz-title"
                  type="text"
                  value={draft.title}
                  onChange={(e) =>
                    commitChange({ ...draft, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#d8e0e8] bg-white text-sm font-medium text-[#102a43] focus:outline-none focus:border-[#102a43]"
                />
              </div>

              <div>
                <label
                  htmlFor="quiz-desc"
                  className="block text-xs font-medium text-[#36536e] mb-1.5"
                >
                  Learner instructions
                </label>
                <textarea
                  id="quiz-desc"
                  rows={2}
                  value={draft.description}
                  onChange={(e) =>
                    commitChange({ ...draft, description: e.target.value })
                  }
                  placeholder="Briefly explain what this assessment covers..."
                  className="w-full px-3.5 py-2 rounded-lg border border-[#d8e0e8] bg-white text-sm text-[#102a43] focus:outline-none focus:border-[#102a43]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="quiz-subject"
                    className="block text-xs font-medium text-[#36536e] mb-1.5"
                  >
                    Subject
                  </label>
                  <select
                    id="quiz-subject"
                    value={draft.subject}
                    onChange={(e) =>
                      commitChange({
                        ...draft,
                        subject: e.target.value as SubjectCategory,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#d8e0e8] bg-white text-sm text-[#102a43] focus:outline-none focus:border-[#102a43]"
                  >
                    <option value="Design">Design</option>
                    <option value="Strategy">Strategy</option>
                    <option value="Science">Science</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="quiz-time"
                    className="block text-xs font-medium text-[#36536e] mb-1.5"
                  >
                    Time limit
                  </label>
                  <select
                    id="quiz-time"
                    value={draft.timeLimitMinutes}
                    onChange={(e) =>
                      commitChange({
                        ...draft,
                        timeLimitMinutes: Number(
                          e.target.value,
                        ) as TimeLimitOption,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#d8e0e8] bg-white text-sm text-[#102a43] focus:outline-none focus:border-[#102a43]"
                  >
                    <option value={5}>5 minutes</option>
                    <option value={10}>10 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={0}>Unlimited</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="quiz-difficulty"
                    className="block text-xs font-medium text-[#36536e] mb-1.5"
                  >
                    Difficulty
                  </label>
                  <select
                    id="quiz-difficulty"
                    value={draft.difficulty}
                    onChange={(e) =>
                      commitChange({
                        ...draft,
                        difficulty: e.target.value as DifficultyLevel,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#d8e0e8] bg-white text-sm text-[#102a43] focus:outline-none focus:border-[#102a43]"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Question Flow & Active Question Composer */}
          <section className="bg-white border border-[#e6ebf0] rounded-[14px] p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-[#64778c]">
                  02. Question flow
                </p>
                <h2 className="mt-1 font-display text-lg font-bold text-[#102a43]">
                  Questions ({draft.questions.length})
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowBankPicker(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d8e0e8] bg-white text-xs font-medium text-[#102a43] hover:bg-[#f7f8f7] transition-colors whitespace-nowrap shrink-0"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#0a8f63]" />
                  <span>Import from bank</span>
                </button>
                <button
                  type="button"
                  onClick={addNewQuestion}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#102a43] text-white text-xs font-medium hover:bg-[#1a3e5e] transition-colors whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 text-[#2ee6a6]" />
                  <span>Add question</span>
                </button>
              </div>
            </div>

            {draft.questions.length === 0 ? (
              <div className="py-10 border border-dashed border-[#d8e0e8] rounded-xl text-center">
                <p className="text-sm font-medium text-[#102a43]">
                  Add a question to your quiz
                </p>
                <p className="text-xs text-[#64778c] mt-1">
                  Write a multiple choice or short answer prompt, or pull from
                  your question bank.
                </p>
                <button
                  type="button"
                  onClick={addNewQuestion}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#102a43] text-white text-xs font-medium hover:bg-[#1a3e5e]"
                >
                  <Plus className="w-3.5 h-3.5 text-[#2ee6a6]" />
                  <span>Add first question</span>
                </button>
              </div>
            ) : (
              <>
                {/* Question List Selector */}
                <div className="border-t border-[#e6ebf0] divide-y divide-[#e6ebf0]">
                  {draft.questions.map((q, index) => {
                    const isSelected = activeQuestion?.id === q.id;
                    return (
                      <div
                        key={q.id}
                        className={`flex items-center justify-between gap-3 py-3 px-2 rounded-lg transition-colors ${
                          isSelected ? 'bg-[#f7f8f7]' : 'hover:bg-[#f7f8f7]/60'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedQuestionId(q.id)}
                          className="flex items-center gap-3 min-w-0 flex-1 text-left"
                        >
                          <span className="font-mono-num text-xs font-semibold text-[#0a8f63] w-6 shrink-0">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#102a43] truncate">
                              {q.prompt || 'Untitled question'}
                            </p>
                            <p className="text-xs text-[#64778c]">
                              {q.type === 'multiple-choice'
                                ? 'Multiple choice'
                                : 'Short answer'}{' '}
                              · {q.points} pts · {q.difficulty}
                            </p>
                          </div>
                        </button>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveQuestion(index, -1)}
                            disabled={index === 0}
                            aria-label="Move question up"
                            className="p-1.5 rounded text-[#64778c] hover:text-[#102a43] disabled:opacity-30"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveQuestion(index, 1)}
                            disabled={index === draft.questions.length - 1}
                            aria-label="Move question down"
                            className="p-1.5 rounded text-[#64778c] hover:text-[#102a43] disabled:opacity-30"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteQuestion(q.id)}
                            aria-label="Delete question"
                            className="p-1.5 rounded text-[#64778c] hover:text-[#d95d47]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Active Question Composer */}
                {activeQuestion && (
                  <div className="pt-6 border-t border-[#e6ebf0] space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-display text-sm font-bold text-[#102a43]">
                        Edit question
                      </h3>

                      <div className="flex items-center gap-3">
                        <select
                          aria-label="Question type"
                          value={activeQuestion.type}
                          onChange={(e) => {
                            const nextType = e.target.value as QuestionType;
                            updateQuestion(activeQuestion.id, {
                              type: nextType,
                              options:
                                nextType === 'multiple-choice' &&
                                activeQuestion.options.length === 0
                                  ? [
                                      'Option A',
                                      'Option B',
                                      'Option C',
                                      'Option D',
                                    ]
                                  : activeQuestion.options,
                              correctAnswer:
                                nextType === 'multiple-choice' &&
                                activeQuestion.options.length === 0
                                  ? 'Option A'
                                  : activeQuestion.correctAnswer,
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-[#d8e0e8] bg-white text-xs font-medium text-[#102a43]"
                        >
                          <option value="multiple-choice">
                            Multiple choice
                          </option>
                          <option value="short-answer">Short answer</option>
                        </select>

                        <div className="flex items-center gap-1.5">
                          <label
                            htmlFor="q-points"
                            className="text-xs text-[#64778c]"
                          >
                            Points
                          </label>
                          <input
                            id="q-points"
                            type="number"
                            min={1}
                            max={20}
                            value={activeQuestion.points}
                            onChange={(e) =>
                              updateQuestion(activeQuestion.id, {
                                points: Math.max(1, Number(e.target.value)),
                              })
                            }
                            className="w-14 px-2 py-1.5 rounded-lg border border-[#d8e0e8] bg-white font-mono-num text-xs text-[#102a43]"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="q-prompt"
                        className="block text-xs font-medium text-[#36536e] mb-1.5"
                      >
                        Question prompt
                      </label>
                      <textarea
                        id="q-prompt"
                        rows={2}
                        value={activeQuestion.prompt}
                        onChange={(e) =>
                          updateQuestion(activeQuestion.id, {
                            prompt: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#d8e0e8] bg-white text-sm text-[#102a43] focus:outline-none focus:border-[#102a43]"
                      />
                    </div>

                    {activeQuestion.type === 'multiple-choice' ? (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-[#36536e]">
                            Answer options (select the correct answer)
                          </p>
                          {activeQuestion.options.length < 6 && (
                            <button
                              type="button"
                              onClick={addOption}
                              className="text-xs font-medium text-[#0a8f63] hover:text-[#076d4b]"
                            >
                              + Add option
                            </button>
                          )}
                        </div>

                        <div className="space-y-2">
                          {activeQuestion.options.map((opt, idx) => {
                            const isCorrect =
                              activeQuestion.correctAnswer === opt;
                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-2.5"
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuestion(activeQuestion.id, {
                                      correctAnswer: opt,
                                    })
                                  }
                                  aria-label={`Mark option ${OPTION_LETTERS[idx]} as correct`}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                                    isCorrect
                                      ? 'bg-[#e1fbf1] border-[#0a8f63] text-[#0a8f63]'
                                      : 'bg-white border-[#d8e0e8] text-[#64778c] hover:border-[#102a43]'
                                  }`}
                                >
                                  {isCorrect ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    <span className="font-mono-num text-xs">
                                      {OPTION_LETTERS[idx]}
                                    </span>
                                  )}
                                </button>

                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) =>
                                    handleOptionEdit(idx, e.target.value)
                                  }
                                  className="flex-1 px-3 py-2 rounded-lg border border-[#d8e0e8] bg-white text-sm text-[#102a43] focus:outline-none focus:border-[#102a43]"
                                />

                                {activeQuestion.options.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => removeOption(idx)}
                                    aria-label="Remove option"
                                    className="p-2 text-[#64778c] hover:text-[#d95d47]"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label
                          htmlFor="q-ref-answer"
                          className="block text-xs font-medium text-[#36536e] mb-1.5"
                        >
                          Reference grading answer
                        </label>
                        <textarea
                          id="q-ref-answer"
                          rows={2}
                          value={activeQuestion.correctAnswer}
                          onChange={(e) =>
                            updateQuestion(activeQuestion.id, {
                              correctAnswer: e.target.value,
                            })
                          }
                          placeholder="Outline key concepts expected in a complete learner response..."
                          className="w-full px-3.5 py-2 rounded-lg border border-[#d8e0e8] bg-white text-sm text-[#102a43] focus:outline-none focus:border-[#102a43]"
                        />
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="q-explanation"
                        className="block text-xs font-medium text-[#36536e] mb-1.5"
                      >
                        Explanation shown after submission
                      </label>
                      <input
                        id="q-explanation"
                        type="text"
                        value={activeQuestion.explanation}
                        onChange={(e) =>
                          updateQuestion(activeQuestion.id, {
                            explanation: e.target.value,
                          })
                        }
                        placeholder="Clarify why the correct answer works..."
                        className="w-full px-3.5 py-2 rounded-lg border border-[#d8e0e8] bg-white text-sm text-[#102a43] focus:outline-none focus:border-[#102a43]"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        {/* Right Column: Publishing Checklist & Delivery Controls */}
        <aside className="space-y-5">
          <section className="bg-white border border-[#e6ebf0] rounded-[14px] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-[#102a43]">
                Publishing checklist
              </h3>
              <span className="font-mono-num text-xs font-semibold text-[#0a8f63]">
                {checklistCount}/4
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-[#102a43]">
                {hasDetails ? (
                  <CheckCircle2 className="w-4 h-4 text-[#0a8f63] shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-[#9eb0c0] shrink-0" />
                )}
                <span>Add quiz details</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#102a43]">
                {hasQuestion ? (
                  <CheckCircle2 className="w-4 h-4 text-[#0a8f63] shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-[#9eb0c0] shrink-0" />
                )}
                <span>Add at least 1 question</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#102a43]">
                <CheckCircle2 className="w-4 h-4 text-[#0a8f63] shrink-0" />
                <span>Review delivery defaults</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#102a43]">
                {isLive ? (
                  <CheckCircle2 className="w-4 h-4 text-[#0a8f63] shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-[#9eb0c0] shrink-0" />
                )}
                <span>Make quiz live</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#e6ebf0] flex items-center justify-between text-xs text-[#64778c]">
              <span>Total points</span>
              <span className="font-mono-num font-semibold text-[#102a43]">
                {totalPoints} pts
              </span>
            </div>
          </section>

          <section className="bg-white border border-[#e6ebf0] rounded-[14px] p-5 space-y-4">
            <h3 className="font-display text-sm font-bold text-[#102a43]">
              Delivery options
            </h3>

            <div className="space-y-3.5 text-xs">
              <label className="flex items-start justify-between gap-3 cursor-pointer">
                <div>
                  <p className="font-medium text-[#102a43]">
                    Allow new attempts
                  </p>
                  <p className="text-[#64778c] mt-0.5">
                    Learners can start or retake this quiz.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={draft.settings.allowNewAttempts}
                  onChange={(e) =>
                    commitChange({
                      ...draft,
                      settings: {
                        ...draft.settings,
                        allowNewAttempts: e.target.checked,
                      },
                    })
                  }
                  className="mt-0.5 w-4 h-4 accent-[#102a43]"
                />
              </label>

              <label className="flex items-start justify-between gap-3 cursor-pointer">
                <div>
                  <p className="font-medium text-[#102a43]">
                    Let learners review answers
                  </p>
                  <p className="text-[#64778c] mt-0.5">
                    Show correct answers after submitting.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={draft.settings.reviewCorrectAnswers}
                  onChange={(e) =>
                    commitChange({
                      ...draft,
                      settings: {
                        ...draft.settings,
                        reviewCorrectAnswers: e.target.checked,
                      },
                    })
                  }
                  className="mt-0.5 w-4 h-4 accent-[#102a43]"
                />
              </label>

              <label className="flex items-start justify-between gap-3 cursor-pointer">
                <div>
                  <p className="font-medium text-[#102a43]">
                    Show learner feedback
                  </p>
                  <p className="text-[#64778c] mt-0.5">
                    Display author explanations on review.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={draft.settings.showLearnerFeedback}
                  onChange={(e) =>
                    commitChange({
                      ...draft,
                      settings: {
                        ...draft.settings,
                        showLearnerFeedback: e.target.checked,
                      },
                    })
                  }
                  className="mt-0.5 w-4 h-4 accent-[#102a43]"
                />
              </label>
            </div>
          </section>
        </aside>
      </div>

      {/* Question Bank Picker Modal */}
      {showBankPicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102a43]/45 backdrop-blur-xs"
          onClick={() => setShowBankPicker(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Import from question bank"
            className="w-full max-w-xl max-h-[82vh] flex flex-col bg-white border border-[#d8e0e8] rounded-[14px] shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[#e6ebf0] flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-[#102a43]">
                Import from question bank
              </h3>
              <button
                type="button"
                onClick={() => setShowBankPicker(false)}
                className="p-1.5 rounded-lg text-[#64778c] hover:text-[#102a43]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#e6ebf0] p-4">
              {questionBank.map((q) => (
                <div
                  key={q.id}
                  className="py-3.5 flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#102a43]">
                      {q.prompt}
                    </p>
                    <p className="text-xs text-[#64778c] mt-1">
                      {q.subject} ·{' '}
                      {q.type === 'multiple-choice'
                        ? 'Multiple choice'
                        : 'Short answer'}{' '}
                      · {q.points} pts
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => importFromBank(q)}
                    className="px-3 py-1.5 rounded-lg bg-[#102a43] text-white text-xs font-medium hover:bg-[#1a3e5e] whitespace-nowrap shrink-0"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
