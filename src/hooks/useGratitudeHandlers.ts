
import { supabase } from '@/integrations/supabase/client';
import { GratitudePrompt } from '@/types/provider';

interface UseGratitudeHandlersProps {
  gratitudePrompts: GratitudePrompt[];
  setGratitudePrompts: React.Dispatch<React.SetStateAction<GratitudePrompt[]>>;
  newGratitudePrompt: { prompt: string; category: string; difficulty: GratitudePrompt['difficulty'] };
  setNewGratitudePrompt: React.Dispatch<React.SetStateAction<{ prompt: string; category: string; difficulty: GratitudePrompt['difficulty'] }>>;
  showSuccess: (title: string, description?: string) => void;
  showError: (title: string, description?: string) => void;
}

export const useGratitudeHandlers = ({
  gratitudePrompts,
  setGratitudePrompts,
  newGratitudePrompt,
  setNewGratitudePrompt,
  showSuccess,
  showError
}: UseGratitudeHandlersProps) => {
  const handleAddGratitudePrompt = async () => {
    if (!newGratitudePrompt.prompt.trim()) {
      showError("Validation Error", "Prompt text is required");
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('gratitude_prompts')
        .insert({
          prompt: newGratitudePrompt.prompt,
          category: newGratitudePrompt.category || 'General',
          difficulty: newGratitudePrompt.difficulty,
          provider_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setGratitudePrompts(prev => [...prev, data as any]);
      setNewGratitudePrompt({ prompt: '', category: '', difficulty: 'simple' });
      showSuccess("Gratitude prompt added", "The gratitude prompt has been added to the database.");
    } catch (error) {
      console.error('Error adding gratitude prompt:', error);
      showError("Error", "Failed to add gratitude prompt. Make sure you have provider role.");
    }
  };

  const handleDeleteGratitudePrompt = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gratitude_prompts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setGratitudePrompts(prev => prev.filter(g => g.id !== id));
      showSuccess("Gratitude prompt deleted", "The gratitude prompt has been removed.");
    } catch (error) {
      console.error('Error deleting gratitude prompt:', error);
      showError("Error", "Failed to delete gratitude prompt.");
    }
  };

  const handleBulkImportGratitudePrompts = async (items: any[]) => {
    if (items.length === 0) {
      showError("Import Error", "No valid gratitude prompts found to import");
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const promptsToInsert = items.map(item => ({
        prompt: item.prompt,
        category: item.category || 'General',
        difficulty: item.difficulty || 'simple',
        provider_id: user?.id
      }));

      const { data, error } = await supabase
        .from('gratitude_prompts')
        .insert(promptsToInsert)
        .select();

      if (error) throw error;

      setGratitudePrompts(prev => [...prev, ...(data || []) as any]);
      showSuccess("Bulk import successful", `${items.length} gratitude prompts have been imported.`);
    } catch (error) {
      console.error('Error importing gratitude prompts:', error);
      showError("Error", "Failed to import gratitude prompts.");
    }
  };

  return {
    handleAddGratitudePrompt,
    handleDeleteGratitudePrompt,
    handleBulkImportGratitudePrompts
  };
};
