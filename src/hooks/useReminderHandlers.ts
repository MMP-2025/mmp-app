
import { Reminder } from '@/types/provider';

interface UseReminderHandlersProps {
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  newReminder: { title: string; message: string; frequency: Reminder['frequency']; category: string };
  setNewReminder: React.Dispatch<React.SetStateAction<{ title: string; message: string; frequency: Reminder['frequency']; category: string }>>;
  toast: any;
}

export const useReminderHandlers = ({
  reminders,
  setReminders,
  newReminder,
  setNewReminder,
  toast
}: UseReminderHandlersProps) => {
  const handleAddReminder = () => {
    if (!newReminder.title.trim() || !newReminder.message.trim()) return;
    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      message: newReminder.message,
      frequency: newReminder.frequency,
      category: newReminder.category || 'General'
    };
    setReminders(prev => [...prev, reminder]);
    setNewReminder({ title: '', message: '', frequency: 'daily', category: '' });
    toast({
      title: "Reminder added",
      description: "The reminder has been added to the database."
    });
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Reminder deleted",
      description: "The reminder has been removed."
    });
  };

  const handleBulkImportReminders = (items: any[]) => {
    setReminders(prev => [...prev, ...items]);
    toast({
      title: "Bulk import successful",
      description: `${items.length} reminders have been imported.`
    });
  };

  return {
    handleAddReminder,
    handleDeleteReminder,
    handleBulkImportReminders
  };
};
