import React, { useEffect } from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import { QuizMode } from './types';
import QuizView from './components/QuizView';
import InputView from './components/InputView';
import ReviewView from './components/ReviewView';
import GuideView from './components/GuideView';
import HistoryView from './components/HistoryView';
import ResultsModal from './components/ResultsModal';
import Timer from './components/Timer';
import { LayoutList, Shuffle, Edit3, BookOpen, HelpCircle, History, Eye, EyeOff, Send, RotateCcw } from 'lucide-react';

const QuizAppContent: React.FC = () => {
  const [showResults, setShowResults] = React.useState(false);
  const { isSubmitted, questions, activeMode, setActiveMode, isPageChecked, togglePageCheck, submitQuiz, resetQuiz } = useQuiz();

  // Auto show results when submission happens (e.g. via timer)
  useEffect(() => {
    if (isSubmitted) {
      setShowResults(true);
    }
  }, [isSubmitted]);

  const tabs = [
    { id: 'guide', label: 'Guide', icon: HelpCircle },
    { id: 'input', label: 'Input Data', icon: Edit3 },
    { id: 'normal', label: 'Normal Quiz', icon: LayoutList },
    { id: 'random', label: 'Randomized', icon: Shuffle },
    { id: 'review', label: 'Review & Notes', icon: BookOpen },
    { id: 'history', label: 'History', icon: History },
  ];

  const showQuizControls = (activeMode === 'normal' || activeMode === 'random') && questions.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-2 flex-shrink-0 z-10">
             <div className="bg-blue-600 text-white p-2 rounded-lg font-bold text-xl shadow-sm">QM</div>
             <h1 className="text-xl font-bold text-gray-800 hidden md:block tracking-tight">QuizMaster 200</h1>
          </div>

          {/* Center: Controls (Absolute positioned to ensure true center, visible on medium+ screens) */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center gap-3 z-10">
             {showQuizControls && (
                 <>
                    {/* Quick Check Button */}
                    {!isSubmitted && (
                        <button
                            onClick={() => togglePageCheck()}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all shadow-sm font-medium text-sm ${
                                isPageChecked 
                                ? 'bg-indigo-600 text-white border-indigo-700 ring-2 ring-indigo-200' 
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                            title="Toggle Quick Check (/)"
                        >
                            {isPageChecked ? <EyeOff size={18} /> : <Eye size={18} />}
                            <span className="hidden lg:inline">Quick Check</span>
                        </button>
                    )}

                    {/* Submit Button */}
                    {!isSubmitted ? (
                        <button
                            onClick={submitQuiz}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white border border-green-700 hover:bg-green-700 transition-colors shadow-sm font-medium text-sm"
                            title="Submit Quiz"
                        >
                            <Send size={18} />
                            <span className="hidden lg:inline">Submit</span>
                        </button>
                    ) : (
                         <button
                            onClick={() => setShowResults(true)}
                            className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 font-medium hover:bg-blue-100 text-sm transition-colors"
                        >
                            View Score
                        </button>
                    )}

                    {/* Reset Button */}
                    <button
                        onClick={resetQuiz}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm font-medium text-sm"
                        title="Reset Quiz"
                    >
                        <RotateCcw size={18} />
                        <span className="hidden lg:inline">Reset</span>
                    </button>

                    <div className="w-px h-8 bg-gray-200 mx-1"></div>

                    {/* Timer */}
                    <Timer />
                 </>
             )}
          </div>

          {/* Mobile Only Controls (Right aligned) */}
          <div className="flex md:hidden items-center gap-2">
             {showQuizControls && <Timer />}
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 overflow-x-auto scrollbar-hide">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8">
                 {tabs.map(tab => {
                     const Icon = tab.icon;
                     return (
                         <button
                            key={tab.id}
                            onClick={() => setActiveMode(tab.id as QuizMode)}
                            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                                activeMode === tab.id
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                         >
                             <Icon size={18} />
                             {tab.label}
                         </button>
                     )
                 })}
             </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
        {activeMode === 'guide' && <GuideView />}
        {activeMode === 'input' && <InputView />}
        {activeMode === 'normal' && <QuizView mode="normal" />}
        {activeMode === 'random' && <QuizView mode="random" />}
        {activeMode === 'review' && <ReviewView />}
        {activeMode === 'history' && <HistoryView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-500 text-sm font-medium">
                Website created by <span className="text-blue-600 font-bold">Dai-Van Vo</span>.
            </p>
            <p className="text-gray-400 text-xs mt-1">© {new Date().getFullYear()} QuizMaster 200. All rights reserved.</p>
        </div>
      </footer>

      <ResultsModal isOpen={showResults} onClose={() => setShowResults(false)} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QuizProvider>
      <QuizAppContent />
    </QuizProvider>
  );
};

export default App;