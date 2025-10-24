
import { supabase } from '@/integrations/supabase/client';
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
  const handleAddQuestion = async () => {
    if (!newQuestion.question.trim()) {
      showError("Validation Error", "Question text is required");
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('questions')
        .insert({
          question: newQuestion.question,
          type: newQuestion.type || 'reflection',
          provider_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setQuestions(prev => [...prev, data as any]);
      setNewQuestion({ question: '', category: '', type: 'reflection' });
      showSuccess("Question added", "The question has been added to the database.");
    } catch (error) {
      console.error('Error adding question:', error);
      showError("Error", "Failed to add question. Make sure you have provider role.");
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setQuestions(prev => prev.filter(q => q.id !== id));
      showSuccess("Question deleted", "The question has been removed.");
    } catch (error) {
      console.error('Error deleting question:', error);
      showError("Error", "Failed to delete question.");
    }
  };

  const handleBulkImportQuestions = async (items: any[]) => {
    if (items.length === 0) {
      showError("Import Error", "No valid questions found to import");
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const questionsToInsert = items.map(item => ({
        question: item.question,
        type: item.type || 'reflection',
        provider_id: user?.id
      }));

      const { data, error } = await supabase
        .from('questions')
        .insert(questionsToInsert)
        .select();

      if (error) throw error;

      setQuestions(prev => [...prev, ...(data || []) as any]);
      showSuccess("Bulk import successful", `${items.length} questions have been imported.`);
    } catch (error) {
      console.error('Error importing questions:', error);
      showError("Error", "Failed to import questions.");
    }
  };

  return {
    handleAddQuestion,
    handleDeleteQuestion,
    handleBulkImportQuestions
  };
};
