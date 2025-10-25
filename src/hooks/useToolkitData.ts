
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ToolkitItem } from '@/types/provider';

export const useToolkitData = () => {
  const [toolkitItems, setToolkitItems] = useState<ToolkitItem[]>([]);
  const [newToolkitItem, setNewToolkitItem] = useState({
    title: '',
    description: '',
    instructions: '',
    category: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToolkitItems = async () => {
      try {
        const { data, error } = await supabase
          .from('toolkit_items')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setToolkitItems((data || []) as any);
      } catch (error) {
        console.error('Error fetching toolkit items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchToolkitItems();
  }, []);

  return {
    toolkitItems,
    setToolkitItems,
    newToolkitItem,
    setNewToolkitItem,
    loading
  };
};
