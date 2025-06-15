
import { useToolkitData } from './useToolkitData';
import { useReminderData } from './useReminderData';

export const useToolsData = () => {
  const toolkitData = useToolkitData();
  const reminderData = useReminderData();

  return {
    // Toolkit data
    toolkitItems: toolkitData.toolkitItems,
    setToolkitItems: toolkitData.setToolkitItems,
    newToolkitItem: toolkitData.newToolkitItem,
    setNewToolkitItem: toolkitData.setNewToolkitItem,
    
    // Reminder data
    reminders: reminderData.reminders,
    setReminders: reminderData.setReminders,
    newReminder: reminderData.newReminder,
    setNewReminder: reminderData.setNewReminder
  };
};
