import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { SECTIONS, QUESTIONS_PER_SECTION } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ResultsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { questions, userAnswers, resetQuiz, lastScores } = useQuiz();

  if (!isOpen) return null;

  // Calculate scores per section
  const data = SECTIONS.map(section => {
    const sectionQuestions = questions.filter(q => q.section === section);
    let correct = 0;
    sectionQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correctOptionId) correct++;
    });
    
    // Formula: (Correct / 50) * 10
    const score = (correct / QUESTIONS_PER_SECTION) * 10;
    return {
      name: `Section ${section}`,
      score: parseFloat(score.toFixed(1)),
      correct,
      total: QUESTIONS_PER_SECTION
    };
  });

  const totalCorrect = data.reduce((acc, curr) => acc + curr.correct, 0);
  const totalScore = parseFloat(((totalCorrect / 200) * 10).toFixed(2));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-800">Quiz Results</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-8">
            <p className="text-gray-500 font-medium uppercase tracking-wider text-sm">Overall Score</p>
            <div className="text-5xl font-extrabold text-blue-600 mt-2">{totalScore} <span className="text-2xl text-gray-400">/ 10</span></div>
            <p className="text-gray-600 mt-2">Correct Answers: {totalCorrect} / 200</p>
            
            <div className="mt-4 grid grid-cols-2 gap-4 max-w-sm mx-auto text-sm">
                <div className="bg-blue-50 p-2 rounded border border-blue-100">
                    <span className="block text-gray-500 text-xs uppercase">Normal (p)</span>
                    <span className="font-bold text-blue-700">{lastScores.normal !== null ? lastScores.normal : '-'}</span> correct
                </div>
                <div className="bg-purple-50 p-2 rounded border border-purple-100">
                    <span className="block text-gray-500 text-xs uppercase">Random (q)</span>
                    <span className="font-bold text-purple-700">{lastScores.random !== null ? lastScores.random : '-'}</span> correct
                </div>
            </div>
          </div>

          <div className="h-64 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} hide />
                <Tooltip 
                    cursor={{fill: '#f3f4f6'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score >= 5 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {data.map((sec, i) => (
                 <div key={i} className="bg-gray-50 p-3 rounded-lg flex flex-col items-center justify-center text-center">
                     <span className="text-sm font-medium text-gray-600 uppercase mb-1">{sec.name}</span>
                     <span className={`text-xl font-bold ${sec.score >= 5 ? 'text-green-600' : 'text-red-500'}`}>
                         {sec.score} / 10
                     </span>
                 </div>
             ))}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Review Answers
          </button>
          <button 
            onClick={() => {
                resetQuiz();
                onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;