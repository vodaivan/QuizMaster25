import { Question, QUESTIONS_PER_SECTION } from '../types';

export const parseQuestions = (text: string): Question[] => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
  const questions: Question[] = [];
  
  let currentQuestion: Partial<Question> | null = null;
  let currentOptions: { id: string; text: string }[] = [];
  let currentCorrectId = '';

  const questionRegex = /^(?:Câu|Question)\s+(\d+)[:.]\s*(.+)/i;
  const optionRegex = /^([A-D])\.\s*(.+)/i;

  lines.forEach((line) => {
    // Check if line is a Question
    const qMatch = line.match(questionRegex);
    if (qMatch) {
      // Save previous question if exists
      if (currentQuestion && currentOptions.length > 0) {
        questions.push({
          ...currentQuestion,
          options: currentOptions,
          correctOptionId: currentCorrectId,
          // Calculate section based on ID
          section: Math.ceil((currentQuestion.id || 1) / QUESTIONS_PER_SECTION)
        } as Question);
      }

      // Start new question
      currentQuestion = {
        id: parseInt(qMatch[1], 10),
        text: qMatch[2],
      };
      currentOptions = [];
      currentCorrectId = '';
      
      // Check if the question line itself has the answer marker (rare but possible)
      if (line.endsWith('++')) {
          // This usually shouldn't happen for the question title, but handling edge case
      }
      return;
    }

    // Check if line is an Option
    const oMatch = line.match(optionRegex);
    if (oMatch && currentQuestion) {
      let optText = oMatch[2];
      const isCorrect = line.includes('++') || optText.endsWith('++');
      
      if (isCorrect) {
        // Remove the ++ marker
        optText = optText.replace(/\+\+$/, '').trim();
        currentCorrectId = oMatch[1].toUpperCase();
      }

      currentOptions.push({
        id: oMatch[1].toUpperCase(),
        text: optText
      });
    }
  });

  // Push the last question
  if (currentQuestion && currentOptions.length > 0) {
    questions.push({
      ...currentQuestion,
      options: currentOptions,
      correctOptionId: currentCorrectId,
      section: Math.ceil((currentQuestion.id || 1) / QUESTIONS_PER_SECTION)
    } as Question);
  }

  // Ensure strict ID ordering and limit to 200 just in case
  return questions.sort((a, b) => a.id - b.id);
};