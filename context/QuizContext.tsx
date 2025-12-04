import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Question, QuizState, QuizMode, QuizModeState } from '../types';

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

const initialModeState: QuizModeState = {
  userAnswers: {},
  isSubmitted: false,
  timeRemaining: null,
  isTimerPaused: false,
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

    // Mark as submitted and freeze timer
    updateActiveState({
      isSubmitted: true,
      isTimerPaused: true // Freeze the timer
    });

  }, [questions, currentState, wrongCounts, activeMode]);

  const resetQuiz = useCallback(() => {
    updateActiveState(initialModeState);
    if (activeMode === 'normal' || activeMode === 'random') {
        setLastScores(prev => ({ ...prev, [activeMode]: null }));
    }
  }, [activeMode]);

  const setTimer = useCallback((seconds: number) => {
    // Setting timer also essentially resets the session for that mode
    updateActiveState({
        ...initialModeState,
        timeRemaining: seconds
    });
    // Also reset score for this mode
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
    // We need to access the state directly in the callback to avoid stale closures if using generic `tickTimer` logic
    // However, since we use `updateActiveState` with a callback, it handles the latest state.
    
    // BUT, we only want to tick if it's the *Active* mode that has the timer running.
    // If we are viewing 'Guide' but 'Normal' has a timer, should it tick?
    // For simplicity, we only tick the active mode's timer.
    
    if (activeMode !== 'normal' && activeMode !== 'random') return;

    updateActiveState(prev => {
        if (prev.timeRemaining === null) return {};
        if (prev.isTimerPaused || prev.isSubmitted) return {}; // Do not tick if paused or submitted

        if (prev.timeRemaining <= 1) {
            // Trigger submit logic needs to be handled outside the reducer or carefully
            // Since we can't call `submitQuiz` easily inside this state setter, we'll use an effect or just set submitted here
            // To ensure consistency, we'll set time to 0 and submitted to true here
            // But we miss the Score Calculation logic if we just set state.
            // Better approach: decrement. If 0, useEffect in component triggers submit?
            // Or just allow tick to 0.
            return { timeRemaining: 0 };
        }
        return { timeRemaining: prev.timeRemaining - 1 };
    });
  }, [activeMode]);

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
      
      // Dynamic values from active state
      userAnswers: currentState.userAnswers,
      isSubmitted: currentState.isSubmitted,
      timeRemaining: currentState.timeRemaining,
      isTimerPaused: currentState.isTimerPaused,

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