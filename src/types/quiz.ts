export type SubjectCategory = 'Design' | 'Strategy' | 'Science' | 'General';

export type QuestionType = 'multiple-choice' | 'short-answer';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export type QuizStatus = 'Live' | 'Draft';

export type TimeLimitOption = 5 | 10 | 15 | 30 | 0; // 0 = Unlimited

export interface Question {
  id: string;
  prompt: string;
  type: QuestionType;
  subject: SubjectCategory;
  difficulty: DifficultyLevel;
  points: number;
  options: string[];
  correctAnswer: string;
  explanation: string;
  usageCount: number;
  updatedAt: string;
}

export interface QuizSettings {
  allowNewAttempts: boolean;
  reviewCorrectAnswers: boolean;
  showLearnerFeedback: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: SubjectCategory;
  status: QuizStatus;
  difficulty: DifficultyLevel;
  timeLimitMinutes: TimeLimitOption;
  questions: Question[];
  attemptsCount: number;
  avgScore: number;
  completionRate: number;
  lastEdited: string;
  settings: QuizSettings;
}

export interface SubmissionAnswer {
  questionId: string;
  questionPrompt: string;
  questionType: QuestionType;
  learnerAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  needsReview?: boolean;
  educatorNote?: string;
}

export interface Submission {
  id: string;
  quizId: string;
  quizTitle: string;
  learnerName: string;
  learnerEmail: string;
  learnerAvatar?: string;
  scorePercent: number;
  pointsEarned: number;
  totalPoints: number;
  timeSpentSeconds: number;
  submittedAt: string;
  status: 'Completed' | 'Needs review';
  answers: SubmissionAnswer[];
}

export interface ActivityDay {
  label: string;
  fullDate: string;
  attempts: number;
  avgScore: number;
}

export interface WorkspaceSettings {
  educatorName: string;
  educatorEmail: string;
  organization: string;
  roleTitle: string;
  defaultTimeLimit: TimeLimitOption;
  autoPublishQuizzes: boolean;
  allowNewAttempts: boolean;
  reviewCorrectAnswers: boolean;
  notifyOnSubmission: boolean;
  mondaySummary: boolean;
  productUpdates: boolean;
}

export type AppView =
  | 'overview'
  | 'quizzes'
  | 'editor'
  | 'question-bank'
  | 'analytics'
  | 'learner-portal'
  | 'settings';

export type AuthRole = 'educator' | 'learner' | 'signed-out';
