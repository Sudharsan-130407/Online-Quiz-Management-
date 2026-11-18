import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ASSETS } from '../data/initialData';

interface LoginViewProps {
  onSignInEducator: (email?: string) => void;
  onSignInLearner: () => void;
}

export function LoginView({
  onSignInEducator,
  onSignInLearner,
}: LoginViewProps) {
  const [email, setEmail] = useState('maya@quizly.app');
  const [password, setPassword] = useState('••••••••••••');
  const [artFailed, setArtFailed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignInEducator(email);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] bg-[#f7f8f7]">
      {/* Left Artwork Panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 bg-[#102a43] text-white overflow-hidden">
        {!artFailed && (
          <img
            src={ASSETS.loginArt}
            alt="Geometric learning pathways illustration"
            referrerPolicy="no-referrer"
            onError={() => setArtFailed(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-55"
          />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#102a43] via-[#102a43]/70 to-[#102a43]/50"
          aria-hidden="true"
        />

        <div className="relative z-10 flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-[#2ee6a6] text-[#102a43] flex items-center justify-center shrink-0">
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
          <span className="font-display text-lg font-bold tracking-tight text-white">
            Quizly
          </span>
        </div>

        <div className="relative z-10 max-w-md space-y-4">
          <h1 className="font-display text-3xl xl:text-4xl font-bold leading-tight text-balance">
            Precise tools for curious educators.
          </h1>
          <p className="text-sm text-[#d2dfe9] leading-relaxed">
            Build structured assessments, organize reusable question banks,
            review short-answer responses, and track cohort mastery in one calm
            workspace.
          </p>
        </div>

        <p className="relative z-10 text-xs text-[#9eb3c6]">
          © 2026 Quizly · Online Quiz Management
        </p>
      </div>

      {/* Right Sign-In Panel */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-white">
        <div className="w-full max-w-sm mx-auto space-y-7">
          <div className="lg:hidden flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#102a43] text-[#2ee6a6] flex items-center justify-center">
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

          <div>
            <h2 className="font-display text-2xl font-bold text-[#102a43]">
              Sign in to workspace
            </h2>
            <p className="mt-1.5 text-sm text-[#64778c]">
              Enter your educator credentials or explore the learner portal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-medium text-[#36536e] mb-1.5"
              >
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#d8e0e8] bg-white text-sm text-[#102a43] focus:outline-none focus:border-[#102a43]"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-medium text-[#36536e] mb-1.5"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#d8e0e8] bg-white text-sm text-[#102a43] focus:outline-none focus:border-[#102a43]"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#102a43] text-white text-sm font-semibold hover:bg-[#1a3e5e] transition-colors"
            >
              <span>Continue as Maya Chen</span>
              <ArrowRight className="w-4 h-4 text-[#2ee6a6]" />
            </button>
          </form>

          <div className="pt-4 border-t border-[#e6ebf0] space-y-2.5">
            <p className="text-xs text-[#64778c]">
              Or jump directly into a role:
            </p>
            <button
              type="button"
              onClick={onSignInLearner}
              className="w-full px-4 py-2.5 rounded-lg border border-[#d8e0e8] bg-[#f7f8f7] text-sm font-medium text-[#102a43] hover:bg-[#edf1f3] transition-colors"
            >
              Open Learner Portal (Alex Kim)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
