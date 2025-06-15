
import { Reminder } from '@/types/provider';

interface UseReminderHandlersProps {
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  newReminder: { title: string; message: string; frequency: Reminder['frequency']; category: string };
  setNewReminder: React.Dispatch<React.SetStateAction<{ title: string; message: string; frequency: Reminder['frequency']; category: string }>>;
  showSuccess: (title: string, description?: string) => void;
  showError: (title: string, description?: string) => void;
}

export const useReminderHandlers = ({
  reminders,
  setReminders,
  newReminder,
  setNewReminder,
  showSuccess,
  showError
}: UseReminderHandlersProps) => {
  const handleAddReminder = () => {
    if (!newReminder.title.trim() || !newReminder.message.trim()) {
      showError("Validation Error", "Title and message are required");
      return;
    }
    
    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      message: newReminder.message,
      frequency: newReminder.frequency,
      category: newReminder.category || 'General'
    };
    setReminders(prev => [...prev, reminder]);
    setNewReminder({ title: '', message: '', frequency: 'daily', category: '' });
    showSuccess("Reminder added", "The reminder has been added to the database.");
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    showSuccess("Reminder deleted", "The reminder has been removed.");
  };

  const handleBulkImportReminders = (items: any[]) => {
    if (items.length === 0) {
      showError("Import Error", "No valid reminders found to import");
      return;
    }
    
    setReminders(prev => [...prev, ...items]);
    showSuccess("Bulk import successful", `${items.length} reminders have been imported.`);
  };

  return {
    handleAddReminder,
    handleDeleteReminder,
    handleBulkImportReminders
  };
};
