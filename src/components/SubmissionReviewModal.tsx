import { useState } from 'react';
import { CheckCircle2, Clock, X } from 'lucide-react';
import { Submission } from '../types/quiz';
import { Avatar } from './Avatar';

interface SubmissionReviewModalProps {
  submission: Submission | null;
  onClose: () => void;
  onUpdateSubmission: (updated: Submission) => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function SubmissionReviewModal({
  submission,
  onClose,
  onUpdateSubmission,
}: SubmissionReviewModalProps) {
  const [draft, setDraft] = useState<Submission | null>(submission);

  if (!submission || !draft) return null;

  const handlePointsChange = (questionId: string, newPoints: number) => {
    const updatedAnswers = draft.answers.map((ans) => {
      if (ans.questionId !== questionId) return ans;
      const clamped = Math.max(0, Math.min(ans.maxPoints, newPoints));
      return {
        ...ans,
        pointsEarned: clamped,
        isCorrect: clamped > 0,
        needsReview: false,
      };
    });

    const earned = updatedAnswers.reduce((sum, a) => sum + a.pointsEarned, 0);
    const total = updatedAnswers.reduce((sum, a) => sum + a.maxPoints, 0);
    const scorePercent = total > 0 ? Math.round((earned / total) * 100) : 0;

    setDraft({
      ...draft,
      answers: updatedAnswers,
      pointsEarned: earned,
      totalPoints: total,
      scorePercent,
    });
  };

  const handleCompleteReview = () => {
    const finalized: Submission = {
      ...draft,
      status: 'Completed',
      answers: draft.answers.map((a) => ({ ...a, needsReview: false })),
    };
    onUpdateSubmission(finalized);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102a43]/45 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Response review"
        className="w-full max-w-2xl max-h-[88vh] flex flex-col bg-white border border-[#d8e0e8] rounded-[14px] shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[#e6ebf0]">
          <div className="flex items-center gap-3.5 min-w-0">
            <Avatar
              src={draft.learnerAvatar}
              name={draft.learnerName}
              size="lg"
            />
            <div className="min-w-0">
              <h2 className="font-display text-lg font-bold text-[#102a43] truncate">
                {draft.learnerName}
              </h2>
              <p className="text-sm text-[#64778c] truncate">
                {draft.quizTitle} · Submitted {draft.submittedAt}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close response review"
            className="p-2 rounded-lg text-[#64778c] hover:text-[#102a43] hover:bg-[#f7f8f7]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 bg-[#f7f8f7] border-b border-[#e6ebf0] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-[#64778c]">Score: </span>
              <span className="font-mono-num font-semibold text-[#102a43]">
                {draft.scorePercent}% ({draft.pointsEarned}/{draft.totalPoints} pts)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#64778c]">
              <Clock className="w-4 h-4" />
              <span className="font-mono-num">{formatDuration(draft.timeSpentSeconds)}</span>
            </div>
          </div>

          <span
            className={`text-xs font-medium ${
              draft.status === 'Completed'
                ? 'text-[#0a8f63]'
                : 'text-[#c98a18]'
            }`}
          >
            {draft.status === 'Completed' ? 'Reviewed & graded' : 'Short answer awaiting review'}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {draft.answers.map((ans, index) => (
            <div
              key={ans.questionId}
              className="pb-5 border-b border-[#e6ebf0] last:border-b-0 last:pb-0"
            >
              <div className="flex items-start justify-between gap-4 mb-2.5">
                <p className="text-sm font-medium text-[#102a43]">
                  <span className="font-mono-num text-xs text-[#64778c] mr-2">
                    0{index + 1}
                  </span>
                  {ans.questionPrompt}
                </p>
                <span className="font-mono-num text-xs font-medium text-[#36536e] shrink-0">
                  {ans.pointsEarned}/{ans.maxPoints} pts
                </span>
              </div>

              <div className="pl-6 space-y-2">
                <div className="p-3 rounded-lg bg-[#f7f8f7] border border-[#e6ebf0]">
                  <p className="text-xs text-[#64778c] mb-1">Learner response</p>
                  <p className="text-sm text-[#102a43]">{ans.learnerAnswer}</p>
                </div>

                {ans.questionType === 'short-answer' ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <p className="text-xs text-[#64778c] max-w-md">
                      Reference: {ans.correctAnswer}
                    </p>
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={`pts-${ans.questionId}`}
                        className="text-xs font-medium text-[#36536e]"
                      >
                        Award points:
                      </label>
                      <input
                        id={`pts-${ans.questionId}`}
                        type="number"
                        min={0}
                        max={ans.maxPoints}
                        value={ans.pointsEarned}
                        onChange={(e) =>
                          handlePointsChange(
                            ans.questionId,
                            Number(e.target.value),
                          )
                        }
                        className="w-16 px-2.5 py-1.5 rounded-md border border-[#d8e0e8] bg-white font-mono-num text-xs text-[#102a43] focus:outline-none focus:border-[#102a43]"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#64778c]">
                    Expected answer:{' '}
                    <span className="text-[#102a43] font-medium">
                      {ans.correctAnswer}
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-[#e6ebf0] bg-white flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#d8e0e8] text-sm font-medium text-[#36536e] hover:bg-[#f7f8f7] transition-colors whitespace-nowrap shrink-0"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCompleteReview}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#102a43] text-white text-sm font-medium hover:bg-[#1b3e5f] transition-colors whitespace-nowrap shrink-0"
          >
            <CheckCircle2 className="w-4 h-4 text-[#2ee6a6]" />
            <span>Save & mark completed</span>
          </button>
        </div>
      </div>
    </div>
  );
}
