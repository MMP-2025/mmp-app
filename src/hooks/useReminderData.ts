
import { useState } from 'react';
import { Reminder } from '@/types/provider';

export const useReminderData = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState<{
    title: string;
    message: string;
    frequency: Reminder['frequency'];
    category: string;
    targetUser?: string;
  }>({
    title: '',
    message: '',
    frequency: 'daily',
    category: '',
    targetUser: ''
  });

  return {
    reminders,
    setReminders,
    newReminder,
    setNewReminder
  };
};
