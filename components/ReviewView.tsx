import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { SECTIONS, QUESTIONS_PER_SECTION } from '../types';
import { BookOpen, AlertCircle, Save, Download, Pin, PinOff, Trash2, RotateCcw } from 'lucide-react';

const ReviewView: React.FC = () => {
  const { 
      questions, 
      userAnswers, 
      notes, 
      setNote, 
      wrongCounts, 
      isSubmitted, 
      pinnedQuestions, 
      togglePinQuestion, 
      removeReviewQuestion, 
      clearAllReview,
      dismissedReviewIds
  } = useQuiz();
  
  const [activeSection, setActiveSection] = useState(1);
  const [localNotes, setLocalNotes] = useState<Record<number, string>>({});

  // Filter valid review questions
  const allReviewableQuestions = questions.filter(q => {
    // If dismissed, skip
    if (dismissedReviewIds.includes(q.id)) return false;

    // Condition 1: Answered wrong in history
    const isHistoricallyWrong = (wrongCounts[q.id] || 0) > 0;
    
    // Condition 2: Current session wrong
    const isCurrentWrong = isSubmitted && 
                           userAnswers[q.id] !== undefined && 
                           userAnswers[q.id] !== q.correctOptionId;

    // Condition 3: Has note
    const hasNote = !!notes[q.id];

    // Condition 4: Is Pinned
    const isPinned = pinnedQuestions.includes(q.id);

    return isHistoricallyWrong || isCurrentWrong || hasNote || isPinned;
  });

  const pinnedList = allReviewableQuestions.filter(q => pinnedQuestions.includes(q.id));
  const sectionList = allReviewableQuestions.filter(q => !pinnedQuestions.includes(q.id) && q.section === activeSection);

  const handleNoteChange = (qId: number, val: string) => {
    setLocalNotes(prev => ({ ...prev, [qId]: val }));
  };

  const saveNote = (qId: number) => {
    if (localNotes[qId] !== undefined) {
      setNote(qId, localNotes[qId]);
    }
  };

  const exportNotesToTxt = () => {
      if (allReviewableQuestions.length === 0) {
          alert("No notes or wrong answers to export.");
          return;
      }

      let content = "QUIZ REVIEW & NOTES\n";
      content += `Date: ${new Date().toLocaleString()}\n`;
      content += "====================================\n\n";

      allReviewableQuestions.forEach(q => {
          content += `Question ${q.id}: ${q.text}\n`;
          content += `Correct Answer: ${q.correctOptionId}\n`;
          
          if (userAnswers[q.id] && userAnswers[q.id] !== q.correctOptionId) {
              content += `Your Last Answer: ${userAnswers[q.id]} (WRONG)\n`;
          }
          
          if (notes[q.id]) {
              content += `Your Note: ${notes[q.id]}\n`;
          }
          content += "\n------------------------------------\n\n";
      });

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const dateStr = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
      a.download = `review_notes_${dateStr}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const QuestionItem = ({ q }: { q: any }) => {
    const wrongCount = wrongCounts[q.id] || 0;
    const currentNote = localNotes[q.id] !== undefined ? localNotes[q.id] : (notes[q.id] || '');
    const userAnswer = userAnswers[q.id];
    const isPinned = pinnedQuestions.includes(q.id);

    return (
        <div className={`bg-white rounded-xl shadow-sm border p-6 relative transition-all ${isPinned ? 'border-amber-300 ring-1 ring-amber-200' : 'border-gray-200'}`}>
            <div className="absolute top-4 right-4 flex gap-2">
                <button 
                    onClick={() => togglePinQuestion(q.id)}
                    className={`p-1.5 rounded-full transition-colors ${isPinned ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                    title={isPinned ? "Unpin" : "Pin to top"}
                >
                    {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
                </button>
                <button 
                    onClick={() => removeReviewQuestion(q.id)}
                    className="p-1.5 rounded-full bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                    title="Remove from Review"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="flex justify-between items-start mb-4 pr-20">
                <h4 className="text-lg font-medium text-gray-900">
                <span className="text-amber-600 font-bold mr-2">Q{q.id}.</span>
                {q.text}
                </h4>
                {wrongCount > 0 && (
                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold whitespace-nowrap ml-2">
                    Wrong {wrongCount}x
                </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {q.options.map((opt: any) => (
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
  };

  if (questions.length === 0) return <div className="text-center py-10">No questions loaded.</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
         <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 px-4 py-3 rounded-xl w-full md:w-auto">
            <AlertCircle className="text-amber-600 flex-shrink-0" />
            <div>
                <h3 className="font-bold text-amber-800 leading-none">Review Mode</h3>
                <p className="text-xs text-amber-700 mt-1">
                    {allReviewableQuestions.length} questions to review
                </p>
            </div>
         </div>
         
         <div className="flex gap-2 w-full md:w-auto">
             <button 
                onClick={clearAllReview}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
            >
                <Trash2 size={16} /> Clear All
            </button>
            <button 
                onClick={exportNotesToTxt}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm text-sm font-medium"
            >
                <Download size={16} /> Save Notes
            </button>
         </div>
      </div>

      {/* Pinned Section */}
      {pinnedList.length > 0 && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Pin size={14} className="text-amber-500" /> Pinned Questions
              </h3>
              <div className="space-y-6">
                  {pinnedList.map(q => <QuestionItem key={`pin-${q.id}`} q={q} />)}
              </div>
              <div className="h-px bg-gray-200 my-8"></div>
          </div>
      )}

      {/* Section Tabs */}
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
            Q{(sec - 1) * QUESTIONS_PER_SECTION + 1}-{sec * QUESTIONS_PER_SECTION}
          </button>
        ))}
      </div>

      {/* Standard List */}
      {sectionList.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
          <BookOpen className="mx-auto text-gray-300 mb-2" size={48} />
          <p className="text-gray-500">No review items in this section.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sectionList.map(q => <QuestionItem key={q.id} q={q} />)}
        </div>
      )}
    </div>
  );
};

export default ReviewView;