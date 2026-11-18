import {
  ActivityDay,
  Question,
  Quiz,
  Submission,
  WorkspaceSettings,
} from '../types/quiz';

export const ASSETS = {
  loginArt: '/src/assets/images/login_workspace_art_1794980779841.jpg',
  mayaAvatar: '/src/assets/images/avatar_maya_chen_1794980780730.jpg',
  alexAvatar: '/src/assets/images/avatar_alex_kim_1794980780554.jpg',
  linaAvatar: '/src/assets/images/avatar_lina_shah_1794980782132.jpg',
};

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'qb-1',
    prompt:
      'Which WCAG AA contrast ratio is required as the minimum for standard body text?',
    type: 'multiple-choice',
    subject: 'Design',
    difficulty: 'Easy',
    points: 2,
    options: ['3.0:1', '4.5:1', '7.0:1', '2.5:1'],
    correctAnswer: '4.5:1',
    explanation:
      'WCAG 2.1 Level AA specifies a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text.',
    usageCount: 4,
    updatedAt: 'Nov 14',
  },
  {
    id: 'qb-2',
    prompt:
      'Name one way to make a multi-step quiz question easier to scan for screen-reader users.',
    type: 'short-answer',
    subject: 'Design',
    difficulty: 'Medium',
    points: 4,
    options: [],
    correctAnswer:
      'Use semantic fieldset/legend groupings, clear heading hierarchy, or explicit ARIA labels linking prompts to controls.',
    explanation:
      'Grouping radio options inside a <fieldset> with a descriptive <legend> announces context reliably across screen readers.',
    usageCount: 2,
    updatedAt: 'Nov 12',
  },
  {
    id: 'qb-3',
    prompt:
      'When aligning numeric columns in an analytics table, which CSS font-variant prevents horizontal jitter?',
    type: 'multiple-choice',
    subject: 'Design',
    difficulty: 'Medium',
    points: 2,
    options: [
      'tabular-nums',
      'oldstyle-nums',
      'proportional-nums',
      'small-caps',
    ],
    correctAnswer: 'tabular-nums',
    explanation:
      'tabular-nums gives every digit an identical advance width so columns of scores and timers line up cleanly.',
    usageCount: 3,
    updatedAt: 'Nov 10',
  },
  {
    id: 'qb-4',
    prompt:
      'In a 60-30-10 interface palette, what is the primary purpose of the 10% accent color?',
    type: 'multiple-choice',
    subject: 'Design',
    difficulty: 'Easy',
    points: 2,
    options: [
      'Surface borders and subtle gridlines',
      'Primary calls to action and active selection states',
      'Global page canvas background',
      'Muted paragraph metadata',
    ],
    correctAnswer: 'Primary calls to action and active selection states',
    explanation:
      'Concentrating the 10% accent strictly on primary actions and active states keeps visual hierarchy unmistakable.',
    usageCount: 5,
    updatedAt: 'Nov 09',
  },
  {
    id: 'qb-5',
    prompt:
      'Which research metric best validates whether learners retained core concepts two weeks after completing a module?',
    type: 'multiple-choice',
    subject: 'Strategy',
    difficulty: 'Medium',
    points: 3,
    options: [
      'First-click speed on the welcome screen',
      'Delayed recall score on a follow-up check',
      'Total page scroll depth during reading',
      'Number of slides viewed in one sitting',
    ],
    correctAnswer: 'Delayed recall score on a follow-up check',
    explanation:
      'Spaced follow-up assessments measure durable long-term comprehension rather than short-term recognition.',
    usageCount: 2,
    updatedAt: 'Nov 07',
  },
  {
    id: 'qb-6',
    prompt:
      'During photosynthesis, which cellular organelle captures light energy to convert water and carbon dioxide into glucose?',
    type: 'multiple-choice',
    subject: 'Science',
    difficulty: 'Easy',
    points: 2,
    options: ['Mitochondria', 'Chloroplast', 'Ribosome', 'Golgi apparatus'],
    correctAnswer: 'Chloroplast',
    explanation:
      'Chloroplasts house chlorophyll within thylakoid membranes where light-dependent reactions occur.',
    usageCount: 3,
    updatedAt: 'Nov 05',
  },
  {
    id: 'qb-7',
    prompt:
      'Why does breaking a 20-question assessment into focused 5-question sections reduce learner abandonment?',
    type: 'short-answer',
    subject: 'Strategy',
    difficulty: 'Medium',
    points: 4,
    options: [],
    correctAnswer:
      'Chunking lowers perceived cognitive load and gives learners visible progress milestones.',
    explanation:
      'Shorter visible milestones reduce test fatigue and keep completion momentum steady.',
    usageCount: 1,
    updatedAt: 'Nov 03',
  },
  {
    id: 'qb-8',
    prompt:
      'Which CSS property pair keeps micro-interaction transitions on the GPU compositor thread without triggering layout reflow?',
    type: 'multiple-choice',
    subject: 'General',
    difficulty: 'Hard',
    points: 3,
    options: [
      'width and height',
      'top and margin-left',
      'transform and opacity',
      'padding and border-width',
    ],
    correctAnswer: 'transform and opacity',
    explanation:
      'Animating transform and opacity avoids layout recalculation and paint thrashing.',
    usageCount: 2,
    updatedAt: 'Nov 01',
  },
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-design-a11y',
    title: 'Accessible Interface Foundations',
    description:
      'Core accessibility ratios, semantic markup, and visual clarity checks for product design cohorts.',
    subject: 'Design',
    status: 'Live',
    difficulty: 'Medium',
    timeLimitMinutes: 10,
    questions: [
      INITIAL_QUESTIONS[0],
      INITIAL_QUESTIONS[1],
      INITIAL_QUESTIONS[2],
      INITIAL_QUESTIONS[3],
    ],
    attemptsCount: 42,
    avgScore: 89,
    completionRate: 96,
    lastEdited: 'Nov 14',
    settings: {
      allowNewAttempts: true,
      reviewCorrectAnswers: true,
      showLearnerFeedback: true,
    },
  },
  {
    id: 'quiz-product-strategy',
    title: 'Learning Retention & Assessment Design',
    description:
      'How to structure diagnostic questions, spaced recall intervals, and actionable learner feedback.',
    subject: 'Strategy',
    status: 'Live',
    difficulty: 'Medium',
    timeLimitMinutes: 15,
    questions: [
      INITIAL_QUESTIONS[4],
      INITIAL_QUESTIONS[6],
      {
        id: 'q-strat-3',
        prompt:
          'What is the ideal maximum number of distractors in a fast-paced multiple-choice check?',
        type: 'multiple-choice',
        subject: 'Strategy',
        difficulty: 'Easy',
        points: 2,
        options: [
          'Two to three plausible distractors',
          'Seven unrelated distractors',
          'One distractor only',
          'Ten random options',
        ],
        correctAnswer: 'Two to three plausible distractors',
        explanation:
          'Research shows 3–4 total options balance diagnostic precision with fast cognitive scanning.',
        usageCount: 1,
        updatedAt: 'Nov 11',
      },
    ],
    attemptsCount: 28,
    avgScore: 84,
    completionRate: 91,
    lastEdited: 'Nov 11',
    settings: {
      allowNewAttempts: true,
      reviewCorrectAnswers: true,
      showLearnerFeedback: true,
    },
  },
  {
    id: 'quiz-cellular-bio',
    title: 'Cellular Energy & Vascular Systems',
    description:
      'Foundational check covering chloroplasts, ATP synthesis, and transport pathways.',
    subject: 'Science',
    status: 'Live',
    difficulty: 'Easy',
    timeLimitMinutes: 10,
    questions: [
      INITIAL_QUESTIONS[5],
      {
        id: 'q-sci-2',
        prompt:
          'Which plant tissue primarily transports dissolved sugars from leaves to growing roots?',
        type: 'multiple-choice',
        subject: 'Science',
        difficulty: 'Easy',
        points: 2,
        options: ['Xylem', 'Phloem', 'Epidermis', 'Cortex'],
        correctAnswer: 'Phloem',
        explanation:
          'Phloem conducts organic nutrients such as sucrose from source tissues to sink tissues.',
        usageCount: 1,
        updatedAt: 'Nov 08',
      },
      {
        id: 'q-sci-3',
        prompt:
          'Which gas acts as a key allosteric regulator decreasing hemoglobin oxygen affinity in active muscle tissue?',
        type: 'multiple-choice',
        subject: 'Science',
        difficulty: 'Medium',
        points: 3,
        options: ['Carbon dioxide', 'Nitrogen', 'Argon', 'Neon'],
        correctAnswer: 'Carbon dioxide',
        explanation:
          'Elevated CO2 lowers blood pH (the Bohr effect), encouraging hemoglobin to release oxygen where demand is highest.',
        usageCount: 1,
        updatedAt: 'Nov 08',
      },
    ],
    attemptsCount: 19,
    avgScore: 92,
    completionRate: 95,
    lastEdited: 'Nov 08',
    settings: {
      allowNewAttempts: true,
      reviewCorrectAnswers: true,
      showLearnerFeedback: true,
    },
  },
  {
    id: 'quiz-motion-perf',
    title: 'Motion & Rendering Performance',
    description:
      'Draft review covering GPU compositor properties, reduced-motion preferences, and frame budgets.',
    subject: 'General',
    status: 'Draft',
    difficulty: 'Hard',
    timeLimitMinutes: 15,
    questions: [INITIAL_QUESTIONS[7]],
    attemptsCount: 0,
    avgScore: 0,
    completionRate: 0,
    lastEdited: 'Nov 16',
    settings: {
      allowNewAttempts: false,
      reviewCorrectAnswers: true,
      showLearnerFeedback: true,
    },
  },
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-101',
    quizId: 'quiz-design-a11y',
    quizTitle: 'Accessible Interface Foundations',
    learnerName: 'Alex Kim',
    learnerEmail: 'alex.kim@studio.edu',
    learnerAvatar: ASSETS.alexAvatar,
    scorePercent: 90,
    pointsEarned: 9,
    totalPoints: 10,
    timeSpentSeconds: 312,
    submittedAt: '2 hours ago',
    status: 'Needs review',
    answers: [
      {
        questionId: 'qb-1',
        questionPrompt:
          'Which WCAG AA contrast ratio is required as the minimum for standard body text?',
        questionType: 'multiple-choice',
        learnerAnswer: '4.5:1',
        correctAnswer: '4.5:1',
        isCorrect: true,
        pointsEarned: 2,
        maxPoints: 2,
      },
      {
        questionId: 'qb-2',
        questionPrompt:
          'Name one way to make a multi-step quiz question easier to scan for screen-reader users.',
        questionType: 'short-answer',
        learnerAnswer:
          'Wrap radio choices inside a semantic fieldset and legend so the prompt repeats cleanly.',
        correctAnswer:
          'Use semantic fieldset/legend groupings, clear heading hierarchy, or explicit ARIA labels linking prompts to controls.',
        isCorrect: true,
        pointsEarned: 3,
        maxPoints: 4,
        needsReview: true,
      },
      {
        questionId: 'qb-3',
        questionPrompt:
          'When aligning numeric columns in an analytics table, which CSS font-variant prevents horizontal jitter?',
        questionType: 'multiple-choice',
        learnerAnswer: 'tabular-nums',
        correctAnswer: 'tabular-nums',
        isCorrect: true,
        pointsEarned: 2,
        maxPoints: 2,
      },
      {
        questionId: 'qb-4',
        questionPrompt:
          'In a 60-30-10 interface palette, what is the primary purpose of the 10% accent color?',
        questionType: 'multiple-choice',
        learnerAnswer: 'Primary calls to action and active selection states',
        correctAnswer: 'Primary calls to action and active selection states',
        isCorrect: true,
        pointsEarned: 2,
        maxPoints: 2,
      },
    ],
  },
  {
    id: 'sub-102',
    quizId: 'quiz-design-a11y',
    quizTitle: 'Accessible Interface Foundations',
    learnerName: 'Lina Shah',
    learnerEmail: 'lina.shah@studio.edu',
    learnerAvatar: ASSETS.linaAvatar,
    scorePercent: 100,
    pointsEarned: 10,
    totalPoints: 10,
    timeSpentSeconds: 265,
    submittedAt: '5 hours ago',
    status: 'Completed',
    answers: [
      {
        questionId: 'qb-1',
        questionPrompt:
          'Which WCAG AA contrast ratio is required as the minimum for standard body text?',
        questionType: 'multiple-choice',
        learnerAnswer: '4.5:1',
        correctAnswer: '4.5:1',
        isCorrect: true,
        pointsEarned: 2,
        maxPoints: 2,
      },
      {
        questionId: 'qb-2',
        questionPrompt:
          'Name one way to make a multi-step quiz question easier to scan for screen-reader users.',
        questionType: 'short-answer',
        learnerAnswer:
          'Use clear heading levels, ARIA-describedby hints, and keyboard-accessible radio groups.',
        correctAnswer:
          'Use semantic fieldset/legend groupings, clear heading hierarchy, or explicit ARIA labels linking prompts to controls.',
        isCorrect: true,
        pointsEarned: 4,
        maxPoints: 4,
      },
      {
        questionId: 'qb-3',
        questionPrompt:
          'When aligning numeric columns in an analytics table, which CSS font-variant prevents horizontal jitter?',
        questionType: 'multiple-choice',
        learnerAnswer: 'tabular-nums',
        correctAnswer: 'tabular-nums',
        isCorrect: true,
        pointsEarned: 2,
        maxPoints: 2,
      },
      {
        questionId: 'qb-4',
        questionPrompt:
          'In a 60-30-10 interface palette, what is the primary purpose of the 10% accent color?',
        questionType: 'multiple-choice',
        learnerAnswer: 'Primary calls to action and active selection states',
        correctAnswer: 'Primary calls to action and active selection states',
        isCorrect: true,
        pointsEarned: 2,
        maxPoints: 2,
      },
    ],
  },
  {
    id: 'sub-103',
    quizId: 'quiz-product-strategy',
    quizTitle: 'Learning Retention & Assessment Design',
    learnerName: 'Jordan Miller',
    learnerEmail: 'jordan.m@studio.edu',
    scorePercent: 78,
    pointsEarned: 7,
    totalPoints: 9,
    timeSpentSeconds: 418,
    submittedAt: 'Yesterday',
    status: 'Needs review',
    answers: [
      {
        questionId: 'qb-5',
        questionPrompt:
          'Which research metric best validates whether learners retained core concepts two weeks after completing a module?',
        questionType: 'multiple-choice',
        learnerAnswer: 'Delayed recall score on a follow-up check',
        correctAnswer: 'Delayed recall score on a follow-up check',
        isCorrect: true,
        pointsEarned: 3,
        maxPoints: 3,
      },
      {
        questionId: 'qb-7',
        questionPrompt:
          'Why does breaking a 20-question assessment into focused 5-question sections reduce learner abandonment?',
        questionType: 'short-answer',
        learnerAnswer:
          'Learners see clear progress milestones and do not feel overwhelmed by a single long scroll.',
        correctAnswer:
          'Chunking lowers perceived cognitive load and gives learners visible progress milestones.',
        isCorrect: true,
        pointsEarned: 2,
        maxPoints: 4,
        needsReview: true,
      },
      {
        questionId: 'q-strat-3',
        questionPrompt:
          'What is the ideal maximum number of distractors in a fast-paced multiple-choice check?',
        questionType: 'multiple-choice',
        learnerAnswer: 'Two to three plausible distractors',
        correctAnswer: 'Two to three plausible distractors',
        isCorrect: true,
        pointsEarned: 2,
        maxPoints: 2,
      },
    ],
  },
  {
    id: 'sub-104',
    quizId: 'quiz-cellular-bio',
    quizTitle: 'Cellular Energy & Vascular Systems',
    learnerName: 'Lina Shah',
    learnerEmail: 'lina.shah@studio.edu',
    learnerAvatar: ASSETS.linaAvatar,
    scorePercent: 100,
    pointsEarned: 7,
    totalPoints: 7,
    timeSpentSeconds: 194,
    submittedAt: '2 days ago',
    status: 'Completed',
    answers: [
      {
        questionId: 'qb-6',
        questionPrompt:
          'During photosynthesis, which cellular organelle captures light energy to convert water and carbon dioxide into glucose?',
        questionType: 'multiple-choice',
        learnerAnswer: 'Chloroplast',
        correctAnswer: 'Chloroplast',
        isCorrect: true,
        pointsEarned: 2,
        maxPoints: 2,
      },
      {
        questionId: 'q-sci-2',
        questionPrompt:
          'Which plant tissue primarily transports dissolved sugars from leaves to growing roots?',
        questionType: 'multiple-choice',
        learnerAnswer: 'Phloem',
        correctAnswer: 'Phloem',
        isCorrect: true,
        pointsEarned: 2,
        maxPoints: 2,
      },
      {
        questionId: 'q-sci-3',
        questionPrompt:
          'Which gas acts as a key allosteric regulator decreasing hemoglobin oxygen affinity in active muscle tissue?',
        questionType: 'multiple-choice',
        learnerAnswer: 'Carbon dioxide',
        correctAnswer: 'Carbon dioxide',
        isCorrect: true,
        pointsEarned: 3,
        maxPoints: 3,
      },
    ],
  },
];

export const ACTIVITY_7_DAYS: ActivityDay[] = [
  { label: 'Wed', fullDate: 'Nov 11', attempts: 11, avgScore: 84 },
  { label: 'Thu', fullDate: 'Nov 12', attempts: 16, avgScore: 87 },
  { label: 'Fri', fullDate: 'Nov 13', attempts: 14, avgScore: 86 },
  { label: 'Sat', fullDate: 'Nov 14', attempts: 9, avgScore: 91 },
  { label: 'Sun', fullDate: 'Nov 15', attempts: 12, avgScore: 88 },
  { label: 'Mon', fullDate: 'Nov 16', attempts: 19, avgScore: 90 },
  { label: 'Tue', fullDate: 'Nov 17', attempts: 15, avgScore: 92 },
];

export const ACTIVITY_30_DAYS: ActivityDay[] = [
  { label: 'Wk 1', fullDate: 'Oct 19–25', attempts: 48, avgScore: 82 },
  { label: 'Wk 2', fullDate: 'Oct 26–Nov 1', attempts: 62, avgScore: 85 },
  { label: 'Wk 3', fullDate: 'Nov 2–8', attempts: 74, avgScore: 88 },
  { label: 'Wk 4', fullDate: 'Nov 9–17', attempts: 96, avgScore: 90 },
];

export const INITIAL_SETTINGS: WorkspaceSettings = {
  educatorName: 'Maya Chen',
  educatorEmail: 'maya@quizly.app',
  organization: 'Design Education Studio',
  roleTitle: 'Owner · Design education',
  defaultTimeLimit: 10,
  autoPublishQuizzes: false,
  allowNewAttempts: true,
  reviewCorrectAnswers: true,
  notifyOnSubmission: true,
  mondaySummary: true,
  productUpdates: false,
};
