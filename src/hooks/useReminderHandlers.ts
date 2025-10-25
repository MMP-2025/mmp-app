
import { supabase } from '@/integrations/supabase/client';
import { Reminder } from '@/types/provider';

interface UseReminderHandlersProps {
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  newReminder: { message: string; frequency: Reminder['frequency']; time: string };
  setNewReminder: React.Dispatch<React.SetStateAction<{ message: string; frequency: Reminder['frequency']; time: string }>>;
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
  const handleAddReminder = async () => {
    if (!newReminder.message.trim()) {
      showError("Validation Error", "Message is required");
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('reminders')
        .insert({
          message: newReminder.message,
          frequency: newReminder.frequency,
          time: newReminder.time,
          provider_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setReminders(prev => [...prev, data as any]);
      setNewReminder({ message: '', frequency: 'daily', time: '09:00' });
      showSuccess("Reminder added", "The reminder has been added to the database.");
    } catch (error) {
      console.error('Error adding reminder:', error);
      showError("Error", "Failed to add reminder. Make sure you have provider role.");
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReminders(prev => prev.filter(r => r.id !== id));
      showSuccess("Reminder deleted", "The reminder has been removed.");
    } catch (error) {
      console.error('Error deleting reminder:', error);
      showError("Error", "Failed to delete reminder.");
    }
  };

  const handleBulkImportReminders = async (items: any[]) => {
    if (items.length === 0) {
      showError("Import Error", "No valid reminders found to import");
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const remindersToInsert = items.map(item => ({
        message: item.message,
        frequency: item.frequency || 'daily',
        time: item.time || '09:00',
        provider_id: user?.id
      }));

      const { data, error } = await supabase
        .from('reminders')
        .insert(remindersToInsert)
        .select();

      if (error) throw error;

      setReminders(prev => [...prev, ...(data || []) as any]);
      showSuccess("Bulk import successful", `${items.length} reminders have been imported.`);
    } catch (error) {
      console.error('Error importing reminders:', error);
      showError("Error", "Failed to import reminders.");
    }
  };

  return {
    handleAddReminder,
    handleDeleteReminder,
    handleBulkImportReminders
  };
};
