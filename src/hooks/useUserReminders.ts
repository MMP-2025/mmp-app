import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UserReminder {
  id: string;
  user_id: string;
  message: string;
  time: string;
  frequency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useUserReminders = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<UserReminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'guest') {
      fetchReminders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchReminders = async () => {
    if (!user || user.role === 'guest') return;

    try {
      const { data, error } = await supabase
        .from('user_reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReminders((data || []) as UserReminder[]);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const addReminder = async (message: string, time: string = '09:00', frequency: string = 'daily') => {
    if (!user || user.role === 'guest') {
      toast.error('Please log in to add reminders');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_reminders')
        .insert([{
          user_id: user.id,
          message,
          time,
          frequency
        }])
        .select()
        .single();

      if (error) throw error;
      setReminders(prev => [data as UserReminder, ...prev]);
      toast.success('Reminder added!');
      return data;
    } catch (error) {
      console.error('Error adding reminder:', error);
      toast.error('Failed to add reminder');
    }
  };

  const updateReminder = async (id: string, updates: Partial<UserReminder>) => {
    try {
      const { error } = await supabase
        .from('user_reminders')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setReminders(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
      toast.success('Reminder updated!');
    } catch (error) {
      console.error('Error updating reminder:', error);
      toast.error('Failed to update reminder');
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setReminders(prev => prev.filter(r => r.id !== id));
      toast.success('Reminder removed');
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast.error('Failed to delete reminder');
    }
  };

  return {
    reminders,
    loading,
    addReminder,
    updateReminder,
    deleteReminder,
    refetch: fetchReminders
  };
};
