import React, { useState, useRef } from 'react';
import { useQuiz } from '../context/QuizContext';
import { parseQuestions } from '../utils/parser';
import { Save, FileText, Upload } from 'lucide-react';

const InputView: React.FC = () => {
  const { setQuestions, questions } = useQuiz();
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleParse = (inputText: string = text) => {
    try {
      if (!inputText.trim()) {
        setStatus('error');
        setMsg('Please enter some text.');
        return;
      }
      const parsed = parseQuestions(inputText);
      if (parsed.length === 0) {
        setStatus('error');
        setMsg('No valid questions found. Check format.');
        return;
      }
      setQuestions(parsed);
      setStatus('success');
      setMsg(`Successfully parsed ${parsed.length} questions!`);
      // Update the textarea with what was parsed if coming from file
      if (inputText !== text) setText(inputText);
    } catch (e) {
      setStatus('error');
      setMsg('Error parsing questions.');
      console.error(e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
          handleParse(content);
      }
    };
    reader.onerror = () => {
        setStatus('error');
        setMsg('Failed to read file.');
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <FileText className="text-blue-600" />
          Question Input
        </h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 mb-4">
            <p className="font-bold mb-2">Format Guide:</p>
            <pre className="whitespace-pre-wrap font-mono text-xs md:text-sm">
{`Câu 1: Biển Đông có diện tích khoảng bao nhiêu km2?
A. Khoảng 2,5 triệu km2.
B. Khoảng 3,5 triệu km2. ++
C. Khoảng 4 triệu km2.
D. Khoảng 4,5 triệu km2.

Câu 2: ...`}
            </pre>
            <p className="mt-2 text-xs italic">Note: Use '++' at the end of a line to mark the correct answer.</p>
        </div>
      </div>

      <div className="mb-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-end">
             <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload .txt File</label>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                        <Upload size={16} /> Choose File
                    </button>
                    <input 
                        type="file" 
                        accept=".txt" 
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <span className="text-xs text-gray-500">Supported: .txt</span>
                </div>
             </div>
             <span className="text-xs text-gray-500 whitespace-nowrap">Current Questions: {questions.length}</span>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Or Paste Text Directly</label>
            <textarea
            className="w-full h-80 p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Paste your questions here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => handleParse(text)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-medium"
        >
          <Save size={18} />
          Parse & Save Questions
        </button>
        
        {status === 'success' && <span className="text-green-600 font-medium">{msg}</span>}
        {status === 'error' && <span className="text-red-600 font-medium">{msg}</span>}
      </div>
    </div>
  );
};

export default InputView;