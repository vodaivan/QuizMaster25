import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { SECTIONS, QUESTIONS_PER_SECTION } from '../types';
import { BookOpen, AlertCircle, Save } from 'lucide-react';

const ReviewView: React.FC = () => {
  const { questions, userAnswers, notes, setNote, wrongCounts, isSubmitted } = useQuiz();
  const [activeSection, setActiveSection] = useState(1);
  const [localNotes, setLocalNotes] = useState<Record<number, string>>({});

  // Get questions that are either wrong OR have a note, within current section
  const reviewableQuestions = questions.filter(q => {
    // Check section
    if (q.section !== activeSection) return false;

    // Condition 1: Answered wrong in history
    const isHistoricallyWrong = (wrongCounts[q.id] || 0) > 0;
    
    // Condition 2: Current session wrong
    // Requirement: "Only results from the final submission... Do NOT include questions with no answer selected."
    const isCurrentWrong = isSubmitted && 
                           userAnswers[q.id] !== undefined && // Must have an answer
                           userAnswers[q.id] !== q.correctOptionId; // Must be wrong

    // Condition 3: Has note
    const hasNote = !!notes[q.id];

    return isHistoricallyWrong || isCurrentWrong || hasNote;
  });

  const handleNoteChange = (qId: number, val: string) => {
    setLocalNotes(prev => ({ ...prev, [qId]: val }));
  };

  const saveNote = (qId: number) => {
    if (localNotes[qId] !== undefined) {
      setNote(qId, localNotes[qId]);
    }
  };

  if (questions.length === 0) return <div className="text-center py-10">No questions loaded.</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-6 flex items-start gap-3">
        <AlertCircle className="text-amber-600 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-amber-800">Review Mode</h3>
          <p className="text-sm text-amber-700">
            Showing questions from Section {activeSection} that you have answered incorrectly (and selected an answer for) or have attached notes to.
          </p>
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto mb-6 pb-2 scrollbar-hide">
        {SECTIONS.map(sec => (
          <button
            key={sec}
            onClick={() => setActiveSection(sec)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeSection === sec
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Review: Q{(sec - 1) * QUESTIONS_PER_SECTION + 1}-{sec * QUESTIONS_PER_SECTION}
          </button>
        ))}
      </div>

      {reviewableQuestions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
          <BookOpen className="mx-auto text-gray-300 mb-2" size={48} />
          <p className="text-gray-500">No review items for this section.</p>
          <p className="text-sm text-gray-400">Either you haven't submitted wrong answers yet, or you haven't taken notes.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviewableQuestions.map(q => {
            const wrongCount = wrongCounts[q.id] || 0;
            const currentNote = localNotes[q.id] !== undefined ? localNotes[q.id] : (notes[q.id] || '');
            const userAnswer = userAnswers[q.id];

            return (
              <div key={q.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    <span className="text-amber-600 font-bold mr-2">Q{q.id}.</span>
                    {q.text}
                  </h4>
                  {wrongCount > 0 && (
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold whitespace-nowrap">
                      Wrong {wrongCount}x
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {q.options.map(opt => (
                        <div key={opt.id} className={`p-2 rounded text-sm border ${
                            opt.id === q.correctOptionId 
                            ? 'bg-green-50 border-green-200 text-green-800 font-medium' 
                            : userAnswer === opt.id 
                                ? 'bg-red-50 border-red-200 text-red-800' // Show user's wrong answer if selected
                                : 'bg-gray-50 border-gray-100 text-gray-500'
                        }`}>
                            <span className="font-bold mr-2">{opt.id}.</span> {opt.text}
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    My Notes
                  </label>
                  <div className="flex gap-2">
                    <textarea
                      value={currentNote}
                      onChange={(e) => handleNoteChange(q.id, e.target.value)}
                      placeholder="Add a memory aid or explanation here..."
                      className="flex-1 p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[80px]"
                    />
                    <button
                      onClick={() => saveNote(q.id)}
                      className="self-end p-2 bg-gray-100 text-gray-600 hover:bg-amber-100 hover:text-amber-700 rounded-lg transition-colors"
                      title="Save Note"
                    >
                      <Save size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewView;