
import { Question } from '@/types/provider';

interface UseQuestionHandlersProps {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  newQuestion: { question: string; category: string; type: Question['type'] };
  setNewQuestion: React.Dispatch<React.SetStateAction<{ question: string; category: string; type: Question['type'] }>>;
  showSuccess: (title: string, description?: string) => void;
  showError: (title: string, description?: string) => void;
}

export const useQuestionHandlers = ({
  questions,
  setQuestions,
  newQuestion,
  setNewQuestion,
  showSuccess,
  showError
}: UseQuestionHandlersProps) => {
  const handleAddQuestion = () => {
    if (!newQuestion.question.trim()) {
      showError("Validation Error", "Question text is required");
      return;
    }
    
    const question: Question = {
      id: Date.now().toString(),
      question: newQuestion.question,
      category: newQuestion.category || 'General',
      type: newQuestion.type
    };
    setQuestions(prev => [...prev, question]);
    setNewQuestion({ question: '', category: '', type: 'reflection' });
    showSuccess("Question added", "The question has been added to the database.");
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    showSuccess("Question deleted", "The question has been removed.");
  };

  const handleBulkImportQuestions = (items: any[]) => {
    if (items.length === 0) {
      showError("Import Error", "No valid questions found to import");
      return;
    }
    
    setQuestions(prev => [...prev, ...items]);
    showSuccess("Bulk import successful", `${items.length} questions have been imported.`);
  };

  return {
    handleAddQuestion,
    handleDeleteQuestion,
    handleBulkImportQuestions
  };
};
