import React, { useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';
import QuestionCard from './QuestionCard';
import { SECTIONS, QUESTIONS_PER_SECTION, QUESTIONS_PER_PAGE } from '../types';
import { RefreshCw, ArrowLeft, ArrowRight, Eye, EyeOff, Send } from 'lucide-react';

interface Props {
  mode: 'normal' | 'random';
}

const QuizView: React.FC<Props> = ({ mode }) => {
  const { 
      questions, 
      shuffledOrder, 
      randomizeQuestions, 
      isSubmitted, 
      userAnswers, 
      submitQuiz,
      currentSection,
      currentPage,
      setCurrentSection,
      setCurrentPage,
      isPageChecked,
      togglePageCheck,
      settings
  } = useQuiz();

  // Keyboard shortcuts for Navigation and Actions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        // Ignore shortcuts if user is typing in a note or input
        const target = e.target as HTMLElement;
        if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') return;

        const key = e.key.toLowerCase();

        // Quick Check (/)
        if (key === '/') {
            e.preventDefault(); 
            if (!isSubmitted) {
                togglePageCheck();
            }
        }

        // Page Navigation (Comma / Period)
        if (key === ',') {
            setCurrentPage(Math.max(1, currentPage - 1));
        }
        if (key === '.') {
            setCurrentPage(Math.min(5, currentPage + 1));
        }

        // Section Navigation (Brackets)
        if (key === '[') {
             setCurrentSection(Math.max(1, currentSection - 1));
        }
        if (key === ']') {
             setCurrentSection(Math.min(4, currentSection + 1));
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, togglePageCheck, currentPage, currentSection, setCurrentPage, setCurrentSection]);

  const handleSubmit = () => {
    submitQuiz();
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-xl">No questions loaded.</p>
        <p>Please go to the "Input" tab to add questions.</p>
      </div>
    );
  }

  // Determine which questions to show
  const getQuestionsForCurrentView = () => {
    const startIndex = (currentSection - 1) * QUESTIONS_PER_SECTION;
    const endIndex = startIndex + QUESTIONS_PER_SECTION;
    
    let sectionQuestionIds: number[] = [];

    if (mode === 'normal') {
      // Filter questions belonging to this section (assuming they are sorted)
      sectionQuestionIds = questions
        .filter(q => q.section === currentSection)
        .map(q => q.id);
    } else {
      // Take slice from shuffled order
      sectionQuestionIds = shuffledOrder.slice(startIndex, endIndex);
    }

    // Now paginate within the section
    const pageStartIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
    const pageEndIndex = pageStartIndex + QUESTIONS_PER_PAGE;
    const pageIds = sectionQuestionIds.slice(pageStartIndex, pageEndIndex);

    return pageIds.map(id => questions.find(q => q.id === id)!);
  };

  const currentQuestions = getQuestionsForCurrentView();

  // Calculate local page score for Quick Check display
  const calculatePageScore = () => {
      let score = 0;
      currentQuestions.forEach(q => {
          if (userAnswers[q.id] === q.correctOptionId) {
              score++;
          }
      });
      return score;
  };

  const NavigationControls = () => (
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
           {/* Section Tabs */}
           <div className="flex space-x-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {SECTIONS.map(sec => (
              <button
                key={sec}
                onClick={() => setCurrentSection(sec)}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  currentSection === sec
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Sec {sec}
              </button>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2">
            <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-gray-200"
                title="Shortcut: comma (,)"
            >
                <ArrowLeft size={18} />
            </button>
            {[1, 2, 3, 4, 5].map(p => (
                <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-md text-sm font-bold transition-all ${
                        currentPage === p 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    {p}
                </button>
            ))}
             <button 
                disabled={currentPage === 5}
                onClick={() => setCurrentPage(Math.min(5, currentPage + 1))}
                className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-gray-200"
                title="Shortcut: period (.)"
            >
                <ArrowRight size={18} />
            </button>
        </div>
      </div>
  );

  const ActionButtons = () => (
    <div className="flex items-center gap-3">
        {!isSubmitted ? (
            <>
                {/* Quick Check Button */}
                {!isPageChecked ? (
                    <button
                        onClick={() => togglePageCheck(true)}
                        className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-md transition-colors font-medium border border-indigo-200"
                        title="Shortcut: /"
                    >
                        <Eye size={16} /> Quick Check
                    </button>
                ) : (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => togglePageCheck(false)}
                            className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition-colors font-medium border border-gray-300"
                            title="Shortcut: /"
                        >
                            <EyeOff size={16} /> Hide Answers
                        </button>
                        <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-2 rounded border border-indigo-100">
                            Page Score: {calculatePageScore()} / 10
                        </span>
                    </div>
                )}
                
                {/* Local Submit Button */}
                    <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 text-sm text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded-md transition-colors font-medium shadow-sm"
                >
                    <Send size={16} /> Submit
                </button>
            </>
        ) : (
            <div className="text-green-700 font-bold bg-green-50 px-3 py-2 rounded border border-green-200 text-sm">
                Quiz Submitted
            </div>
        )}
    </div>
  );

  // Layout Logic
  const gridClass = settings.layout === 'double' 
    ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
    : 'flex flex-col space-y-6';

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Top Control Bar */}
      <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur-sm pt-4 pb-4 border-b border-gray-200 mb-6 shadow-sm">
        <NavigationControls />
        
        {/* Additional Tools Bar */}
        <div className="flex flex-wrap justify-between items-center gap-3 mt-4 px-1">
             <ActionButtons />

             {mode === 'random' && !isSubmitted && (
                <button
                onClick={() => {
                    randomizeQuestions();
                    setCurrentSection(1);
                    setCurrentPage(1);
                }}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-2 rounded-md transition-colors"
                >
                <RefreshCw size={16} /> Reset Random
                </button>
            )}
        </div>
      </div>

      {/* Question List */}
      <div className={gridClass}>
        {currentQuestions.map((q, idx) => {
            const globalIndex = ((currentSection - 1) * 50) + ((currentPage - 1) * 10) + idx + 1;
            return (
                <QuestionCard 
                    key={q.id} 
                    question={q} 
                    index={globalIndex}
                    isRandomMode={mode === 'random'}
                    isPageChecked={isPageChecked}
                />
            );
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
        <NavigationControls />
        <div className="flex justify-end">
            <ActionButtons />
        </div>
      </div>
    </div>
  );
};

export default QuizView;