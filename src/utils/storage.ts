
// Local storage utilities for data persistence
export interface StorageItem<T> {
  data: T;
  timestamp: number;
  version: string;
}

export class StorageManager {
  private static version = '1.0.0';

  static save<T>(key: string, data: T): void {
    try {
      const item: StorageItem<T> = {
        data,
        timestamp: Date.now(),
        version: this.version
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  static load<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      
      const parsed: StorageItem<T> = JSON.parse(item);
      return parsed.data;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return defaultValue;
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}

// Key constants for different data types
export const STORAGE_KEYS = {
  MOOD_ENTRIES: 'mood_entries',
  JOURNAL_ENTRIES: 'journal_entries',
  GRATITUDE_ENTRIES: 'gratitude_entries',
  USER_PREFERENCES: 'user_preferences',
  ANALYTICS_DATA: 'analytics_data',
  MINDFULNESS_PROGRESS: 'mindfulness_progress',
  SAVED_PROMPTS: 'saved_prompts',
  PLANNER_EVENTS: 'planner_events',
  REMINDERS: 'reminders'
} as const;
