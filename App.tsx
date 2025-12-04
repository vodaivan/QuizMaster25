import React, { useEffect } from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import { QuizMode } from './types';
import QuizView from './components/QuizView';
import InputView from './components/InputView';
import ReviewView from './components/ReviewView';
import GuideView from './components/GuideView';
import ResultsModal from './components/ResultsModal';
import Timer from './components/Timer';
import { LayoutList, Shuffle, Edit3, BookOpen, Send, HelpCircle } from 'lucide-react';

const QuizAppContent: React.FC = () => {
  const [showResults, setShowResults] = React.useState(false);
  const { isSubmitted, submitQuiz, questions, activeMode, setActiveMode } = useQuiz();

  // Auto show results when submission happens (e.g. via timer)
  useEffect(() => {
    if (isSubmitted) {
      setShowResults(true);
    }
  }, [isSubmitted]);

  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to submit the quiz?')) {
      submitQuiz();
    }
  };

  const tabs = [
    { id: 'guide', label: 'Guide', icon: HelpCircle },
    { id: 'input', label: 'Input Data', icon: Edit3 },
    { id: 'normal', label: 'Normal Quiz', icon: LayoutList },
    { id: 'random', label: 'Randomized', icon: Shuffle },
    { id: 'review', label: 'Review & Notes', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="bg-blue-600 text-white p-2 rounded-lg font-bold text-xl">QM</div>
             <h1 className="text-xl font-bold text-gray-800 hidden md:block">QuizMaster 200</h1>
          </div>

          <div className="flex items-center gap-4">
             {(activeMode === 'normal' || activeMode === 'random') && questions.length > 0 && (
                 <>
                    <Timer />
                    {!isSubmitted && (
                        <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold shadow-sm transition-transform active:scale-95"
                        >
                        <Send size={18} />
                        <span className="hidden md:inline">Submit Quiz</span>
                        </button>
                    )}
                    {isSubmitted && (
                        <button
                            onClick={() => setShowResults(true)}
                            className="text-blue-600 font-medium hover:underline"
                        >
                            View Score
                        </button>
                    )}
                 </>
             )}
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 overflow-x-auto">
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeMode === 'guide' && <GuideView />}
        {activeMode === 'input' && <InputView />}
        {activeMode === 'normal' && <QuizView mode="normal" />}
        {activeMode === 'random' && <QuizView mode="random" />}
        {activeMode === 'review' && <ReviewView />}
      </main>

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