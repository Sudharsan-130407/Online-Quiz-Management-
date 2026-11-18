import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  LogOut,
  Play,
  XCircle,
} from 'lucide-react';
import { ASSETS } from '../data/initialData';
import { Quiz, Submission, SubmissionAnswer } from '../types/quiz';
import { Avatar } from './Avatar';

interface LearnerPortalViewProps {
  quizzes: Quiz[];
  submissions: Submission[];
  initialQuizId?: string | null;
  learnerName: string;
  learnerEmail: string;
  isPreviewMode: boolean;
  onExitToWorkspace?: () => void;
  onSignOut?: () => void;
  onSubmitQuiz: (submission: Submission) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function LearnerPortalView({
  quizzes,
  submissions,
  initialQuizId,
  learnerName,
  learnerEmail,
  isPreviewMode,
  onExitToWorkspace,
  onSignOut,
  onSubmitQuiz,
}: LearnerPortalViewProps) {
  const availableQuizzes = quizzes.filter(
    (q) =>
      (q.status === 'Live' && q.settings.allowNewAttempts) ||
      q.id === initialQuizId,
  );

  const [activeQuizId, setActiveQuizId] = useState<string | null>(
    initialQuizId ?? null,
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [completedResult, setCompletedResult] = useState<Submission | null>(
    null,
  );

  const activeQuiz = quizzes.find((q) => q.id === activeQuizId) ?? null;

  useEffect(() => {
    if (initialQuizId) {
      setActiveQuizId(initialQuizId);
      setCurrentIdx(0);
      setAnswers({});
      setSecondsElapsed(0);
      setCompletedResult(null);
    }
  }, [initialQuizId]);

  useEffect(() => {
    if (!activeQuiz || completedResult) return;
    const timer = window.setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeQuiz, completedResult]);

  const startQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
    setCurrentIdx(0);
    setAnswers({});
    setSecondsElapsed(0);
    setCompletedResult(null);
  };

  const handleFinishQuiz = () => {
    if (!activeQuiz) return;

    const evaluatedAnswers: SubmissionAnswer[] = activeQuiz.questions.map(
      (q) => {
        const learnerAns = (answers[q.id] ?? '').trim();
        if (q.type === 'multiple-choice') {
          const isCorrect = learnerAns === q.correctAnswer;
          return {
            questionId: q.id,
            questionPrompt: q.prompt,
            questionType: q.type,
            learnerAnswer: learnerAns || 'Not answered',
            correctAnswer: q.correctAnswer,
            isCorrect,
            pointsEarned: isCorrect ? q.points : 0,
            maxPoints: q.points,
          };
        }

        // Short answer receives provisional credit if answered and flagged for educator review
        const hasResponse = learnerAns.length > 0;
        return {
          questionId: q.id,
          questionPrompt: q.prompt,
          questionType: q.type,
          learnerAnswer: learnerAns || 'Not answered',
          correctAnswer: q.correctAnswer,
          isCorrect: hasResponse,
          pointsEarned: hasResponse ? Math.max(1, Math.round(q.points * 0.75)) : 0,
          maxPoints: q.points,
          needsReview: hasResponse,
        };
      },
    );

    const hasShortAnswer = evaluatedAnswers.some((a) => a.needsReview);
    const pointsEarned = evaluatedAnswers.reduce(
      (s, a) => s + a.pointsEarned,
      0,
    );
    const totalPoints = evaluatedAnswers.reduce((s, a) => s + a.maxPoints, 0);
    const scorePercent =
      totalPoints > 0 ? Math.round((pointsEarned / totalPoints) * 100) : 0;

    const newSubmission: Submission = {
      id: `sub-${Date.now()}`,
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      learnerName,
      learnerEmail,
      learnerAvatar: ASSETS.alexAvatar,
      scorePercent,
      pointsEarned,
      totalPoints,
      timeSpentSeconds: Math.max(12, secondsElapsed),
      submittedAt: 'Just now',
      status: hasShortAnswer ? 'Needs review' : 'Completed',
      answers: evaluatedAnswers,
    };

    onSubmitQuiz(newSubmission);
    setCompletedResult(newSubmission);
  };

  const mySubmissions = submissions.filter(
    (s) => s.learnerName === learnerName,
  );
  const avgLearnerScore =
    mySubmissions.length > 0
      ? Math.round(
          mySubmissions.reduce((sum, s) => sum + s.scorePercent, 0) /
            mySubmissions.length,
        )
      : 90;

  const remainingSeconds =
    activeQuiz && activeQuiz.timeLimitMinutes > 0
      ? Math.max(0, activeQuiz.timeLimitMinutes * 60 - secondsElapsed)
      : null;

  // Player or Results View
  if (activeQuiz) {
    if (completedResult) {
      return (
        <div className="max-w-3xl mx-auto py-4 space-y-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setActiveQuizId(null);
                setCompletedResult(null);
              }}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#36536e] hover:text-[#102a43]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All assigned quizzes</span>
            </button>

            {isPreviewMode && onExitToWorkspace && (
              <button
                type="button"
                onClick={onExitToWorkspace}
                className="px-3.5 py-1.5 rounded-lg border border-[#d8e0e8] bg-white text-xs font-medium text-[#102a43] hover:bg-[#f7f8f7]"
              >
                Back to workspace
              </button>
            )}
          </div>

          <section className="bg-white border border-[#e6ebf0] rounded-[14px] p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e6ebf0]">
              <div>
                <p className="text-xs font-medium text-[#0a8f63]">
                  Assessment submitted
                </p>
                <h1 className="mt-1 font-display text-2xl font-bold text-[#102a43]">
                  See how you did
                </h1>
                <p className="mt-1 text-sm text-[#64778c]">
                  {activeQuiz.title}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-[#64778c]">Score</p>
                  <p className="font-mono-num text-3xl font-bold text-[#102a43]">
                    {completedResult.scorePercent}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#64778c]">Time spent</p>
                  <p className="font-mono-num text-lg font-semibold text-[#36536e]">
                    {formatTimer(completedResult.timeSpentSeconds)}
                  </p>
                </div>
              </div>
            </div>

            {activeQuiz.settings.reviewCorrectAnswers ? (
              <div className="space-y-5">
                <h2 className="font-display text-base font-bold text-[#102a43]">
                  Response review
                </h2>

                {completedResult.answers.map((ans, idx) => {
                  const sourceQ = activeQuiz.questions[idx];
                  return (
                    <div
                      key={ans.questionId}
                      className="p-4 rounded-xl bg-[#f7f8f7] border border-[#e6ebf0] space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium text-[#102a43]">
                          <span className="font-mono-num text-xs text-[#64778c] mr-2">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          {ans.questionPrompt}
                        </p>
                        {ans.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-[#0a8f63] shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-[#d95d47] shrink-0 mt-0.5" />
                        )}
                      </div>

                      <p className="text-xs text-[#36536e]">
                        Your answer:{' '}
                        <span className="font-medium text-[#102a43]">
                          {ans.learnerAnswer}
                        </span>
                      </p>

                      {!ans.isCorrect && (
                        <p className="text-xs text-[#0a8f63]">
                          Correct answer: {ans.correctAnswer}
                        </p>
                      )}

                      {activeQuiz.settings.showLearnerFeedback &&
                        sourceQ?.explanation && (
                          <p className="text-xs text-[#64778c] pt-1">
                            {sourceQ.explanation}
                          </p>
                        )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-[#64778c]">
                Your educator has chosen to release detailed answer reviews
                after cohort grading completes.
              </p>
            )}
          </section>
        </div>
      );
    }

    const question = activeQuiz.questions[currentIdx];
    const answeredCount = activeQuiz.questions.filter(
      (q) => (answers[q.id] ?? '').trim().length > 0,
    ).length;

    return (
      <div className="max-w-3xl mx-auto py-4 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setActiveQuizId(null)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#36536e] hover:text-[#102a43]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit quiz</span>
          </button>

          <div className="flex items-center gap-4 text-xs text-[#64778c]">
            <span className="font-mono-num">
              {answeredCount}/{activeQuiz.questions.length} answered
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono-num font-semibold text-[#102a43]">
              <Clock className="w-3.5 h-3.5 text-[#0a8f63]" />
              {remainingSeconds !== null
                ? formatTimer(remainingSeconds)
                : formatTimer(secondsElapsed)}
            </span>
          </div>
        </div>

        {/* Question Step Strip */}
        <div className="bg-white border border-[#e6ebf0] rounded-[14px] p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display text-sm font-bold text-[#102a43] truncate">
              {activeQuiz.title}
            </p>
            <p className="text-xs text-[#64778c]">
              Question {currentIdx + 1} of {activeQuiz.questions.length}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {activeQuiz.questions.map((q, idx) => {
              const isAnswered = (answers[q.id] ?? '').trim().length > 0;
              const isCurrent = idx === currentIdx;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  aria-label={`Go to question ${idx + 1}`}
                  className={`w-8 h-8 rounded-lg font-mono-num text-xs font-medium transition-colors ${
                    isCurrent
                      ? 'bg-[#102a43] text-white'
                      : isAnswered
                        ? 'bg-[#e1fbf1] text-[#0a8f63]'
                        : 'bg-[#f7f8f7] text-[#64778c] hover:bg-[#e6ebf0]'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Question Card */}
        {question && (
          <section className="bg-white border border-[#e6ebf0] rounded-[14px] p-7 space-y-6">
            <div>
              <p className="text-xs text-[#64778c]">
                {question.type === 'multiple-choice'
                  ? 'Choose the correct answer'
                  : 'Write a concise response'}{' '}
                · {question.points} points
              </p>
              <h2 className="mt-2 font-display text-lg sm:text-xl font-bold text-[#102a43] text-balance">
                {question.prompt}
              </h2>
            </div>

            {question.type === 'multiple-choice' ? (
              <fieldset className="space-y-2.5">
                <legend className="sr-only">{question.prompt}</legend>
                {question.options.map((option, idx) => {
                  const selected = answers[question.id] === option;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [question.id]: option,
                        }))
                      }
                      className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border text-left transition-colors ${
                        selected
                          ? 'bg-[#e1fbf1]/60 border-[#0a8f63] text-[#102a43]'
                          : 'bg-white border-[#e6ebf0] text-[#36536e] hover:border-[#b9c6d2] hover:text-[#102a43]'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg font-mono-num text-xs font-semibold flex items-center justify-center shrink-0 ${
                          selected
                            ? 'bg-[#0a8f63] text-white'
                            : 'bg-[#f7f8f7] text-[#64778c]'
                        }`}
                      >
                        {OPTION_LETTERS[idx]}
                      </span>
                      <span className="text-sm font-medium">{option}</span>
                    </button>
                  );
                })}
              </fieldset>
            ) : (
              <div>
                <textarea
                  rows={4}
                  value={answers[question.id] ?? ''}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [question.id]: e.target.value,
                    }))
                  }
                  placeholder="Type your response here..."
                  className="w-full px-4 py-3 rounded-xl border border-[#d8e0e8] bg-white text-sm text-[#102a43] focus:outline-none focus:border-[#102a43]"
                />
              </div>
            )}

            <div className="pt-4 border-t border-[#e6ebf0] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                disabled={currentIdx === 0}
                className="px-4 py-2 rounded-lg border border-[#d8e0e8] text-xs font-medium text-[#36536e] hover:bg-[#f7f8f7] disabled:opacity-40"
              >
                Previous
              </button>

              {currentIdx < activeQuiz.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIdx((i) =>
                      Math.min(activeQuiz.questions.length - 1, i + 1),
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#102a43] text-white text-xs font-medium hover:bg-[#1a3e5e]"
                >
                  <span>Next question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishQuiz}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2ee6a6] text-[#102a43] text-xs font-bold hover:bg-[#49edb3] transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit quiz</span>
                </button>
              )}
            </div>
          </section>
        )}
      </div>
    );
  }

  // Learner Home / Quiz Catalog
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e6ebf0]">
        <div className="flex items-center gap-3.5">
          <Avatar src={ASSETS.alexAvatar} name={learnerName} size="lg" />
          <div>
            <h1 className="font-display text-2xl font-bold text-[#102a43]">
              Keep the momentum going
            </h1>
            <p className="text-sm text-[#64778c]">
              Signed in as {learnerName} · Choose an open quiz below to test your
              understanding.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isPreviewMode && onExitToWorkspace ? (
            <button
              type="button"
              onClick={onExitToWorkspace}
              className="px-4 py-2 rounded-lg border border-[#d8e0e8] bg-white text-xs font-medium text-[#102a43] hover:bg-[#f7f8f7] whitespace-nowrap shrink-0"
            >
              Back to workspace
            </button>
          ) : (
            onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#d8e0e8] bg-white text-xs font-medium text-[#36536e] hover:text-[#102a43] whitespace-nowrap shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign out</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Learner Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#e6ebf0] rounded-[14px] p-5">
          <p className="text-xs text-[#64778c]">Assigned quizzes</p>
          <p className="mt-1.5 font-mono-num text-2xl font-bold text-[#102a43]">
            {availableQuizzes.length}
          </p>
        </div>
        <div className="bg-white border border-[#e6ebf0] rounded-[14px] p-5">
          <p className="text-xs text-[#64778c]">Average score</p>
          <p className="mt-1.5 font-mono-num text-2xl font-bold text-[#102a43]">
            {avgLearnerScore}%
          </p>
        </div>
        <div className="bg-white border border-[#e6ebf0] rounded-[14px] p-5">
          <p className="text-xs text-[#64778c]">Learning streak</p>
          <p className="mt-1.5 font-mono-num text-2xl font-bold text-[#0a8f63]">
            4 days
          </p>
        </div>
      </section>

      {/* Open Quizzes Grid */}
      <section className="space-y-4">
        <h2 className="font-display text-base font-bold text-[#102a43]">
          Next up
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {availableQuizzes.map((quiz) => (
            <article
              key={quiz.id}
              className="bg-white border border-[#e6ebf0] rounded-[14px] p-6 flex flex-col justify-between gap-5"
            >
              <div>
                <p className="text-xs text-[#64778c]">
                  {quiz.subject} · {quiz.difficulty} ·{' '}
                  {quiz.questions.length} questions ·{' '}
                  {quiz.timeLimitMinutes === 0
                    ? 'Untimed'
                    : `${quiz.timeLimitMinutes} min`}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-[#102a43]">
                  {quiz.title}
                </h3>
                <p className="mt-1.5 text-sm text-[#64778c]">
                  {quiz.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#e6ebf0] flex items-center justify-between">
                <span className="text-xs text-[#64778c]">
                  Choose the answer that feels most accurate
                </span>
                <button
                  type="button"
                  onClick={() => startQuiz(quiz.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#102a43] text-white text-xs font-medium hover:bg-[#1a3e5e] transition-colors whitespace-nowrap shrink-0"
                >
                  <Play className="w-3.5 h-3.5 text-[#2ee6a6]" />
                  <span>Start quiz</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
