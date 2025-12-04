import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Question, QuizState, QuizMode, QuizModeState, HistoryEntry, QUESTIONS_PER_PAGE, QUESTIONS_PER_SECTION } from '../types';

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
  clearHistory: () => void;

  // Navigation Setters
  setCurrentSection: (section: number) => void;
  setCurrentPage: (page: number) => void;
  togglePageCheck: (force?: boolean) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_NOTES = 'quiz_notes';
const LOCAL_STORAGE_KEY_WRONG = 'quiz_wrong_counts';
const LOCAL_STORAGE_KEY_DATA = 'quiz_data';
const LOCAL_STORAGE_KEY_HISTORY = 'quiz_history';

const initialModeState: QuizModeState = {
  userAnswers: {},
  isSubmitted: false,
  timeRemaining: null,
  initialDuration: null,
  isTimerPaused: false,
  currentSection: 1,
  currentPage: 1,
  isPageChecked: false,
};

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions, setQuestionsState] = useState<Question[]>([]);
  
  // Separate states for Normal and Random modes
  const [normalState, setNormalState] = useState<QuizModeState>(initialModeState);
  const [randomState, setRandomState] = useState<QuizModeState>(initialModeState);
  
  const [notes, setNotesState] = useState<Record<number, string>>({});
  const [wrongCounts, setWrongCounts] = useState<Record<number, number>>({});
  const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);
  const [activeMode, setActiveModeState] = useState<QuizMode>('guide');
  const [lastScores, setLastScores] = useState<{ normal: number | null; random: number | null }>({ normal: null, random: null });
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load persistence
  useEffect(() => {
    const savedNotes = localStorage.getItem(LOCAL_STORAGE_KEY_NOTES);
    const savedWrong = localStorage.getItem(LOCAL_STORAGE_KEY_WRONG);
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY_DATA);
    const savedHistory = localStorage.getItem(LOCAL_STORAGE_KEY_HISTORY);

    if (savedNotes) setNotesState(JSON.parse(savedNotes));
    if (savedWrong) setWrongCounts(JSON.parse(savedWrong));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedData) {
        const parsed = JSON.parse(savedData);
        setQuestionsState(parsed);
        setShuffledOrder(parsed.map((q: Question) => q.id).sort(() => Math.random() - 0.5));
        if (parsed.length > 0) setActiveModeState('normal');
    }
  }, []);

  const setQuestions = useCallback((qs: Question[]) => {
    setQuestionsState(qs);
    setShuffledOrder(qs.map(q => q.id).sort(() => Math.random() - 0.5));
    localStorage.setItem(LOCAL_STORAGE_KEY_DATA, JSON.stringify(qs));
    // Reset both states when new questions load
    setNormalState(initialModeState);
    setRandomState(initialModeState);
  }, []);

  // Helper to update active state
  const updateActiveState = (update: Partial<QuizModeState> | ((prev: QuizModeState) => Partial<QuizModeState>)) => {
    if (activeMode === 'normal') {
      setNormalState(prev => ({ ...prev, ...(typeof update === 'function' ? update(prev) : update) }));
    } else if (activeMode === 'random') {
      setRandomState(prev => ({ ...prev, ...(typeof update === 'function' ? update(prev) : update) }));
    }
  };

  const getActiveState = (): QuizModeState => {
    if (activeMode === 'random') return randomState;
    if (activeMode === 'normal') return normalState;
    return initialModeState; // Fallback for other tabs
  };

  const currentState = getActiveState();

  const setActiveMode = useCallback((mode: QuizMode) => {
    setActiveModeState(mode);
  }, []);

  // Navigation Logic
  const setCurrentSection = useCallback((section: number) => {
    // Reset page to 1 and uncheck page when switching section
    updateActiveState({ currentSection: section, currentPage: 1, isPageChecked: false });
  }, [activeMode]);

  const setCurrentPage = useCallback((page: number) => {
    // Uncheck page when switching page
    updateActiveState({ currentPage: page, isPageChecked: false });
  }, [activeMode]);

  const togglePageCheck = useCallback((force?: boolean) => {
    updateActiveState(prev => ({ 
        isPageChecked: force !== undefined ? force : !prev.isPageChecked 
    }));
  }, [activeMode]);


  const randomizeQuestions = useCallback(() => {
    setShuffledOrder(prev => [...prev].sort(() => Math.random() - 0.5));
    // Only reset random state
    setRandomState(initialModeState);
    setLastScores(prev => ({ ...prev, random: null }));
  }, []);

  const setAnswer = useCallback((qId: number, oId: string) => {
    if (currentState.isSubmitted) return;
    updateActiveState(prev => ({
      userAnswers: { ...prev.userAnswers, [qId]: oId }
    }));
  }, [activeMode, currentState.isSubmitted]);

  const setNote = useCallback((qId: number, note: string) => {
    const newNotes = { ...notes, [qId]: note };
    setNotesState(newNotes);
    localStorage.setItem(LOCAL_STORAGE_KEY_NOTES, JSON.stringify(newNotes));
  }, [notes]);

  const submitQuiz = useCallback(() => {
    if (questions.length === 0) return;
    if (activeMode !== 'normal' && activeMode !== 'random') return;

    const currentAnswers = currentState.userAnswers;

    // Calculate score
    let correctCount = 0;
    questions.forEach(q => {
      if (currentAnswers[q.id] === q.correctOptionId) {
        correctCount++;
      }
    });

    const finalScore = parseFloat(((correctCount / 200) * 10).toFixed(2));

    setLastScores(prev => ({
      ...prev,
      [activeMode]: correctCount
    }));

    // Update wrong counts global stats
    const newWrongCounts = { ...wrongCounts };
    questions.forEach(q => {
      const userAnswer = currentAnswers[q.id];
      if (userAnswer && userAnswer !== q.correctOptionId) {
        newWrongCounts[q.id] = (newWrongCounts[q.id] || 0) + 1;
      }
    });
    setWrongCounts(newWrongCounts);
    localStorage.setItem(LOCAL_STORAGE_KEY_WRONG, JSON.stringify(newWrongCounts));

    // Save History
    const durationSpent = currentState.initialDuration && currentState.timeRemaining !== null 
        ? currentState.initialDuration - currentState.timeRemaining 
        : 0;

    const newHistoryEntry: HistoryEntry = {
        timestamp: new Date().toLocaleString(),
        mode: activeMode === 'normal' ? 'Normal' : 'Random',
        score: finalScore,
        duration: durationSpent
    };

    setHistory(prev => {
        const updated = [newHistoryEntry, ...prev].slice(0, 10); // Keep last 10
        localStorage.setItem(LOCAL_STORAGE_KEY_HISTORY, JSON.stringify(updated));
        return updated;
    });

    // Mark as submitted and freeze timer
    updateActiveState({
      isSubmitted: true,
      isTimerPaused: true,
      isPageChecked: false // Turn off quick check highlights as global submit overrides them
    });

  }, [questions, currentState, wrongCounts, activeMode]);

  const resetQuiz = useCallback(() => {
    updateActiveState(initialModeState);
    if (activeMode === 'normal' || activeMode === 'random') {
        setLastScores(prev => ({ ...prev, [activeMode]: null }));
    }
  }, [activeMode]);

  const setTimer = useCallback((seconds: number) => {
    updateActiveState({
        ...initialModeState,
        timeRemaining: seconds,
        initialDuration: seconds,
        isTimerPaused: false
    });
    if (activeMode === 'normal' || activeMode === 'random') {
        setLastScores(prev => ({ ...prev, [activeMode]: null }));
    }
  }, [activeMode]);

  const toggleTimerPause = useCallback(() => {
    if (currentState.timeRemaining !== null && !currentState.isSubmitted) {
      updateActiveState(prev => ({ isTimerPaused: !prev.isTimerPaused }));
    }
  }, [currentState.timeRemaining, currentState.isSubmitted, activeMode]);

  const tickTimer = useCallback(() => {
    if (activeMode !== 'normal' && activeMode !== 'random') return;

    updateActiveState(prev => {
        if (prev.timeRemaining === null) return {};
        if (prev.isTimerPaused || prev.isSubmitted) return {};

        if (prev.timeRemaining <= 1) {
            return { timeRemaining: 0 };
        }
        return { timeRemaining: prev.timeRemaining - 1 };
    });
  }, [activeMode]);

  const clearHistory = useCallback(() => {
      setHistory([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY_HISTORY);
  }, []);

  // Handle auto-submit when timer hits 0
  useEffect(() => {
      if ((activeMode === 'normal' || activeMode === 'random') && 
          currentState.timeRemaining === 0 && 
          !currentState.isSubmitted) {
          submitQuiz();
      }
  }, [currentState.timeRemaining, currentState.isSubmitted, activeMode, submitQuiz]);


  return (
    <QuizContext.Provider value={{
      questions,
      notes,
      wrongCounts,
      shuffledOrder,
      activeMode,
      lastScores,
      history,
      
      // Dynamic values from active state
      userAnswers: currentState.userAnswers,
      isSubmitted: currentState.isSubmitted,
      timeRemaining: currentState.timeRemaining,
      initialDuration: currentState.initialDuration,
      isTimerPaused: currentState.isTimerPaused,
      currentSection: currentState.currentSection,
      currentPage: currentState.currentPage,
      isPageChecked: currentState.isPageChecked,

      setQuestions,
      setAnswer,
      submitQuiz,
      resetQuiz,
      setNote,
      setTimer,
      toggleTimerPause,
      tickTimer,
      randomizeQuestions,
      setActiveMode,
      clearHistory,
      setCurrentSection,
      setCurrentPage,
      togglePageCheck
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