import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface GratitudeEntry {
  id: string;
  content: string;
  date: Date;
  category?: string;
}

export const useGratitudeEntries = () => {
  const { user } = useAuth();
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setGratitudeEntries([]);
      setLoading(false);
      return;
    }

    const fetchGratitudeEntries = async () => {
      try {
        const { data, error } = await supabase
          .from('gratitude_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedEntries: GratitudeEntry[] = (data || []).map(entry => ({
          id: entry.id,
          content: entry.content,
          date: new Date(entry.created_at),
          category: entry.category || undefined
        }));

        setGratitudeEntries(formattedEntries);
      } catch (error) {
        console.error('Error fetching gratitude entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGratitudeEntries();
  }, [user]);

  const saveGratitudeEntry = useCallback(async (
    content: string,
    category?: string
  ) => {
    if (!user) {
      throw new Error('You must be logged in to save gratitude entries');
    }

    try {
      const { data, error } = await supabase
        .from('gratitude_entries')
        .insert({
          user_id: user.id,
          content,
          category: category || 'General',
          date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (error) throw error;

      const newEntry: GratitudeEntry = {
        id: data.id,
        content: data.content,
        date: new Date(data.created_at),
        category: data.category || undefined
      };

      setGratitudeEntries(prev => [newEntry, ...prev]);
    } catch (error) {
      console.error('Error saving gratitude entry:', error);
      throw error;
    }
  }, [user]);

  return {
    gratitudeEntries,
    loading,
    saveGratitudeEntry
  };
};
