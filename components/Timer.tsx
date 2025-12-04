import React, { useEffect, useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { Clock, Pause, Play, RotateCcw } from 'lucide-react';

const Timer: React.FC = () => {
  const { timeRemaining, setTimer, tickTimer, isSubmitted, isTimerPaused, toggleTimerPause, resetQuiz } = useQuiz();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    let interval: any;
    if (timeRemaining !== null && timeRemaining > 0 && !isSubmitted) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeRemaining, isSubmitted, tickTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectTime = (minutes: number) => {
    setTimer(minutes * 60);
    setShowMenu(false);
  };

  const handleEndTest = () => {
    if (window.confirm("Are you sure you want to end the test and reset everything? This will clear all progress.")) {
      resetQuiz();
    }
  };

  const timeOptions = [10, 15, 20, 25, 30, 45, 60];

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <button
          onClick={() => {
              if (timeRemaining === null) setShowMenu(!showMenu);
          }}
          disabled={timeRemaining !== null}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold transition-colors ${
            timeRemaining !== null && timeRemaining < 60 ? 'bg-red-100 text-red-600' : 'bg-white text-gray-700 hover:bg-gray-100'
          } border border-gray-300 shadow-sm disabled:cursor-default`}
        >
          <Clock size={20} />
          {timeRemaining !== null ? formatTime(timeRemaining) : '--:--'}
        </button>

        {showMenu && timeRemaining === null && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="p-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Set Timer</div>
            {timeOptions.map(min => (
              <button
                key={min}
                onClick={() => handleSelectTime(min)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                {min} Minutes
              </button>
            ))}
          </div>
        )}
      </div>

      {timeRemaining !== null && !isSubmitted && (
        <>
          <button
            onClick={toggleTimerPause}
            className="p-2 rounded-lg bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
            title={isTimerPaused ? "Resume" : "Pause"}
          >
            {isTimerPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
          
          <button
             onClick={handleEndTest}
             className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-medium text-sm"
             title="End Test & Reset"
          >
            <RotateCcw size={16} />
            <span className="hidden md:inline">End Test</span>
          </button>
        </>
      )}
    </div>
  );
};

export default Timer;