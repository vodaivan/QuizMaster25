import React, { useEffect, useState, useRef } from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import { QuizMode } from './types';
import QuizView from './components/QuizView';
import InputView from './components/InputView';
import ReviewView from './components/ReviewView';
import GuideView from './components/GuideView';
import HistoryView from './components/HistoryView';
import ResultsModal from './components/ResultsModal';
import Timer from './components/Timer';
import { LayoutList, Shuffle, Edit3, BookOpen, HelpCircle, History, Eye, EyeOff, Send, RotateCcw, Settings, X, Type, Columns } from 'lucide-react';

const QuizAppContent: React.FC = () => {
  const [showResults, setShowResults] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const { isSubmitted, questions, activeMode, setActiveMode, isPageChecked, togglePageCheck, submitQuiz, resetQuiz, settings, updateSettings } = useQuiz();

  // Auto show results when submission happens (e.g. via timer)
  useEffect(() => {
    if (isSubmitted) {
      setShowResults(true);
    }
  }, [isSubmitted]);

  // Click outside to close settings
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
            setShowSettings(false);
        }
    };
    if (showSettings) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings]);

  const tabs = [
    { id: 'guide', label: 'Guide', icon: HelpCircle },
    { id: 'input', label: 'Input Data', icon: Edit3 },
    { id: 'normal', label: 'Normal Quiz', icon: LayoutList },
    { id: 'random', label: 'Randomized', icon: Shuffle },
    { id: 'review', label: 'Review & Notes', icon: BookOpen },
    { id: 'history', label: 'History', icon: History },
  ];

  const showQuizControls = (activeMode === 'normal' || activeMode === 'random') && questions.length > 0;

  // Global Styles based on Settings
  const fontClass = {
      sans: 'font-sans',
      serif: 'font-serif',
      mono: 'font-mono'
  }[settings.fontFamily];

  const sizeClass = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg'
  }[settings.fontSize];

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${fontClass} ${sizeClass}`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-2 flex-shrink-0 z-10">
             <div className="bg-blue-600 text-white p-2 rounded-lg font-bold text-xl shadow-sm">QM</div>
             <h1 className="text-xl font-bold text-gray-800 hidden md:block tracking-tight">QuizMaster 200</h1>
          </div>

          {/* Center: Controls (Absolute positioned to ensure true center, visible on medium+ screens) */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center gap-3 z-10">
             {showQuizControls && (
                 <>
                    {/* Quick Check Button */}
                    {!isSubmitted && (
                        <button
                            onClick={() => togglePageCheck()}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all shadow-sm font-medium text-sm ${
                                isPageChecked 
                                ? 'bg-indigo-600 text-white border-indigo-700 ring-2 ring-indigo-200' 
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                            title="Toggle Quick Check (/)"
                        >
                            {isPageChecked ? <EyeOff size={18} /> : <Eye size={18} />}
                            <span className="hidden lg:inline">Quick Check</span>
                        </button>
                    )}

                    {/* Submit Button */}
                    {!isSubmitted ? (
                        <button
                            onClick={submitQuiz}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white border border-green-700 hover:bg-green-700 transition-colors shadow-sm font-medium text-sm"
                            title="Submit Quiz"
                        >
                            <Send size={18} />
                            <span className="hidden lg:inline">Submit</span>
                        </button>
                    ) : (
                         <button
                            onClick={() => setShowResults(true)}
                            className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 font-medium hover:bg-blue-100 text-sm transition-colors"
                        >
                            View Score
                        </button>
                    )}

                    {/* Reset Button */}
                    <button
                        onClick={resetQuiz}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm font-medium text-sm"
                        title="Reset Quiz"
                    >
                        <RotateCcw size={18} />
                        <span className="hidden lg:inline">Reset</span>
                    </button>

                    <div className="w-px h-8 bg-gray-200 mx-1"></div>

                    {/* Timer */}
                    <Timer />
                 </>
             )}
          </div>

          {/* Mobile Only Controls (Right aligned next to settings) */}
          <div className="flex md:hidden items-center gap-2 z-10 mr-10">
             {showQuizControls && <Timer />}
          </div>

          {/* Right: Settings Button */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20" ref={settingsRef}>
             <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                title="Settings"
             >
                 <Settings size={22} />
             </button>

             {/* Settings Panel */}
             {showSettings && (
                 <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-4 animate-in slide-in-from-top-2">
                     <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                         <h3 className="font-bold text-gray-800 flex items-center gap-2">
                             <Settings size={16} /> Appearance
                         </h3>
                     </div>

                     <div className="space-y-4">
                         {/* Font Family */}
                         <div>
                             <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block flex items-center gap-1">
                                <Type size={12} /> Font Style
                             </label>
                             <div className="grid grid-cols-3 gap-2">
                                 {['sans', 'serif', 'mono'].map((f) => (
                                     <button
                                        key={f}
                                        onClick={() => updateSettings({ fontFamily: f as any })}
                                        className={`px-2 py-1.5 text-xs rounded border capitalize transition-colors ${
                                            settings.fontFamily === f 
                                            ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' 
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                     >
                                         {f}
                                     </button>
                                 ))}
                             </div>
                         </div>

                         {/* Font Size */}
                         <div>
                             <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                                Font Size
                             </label>
                             <div className="grid grid-cols-3 gap-2">
                                 {['small', 'medium', 'large'].map((s) => (
                                     <button
                                        key={s}
                                        onClick={() => updateSettings({ fontSize: s as any })}
                                        className={`px-2 py-1.5 text-xs rounded border capitalize transition-colors ${
                                            settings.fontSize === s 
                                            ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' 
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                     >
                                         {s}
                                     </button>
                                 ))}
                             </div>
                         </div>

                         {/* Layout Mode */}
                         <div>
                             <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block flex items-center gap-1">
                                <Columns size={12} /> Quiz Layout
                             </label>
                             <p className="text-[10px] text-gray-400 mb-2">Applies to Normal & Random tabs only.</p>
                             <div className="grid grid-cols-2 gap-2">
                                 <button
                                    onClick={() => updateSettings({ layout: 'single' })}
                                    className={`px-2 py-2 text-xs rounded border transition-colors flex flex-col items-center gap-1 ${
                                        settings.layout === 'single'
                                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                 >
                                     <div className="w-4 h-4 border border-current rounded-sm"></div>
                                     One Column
                                 </button>
                                 <button
                                    onClick={() => updateSettings({ layout: 'double' })}
                                    className={`px-2 py-2 text-xs rounded border transition-colors flex flex-col items-center gap-1 ${
                                        settings.layout === 'double'
                                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                 >
                                     <div className="flex gap-0.5">
                                        <div className="w-2 h-4 border border-current rounded-sm"></div>
                                        <div className="w-2 h-4 border border-current rounded-sm"></div>
                                     </div>
                                     Two Columns
                                 </button>
                             </div>
                         </div>
                     </div>
                 </div>
             )}
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 overflow-x-auto scrollbar-hide">
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
        {activeMode === 'guide' && <GuideView />}
        {activeMode === 'input' && <InputView />}
        {activeMode === 'normal' && <QuizView mode="normal" />}
        {activeMode === 'random' && <QuizView mode="random" />}
        {activeMode === 'review' && <ReviewView />}
        {activeMode === 'history' && <HistoryView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-500 text-sm font-medium">
                Website created by <span className="text-blue-600 font-bold">Dai-Van Vo</span>.
            </p>
            <p className="text-gray-400 text-xs mt-1">© {new Date().getFullYear()} QuizMaster 200. All rights reserved.</p>
        </div>
      </footer>

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