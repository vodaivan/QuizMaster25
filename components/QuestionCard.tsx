import React, { useMemo } from 'react';
import { Question, Option } from '../types';
import { useQuiz } from '../context/QuizContext';
import { CheckCircle, XCircle } from 'lucide-react';

interface Props {
  question: Question;
  index: number; // Display index (e.g. Question 1, 2, 3...)
  isRandomMode?: boolean;
  isPageChecked?: boolean; // Prop for local quick check
}

const QuestionCard: React.FC<Props> = ({ question, index, isRandomMode = false, isPageChecked = false }) => {
  const { userAnswers, setAnswer, isSubmitted } = useQuiz();
  
  const selectedOptionId = userAnswers[question.id];
  const isCorrect = selectedOptionId === question.correctOptionId;

  // Determine if we should show results (Global submit OR Local page check)
  const showResults = isSubmitted || isPageChecked;

  // Shuffle options if in random mode, but memoize based on the question ID so it doesn't reshuffle on every render
  const displayOptions = useMemo(() => {
    if (!isRandomMode) return question.options;
    // We shuffle the content objects.
    return [...question.options].sort(() => Math.random() - 0.5);
  }, [question.options, isRandomMode]);

  // Static labels for the UI (Always A, B, C, D top to bottom)
  const LABELS = ['A', 'B', 'C', 'D'];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isSubmitted) return;
    
    const key = e.key.toLowerCase();
    let optionIndex = -1;

    // Mapping keys to indices 0-3
    if (['1', 'a', 'z'].includes(key)) optionIndex = 0;
    else if (['2', 'b', 'x'].includes(key)) optionIndex = 1;
    else if (['3', 'c'].includes(key)) optionIndex = 2;
    else if (['4', 'd', 'v'].includes(key)) optionIndex = 3;

    if (optionIndex !== -1 && displayOptions[optionIndex]) {
      setAnswer(question.id, displayOptions[optionIndex].id);
    }
  };

  const getOptionClass = (option: Option) => {
    const baseClass = "flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200";
    
    // Logic for styling based on results
    if (showResults) {
      // If this option is the Correct Answer
      if (option.id === question.correctOptionId) {
        return `${baseClass} bg-green-100 border-green-500 text-green-800 ring-1 ring-green-500`;
      }
      // If this option was selected by user BUT it is NOT the correct answer
      if (option.id === selectedOptionId && selectedOptionId !== question.correctOptionId) {
        return `${baseClass} bg-red-100 border-red-500 text-red-800`;
      }
      // Unselected, incorrect options
      return `${baseClass} border-gray-200 opacity-60`;
    }

    // Normal Selection State (Not Checked yet)
    if (selectedOptionId === option.id) {
      return `${baseClass} bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-500`;
    }

    return `${baseClass} border-gray-200 hover:bg-gray-50 hover:border-gray-300`;
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      data-question-id={question.id}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
          <span className="font-bold text-blue-600 mr-2">Q{index}.</span>
          {question.text}
        </h3>
        {showResults && (
          <div className="flex-shrink-0 ml-4">
            {isCorrect ? (
              <CheckCircle className="text-green-500" size={24} />
            ) : selectedOptionId ? (
              <XCircle className="text-red-500" size={24} />
            ) : null}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {displayOptions.map((option, i) => {
          // In Random Mode, the visual label is based on index (0=A, 1=B...), 
          // but the logic relies on option.id (which carries the original data ID like 'A' from the parsing)
          const visualLabel = isRandomMode ? LABELS[i] : option.id;

          return (
            <label
              key={option.id}
              className={getOptionClass(option)}
            >
              <input
                type="radio"
                name={`q-${question.id}`}
                value={option.id}
                checked={selectedOptionId === option.id}
                onChange={() => setAnswer(question.id, option.id)}
                disabled={isSubmitted}
                className="hidden"
              />
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 font-medium text-sm flex-shrink-0
                ${selectedOptionId === option.id ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 text-gray-500'}
                ${showResults && option.id === question.correctOptionId ? '!border-green-500 !bg-green-500 !text-white' : ''}
                ${showResults && selectedOptionId === option.id && selectedOptionId !== question.correctOptionId ? '!border-red-500 !bg-red-500 !text-white' : ''}
              `}>
                {visualLabel}
              </div>
              <span className="text-sm md:text-base">{option.text}</span>
            </label>
          );
        })}
      </div>
      <div className="text-xs text-gray-300 mt-2 text-right">
        Keys: 1/A/Z, 2/B/X, 3/C, 4/D/V
      </div>
    </div>
  );
};

export default QuestionCard;