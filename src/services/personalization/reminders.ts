
import { UserBehavior, AdaptiveReminder } from '@/types/personalization';

const getOptimalReminderTimes = (userBehavior: UserBehavior | null): string[] => {
  if (!userBehavior) {
    return ['09:00', '14:00', '19:00', '20:00'];
  }

  const { preferredTimeOfDay, engagementLevel } = userBehavior;

  switch (preferredTimeOfDay) {
    case 'morning':
      return engagementLevel === 'high' 
        ? ['08:00', '12:00', '16:00', '20:00']
        : ['09:00', '18:00'];
    case 'afternoon':
      return engagementLevel === 'high'
        ? ['10:00', '14:00', '17:00', '21:00']
        : ['12:00', '19:00'];
    case 'evening':
      return engagementLevel === 'high'
        ? ['11:00', '15:00', '18:00', '21:30']
        : ['14:00', '20:00'];
    case 'night':
      return engagementLevel === 'high'
        ? ['12:00', '16:00', '20:00', '22:00']
        : ['15:00', '21:00'];
    default:
      return ['09:00', '14:00', '19:00', '20:00'];
  }
};

export const getAdaptiveReminders = (userBehavior: UserBehavior | null): AdaptiveReminder[] => {
  const baseReminders: Omit<AdaptiveReminder, 'optimalTime'>[] = [
    {
      id: 'mood_check',
      type: 'mood_check',
      message: 'How are you feeling today? Take a moment to check in with yourself.',
      frequency: 'daily',
      enabled: true
    },
    {
      id: 'mindfulness',
      type: 'mindfulness',
      message: 'Time for a mindful moment. Try a quick breathing exercise.',
      frequency: 'daily',
      enabled: true
    },
    {
      id: 'journal',
      type: 'journal',
      message: 'Reflect on your day with a journal entry.',
      frequency: 'daily',
      enabled: true
    },
    {
      id: 'gratitude',
      type: 'gratitude',
      message: 'What are you grateful for today?',
      frequency: 'daily',
      enabled: true
    }
  ];

  const optimalTimes = getOptimalReminderTimes(userBehavior);

  return baseReminders.map((reminder, index) => ({
    ...reminder,
    optimalTime: optimalTimes[index] || '09:00'
  }));
};
