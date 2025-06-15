
import { MindfulnessPrompt } from '@/types/provider';

interface UseMindfulnessHandlersProps {
  mindfulnessPrompts: MindfulnessPrompt[];
  setMindfulnessPrompts: React.Dispatch<React.SetStateAction<MindfulnessPrompt[]>>;
  newMindfulnessPrompt: { prompt: string; category: string; duration: string };
  setNewMindfulnessPrompt: React.Dispatch<React.SetStateAction<{ prompt: string; category: string; duration: string }>>;
  toast: any;
}

export const useMindfulnessHandlers = ({
  mindfulnessPrompts,
  setMindfulnessPrompts,
  newMindfulnessPrompt,
  setNewMindfulnessPrompt,
  toast
}: UseMindfulnessHandlersProps) => {
  const handleAddMindfulnessPrompt = () => {
    if (!newMindfulnessPrompt.prompt.trim()) return;
    const mindfulnessPrompt: MindfulnessPrompt = {
      id: Date.now().toString(),
      prompt: newMindfulnessPrompt.prompt,
      category: newMindfulnessPrompt.category || 'General',
      duration: newMindfulnessPrompt.duration
    };
    setMindfulnessPrompts(prev => [...prev, mindfulnessPrompt]);
    setNewMindfulnessPrompt({ prompt: '', category: '', duration: '5 minutes' });
    toast({
      title: "Mindfulness prompt added",
      description: "The mindfulness prompt has been added to the database."
    });
  };

  const handleDeleteMindfulnessPrompt = (id: string) => {
    setMindfulnessPrompts(prev => prev.filter(m => m.id !== id));
    toast({
      title: "Mindfulness prompt deleted",
      description: "The mindfulness prompt has been removed."
    });
  };

  const handleBulkImportMindfulnessPrompts = (items: any[]) => {
    setMindfulnessPrompts(prev => [...prev, ...items]);
    toast({
      title: "Bulk import successful",
      description: `${items.length} mindfulness prompts have been imported.`
    });
  };

  return {
    handleAddMindfulnessPrompt,
    handleDeleteMindfulnessPrompt,
    handleBulkImportMindfulnessPrompts
  };
};
