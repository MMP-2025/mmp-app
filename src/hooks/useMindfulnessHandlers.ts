
import { MindfulnessPrompt } from '@/types/provider';

interface UseMindfulnessHandlersProps {
  mindfulnessPrompts: MindfulnessPrompt[];
  setMindfulnessPrompts: React.Dispatch<React.SetStateAction<MindfulnessPrompt[]>>;
  newMindfulnessPrompt: { prompt: string; category: string; duration: string };
  setNewMindfulnessPrompt: React.Dispatch<React.SetStateAction<{ prompt: string; category: string; duration: string }>>;
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
  const handleAddMindfulnessPrompt = () => {
    if (!newMindfulnessPrompt.prompt.trim()) {
      showError("Validation Error", "Prompt text is required");
      return;
    }
    
    const mindfulnessPrompt: MindfulnessPrompt = {
      id: Date.now().toString(),
      prompt: newMindfulnessPrompt.prompt,
      category: newMindfulnessPrompt.category || 'General',
      duration: newMindfulnessPrompt.duration
    };
    setMindfulnessPrompts(prev => [...prev, mindfulnessPrompt]);
    setNewMindfulnessPrompt({ prompt: '', category: '', duration: '5 minutes' });
    showSuccess("Mindfulness prompt added", "The mindfulness prompt has been added to the database.");
  };

  const handleDeleteMindfulnessPrompt = (id: string) => {
    setMindfulnessPrompts(prev => prev.filter(m => m.id !== id));
    showSuccess("Mindfulness prompt deleted", "The mindfulness prompt has been removed.");
  };

  const handleBulkImportMindfulnessPrompts = (items: any[]) => {
    if (items.length === 0) {
      showError("Import Error", "No valid mindfulness prompts found to import");
      return;
    }
    
    setMindfulnessPrompts(prev => [...prev, ...items]);
    showSuccess("Bulk import successful", `${items.length} mindfulness prompts have been imported.`);
  };

  return {
    handleAddMindfulnessPrompt,
    handleDeleteMindfulnessPrompt,
    handleBulkImportMindfulnessPrompts
  };
};
