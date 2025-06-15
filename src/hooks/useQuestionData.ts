
import { useState } from 'react';
import { Question } from '@/types/provider';

export const useQuestionData = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<{
    question: string;
    category: string;
    type: Question['type'];
  }>({
    question: '',
    category: '',
    type: 'reflection'
  });

  return {
    questions,
    setQuestions,
    newQuestion,
    setNewQuestion
  };
};
