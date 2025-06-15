
import { ToolkitItem } from '@/types/provider';

interface UseToolkitHandlersProps {
  toolkitItems: ToolkitItem[];
  setToolkitItems: React.Dispatch<React.SetStateAction<ToolkitItem[]>>;
  newToolkitItem: { title: string; description: string; instructions: string; category: string; duration: string };
  setNewToolkitItem: React.Dispatch<React.SetStateAction<{ title: string; description: string; instructions: string; category: string; duration: string }>>;
  showSuccess: (title: string, description?: string) => void;
  showError: (title: string, description?: string) => void;
}

export const useToolkitHandlers = ({
  toolkitItems,
  setToolkitItems,
  newToolkitItem,
  setNewToolkitItem,
  showSuccess,
  showError
}: UseToolkitHandlersProps) => {
  const handleAddToolkitItem = () => {
    if (!newToolkitItem.title.trim() || !newToolkitItem.instructions.trim()) {
      showError("Validation Error", "Title and instructions are required");
      return;
    }
    
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
    showSuccess("Toolkit item added", "The toolkit item has been added to the database.");
  };

  const handleDeleteToolkitItem = (id: string) => {
    setToolkitItems(prev => prev.filter(t => t.id !== id));
    showSuccess("Toolkit item deleted", "The toolkit item has been removed.");
  };

  const handleBulkImportToolkitItems = (items: any[]) => {
    if (items.length === 0) {
      showError("Import Error", "No valid toolkit items found to import");
      return;
    }
    
    setToolkitItems(prev => [...prev, ...items]);
    showSuccess("Bulk import successful", `${items.length} toolkit items have been imported.`);
  };

  return {
    handleAddToolkitItem,
    handleDeleteToolkitItem,
    handleBulkImportToolkitItems
  };
};
