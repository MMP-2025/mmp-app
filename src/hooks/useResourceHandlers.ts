
import { Resource } from '@/types/provider';

interface UseResourceHandlersProps {
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  newResource: { title: string; description: string; content: string; category: string };
  setNewResource: React.Dispatch<React.SetStateAction<{ title: string; description: string; content: string; category: string }>>;
  toast: any;
}

export const useResourceHandlers = ({
  resources,
  setResources,
  newResource,
  setNewResource,
  toast
}: UseResourceHandlersProps) => {
  const handleAddResource = () => {
    if (!newResource.title.trim() || !newResource.content.trim()) return;
    const resource: Resource = {
      id: Date.now().toString(),
      title: newResource.title,
      description: newResource.description,
      content: newResource.content,
      category: newResource.category || 'General'
    };
    setResources(prev => [...prev, resource]);
    setNewResource({ title: '', description: '', content: '', category: '' });
    toast({
      title: "Resource added",
      description: "The resource has been added to the database."
    });
  };

  const handleDeleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Resource deleted",
      description: "The resource has been removed."
    });
  };

  return {
    handleAddResource,
    handleDeleteResource
  };
};
