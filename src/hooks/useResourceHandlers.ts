
import { Resource } from '@/types/provider';

interface UseResourceHandlersProps {
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  newResource: { title: string; description: string; content: string; category: string };
  setNewResource: React.Dispatch<React.SetStateAction<{ title: string; description: string; content: string; category: string }>>;
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
  const handleAddResource = () => {
    if (!newResource.title.trim() || !newResource.content.trim()) {
      showError("Validation Error", "Title and content are required");
      return;
    }
    
    const resource: Resource = {
      id: Date.now().toString(),
      title: newResource.title,
      description: newResource.description,
      content: newResource.content,
      category: newResource.category || 'General'
    };
    setResources(prev => [...prev, resource]);
    setNewResource({ title: '', description: '', content: '', category: '' });
    showSuccess("Resource added", "The resource has been added to the database.");
  };

  const handleDeleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
    showSuccess("Resource deleted", "The resource has been removed.");
  };

  return {
    handleAddResource,
    handleDeleteResource
  };
};
