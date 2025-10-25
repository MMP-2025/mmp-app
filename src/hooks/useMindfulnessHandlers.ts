
import { supabase } from '@/integrations/supabase/client';
import { MindfulnessPrompt } from '@/types/provider';

interface UseMindfulnessHandlersProps {
  mindfulnessPrompts: MindfulnessPrompt[];
  setMindfulnessPrompts: React.Dispatch<React.SetStateAction<MindfulnessPrompt[]>>;
  newMindfulnessPrompt: { prompt: string; category: string; duration: number };
  setNewMindfulnessPrompt: React.Dispatch<React.SetStateAction<{ prompt: string; category: string; duration: number }>>;
  showSuccess: (title: string, description?: string) => void;
  showError: (title: string, description?: string) => void;
}

export const useMindfulnessHandlers = ({
  mindfulnessPrompts,
  setMindfulnessPrompts,
  newMindfulnessPrompt,
  setNewMindfulnessPrompt,
  showSuccess,
  showError
}: UseMindfulnessHandlersProps) => {
  const handleAddMindfulnessPrompt = async () => {
    if (!newMindfulnessPrompt.prompt.trim()) {
      showError("Validation Error", "Prompt text is required");
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('mindfulness_exercises')
        .insert({
          prompt: newMindfulnessPrompt.prompt,
          category: newMindfulnessPrompt.category || 'General',
          duration: newMindfulnessPrompt.duration || 5,
          provider_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setMindfulnessPrompts(prev => [...prev, data as any]);
      setNewMindfulnessPrompt({ prompt: '', category: '', duration: 5 });
      showSuccess("Mindfulness exercise added", "The mindfulness exercise has been added to the database.");
    } catch (error) {
      console.error('Error adding mindfulness exercise:', error);
      showError("Error", "Failed to add mindfulness exercise. Make sure you have provider role.");
    }
  };

  const handleDeleteMindfulnessPrompt = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mindfulness_exercises')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMindfulnessPrompts(prev => prev.filter(m => m.id !== id));
      showSuccess("Mindfulness exercise deleted", "The mindfulness exercise has been removed.");
    } catch (error) {
      console.error('Error deleting mindfulness exercise:', error);
      showError("Error", "Failed to delete mindfulness exercise.");
    }
  };

  const handleBulkImportMindfulnessPrompts = async (items: any[]) => {
    if (items.length === 0) {
      showError("Import Error", "No valid mindfulness exercises found to import");
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const exercisesToInsert = items.map(item => ({
        prompt: item.prompt,
        category: item.category || 'General',
        duration: item.duration || 5,
        provider_id: user?.id
      }));

      const { data, error } = await supabase
        .from('mindfulness_exercises')
        .insert(exercisesToInsert)
        .select();

      if (error) throw error;

      setMindfulnessPrompts(prev => [...prev, ...(data || []) as any]);
      showSuccess("Bulk import successful", `${items.length} mindfulness exercises have been imported.`);
    } catch (error) {
      console.error('Error importing mindfulness exercises:', error);
      showError("Error", "Failed to import mindfulness exercises.");
    }
  };

  return {
    handleAddMindfulnessPrompt,
    handleDeleteMindfulnessPrompt,
    handleBulkImportMindfulnessPrompts
  };
};
