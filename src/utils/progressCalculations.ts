import { StorageManager } from '@/utils/storage';
import { UserProgress } from '@/types/achievements';

const getDaysDifference = (dateStr1: string, dateStr2: string): number => {
  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
};

export const calculateCurrentStreak = (): number => {
  const moodEntries = StorageManager.load<{ date: string }[]>('mood_entries', []);
  if (moodEntries.length === 0) return 0;

  const uniqueDates = [...new Set(moodEntries.map(entry => entry.date))].sort().reverse();
  
  if (uniqueDates.length === 0) return 0;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const latestDate = uniqueDates[0];

  if (latestDate !== today && latestDate !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const diff = getDaysDifference(uniqueDates[i + 1], uniqueDates[i]);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const calculateLongestStreak = (): number => {
  const moodEntries = StorageManager.load<{ date: string }[]>('mood_entries', []);
  if (moodEntries.length === 0) return 0;

  const uniqueDates = [...new Set(moodEntries.map(entry => entry.date))].sort();

  if (uniqueDates.length < 2) return uniqueDates.length;

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const diff = getDaysDifference(uniqueDates[i - 1], uniqueDates[i]);
    if (diff === 1) {
      currentStreak++;
    } else {
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 1;
    }
  }

  return Math.max(longestStreak, currentStreak);
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
