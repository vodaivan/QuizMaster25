export interface Option {
  id: string; // 'A', 'B', 'C', 'D'
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
  correctOptionId: string; // 'A', 'B', 'C', 'D'
  section: number; // 1, 2, 3, 4
}

export type QuizMode = 'normal' | 'random' | 'input' | 'review' | 'guide';

export interface QuizModeState {
  userAnswers: Record<number, string>;
  isSubmitted: boolean;
  timeRemaining: number | null;
  isTimerPaused: boolean;
}

export interface QuizState {
  questions: Question[];
  // These properties now reflect the *active* mode
  userAnswers: Record<number, string>; 
  isSubmitted: boolean;
  timeRemaining: number | null; 
  isTimerPaused: boolean;
  
  notes: Record<number, string>;
  wrongCounts: Record<number, number>;
  shuffledOrder: number[]; 
  activeMode: QuizMode;
  lastScores: { normal: number | null; random: number | null };
}

export const SECTIONS = [1, 2, 3, 4];
export const QUESTIONS_PER_SECTION = 50;
export const QUESTIONS_PER_PAGE = 10;