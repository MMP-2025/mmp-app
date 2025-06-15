
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
  const handleAddPrompt = () => {
    if (!newPrompt.prompt.trim()) {
      showError("Validation Error", "Prompt text is required");
      return;
    }
    
    const prompt: JournalPrompt = {
      id: Date.now().toString(),
      prompt: newPrompt.prompt,
      category: newPrompt.category || 'General',
      difficulty: newPrompt.difficulty
    };
    setJournalPrompts(prev => [...prev, prompt]);
    setNewPrompt({ prompt: '', category: '', difficulty: 'beginner' });
    showSuccess("Journal prompt added", "The journal prompt has been added to the database.");
  };

  const handleDeletePrompt = (id: string) => {
    setJournalPrompts(prev => prev.filter(p => p.id !== id));
    showSuccess("Prompt deleted", "The journal prompt has been removed.");
  };

  const handleBulkImportPrompts = (items: any[]) => {
    if (items.length === 0) {
      showError("Import Error", "No valid prompts found to import");
      return;
    }
    
    setJournalPrompts(prev => [...prev, ...items]);
    showSuccess("Bulk import successful", `${items.length} journal prompts have been imported.`);
  };

  return {
    handleAddPrompt,
    handleDeletePrompt,
    handleBulkImportPrompts
  };
};
