
import { ToolkitItem } from '@/types/provider';

interface UseToolkitHandlersProps {
  toolkitItems: ToolkitItem[];
  setToolkitItems: React.Dispatch<React.SetStateAction<ToolkitItem[]>>;
  newToolkitItem: { title: string; description: string; instructions: string; category: string; duration: string };
  setNewToolkitItem: React.Dispatch<React.SetStateAction<{ title: string; description: string; instructions: string; category: string; duration: string }>>;
  toast: any;
}

export const useToolkitHandlers = ({
  toolkitItems,
  setToolkitItems,
  newToolkitItem,
  setNewToolkitItem,
  toast
}: UseToolkitHandlersProps) => {
  const handleAddToolkitItem = () => {
    if (!newToolkitItem.title.trim() || !newToolkitItem.instructions.trim()) return;
    const toolkitItem: ToolkitItem = {
      id: Date.now().toString(),
      title: newToolkitItem.title,
      description: newToolkitItem.description,
      instructions: newToolkitItem.instructions,
      category: newToolkitItem.category || 'General',
      duration: newToolkitItem.duration
    };
    setToolkitItems(prev => [...prev, toolkitItem]);
    setNewToolkitItem({ title: '', description: '', instructions: '', category: '', duration: '' });
    toast({
      title: "Toolkit item added",
      description: "The toolkit item has been added to the database."
    });
  };

  const handleDeleteToolkitItem = (id: string) => {
    setToolkitItems(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Toolkit item deleted",
      description: "The toolkit item has been removed."
    });
  };

  const handleBulkImportToolkitItems = (items: any[]) => {
    setToolkitItems(prev => [...prev, ...items]);
    toast({
      title: "Bulk import successful",
      description: `${items.length} toolkit items have been imported.`
    });
  };

  return {
    handleAddToolkitItem,
    handleDeleteToolkitItem,
    handleBulkImportToolkitItems
  };
};
