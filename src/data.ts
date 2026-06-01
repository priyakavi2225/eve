import { LearningNode, QuizQuestion, AchievementBadge, LeaderboardEntry } from './types';

// Theming exactly matches the uploaded image "Roadmap to become a Topper"!
export const LEARNING_LEVELS: LearningNode[] = [
  {
    id: 'lvl_1',
    levelNum: 1,
    title: 'Work Hard',
    type: 'lesson',
    status: 'unlocked',
    description: 'Learn the fundamentals of active study and standard study discipline. Lay down your foundation!',
    durationMinutes: 5,
    coinsReward: 50,
    gemsReward: 5,
    xpReward: 100,
    tips: [
      'Active study is 3x more effective than passive reading.',
      'Start with a tidy workspace to clear visual clutter.'
    ],
    x: 18,
    y: 88, // bottom of the mountain path
  },
  {
    id: 'lvl_2',
    levelNum: 2,
    title: 'Stay Consistent',
    type: 'practice',
    status: 'locked',
    description: 'Establish a powerful daily cadence and beat the initial procrastination hump.',
    durationMinutes: 8,
    coinsReward: 60,
    gemsReward: 6,
    xpReward: 120,
    tips: [
      'The best way to build a habit is starting at the exact same hour daily.',
      'Even 10 minutes of learning helps maintain your momentum.'
    ],
    x: 42,
    y: 83,
  },
  {
    id: 'lvl_3',
    levelNum: 3,
    title: 'Never Give Up',
    type: 'quiz',
    status: 'locked',
    description: 'An interactive grit-infused quiz testing your perseverance and active recall.',
    durationMinutes: 6,
    coinsReward: 80,
    gemsReward: 10,
    xpReward: 150,
    tips: [
      'Mistakes are just nodes in your personalized neural network.',
      'Analyze incorrect answers instantly with our AI Assistant!'
    ],
    x: 25,
    y: 74,
  },
  {
    id: 'lvl_4',
    levelNum: 4,
    title: 'Set Your Goals',
    type: 'challenge',
    status: 'locked',
    description: 'Draft your milestone targets and map them directly into rewarding daily micro-quests.',
    durationMinutes: 10,
    coinsReward: 100,
    gemsReward: 12,
    xpReward: 200,
    tips: [
      'Use the SMART goal framework (Specific, Measurable, Actionable, Relevant, Timebound).',
      'Celebrate short-term targets to release helpful motivational dopamine.'
    ],
    x: 22,
    y: 63,
  },
  {
    id: 'lvl_5',
    levelNum: 5,
    title: 'Manage Your Time',
    type: 'lesson',
    status: 'locked',
    description: 'Unlock timeboxing, the Pomodoro technique, and smart task batching concepts.',
    durationMinutes: 7,
    coinsReward: 70,
    gemsReward: 8,
    xpReward: 140,
    tips: [
      'Standard Pomodoro uses 25 minutes of focus followed by a 5-minute stretching break.',
      'Avoid multitasking; context-switching drains cognitive energy rapidly.'
    ],
    x: 62,
    y: 64,
  },
  {
    id: 'lvl_6',
    levelNum: 6,
    title: 'Stay Focused',
    type: 'practice',
    status: 'locked',
    description: 'Master sensory focus and learn to completely muzzle notifications while in the zone.',
    durationMinutes: 9,
    coinsReward: 90,
    gemsReward: 10,
    xpReward: 160,
    tips: [
      'Turn on Do Not Disturb mode across all personal mobile devices.',
      'Keep a stray notepad nearby to write down unrelated passing thoughts.'
    ],
    x: 68,
    y: 53,
  },
  {
    id: 'lvl_7',
    levelNum: 7,
    title: 'Healthy Lifestyle',
    type: 'quiz',
    status: 'locked',
    description: 'A vital check-in on the fuel behind the engine: sleep cycles, nutrition, and exercise.',
    durationMinutes: 5,
    coinsReward: 80,
    gemsReward: 8,
    xpReward: 150,
    tips: [
      'Your brain consolidates primary learning memory during REM sleep.',
      'Staying hydrated prevents late afternoon studying headaches.'
    ],
    x: 35,
    y: 44,
  },
  {
    id: 'lvl_8',
    levelNum: 8,
    title: 'Make a Study Plan',
    type: 'challenge',
    status: 'locked',
    description: 'Assemble an optimized weekly study roadmap that balances intensity with healthy restoration.',
    durationMinutes: 12,
    coinsReward: 120,
    gemsReward: 15,
    xpReward: 250,
    tips: [
      'Alternate between highly intense and mildly passive study activities.',
      'Block out mandatory relaxation hours to completely prevent burnout.'
    ],
    x: 55,
    y: 35,
  },
  {
    id: 'lvl_9',
    levelNum: 9,
    title: 'Practice & Revise',
    type: 'practice',
    status: 'locked',
    description: 'Reinforce advanced lessons with dynamic active recall flashcards.',
    durationMinutes: 10,
    coinsReward: 100,
    gemsReward: 12,
    xpReward: 180,
    tips: [
      'Spaced repetition overrides the infamous psychological exponential forgetting curve.',
      'Teach concepts out loud to test if you truly understand them.'
    ],
    x: 82,
    y: 36,
  },
  {
    id: 'lvl_10',
    levelNum: 10,
    title: 'Take Mock Tests',
    type: 'boss',
    status: 'locked',
    description: 'The Ultimate Graduation Board: A comprehensive timed test spanning all topper strategies.',
    durationMinutes: 15,
    coinsReward: 250,
    gemsReward: 30,
    xpReward: 500,
    tips: [
      'Simulate exact exam environments: timers, silence, and no external searching.',
      'Accept incorrect answers as diagnostic data to refine your focus modules.'
    ],
    x: 52,
    y: 20, // Peak of Topper mountain scale
  }
];

export const ALL_QUESTIONS: { [nodeId: string]: QuizQuestion[] } = {
  lvl_1: [
    {
      id: 'q1_1',
      question: 'Which studying approach is mathematically proven to generate supercharged learning outcomes?',
      type: 'mcq',
      options: [
        'Reading highlighters repeatedly over a textbook',
        'Active recall (testing yourself and forcing retrieval)',
        'Listening to academic lectures while playing video games',
        'Staring intensely at a diagram for half an hour'
      ],
      correctAnswer: '1', // index 1 (Active recall)
      explanation: 'Active recall forces your synapses to physically rebuild connections, forming durable memory chunks, whereas simple passive reading only builds temporary recognition familiarity.'
    },
    {
      id: 'q1_2',
      question: 'True or False: Listening to highly complex, loud lyrical music makes you absorb text details quicker.',
      type: 'true_false',
      options: ['True', 'False'],
      correctAnswer: false, // False
      explanation: 'Lyrics activate the auditory and language synthesis systems of your brain, which directly compete with the reading comprehension nodes, causing heavy cognitive distraction.'
    }
  ],
  lvl_2: [
    {
      id: 'q2_1',
      question: 'If you only have 15 minutes left in a busy day, what should consistency dictate?',
      type: 'mcq',
      options: [
        'Skip studying research entirely and binge-watch a tutorial tomorrow',
        'Do a short 5-10 minute active review card sprint to keep the neural habit alive',
        'Read 3 pages as fast as light without understanding a single sentence',
        'Promise yourself you will study 8 hours straight on Saturday to compensate'
      ],
      correctAnswer: '1',
      explanation: 'Maintaining the daily habit trigger is crucial. Skipping a day severely increases the friction of starting again, whereas a micro-session protects the psychological streak.'
    },
    {
      id: 'q2_2',
      question: 'Match these popular productivity tools with their core mechanism of action:',
      type: 'match',
      pairs: [
        { left: 'Pomodoro timer', right: 'Intense 25m focus blocks' },
        { left: 'Habit tracking calendar', right: 'Visual x-mark chain' },
        { left: 'Spaced Repetition App', right: 'Calculated expanding schedules' }
      ],
      correctAnswer: {
        'Pomodoro timer': 'Intense 25m focus blocks',
        'Habit tracking calendar': 'Visual x-mark chain',
        'Spaced Repetition App': 'Calculated expanding schedules'
      },
      explanation: 'Each tool acts as a mechanical scaffold helping your brain establish consistency, reducing internal friction.'
    }
  ],
  lvl_3: [
    {
      id: 'q3_1',
      question: 'What is the scientifically supported term for treating academic failures as growth vectors?',
      type: 'mcq',
      options: [
        'Durable Denial complex',
        'Growth Mindset (embracing hurdles to develop capability)',
        'Syntactic Stoicism',
        'Visualized Victory projection'
      ],
      correctAnswer: '1',
      explanation: 'Coined by Carol Dweck, a growth mindset assumes intelligence and skills are plastic, developed directly through rigor, persistence, and continuous trial-and-error.'
    },
    {
      id: 'q3_2',
      question: 'Arrange these steps in the correct order when correcting a failed quiz: (1) Ask AI Tutor to simplify, (2) Flag for revision, (3) Retake the level.',
      type: 'puzzle',
      puzzlePieces: [
        'Ask AI Tutor to simplify the concept instantly',
        'Flag the failed question for spaced revision tomorrow',
        'Re-quiz yourself on the level nodes to locked golden success'
      ],
      correctAnswer: ['Ask AI Tutor to simplify the concept instantly', 'Flag the failed question for spaced revision tomorrow', 'Re-quiz yourself on the level nodes to locked golden success'],
      explanation: 'First diagnose why you erred, catalog it, and then instantly apply the correction loop to test active retrieval!'
    }
  ],
  lvl_4: [
    {
      id: 'q4_1',
      question: 'In the SMART goals context, what does the key letter "A" represent?',
      type: 'mcq',
      options: [
        'Aggressive targets that push you into heavy stress',
        'Actionable / Achievable steps that you explicitly control',
        'Abundant textbook resources',
        'Automatic memorization hacks'
      ],
      correctAnswer: '1',
      explanation: 'S = Specific, M = Measurable, A = Actionable, R = Relevant, T = Time-bound. "Actionable" ensures you focus on behaviors you have agency over.'
    }
  ],
  lvl_5: [
    {
      id: 'q5_1',
      question: 'What happens to your brain processing capacity during multi-tasking?',
      type: 'mcq',
      options: [
        'It unlocks modern parallel thread nodes to speed up work',
        'It experiences heavy "attention residue" that slows ingestion',
        'It becomes completely immune to academic burnouts',
        'It increases long-term storage consolidation speed'
      ],
      correctAnswer: '1',
      explanation: 'Attention residue occurs when you switch from active task A to B. Residue from task A lingers, leaving less processing room for task B and causing drag.'
    }
  ],
  lvl_6: [
    {
      id: 'q6_1',
      question: 'Which of these is the most effective way to protect your attention during high-intensity studying sessions?',
      type: 'mcq',
      options: [
        'Leaving social channels open so you do not suffer from FOMO',
        'Hiding phones completely in another physical room',
        'Flipping the screen face down but keeping vibration alerts on',
        'Checking feeds only during short questions'
      ],
      correctAnswer: '1',
      explanation: 'Even a silent phone sitting on your workspace is proven to compete for passive cognitive attention. Complete physical isolation restores maximum focus.'
    }
  ],
  lvl_7: [
    {
      id: 'q7_1',
      question: 'What active cognitive consolidation occurs during healthy deep sleep cycles?',
      type: 'mcq',
      options: [
        'Pruning of toxic synaptic links and storage transfer to Neocortex',
        'Constant physical enlargement of the overall Skull size',
        'Conversion of general facts into immediate physical strength',
        'Direct connection of different eyes receptors networks'
      ],
      correctAnswer: '0',
      explanation: 'Deep sleep clears metabolic waste from active zones while transferring information from the fragile hippocampus memory chip into the durable neocortex vault.'
    }
  ],
  lvl_8: [
    {
      id: 'q8_1',
      question: 'An optimized study plan should always map which of the following details?',
      type: 'mcq',
      options: [
        'Studying continuously for 12 hours without drinking water',
        'Balancing intense blocks with periods of planned recreation',
        'Changing subjects every 10 seconds to create constant surprise',
        'Only using digital high-contrast interfaces'
      ],
      correctAnswer: '1',
      explanation: 'Rest is not a luxury, it is a metabolic necessity for memory consolidation. Structured downtime prevents mental fatigue and maintains motivation.'
    }
  ],
  lvl_9: [
    {
      id: 'q9_1',
      question: 'What describes the "forgetting curve" identified by Hermann Ebbinghaus?',
      type: 'mcq',
      options: [
        'Memory for facts expands exponentially when you eat sugars',
        'Memory retention falls off exponentially without spaced reviews',
        'Studying languages replaces earlier mathematical codes',
        'Older adults forget facts quicker than teenage pupils'
      ],
      correctAnswer: '1',
      explanation: 'We lose almost 50% of freshly absorbed materials within a few hours. Reviewing the content at expanding spacing intervals flatten the curve completely!'
    }
  ],
  lvl_10: [
    {
      id: 'q10_1',
      question: 'What is the primary benefit of taking timed mock exams before real tests?',
      type: 'mcq',
      options: [
        'It teaches your muscular system how to handle heavy fatigue',
        'It trains stress modulation, pacing, and isolates latent weak zones',
        'It completely replaces the need for standard subject revision',
        'It automatically guarantees an A+ mark regardless of focus'
      ],
      correctAnswer: '1',
      explanation: 'Timed mock tests desensitize you to performance pressure, audit your pacing strategy, and expose exact concepts where your understanding breaks down under load.'
    }
  ]
};

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'fast_learner',
    name: 'Fast Learner',
    description: 'Finished your first micro-lesson under 3 minutes.',
    icon: 'Zap',
    color: 'text-indigo-500 bg-indigo-50 border-indigo-200'
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Score 100% on any interactive Quiz node.',
    icon: 'Award',
    color: 'text-amber-500 bg-amber-50 border-amber-200'
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Answered 5 consecutive questions correctly without error.',
    icon: 'Target',
    color: 'text-emerald-500 bg-emerald-50 border-emerald-200'
  },
  {
    id: 'weekly_champion',
    name: 'Weekly Champion',
    description: 'Logged XP gains for 7 independent days in a single week.',
    icon: 'Calendar',
    color: 'text-rose-500 bg-rose-50 border-rose-200'
  },
  {
    id: 'knowledge_explorer',
    name: 'Knowledge Explorer',
    description: 'Unlocked level 5 node "Manage Your Time".',
    icon: 'Map',
    color: 'text-sky-500 bg-sky-50 border-sky-200'
  },
  {
    id: 'ai_scholar',
    name: 'AI Scholar',
    description: 'Consulted the personalized AI Tutor 5 times for active doubt clearing.',
    icon: 'Cpu',
    color: 'text-violet-500 bg-violet-50 border-violet-200'
  }
];

export const MOCK_LEADERBOARDS: { [group: string]: LeaderboardEntry[] } = {
  friends: [
    { uid: 'f1', fullName: 'Aarav Sharma', avatar: '🐱', xp: 2450, level: 8, rank: 1 },
    { uid: 'f2', fullName: 'Zoya Patel', avatar: '🐰', xp: 1890, level: 6, rank: 2 },
    { uid: 'f3', fullName: 'You', avatar: '🦊', xp: 450, level: 2, rank: 3 },
    { uid: 'f4', fullName: 'Rohan Mathur', avatar: '🐼', xp: 320, level: 1, rank: 4 },
    { uid: 'f5', fullName: 'Kriti Sen', avatar: '🐯', xp: 120, level: 1, rank: 5 }
  ],
  school: [
    { uid: 's1', fullName: 'Divya Nair', avatar: '🦁', xp: 3500, level: 9, rank: 1 },
    { uid: 's2', fullName: 'Nikhil Paul', avatar: '🐻', xp: 3100, level: 9, rank: 2 },
    { uid: 's3', fullName: 'Aarav Sharma', avatar: '🐱', xp: 2450, level: 8, rank: 3 },
    { uid: 's4', fullName: 'Zoya Patel', avatar: '🐰', xp: 1890, level: 6, rank: 4 },
    { uid: 'f3', fullName: 'You', avatar: '🦊', xp: 450, level: 2, rank: 5 },
    { uid: 's5', fullName: 'Sanjay Dutt', avatar: '🐸', xp: 410, level: 2, rank: 6 }
  ],
  state: [
    { uid: 'st1', fullName: 'Ananya Reddy', avatar: '🦄', xp: 6200, level: 10, rank: 1 },
    { uid: 'st2', fullName: 'Kabir Verma', avatar: '🐨', xp: 5800, level: 10, rank: 2 },
    { uid: 'st3', fullName: 'Siddharth Roy', avatar: '🦖', xp: 4900, level: 10, rank: 3 },
    { uid: 's1', fullName: 'Divya Nair', avatar: '🦁', xp: 3500, level: 9, rank: 4 },
    { uid: 'f3', fullName: 'You', avatar: '🦊', xp: 450, level: 2, rank: 142 }
  ],
  national: [
    { uid: 'n1', fullName: 'Aditya Rao', avatar: '🧙', xp: 9500, level: 10, rank: 1 },
    { uid: 'n2', fullName: 'Meera Iyer', avatar: '🧜', xp: 8700, level: 10, rank: 2 },
    { uid: 'st1', fullName: 'Ananya Reddy', avatar: '🦄', xp: 6200, level: 10, rank: 3 },
    { uid: 'f3', fullName: 'You', avatar: '🦊', xp: 450, level: 2, rank: 2108 }
  ]
};
