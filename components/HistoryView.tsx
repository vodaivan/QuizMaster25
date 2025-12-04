import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { History, Trash2, Clock, Trophy } from 'lucide-react';

const HistoryView: React.FC = () => {
  const { history, clearHistory } = useQuiz();

  const formatDuration = (seconds: number) => {
    if (seconds <= 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <History className="text-blue-600" />
          Attempt History
        </h2>
        {history.length > 0 && (
            <button 
                onClick={clearHistory}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
            >
                <Trash2 size={16} /> Clear History
            </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No attempts recorded yet.</p>
          <p className="text-sm">Submit a quiz to see your history here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium">Date & Time</th>
                <th className="px-4 py-3 font-medium">Mode</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Score (0-10)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((entry, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-700">{entry.timestamp}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${entry.mode === 'Normal' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {entry.mode}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 flex items-center gap-1">
                      <Clock size={14} className="text-gray-400" /> {formatDuration(entry.duration)}
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900">
                      <span className={`flex items-center gap-1 ${entry.score >= 5 ? 'text-green-600' : 'text-red-500'}`}>
                        {entry.score >= 9 && <Trophy size={14} />}
                        {entry.score}
                      </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryView;