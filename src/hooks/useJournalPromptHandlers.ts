
import { JournalPrompt } from '@/types/provider';

interface UseJournalPromptHandlersProps {
  journalPrompts: JournalPrompt[];
  setJournalPrompts: React.Dispatch<React.SetStateAction<JournalPrompt[]>>;
  newPrompt: { prompt: string; category: string; difficulty: JournalPrompt['difficulty'] };
  setNewPrompt: React.Dispatch<React.SetStateAction<{ prompt: string; category: string; difficulty: JournalPrompt['difficulty'] }>>;
  toast: any;
}

export const useJournalPromptHandlers = ({
  journalPrompts,
  setJournalPrompts,
  newPrompt,
  setNewPrompt,
  toast
}: UseJournalPromptHandlersProps) => {
  const handleAddPrompt = () => {
    if (!newPrompt.prompt.trim()) return;
    const prompt: JournalPrompt = {
      id: Date.now().toString(),
      prompt: newPrompt.prompt,
      category: newPrompt.category || 'General',
      difficulty: newPrompt.difficulty
    };
    setJournalPrompts(prev => [...prev, prompt]);
    setNewPrompt({ prompt: '', category: '', difficulty: 'beginner' });
    toast({
      title: "Journal prompt added",
      description: "The journal prompt has been added to the database."
    });
  };

  const handleDeletePrompt = (id: string) => {
    setJournalPrompts(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Prompt deleted",
      description: "The journal prompt has been removed."
    });
  };

  const handleBulkImportPrompts = (items: any[]) => {
    setJournalPrompts(prev => [...prev, ...items]);
    toast({
      title: "Bulk import successful", 
      description: `${items.length} journal prompts have been imported.`
    });
  };

  return {
    handleAddPrompt,
    handleDeletePrompt,
    handleBulkImportPrompts
  };
};
