
import { supabase } from '@/integrations/supabase/client';
import { ToolkitItem } from '@/types/provider';

interface UseToolkitHandlersProps {
  toolkitItems: ToolkitItem[];
  setToolkitItems: React.Dispatch<React.SetStateAction<ToolkitItem[]>>;
  newToolkitItem: { title: string; description: string; instructions: string; category: string };
  setNewToolkitItem: React.Dispatch<React.SetStateAction<{ title: string; description: string; instructions: string; category: string }>>;
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
  const handleAddToolkitItem = async () => {
    if (!newToolkitItem.title.trim() || !newToolkitItem.instructions.trim()) {
      showError("Validation Error", "Title and instructions are required");
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('toolkit_items')
        .insert({
          title: newToolkitItem.title,
          description: newToolkitItem.description,
          instructions: newToolkitItem.instructions,
          category: newToolkitItem.category || 'General',
          provider_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setToolkitItems(prev => [...prev, data as any]);
      setNewToolkitItem({ title: '', description: '', instructions: '', category: '' });
      showSuccess("Toolkit item added", "The toolkit item has been added to the database.");
    } catch (error) {
      console.error('Error adding toolkit item:', error);
      showError("Error", "Failed to add toolkit item. Make sure you have provider role.");
    }
  };

  const handleDeleteToolkitItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('toolkit_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setToolkitItems(prev => prev.filter(t => t.id !== id));
      showSuccess("Toolkit item deleted", "The toolkit item has been removed.");
    } catch (error) {
      console.error('Error deleting toolkit item:', error);
      showError("Error", "Failed to delete toolkit item.");
    }
  };

  const handleBulkImportToolkitItems = async (items: any[]) => {
    if (items.length === 0) {
      showError("Import Error", "No valid toolkit items found to import");
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const toolkitToInsert = items.map(item => ({
        title: item.title,
        description: item.description,
        instructions: item.instructions,
        category: item.category || 'General',
        provider_id: user?.id
      }));

      const { data, error } = await supabase
        .from('toolkit_items')
        .insert(toolkitToInsert)
        .select();

      if (error) throw error;

      setToolkitItems(prev => [...prev, ...(data || []) as any]);
      showSuccess("Bulk import successful", `${items.length} toolkit items have been imported.`);
    } catch (error) {
      console.error('Error importing toolkit items:', error);
      showError("Error", "Failed to import toolkit items.");
    }
  };

  return {
    handleAddToolkitItem,
    handleDeleteToolkitItem,
    handleBulkImportToolkitItems
  };
};
