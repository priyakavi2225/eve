/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StudyLevel = 'School' | 'Diploma' | 'Undergraduate' | 'Postgraduate' | 'Competitive Exams' | 'Coding' | 'Skill Development';
export type KnowledgeLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type NodeType = 'lesson' | 'practice' | 'quiz' | 'challenge' | 'boss';
export type NodeStatus = 'completed' | 'unlocked' | 'locked';

export interface StudentProfile {
  uid: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  language: string;
  studyingFor: StudyLevel;
  knowledgeLevel: KnowledgeLevel;
  currentLevel: number;
  xp: number;
  coins: number;
  gems: number;
  streak: number;
  lastActiveDate?: string; // YYYY-MM-DD
  verified: boolean;
  unlockedBadges: string[]; // Badge IDs
  completedLevels: string[]; // Node IDs
}

export interface LearningNode {
  id: string;
  levelNum: number;
  title: string;
  type: NodeType;
  status: NodeStatus;
  description: string;
  durationMinutes: number;
  coinsReward: number;
  gemsReward: number;
  xpReward: number;
  tips?: string[];
  // coordinates for rendering our Candy Crush mountain climb roadmap (percentage offset from center or specific grid position)
  x: number; // 0 to 100 percent width
  y: number; // 0 to 100 percent height (climbing bottom-to-top)
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'true_false' | 'match' | 'puzzle';
  options?: string[]; // for MCQ or true_false
  pairs?: { left: string; right: string }[]; // for match the following
  puzzlePieces?: string[]; // for ordering puzzle questions
  correctAnswer: string | boolean | string[] | { [key: string]: string }; // string index, boolean, or match mapping
  explanation: string;
  image?: string;
}

export interface LeaderboardEntry {
  uid: string;
  fullName: string;
  avatar: string;
  xp: number;
  level: number;
  rank: number;
}

export interface ActivityLog {
  id: string;
  title: string;
  type: 'quiz_complete' | 'lesson_finish' | 'badge_earned' | 'streak_gain';
  timestamp: string;
  xpAwarded: number;
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string; // name of lucide-react icon
  color: string; // tailwind color class
}
