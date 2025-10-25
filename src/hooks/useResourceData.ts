
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Resource } from '@/types/provider';

export const useResourceData = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    url: '',
    file_type: 'pdf'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setResources((data || []) as any);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return {
    resources,
    setResources,
    newResource,
    setNewResource,
    loading
  };
};
