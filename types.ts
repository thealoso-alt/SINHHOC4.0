
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizResult {
  studentName: string;
  studentId: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  timestamp: string;
  answers: Record<string, number>;
  aiFeedback?: string;
}

export interface Student {
  name: string;
  id: string;
  password?: string;
}

export enum AppState {
  LOGIN,
  QUIZ_SELECTION,
  TAKING_QUIZ,
  RESULTS,
  LEADERBOARD,
  SETTINGS
}
