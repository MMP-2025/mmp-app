import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface HabitLog {
  id: string;
  user_id: string;
  habit_name: string;
  completed: boolean;
  notes?: string;
  date: string;
  created_at: string;
}

export const useHabitLogs = () => {
  const { user } = useAuth();
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchHabitLogs = async () => {
      const { data, error } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching habit logs:', error);
      } else {
        setHabitLogs(data || []);
      }
      setLoading(false);
    };

    fetchHabitLogs();
  }, [user]);

  const addHabitLog = useCallback(async (habitData: Omit<HabitLog, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) {
      toast.error('Please sign in to log habits');
      return;
    }

    const { data, error } = await supabase
      .from('habit_logs')
      .insert({
        user_id: user.id,
        ...habitData
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding habit log:', error);
      toast.error('Failed to log habit');
      return;
    }

    if (data) {
      setHabitLogs(prev => [data, ...prev]);
      toast.success('Habit logged successfully');
    }
  }, [user]);

  const updateHabitLog = useCallback(async (id: string, updates: Partial<HabitLog>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('habit_logs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating habit log:', error);
      toast.error('Failed to update habit');
      return;
    }

    if (data) {
      setHabitLogs(prev => prev.map(log => log.id === id ? data : log));
      toast.success('Habit updated');
    }
  }, [user]);

  const deleteHabitLog = useCallback(async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('habit_logs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting habit log:', error);
      toast.error('Failed to delete habit');
      return;
    }

    setHabitLogs(prev => prev.filter(log => log.id !== id));
    toast.success('Habit deleted');
  }, [user]);

  return {
    habitLogs,
    loading,
    addHabitLog,
    updateHabitLog,
    deleteHabitLog
  };
};
