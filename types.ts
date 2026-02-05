
export interface User {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
  avatar?: string;
}

export type AppTab = 'home' | 'ai' | 'cards' | 'quiz' | 'log';

export interface StudySession {
  startTime: number;
  duration: number; // in seconds
  active: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  image?: string;
}
