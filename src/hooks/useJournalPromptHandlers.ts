
import { supabase } from '@/integrations/supabase/client';
import { JournalPrompt } from '@/types/provider';

interface UseJournalPromptHandlersProps {
  journalPrompts: JournalPrompt[];
  setJournalPrompts: React.Dispatch<React.SetStateAction<JournalPrompt[]>>;
  newPrompt: { prompt: string; category: string; difficulty: JournalPrompt['difficulty'] };
  setNewPrompt: React.Dispatch<React.SetStateAction<{ prompt: string; category: string; difficulty: JournalPrompt['difficulty'] }>>;
  showSuccess: (title: string, description?: string) => void;
  showError: (title: string, description?: string) => void;
}

export const useJournalPromptHandlers = ({
  journalPrompts,
  setJournalPrompts,
  newPrompt,
  setNewPrompt,
  showSuccess,
  showError
}: UseJournalPromptHandlersProps) => {
  const handleAddPrompt = async () => {
    if (!newPrompt.prompt.trim()) {
      showError("Validation Error", "Prompt text is required");
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('journal_prompts')
        .insert({
          prompt: newPrompt.prompt,
          category: newPrompt.category || 'General',
          difficulty: newPrompt.difficulty,
          provider_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setJournalPrompts(prev => [...prev, data as any]);
      setNewPrompt({ prompt: '', category: '', difficulty: 'beginner' });
      showSuccess("Journal prompt added", "The journal prompt has been added to the database.");
    } catch (error) {
      console.error('Error adding prompt:', error);
      showError("Error", "Failed to add journal prompt. Make sure you have provider role.");
    }
  };

  const handleDeletePrompt = async (id: string) => {
    try {
      const { error } = await supabase
        .from('journal_prompts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setJournalPrompts(prev => prev.filter(p => p.id !== id));
      showSuccess("Prompt deleted", "The journal prompt has been removed.");
    } catch (error) {
      console.error('Error deleting prompt:', error);
      showError("Error", "Failed to delete journal prompt.");
    }
  };

  const handleBulkImportPrompts = async (items: any[]) => {
    if (items.length === 0) {
      showError("Import Error", "No valid prompts found to import");
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const promptsToInsert = items.map(item => ({
        prompt: item.prompt,
        category: item.category || 'General',
        difficulty: item.difficulty || 'beginner',
        provider_id: user?.id
      }));

      const { data, error } = await supabase
        .from('journal_prompts')
        .insert(promptsToInsert)
        .select();

      if (error) throw error;

      setJournalPrompts(prev => [...prev, ...(data || []) as any]);
      showSuccess("Bulk import successful", `${items.length} journal prompts have been imported.`);
    } catch (error) {
      console.error('Error importing prompts:', error);
      showError("Error", "Failed to import journal prompts.");
    }
  };

  return {
    handleAddPrompt,
    handleDeletePrompt,
    handleBulkImportPrompts
  };
};
