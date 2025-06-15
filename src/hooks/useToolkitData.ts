
import { useState } from 'react';
import { ToolkitItem } from '@/types/provider';

export const useToolkitData = () => {
  const [toolkitItems, setToolkitItems] = useState<ToolkitItem[]>([]);
  const [newToolkitItem, setNewToolkitItem] = useState({
    title: '',
    description: '',
    instructions: '',
    category: '',
    duration: ''
  });

  return {
    toolkitItems,
    setToolkitItems,
    newToolkitItem,
    setNewToolkitItem
  };
};
