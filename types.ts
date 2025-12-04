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

export type QuizMode = 'normal' | 'random' | 'input' | 'review' | 'guide' | 'history' | 'search';

export interface HistoryEntry {
  timestamp: string;
  mode: 'Normal' | 'Random';
  score: number;
  duration: number; // seconds spent
}

// Settings Types
export type FontFamily = 
  | 'Default' 
  | 'Sans-serif' 
  | 'Serif' 
  | 'Monospace' 
  | 'Roboto' 
  | 'Open Sans' 
  | 'Lato' 
  | 'Montserrat' 
  | 'Georgia' 
  | 'Courier New';

export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';
export type ColumnLayout = 'single' | 'double';

export interface AppSettings {
  fontFamily: FontFamily;
  fontSize: FontSize;
  layout: ColumnLayout;
}

export interface QuizModeState {
  userAnswers: Record<number, string>;
  isSubmitted: boolean;
  timeRemaining: number | null;
  initialDuration: number | null; // To calculate time spent
  isTimerPaused: boolean;
  
  // Navigation State
  currentSection: number;
  currentPage: number;
  isPageChecked: boolean;
}

export interface QuizState {
  questions: Question[];
  // These properties now reflect the *active* mode
  userAnswers: Record<number, string>; 
  isSubmitted: boolean;
  timeRemaining: number | null; 
  initialDuration: number | null;
  isTimerPaused: boolean;
  
  currentSection: number;
  currentPage: number;
  isPageChecked: boolean;

  notes: Record<number, string>;
  wrongCounts: Record<number, number>;
  shuffledOrder: number[]; 
  activeMode: QuizMode;
  lastScores: { normal: number | null; random: number | null };
  history: HistoryEntry[];
  
  // App Settings
  settings: AppSettings;

  // Review & Search Features
  pinnedQuestions: number[];
  dismissedReviewIds: number[];
}

export const SECTIONS = [1, 2, 3, 4];
export const QUESTIONS_PER_SECTION = 50;
export const QUESTIONS_PER_PAGE = 10;