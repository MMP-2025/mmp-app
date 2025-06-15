
import { Question } from '@/types/provider';

interface UseQuestionHandlersProps {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  newQuestion: { question: string; category: string; type: Question['type'] };
  setNewQuestion: React.Dispatch<React.SetStateAction<{ question: string; category: string; type: Question['type'] }>>;
  toast: any;
}

export const useQuestionHandlers = ({
  questions,
  setQuestions,
  newQuestion,
  setNewQuestion,
  toast
}: UseQuestionHandlersProps) => {
  const handleAddQuestion = () => {
    if (!newQuestion.question.trim()) return;
    const question: Question = {
      id: Date.now().toString(),
      question: newQuestion.question,
      category: newQuestion.category || 'General',
      type: newQuestion.type
    };
    setQuestions(prev => [...prev, question]);
    setNewQuestion({ question: '', category: '', type: 'reflection' });
    toast({
      title: "Question added",
      description: "The question has been added to the database."
    });
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    toast({
      title: "Question deleted",
      description: "The question has been removed."
    });
  };

  const handleBulkImportQuestions = (items: any[]) => {
    setQuestions(prev => [...prev, ...items]);
    toast({
      title: "Bulk import successful",
      description: `${items.length} questions have been imported.`
    });
  };

  return {
    handleAddQuestion,
    handleDeleteQuestion,
    handleBulkImportQuestions
  };
};
