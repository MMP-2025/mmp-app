
import { supabase } from '@/integrations/supabase/client';
import { Resource } from '@/types/provider';

interface UseResourceHandlersProps {
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  newResource: { title: string; description: string; url: string; file_type: string };
  setNewResource: React.Dispatch<React.SetStateAction<{ title: string; description: string; url: string; file_type: string }>>;
  showSuccess: (title: string, description?: string) => void;
  showError: (title: string, description?: string) => void;
}

export const useResourceHandlers = ({
  resources,
  setResources,
  newResource,
  setNewResource,
  showSuccess,
  showError
}: UseResourceHandlersProps) => {
  const handleAddResource = async () => {
    if (!newResource.title.trim() || !newResource.url.trim()) {
      showError("Validation Error", "Title and URL are required");
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('resources')
        .insert({
          title: newResource.title,
          description: newResource.description,
          url: newResource.url,
          file_type: newResource.file_type || 'pdf',
          provider_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setResources(prev => [...prev, data as any]);
      setNewResource({ title: '', description: '', url: '', file_type: 'pdf' });
      showSuccess("Resource added", "The resource has been added to the database.");
    } catch (error) {
      console.error('Error adding resource:', error);
      showError("Error", "Failed to add resource. Make sure you have provider role.");
    }
  };

  const handleDeleteResource = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setResources(prev => prev.filter(r => r.id !== id));
      showSuccess("Resource deleted", "The resource has been removed.");
    } catch (error) {
      console.error('Error deleting resource:', error);
      showError("Error", "Failed to delete resource.");
    }
  };

  return {
    handleAddResource,
    handleDeleteResource
  };
};
