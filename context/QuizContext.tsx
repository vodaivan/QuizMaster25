import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Question, QuizState, QuizMode } from '../types';

interface QuizContextType extends QuizState {
  setQuestions: (questions: Question[]) => void;
  setAnswer: (questionId: number, optionId: string) => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  setNote: (questionId: number, note: string) => void;
  setTimer: (seconds: number) => void;
  toggleTimerPause: () => void;
  tickTimer: () => void;
  randomizeQuestions: () => void;
  setActiveMode: (mode: QuizMode) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_NOTES = 'quiz_notes';
const LOCAL_STORAGE_KEY_WRONG = 'quiz_wrong_counts';
const LOCAL_STORAGE_KEY_DATA = 'quiz_data';

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions, setQuestionsState] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [notes, setNotesState] = useState<Record<number, string>>({});
  const [wrongCounts, setWrongCounts] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);
  const [activeMode, setActiveMode] = useState<QuizMode>('guide'); // Default to guide or input if empty
  const [lastScores, setLastScores] = useState<{ normal: number | null; random: number | null }>({ normal: null, random: null });

  // Load persistence
  useEffect(() => {
    const savedNotes = localStorage.getItem(LOCAL_STORAGE_KEY_NOTES);
    const savedWrong = localStorage.getItem(LOCAL_STORAGE_KEY_WRONG);
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY_DATA);

    if (savedNotes) setNotesState(JSON.parse(savedNotes));
    if (savedWrong) setWrongCounts(JSON.parse(savedWrong));
    if (savedData) {
        const parsed = JSON.parse(savedData);
        setQuestionsState(parsed);
        setShuffledOrder(parsed.map((q: Question) => q.id).sort(() => Math.random() - 0.5));
        if (parsed.length > 0) setActiveMode('normal');
    }
  }, []);

  const setQuestions = useCallback((qs: Question[]) => {
    setQuestionsState(qs);
    // Initialize shuffle
    setShuffledOrder(qs.map(q => q.id).sort(() => Math.random() - 0.5));
    localStorage.setItem(LOCAL_STORAGE_KEY_DATA, JSON.stringify(qs));
  }, []);

  const randomizeQuestions = useCallback(() => {
    setShuffledOrder(prev => [...prev].sort(() => Math.random() - 0.5));
    if (!isSubmitted) {
      setUserAnswers({});
    }
  }, [isSubmitted]);

  const setAnswer = useCallback((qId: number, oId: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: oId }));
  }, [isSubmitted]);

  const setNote = useCallback((qId: number, note: string) => {
    const newNotes = { ...notes, [qId]: note };
    setNotesState(newNotes);
    localStorage.setItem(LOCAL_STORAGE_KEY_NOTES, JSON.stringify(newNotes));
  }, [notes]);

  const submitQuiz = useCallback(() => {
    if (questions.length === 0) return;

    // Calculate score for p (Normal) or q (Random)
    let correctCount = 0;
    questions.forEach(q => {
      // Use global userAnswers state
      if (userAnswers[q.id] === q.correctOptionId) {
        correctCount++;
      }
    });

    setLastScores(prev => ({
      ...prev,
      [activeMode === 'random' ? 'random' : 'normal']: correctCount
    }));

    setIsSubmitted(true);
    setIsTimerPaused(true); // Stop timer on submit
    setTimeRemaining(null);

    // Calculate wrong answers and update stats
    const newWrongCounts = { ...wrongCounts };
    questions.forEach(q => {
      const userAnswer = userAnswers[q.id];
      // Only count wrong if answered and incorrect.
      if (userAnswer && userAnswer !== q.correctOptionId) {
        newWrongCounts[q.id] = (newWrongCounts[q.id] || 0) + 1;
      }
    });
    setWrongCounts(newWrongCounts);
    localStorage.setItem(LOCAL_STORAGE_KEY_WRONG, JSON.stringify(newWrongCounts));
  }, [questions, userAnswers, wrongCounts, activeMode]);

  const resetQuiz = useCallback(() => {
    setIsSubmitted(false);
    setUserAnswers({});
    setTimeRemaining(null);
    setIsTimerPaused(false);
    setLastScores({ normal: null, random: null }); // Reset scores
  }, []);

  const setTimer = useCallback((seconds: number) => {
    setTimeRemaining(seconds);
    setIsSubmitted(false);
    setIsTimerPaused(false);
    setUserAnswers({});
    setLastScores({ normal: null, random: null });
  }, []);

  const toggleTimerPause = useCallback(() => {
    if (timeRemaining !== null && !isSubmitted) {
      setIsTimerPaused(prev => !prev);
    }
  }, [timeRemaining, isSubmitted]);

  const tickTimer = useCallback(() => {
    setTimeRemaining(prev => {
      if (prev === null) return null;
      if (isTimerPaused) return prev; // Do not decrement if paused

      if (prev <= 1) {
        submitQuiz();
        return 0;
      }
      return prev - 1;
    });
  }, [submitQuiz, isTimerPaused]);

  return (
    <QuizContext.Provider value={{
      questions,
      userAnswers,
      isSubmitted,
      notes,
      wrongCounts,
      timeRemaining,
      isTimerPaused,
      shuffledOrder,
      activeMode,
      lastScores,
      setQuestions,
      setAnswer,
      submitQuiz,
      resetQuiz,
      setNote,
      setTimer,
      toggleTimerPause,
      tickTimer,
      randomizeQuestions,
      setActiveMode
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within a QuizProvider');
  return context;
};