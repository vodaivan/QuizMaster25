import React, { useState, useMemo } from 'react';
import { useQuiz } from '../context/QuizContext';
import { Search as SearchIcon, AlertCircle } from 'lucide-react';
import { Question } from '../types';

const SearchView: React.FC = () => {
  const { questions } = useQuiz();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim() || questions.length === 0) return [];

    const lowerQuery = query.toLowerCase().trim();
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 0);

    return questions.map(q => {
        const text = q.text.toLowerCase();
        let score = 0;

        // Exact phrase match (Highest Priority)
        if (text.includes(lowerQuery)) {
            score += 100;
        }

        // Word matching
        let matchedWords = 0;
        queryWords.forEach(word => {
            if (text.includes(word)) {
                matchedWords++;
            }
        });

        if (matchedWords === queryWords.length && queryWords.length > 1) {
             score += 50; // All words present but maybe scattered
        } else if (matchedWords > 0) {
             score += (matchedWords / queryWords.length) * 30; // Partial match score
        }

        return { question: q, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score); // Sort by score descending

  }, [query, questions]);

  const ResultCard = ({ q }: { q: Question }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
                <span className="font-bold text-blue-600 mr-2">Q{q.id}.</span>
                {q.text}
            </h3>
        </div>
        <div className="pl-8 space-y-1 text-sm">
            {q.options.map(opt => (
                <div key={opt.id} className={`flex items-start gap-2 ${opt.id === q.correctOptionId ? 'text-green-700 font-bold' : 'text-gray-600'}`}>
                    <span className="w-5">{opt.id}.</span>
                    <span>{opt.text}</span>
                </div>
            ))}
        </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
           <SearchIcon className="text-blue-600" /> Search Questions
        </h2>
        
        <div className="relative">
            <input 
                type="text" 
                className="w-full p-4 pl-12 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="Type keywords to search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
        </div>
      </div>

      <div className="space-y-6">
          {query.trim() && results.length === 0 && (
              <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                  <AlertCircle className="mx-auto mb-2 opacity-50" size={32} />
                  <p>No matches found for "{query}"</p>
              </div>
          )}

          {results.length > 0 && (
              <>
                  <p className="text-sm text-gray-500 font-medium px-1">Found {results.length} results</p>
                  {results.map(({ question }) => (
                      <ResultCard key={question.id} q={question} />
                  ))}
              </>
          )}

          {!query.trim() && (
              <div className="text-center py-20 text-gray-400">
                  <SearchIcon className="mx-auto mb-4 opacity-20" size={64} />
                  <p className="text-lg">Enter keywords above to find questions.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default SearchView;