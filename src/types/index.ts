export interface Subject {
  id: string;
  name: string;
  color: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  examDate?: string;
  description?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  tags: string[];
  createdBy: string;
  isPublic: boolean;
  rating: number;
  enrolledStudents: number;
}

export interface StudyTask {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  duration: number;
  completed: boolean;
  dueDate: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'reading' | 'practice' | 'quiz' | 'project';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  completedAt?: string;
  timeSpent?: number;
}

export interface Flashcard {
  id: string;
  subjectId: string;
  question: string;
  answer: string;
  type: 'mcq' | 'shortAnswer' | 'trueFalse' | 'fillBlank';
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: string;
  nextReview?: string;
  easiness: number;
  interval: number;
  repetitions: number;
  tags: string[];
  createdBy: string;
  isPublic: boolean;
  successRate: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  subjectId: string;
  description: string;
  coverColor: string;
  pages: BookPage[];
  totalPages: number;
  readingProgress: number;
  lastReadPage: number;
  bookmarks: number[];
  notes: BookNote[];
  highlights: BookHighlight[];
  createdBy: string;
  isPublic: boolean;
  rating: number;
  downloadCount: number;
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number;
}

export interface BookPage {
  id: string;
  pageNumber: number;
  title: string;
  content: string;
  plainText: string;
  wordCount: number;
  readingTime: number;
  lastModified: string;
}

export interface BookNote {
  id: string;
  pageNumber: number;
  content: string;
  position: { x: number; y: number };
  createdAt: string;
  userId: string;
}

export interface BookHighlight {
  id: string;
  pageNumber: number;
  text: string;
  color: string;
  position: { start: number; end: number };
  createdAt: string;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'creator';
  avatar?: string;
  totalStudyTime: number;
  level: number;
  experience: number;
  achievements: Achievement[];
  streakDays: number;
  preferences: UserPreferences;
  enrolledSubjects: string[];
  createdSubjects: string[];
  statistics: UserStatistics;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    studyReminders: boolean;
    achievementAlerts: boolean;
    weeklyReports: boolean;
    flashcardReviews: boolean;
  };
  studySettings: {
    sessionDuration: number;
    breakDuration: number;
    dailyGoal: number;
    preferredDifficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
}

export interface UserStatistics {
  totalBooksRead: number;
  totalFlashcardsReviewed: number;
  averageSessionTime: number;
  strongestSubjects: string[];
  weakestSubjects: string[];
  studyStreak: number;
  weeklyGoalCompletion: number;
  monthlyProgress: number;
}

export interface StudySession {
  id: string;
  userId: string;
  subjectId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  tasksCompleted: number;
  flashcardsReviewed: number;
  pagesRead: number;
  focusScore: number;
  breaksTaken: number;
  sessionType: 'focused' | 'review' | 'practice' | 'mixed';
}

export interface Quiz {
  id: string;
  title: string;
  subjectId: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore: number;
  attempts: QuizAttempt[];
  createdBy: string;
  isPublic: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'shortAnswer' | 'trueFalse' | 'fillBlank';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: Record<string, any>;
  score: number;
  timeSpent: number;
  completedAt: string;
  passed: boolean;
}

export interface AdminStats {
  totalUsers: number;
  totalSubjects: number;
  totalBooks: number;
  totalFlashcards: number;
  activeUsers: number;
  popularSubjects: Subject[];
  systemHealth: {
    uptime: number;
    memoryUsage: number;
    activeConnections: number;
  };
}