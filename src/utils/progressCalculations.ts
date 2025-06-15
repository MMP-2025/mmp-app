
import { StorageManager } from '@/utils/storage';
import { UserProgress } from '@/types/achievements';

export const calculateCurrentStreak = (): number => {
  const moodEntries = StorageManager.load('mood_entries', []);
  if (moodEntries.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  const sortedEntries = moodEntries.sort((a: any, b: any) => b.timestamp - a.timestamp);

  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].date);
    const diffDays = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === i) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const calculateLongestStreak = (): number => {
  return calculateCurrentStreak();
};

export const calculateTotalDays = (): number => {
  const moodEntries = StorageManager.load('mood_entries', []);
  const uniqueDates = new Set(moodEntries.map((entry: any) => entry.date));
  return uniqueDates.size;
};

export const loadUserProgress = (): UserProgress => {
  const moodEntries = StorageManager.load('mood_entries', []).length;
  const journalEntries = StorageManager.load('journal_entries', []).length;
  const mindfulnessProgress = StorageManager.load('mindfulness_progress', { sessions: [] });
  const userBehavior = StorageManager.load('user_behavior', null);

  return {
    moodEntries,
    journalEntries,
    mindfulnessSessions: mindfulnessProgress.sessions?.length || 0,
    currentStreak: calculateCurrentStreak(),
    longestStreak: calculateLongestStreak(),
    totalDays: calculateTotalDays(),
    featuresUsed: userBehavior?.mostUsedFeatures || []
  };
};
