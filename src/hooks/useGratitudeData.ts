
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GratitudePrompt } from '@/types/provider';

export const useGratitudeData = () => {
  const [gratitudePrompts, setGratitudePrompts] = useState<GratitudePrompt[]>([]);
  const [newGratitudePrompt, setNewGratitudePrompt] = useState<{
    prompt: string;
    category: string;
    difficulty: GratitudePrompt['difficulty'];
  }>({
    prompt: '',
    category: '',
    difficulty: 'simple'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const { data, error } = await supabase
          .from('gratitude_prompts')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setGratitudePrompts((data || []) as any);
      } catch (error) {
        console.error('Error fetching gratitude prompts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  return {
    gratitudePrompts,
    setGratitudePrompts,
    newGratitudePrompt,
    setNewGratitudePrompt,
    loading
  };
};
