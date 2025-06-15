
import { useState } from 'react';
import { Resource } from '@/types/provider';

export const useResourceData = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    content: '',
    category: ''
  });

  return {
    resources,
    setResources,
    newResource,
    setNewResource
  };
};
