import { useState } from 'react';
import { Check, LogOut } from 'lucide-react';
import { ASSETS } from '../data/initialData';
import { TimeLimitOption, WorkspaceSettings } from '../types/quiz';
import { Avatar } from './Avatar';

interface SettingsViewProps {
  settings: WorkspaceSettings;
  onSaveSettings: (updated: WorkspaceSettings) => void;
  onSignOut: () => void;
}

export function SettingsView({
  settings,
  onSaveSettings,
  onSignOut,
}: SettingsViewProps) {
  const [draft, setDraft] = useState<WorkspaceSettings>(settings);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(draft);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2200);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#102a43]">
          Profile & preferences
        </h1>
        <p className="mt-1 text-sm text-[#64778c]">
          Configure educator identity, default quiz behavior, and notification
          cadence.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <section className="bg-white border border-[#e6ebf0] rounded-[14px] p-6 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar
                src={ASSETS.mayaAvatar}
                name={draft.educatorName}
                size="lg"
              />
              <div>
                <h2 className="font-display text-base font-bold text-[#102a43]">
                  Personal details
                </h2>
                <p className="text-xs text-[#64778c]">{draft.roleTitle}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="set-name"
                className="block text-xs font-medium text-[#36536e] mb-1.5"
              >
                Full name
              </label>
              <input
                id="set-name"
                type="text"
                value={draft.educatorName}
                onChange={(e) =>
                  setDraft({ ...draft, educatorName: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg border border-[#d8e0e8] text-sm text-[#102a43] focus:outline-none focus:border-[#102a43]"
              />
            </div>

            <div>
              <label
                htmlFor="set-email"
                className="block text-xs font-medium text-[#36536e] mb-1.5"
              >
                Email address
              </label>
              <input
                id="set-email"
                type="email"
                value={draft.educatorEmail}
                onChange={(e) =>
                  setDraft({ ...draft, educatorEmail: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg border border-[#d8e0e8] text-sm text-[#102a43] focus:outline-none focus:border-[#102a43]"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="set-org"
                className="block text-xs font-medium text-[#36536e] mb-1.5"
              >
                Workspace organization
              </label>
              <input
                id="set-org"
                type="text"
                value={draft.organization}
                onChange={(e) =>
                  setDraft({ ...draft, organization: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg border border-[#d8e0e8] text-sm text-[#102a43] focus:outline-none focus:border-[#102a43]"
              />
            </div>
          </div>
        </section>

        {/* Quiz Defaults */}
        <section className="bg-white border border-[#e6ebf0] rounded-[14px] p-6 space-y-4">
          <h2 className="font-display text-base font-bold text-[#102a43]">
            Quiz defaults
          </h2>

          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#e6ebf0]">
            <div>
              <p className="text-sm font-medium text-[#102a43]">
                Default time limit
              </p>
              <p className="text-xs text-[#64778c]">
                Applied automatically when creating a new quiz.
              </p>
            </div>
            <select
              aria-label="Default time limit"
              value={draft.defaultTimeLimit}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  defaultTimeLimit: Number(e.target.value) as TimeLimitOption,
                })
              }
              className="px-3 py-2 rounded-lg border border-[#d8e0e8] bg-white text-xs font-medium text-[#102a43]"
            >
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={0}>Unlimited</option>
            </select>
          </div>

          <label className="flex items-center justify-between gap-4 py-1 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-[#102a43]">
                Auto-publish new quizzes
              </p>
              <p className="text-xs text-[#64778c]">
                Make quizzes immediately available once a question is added.
              </p>
            </div>
            <input
              type="checkbox"
              checked={draft.autoPublishQuizzes}
              onChange={(e) =>
                setDraft({ ...draft, autoPublishQuizzes: e.target.checked })
              }
              className="w-4 h-4 accent-[#102a43]"
            />
          </label>

          <label className="flex items-center justify-between gap-4 py-1 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-[#102a43]">
                Let learners review correct answers
              </p>
              <p className="text-xs text-[#64778c]">
                Show correct answers and author notes right after submission.
              </p>
            </div>
            <input
              type="checkbox"
              checked={draft.reviewCorrectAnswers}
              onChange={(e) =>
                setDraft({ ...draft, reviewCorrectAnswers: e.target.checked })
              }
              className="w-4 h-4 accent-[#102a43]"
            />
          </label>
        </section>

        {/* Notifications */}
        <section className="bg-white border border-[#e6ebf0] rounded-[14px] p-6 space-y-4">
          <h2 className="font-display text-base font-bold text-[#102a43]">
            Notifications
          </h2>

          <label className="flex items-center justify-between gap-4 py-1 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-[#102a43]">
                New submission alerts
              </p>
              <p className="text-xs text-[#64778c]">
                Get notified when a learner finishes an assessment.
              </p>
            </div>
            <input
              type="checkbox"
              checked={draft.notifyOnSubmission}
              onChange={(e) =>
                setDraft({ ...draft, notifyOnSubmission: e.target.checked })
              }
              className="w-4 h-4 accent-[#102a43]"
            />
          </label>

          <label className="flex items-center justify-between gap-4 py-1 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-[#102a43]">
                Monday progress summary
              </p>
              <p className="text-xs text-[#64778c]">
                Weekly digest of cohort completion and average scores.
              </p>
            </div>
            <input
              type="checkbox"
              checked={draft.mondaySummary}
              onChange={(e) =>
                setDraft({ ...draft, mondaySummary: e.target.checked })
              }
              className="w-4 h-4 accent-[#102a43]"
            />
          </label>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#d8e0e8] bg-white text-xs font-medium text-[#36536e] hover:text-[#102a43] hover:bg-[#f7f8f7]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out of workspace</span>
          </button>

          <div className="flex items-center gap-3">
            {savedNotice && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#0a8f63]">
                <Check className="w-3.5 h-3.5" />
                <span>Preferences saved</span>
              </span>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#102a43] text-white text-xs font-semibold hover:bg-[#1a3e5e] transition-colors"
            >
              Save preferences
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
