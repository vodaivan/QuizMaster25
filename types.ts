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

export interface QuizState {
  questions: Question[];
  userAnswers: Record<number, string>; // QuestionID -> OptionID
  isSubmitted: boolean;
  notes: Record<number, string>;
  wrongCounts: Record<number, number>;
  timeRemaining: number | null; // in seconds
  isTimerPaused: boolean;
  shuffledOrder: number[]; // Array of Question IDs in random order
  activeMode: QuizMode;
  lastScores: { normal: number | null; random: number | null };
}

export const SECTIONS = [1, 2, 3, 4];
export const QUESTIONS_PER_SECTION = 50;
export const QUESTIONS_PER_PAGE = 10;