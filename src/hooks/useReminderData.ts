
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Reminder } from '@/types/provider';

export const useReminderData = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState<{
    message: string;
    frequency: Reminder['frequency'];
    time: string;
  }>({
    message: '',
    frequency: 'daily',
    time: '09:00'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const { data, error } = await supabase
          .from('reminders')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReminders((data || []) as any);
      } catch (error) {
        console.error('Error fetching reminders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  return {
    reminders,
    setReminders,
    newReminder,
    setNewReminder,
    loading
  };
};
