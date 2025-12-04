import React, { useState } from 'react';
import { Book, Keyboard, Layout, PlayCircle, Edit3, Shuffle, BookOpen, History, Info, HelpCircle, Eye, Send } from 'lucide-react';

const GuideView: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'vi'>('en');

  const content = {
    en: {
        title: "User Guide & Application Manual",
        intro_title: "Introduction",
        intro_desc: "QuizMaster 200 is a comprehensive multiple-choice testing application designed to help you study efficiently. It supports inputting up to 200 questions, taking tests in normal or randomized modes, reviewing mistakes, taking notes, and tracking your history.",

        sec1: "1. Loading Data (Input Tab)",
        sec1_desc: "You must load questions before using the quiz features.",
        sec1_step1: "Go to the 'Input Data' tab.",
        sec1_step2: "Paste Format: Copy your questions and paste them into the text area.",
        sec1_step3: "File Upload: Click 'Choose File' to upload a .txt file.",
        sec1_format: "Required Format: 'Question X: ...' followed by options A, B, C, D. Add '++' at the end of the correct answer line.",

        sec2: "2. Application Tabs Explained",
        tab_normal: "Normal Quiz: Displays questions in order (1-200). Best for initial study.",
        tab_random: "Randomized: Shuffles question order AND answer options. Resetting this mode re-shuffles everything. Best for mock exams.",
        tab_review: "Review & Notes: After submitting a quiz, incorrect answers appear here. Also lists any questions where you saved a note.",
        tab_history: "History: Logs your last 10 attempts (Mode, Score, Time).",

        sec3: "3. Navigation & Scoring",
        structure: "Structure: 4 Sections (50 questions each). Each section has 5 Pages (10 questions each).",
        scoring: "Scoring: You receive a score per section (0-10) and a total score (0-10).",
        submit_vs_quick: "Submit vs Quick Check:",
        quick_def: "Quick Check (/): Checks only the current page (10 questions). Does NOT affect global score or timer.",
        submit_def: "Submit: Finishes the exam for the current mode. Stops timer, calculates total score, and reveals all answers.",

        sec4: "4. Features & Tools",
        timer: "Timer: Click the clock to set a duration (10-60m). You can Pause/Resume. Timer stops on Submit.",
        notes: "Notes: Click the 'Note' icon next to any question to write a personal memo. Notes are saved to the Review tab.",
        export: "Export Notes: In the Review tab, click 'Save Notes to TXT' to download your study notes.",
        reset: "Reset: Clears all progress in the current mode to start fresh.",

        shortcuts: "Keyboard Shortcuts",
    },
    vi: {
        title: "Hướng Dẫn Sử Dụng & Cẩm Nang",
        intro_title: "Giới Thiệu",
        intro_desc: "QuizMaster 200 là ứng dụng trắc nghiệm toàn diện giúp bạn ôn tập hiệu quả. Ứng dụng hỗ trợ nhập liệu tới 200 câu hỏi, làm bài ở chế độ thường hoặc ngẫu nhiên, xem lại lỗi sai, ghi chú và theo dõi lịch sử làm bài.",

        sec1: "1. Nhập Dữ Liệu (Tab Input)",
        sec1_desc: "Bạn cần nạp câu hỏi trước khi sử dụng các tính năng trắc nghiệm.",
        sec1_step1: "Vào tab 'Input Data'.",
        sec1_step2: "Dán văn bản: Copy câu hỏi từ nguồn của bạn và dán vào khung nhập liệu.",
        sec1_step3: "Tải file: Nhấn 'Choose File' để tải lên file .txt.",
        sec1_format: "Định dạng bắt buộc: 'Câu X: ...' theo sau là các đáp án A, B, C, D. Thêm '++' vào cuối dòng đáp án đúng.",

        sec2: "2. Giải Thích Các Tab",
        tab_normal: "Normal Quiz (Thường): Hiển thị câu hỏi theo thứ tự gốc (1-200). Thích hợp để học lần đầu.",
        tab_random: "Randomized (Ngẫu nhiên): Xáo trộn thứ tự câu hỏi VÀ đáp án. Nhấn Reset sẽ xáo trộn lại. Thích hợp thi thử.",
        tab_review: "Review & Notes (Xem lại): Sau khi nộp bài, các câu sai sẽ hiện ở đây. Tab này cũng chứa các câu bạn đã ghi chú.",
        tab_history: "History (Lịch sử): Lưu 10 lần làm bài gần nhất (Chế độ, Điểm, Thời gian).",

        sec3: "3. Điều Hướng & Tính Điểm",
        structure: "Cấu trúc: 4 Phần (mỗi phần 50 câu). Mỗi phần có 5 Trang (mỗi trang 10 câu).",
        scoring: "Tính điểm: Bạn nhận điểm theo từng phần (thang 10) và điểm tổng kết (thang 10).",
        submit_vs_quick: "Phân biệt Nộp bài & Kiểm tra nhanh:",
        quick_def: "Quick Check (/): Chỉ chấm điểm trang hiện tại (10 câu). KHÔNG ảnh hưởng điểm tổng hay đồng hồ.",
        submit_def: "Submit (Nộp bài): Kết thúc bài thi chế độ hiện tại. Dừng đồng hồ, tính điểm tổng, hiện đáp án toàn bộ.",

        sec4: "4. Tính Năng & Công Cụ",
        timer: "Đồng hồ: Nhấn vào giờ để đặt thời gian (10-60p). Có thể Tạm dừng/Tiếp tục. Đồng hồ dừng khi Nộp bài.",
        notes: "Ghi chú: Nhấn biểu tượng 'Ghi chú' cạnh câu hỏi để viết ghi nhớ. Ghi chú được lưu vào tab Review.",
        export: "Xuất Ghi chú: Tại tab Review, nhấn 'Save Notes to TXT' để tải file ghi chú về máy.",
        reset: "Reset (Làm lại): Xóa toàn bộ tiến độ hiện tại để làm lại từ đầu.",

        shortcuts: "Phím Tắt Bàn Phím",
    }
  };

  const t = content[lang];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Language Toggle Header */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Book className="text-blue-600" />
            {t.title}
        </h2>
        <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
                onClick={() => setLang('en')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${lang === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                English
            </button>
            <button
                onClick={() => setLang('vi')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${lang === 'vi' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Tiếng Việt
            </button>
        </div>
      </div>

      <div className="space-y-10">
        
        {/* Intro Section */}
        <section>
             <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Info className="text-blue-500" /> {t.intro_title}
             </h3>
             <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-100">
                 {t.intro_desc}
             </p>
        </section>

        {/* Section 1: Input */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Edit3 className="text-indigo-500" size={20} />
            {t.sec1}
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
              <div className="text-sm text-gray-700 space-y-2">
                  <p>{t.sec1_desc}</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>{t.sec1_step1}</li>
                      <li><strong>{t.sec1_step2}</strong></li>
                      <li><strong>{t.sec1_step3}</strong></li>
                  </ul>
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200 text-xs font-mono text-gray-600">
                  <p className="font-bold mb-2 text-indigo-700">{t.sec1_format}</p>
                  Question 1: What is...?<br/>
                  A. Option 1<br/>
                  B. Option 2 ++<br/>
                  C. Option 3<br/>
                  D. Option 4
              </div>
          </div>
        </section>

        {/* Section 2: Tabs */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Layout className="text-purple-500" size={20} />
            {t.sec2}
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
             <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 hover:shadow-sm transition-shadow">
                 <h4 className="font-bold text-purple-800 flex items-center gap-2 mb-2"><Layout size={16}/> Normal Quiz</h4>
                 <p className="text-gray-700">{t.tab_normal}</p>
             </div>
             <div className="bg-pink-50 p-4 rounded-lg border border-pink-100 hover:shadow-sm transition-shadow">
                 <h4 className="font-bold text-pink-800 flex items-center gap-2 mb-2"><Shuffle size={16}/> Randomized</h4>
                 <p className="text-gray-700">{t.tab_random}</p>
             </div>
             <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 hover:shadow-sm transition-shadow">
                 <h4 className="font-bold text-amber-800 flex items-center gap-2 mb-2"><BookOpen size={16}/> Review & Notes</h4>
                 <p className="text-gray-700">{t.tab_review}</p>
             </div>
             <div className="bg-teal-50 p-4 rounded-lg border border-teal-100 hover:shadow-sm transition-shadow">
                 <h4 className="font-bold text-teal-800 flex items-center gap-2 mb-2"><History size={16}/> History</h4>
                 <p className="text-gray-700">{t.tab_history}</p>
             </div>
          </div>
        </section>

        {/* Section 3: Navigation & Scoring */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
            <PlayCircle className="text-green-500" size={20} />
            {t.sec3}
          </h3>
          <div className="space-y-4 text-sm text-gray-700">
             <div className="flex gap-4 flex-col md:flex-row">
                <div className="flex-1 bg-gray-50 p-4 rounded border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-2">Structure & Scoring</h4>
                    <p className="mb-2">{t.structure}</p>
                    <p className="text-green-700 font-medium">{t.scoring}</p>
                </div>
                <div className="flex-1 bg-gray-50 p-4 rounded border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-2">{t.submit_vs_quick}</h4>
                    <ul className="space-y-2">
                        <li className="flex gap-2">
                            <Eye size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                            <span>{t.quick_def}</span>
                        </li>
                        <li className="flex gap-2">
                            <Send size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{t.submit_def}</span>
                        </li>
                    </ul>
                </div>
             </div>
          </div>
        </section>

        {/* Section 4: Tools */}
        <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <HelpCircle className="text-orange-500" size={20} />
                {t.sec4}
            </h3>
            <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                <li className="bg-orange-50 p-3 rounded border border-orange-100">{t.timer}</li>
                <li className="bg-orange-50 p-3 rounded border border-orange-100">{t.notes}</li>
                <li className="bg-orange-50 p-3 rounded border border-orange-100">{t.export}</li>
                <li className="bg-orange-50 p-3 rounded border border-orange-100">{t.reset}</li>
            </ul>
        </section>

        {/* Shortcuts */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Keyboard className="text-gray-600" size={20} />
            {t.shortcuts}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
             <div className="bg-gray-50 p-3 rounded border border-gray-200 text-center">
                 <kbd className="bg-white border border-gray-300 rounded px-2 py-1 font-mono text-xs shadow-sm block w-max mx-auto mb-1">/</kbd>
                 <span className="text-gray-500 text-xs">Quick Check</span>
             </div>
             <div className="bg-gray-50 p-3 rounded border border-gray-200 text-center">
                 <kbd className="bg-white border border-gray-300 rounded px-2 py-1 font-mono text-xs shadow-sm block w-max mx-auto mb-1">Space</kbd>
                 <span className="text-gray-500 text-xs">Scroll Down</span>
             </div>
             <div className="bg-gray-50 p-3 rounded border border-gray-200 text-center">
                 <kbd className="bg-white border border-gray-300 rounded px-2 py-1 font-mono text-xs shadow-sm block w-max mx-auto mb-1">Tab</kbd>
                 <span className="text-gray-500 text-xs">Next Question</span>
             </div>
             <div className="bg-gray-50 p-3 rounded border border-gray-200 text-center">
                 <kbd className="bg-white border border-gray-300 rounded px-2 py-1 font-mono text-xs shadow-sm block w-max mx-auto mb-1">1 / A / Z</kbd>
                 <span className="text-gray-500 text-xs">Option A</span>
             </div>
             <div className="bg-gray-50 p-3 rounded border border-gray-200 text-center">
                 <kbd className="bg-white border border-gray-300 rounded px-2 py-1 font-mono text-xs shadow-sm block w-max mx-auto mb-1">2 / B / X</kbd>
                 <span className="text-gray-500 text-xs">Option B</span>
             </div>
             <div className="bg-gray-50 p-3 rounded border border-gray-200 text-center">
                 <kbd className="bg-white border border-gray-300 rounded px-2 py-1 font-mono text-xs shadow-sm block w-max mx-auto mb-1">3 / C</kbd>
                 <span className="text-gray-500 text-xs">Option C</span>
             </div>
             <div className="bg-gray-50 p-3 rounded border border-gray-200 text-center">
                 <kbd className="bg-white border border-gray-300 rounded px-2 py-1 font-mono text-xs shadow-sm block w-max mx-auto mb-1">4 / D / V</kbd>
                 <span className="text-gray-500 text-xs">Option D</span>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GuideView;