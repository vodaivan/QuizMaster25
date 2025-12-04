import React from 'react';
import { Book, Keyboard, Layout, PlayCircle } from 'lucide-react';

const GuideView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Book className="text-blue-600" />
        User Guide
      </h2>

      <div className="space-y-8">
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Layout className="text-indigo-500" size={20} />
            1. Loading Questions (Input Tab)
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3 text-sm text-gray-700">
            <p>
              Before starting a quiz, you must load questions into the app.
              Go to the <strong>Input Data</strong> tab.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Paste Text:</strong> Copy questions from your source and paste them into the large text box.</li>
              <li><strong>Upload File:</strong> Click "Choose File" to upload a <code>.txt</code> file containing your questions.</li>
            </ul>
            <div className="bg-indigo-50 p-3 rounded border border-indigo-100 font-mono text-xs mt-2">
              <strong>Required Format:</strong><br/>
              Question 1: What is the capital of France?<br/>
              A. London<br/>
              B. Paris ++<br/>
              C. Berlin<br/>
              D. Rome<br/>
              <br/>
              (Note: Use '++' at the end of the line to mark the correct answer.)
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <PlayCircle className="text-green-500" size={20} />
            2. Taking the Quiz (Normal & Random Tabs)
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3 text-sm text-gray-700">
            <p>
              The quiz is split into 4 sections of 50 questions each.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Navigation:</strong> Use the top or bottom bars to switch Sections (Sec 1-4) or Pages (1-5).</li>
              <li><strong>Normal Mode:</strong> Questions appear in their original order (1-200).</li>
              <li><strong>Random Mode:</strong> Questions and answer options are shuffled. Labels (A, B, C, D) stay fixed.</li>
              <li><strong>Quick Check:</strong> Click the "Quick Check" button (or press <code>/</code>) to instantly see results for the current page only. It will also show your score for that page (e.g., 7/10).</li>
              <li><strong>Timer:</strong> Click the clock icon to set a time limit. Use Pause/Resume controls as needed.</li>
              <li><strong>End Test:</strong> The "End Test" button in the timer bar will <strong>reset</strong> the entire quiz and clear all progress.</li>
              <li><strong>Submit Quiz:</strong> Click the big green "Submit Quiz" button to finish. This will calculate your final score and show all correct/wrong answers.</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Keyboard className="text-purple-500" size={20} />
            3. Keyboard Shortcuts
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Navigation</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between border-b border-gray-200 pb-1">
                    <span>Toggle Quick Check</span>
                    <kbd className="bg-white px-2 py-0.5 rounded border border-gray-300 font-mono text-xs shadow-sm">/</kbd>
                  </li>
                  <li className="flex justify-between border-b border-gray-200 pb-1">
                    <span>Scroll Down</span>
                    <kbd className="bg-white px-2 py-0.5 rounded border border-gray-300 font-mono text-xs shadow-sm">Space</kbd>
                  </li>
                  <li className="flex justify-between border-b border-gray-200 pb-1">
                    <span>Next Question (Focus)</span>
                    <kbd className="bg-white px-2 py-0.5 rounded border border-gray-300 font-mono text-xs shadow-sm">Tab</kbd>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Answer Selection</h4>
                <p className="text-xs text-gray-500 mb-2">Focus on a question card first (click or tab).</p>
                <ul className="space-y-2">
                  <li className="flex justify-between border-b border-gray-200 pb-1">
                    <span>Select Option A</span>
                    <div className="space-x-1">
                      <kbd className="bg-white px-2 py-0.5 rounded border border-gray-300 font-mono text-xs shadow-sm">1</kbd>
                      <kbd className="bg-white px-2 py-0.5 rounded border border-gray-300 font-mono text-xs shadow-sm">A</kbd>
                      <kbd className="bg-white px-2 py-0.5 rounded border border-gray-300 font-mono text-xs shadow-sm">Z</kbd>
                    </div>
                  </li>
                  <li className="flex justify-between border-b border-gray-200 pb-1">
                    <span>Select Option B</span>
                    <div className="space-x-1">
                      <kbd className="bg-white px-2 py-0.5 rounded border border-gray-300 font-mono text-xs shadow-sm">2</kbd>
                      <kbd className="bg-white px-2 py-0.5 rounded border border-gray-300 font-mono text-xs shadow-sm">B</kbd>
                      <kbd className="bg-white px-2 py-0.5 rounded border border-gray-300 font-mono text-xs shadow-sm">X</kbd>
                    </div>
                  </li>
                  <li className="flex justify-between border-b border-gray-200 pb-1">
                    <span>Select Option C</span>
                    <div className="space-x-1">
                      <kbd className="bg-white px-2 py-0.5 rounded border border-gray-300 font-mono text-xs shadow-sm">3</kbd>
                      <kbd className="bg-white px-2 py-0.5 rounded border border-gray-300 font-mono text-xs shadow-sm">C</kbd>
                    </div>
                  </li>
                  <li className="flex justify-between border-b border-gray-200 pb-1">
                    <span>Select Option D</span>
                    <div className="space-x-1">
                      <kbd className="bg-white px-2 py-0.5 rounded border border-gray-300 font-mono text-xs shadow-sm">4</kbd>
                      <kbd className="bg-white px-2 py-0.5 rounded border border-gray-300 font-mono text-xs shadow-sm">D</kbd>
                      <kbd className="bg-white px-2 py-0.5 rounded border border-gray-300 font-mono text-xs shadow-sm">V</kbd>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GuideView;