import React, { useState, useMemo } from 'react';
import { useQuiz } from '../context/QuizContext';
import { Search as SearchIcon, AlertCircle, HelpCircle, ListChecks } from 'lucide-react';
import { Question } from '../types';

const SearchView: React.FC = () => {
  const { questions } = useQuiz();
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'question' | 'answer'>('question');

  const results = useMemo(() => {
    if (!query.trim() || questions.length === 0) return [];

    const lowerQuery = query.toLowerCase().trim();
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 0);

    const calculateScore = (text: string) => {
        let s = 0;
        // Exact match
        if (text === lowerQuery) {
            s = 100;
        } 
        // Phrase match (contains the full query string)
        else if (text.includes(lowerQuery)) {
            s = 80;
        } 
        // Word match
        else {
            let matchedWords = 0;
            queryWords.forEach(word => {
                if (text.includes(word)) {
                    matchedWords++;
                }
            });

            if (matchedWords === queryWords.length) {
                s = 50; // All words present
            } else if (matchedWords > 0) {
                s = (matchedWords / queryWords.length) * 30; // Partial match
            }
        }
        return s;
    };

    return questions.map(q => {
        let score = 0;

        if (searchType === 'question') {
            score = calculateScore(q.text.toLowerCase());
        } else {
            // Search in options
            const optionScores = q.options.map(opt => calculateScore(opt.text.toLowerCase()));
            // Take the best match found in any option
            score = Math.max(...optionScores);
        }

        return { question: q, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score); // Sort by score descending

  }, [query, questions, searchType]);

  const ResultCard = ({ q }: { q: Question }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
                <span className="font-bold text-blue-600 mr-2">Q{q.id}.</span>
                {q.text}
            </h3>
            {searchType === 'question' && (
               <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded font-bold uppercase tracking-wide">
                   Question Match
               </span>
            )}
        </div>
        <div className="pl-8 space-y-1 text-sm">
            {q.options.map(opt => {
                // Highlight matching answers if in answer search mode
                const isMatch = searchType === 'answer' && query.trim() && opt.text.toLowerCase().includes(query.toLowerCase().trim());
                
                return (
                    <div key={opt.id} className={`flex items-start gap-2 ${opt.id === q.correctOptionId ? 'text-green-700 font-bold' : 'text-gray-600'} ${isMatch ? 'bg-yellow-100 p-1 rounded -ml-1' : ''}`}>
                        <span className="w-5">{opt.id}.</span>
                        <span>{opt.text}</span>
                    </div>
                );
            })}
        </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
           <SearchIcon className="text-blue-600" /> Search
        </h2>
        
        {/* Search Input */}
        <div className="relative mb-6">
            <input 
                type="text" 
                className="w-full p-4 pl-12 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder={searchType === 'question' ? "Search in questions..." : "Search in answers..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
        </div>

        {/* Sub-Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-lg w-full md:w-fit">
            <button
                onClick={() => setSearchType('question')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    searchType === 'question'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <HelpCircle size={16} /> Search by Question
            </button>
            <button
                onClick={() => setSearchType('answer')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    searchType === 'answer'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <ListChecks size={16} /> Search by Answer
            </button>
        </div>
      </div>

      <div className="space-y-6">
          {query.trim() && results.length === 0 && (
              <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                  <AlertCircle className="mx-auto mb-2 opacity-50" size={32} />
                  <p>No matches found for "{query}" in {searchType}s.</p>
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
                  <p className="text-sm">Select a tab to switch between searching questions or answer options.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default SearchView;