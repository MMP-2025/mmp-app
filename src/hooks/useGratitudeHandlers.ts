
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
  const handleAddGratitudePrompt = () => {
    if (!newGratitudePrompt.prompt.trim()) {
      showError("Validation Error", "Prompt text is required");
      return;
    }
    
    const gratitudePrompt: GratitudePrompt = {
      id: Date.now().toString(),
      prompt: newGratitudePrompt.prompt,
      category: newGratitudePrompt.category || 'General',
      difficulty: newGratitudePrompt.difficulty
    };
    setGratitudePrompts(prev => [...prev, gratitudePrompt]);
    setNewGratitudePrompt({ prompt: '', category: '', difficulty: 'simple' });
    showSuccess("Gratitude prompt added", "The gratitude prompt has been added to the database.");
  };

  const handleDeleteGratitudePrompt = (id: string) => {
    setGratitudePrompts(prev => prev.filter(g => g.id !== id));
    showSuccess("Gratitude prompt deleted", "The gratitude prompt has been removed.");
  };

  const handleBulkImportGratitudePrompts = (items: any[]) => {
    if (items.length === 0) {
      showError("Import Error", "No valid gratitude prompts found to import");
      return;
    }
    
    setGratitudePrompts(prev => [...prev, ...items]);
    showSuccess("Bulk import successful", `${items.length} gratitude prompts have been imported.`);
  };

  return {
    handleAddGratitudePrompt,
    handleDeleteGratitudePrompt,
    handleBulkImportGratitudePrompts
  };
};
