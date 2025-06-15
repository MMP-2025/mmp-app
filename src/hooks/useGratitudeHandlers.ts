
import { GratitudePrompt } from '@/types/provider';

interface UseGratitudeHandlersProps {
  gratitudePrompts: GratitudePrompt[];
  setGratitudePrompts: React.Dispatch<React.SetStateAction<GratitudePrompt[]>>;
  newGratitudePrompt: { prompt: string; category: string; difficulty: GratitudePrompt['difficulty'] };
  setNewGratitudePrompt: React.Dispatch<React.SetStateAction<{ prompt: string; category: string; difficulty: GratitudePrompt['difficulty'] }>>;
  toast: any;
}

export const useGratitudeHandlers = ({
  gratitudePrompts,
  setGratitudePrompts,
  newGratitudePrompt,
  setNewGratitudePrompt,
  toast
}: UseGratitudeHandlersProps) => {
  const handleAddGratitudePrompt = () => {
    if (!newGratitudePrompt.prompt.trim()) return;
    const gratitudePrompt: GratitudePrompt = {
      id: Date.now().toString(),
      prompt: newGratitudePrompt.prompt,
      category: newGratitudePrompt.category || 'General',
      difficulty: newGratitudePrompt.difficulty
    };
    setGratitudePrompts(prev => [...prev, gratitudePrompt]);
    setNewGratitudePrompt({ prompt: '', category: '', difficulty: 'simple' });
    toast({
      title: "Gratitude prompt added",
      description: "The gratitude prompt has been added to the database."
    });
  };

  const handleDeleteGratitudePrompt = (id: string) => {
    setGratitudePrompts(prev => prev.filter(g => g.id !== id));
    toast({
      title: "Gratitude prompt deleted",
      description: "The gratitude prompt has been removed."
    });
  };

  const handleBulkImportGratitudePrompts = (items: any[]) => {
    setGratitudePrompts(prev => [...prev, ...items]);
    toast({
      title: "Bulk import successful",
      description: `${items.length} gratitude prompts have been imported.`
    });
  };

  return {
    handleAddGratitudePrompt,
    handleDeleteGratitudePrompt,
    handleBulkImportGratitudePrompts
  };
};
