
import { useState, useEffect, useCallback } from 'react';
import { StorageManager, STORAGE_KEYS } from '@/utils/storage';

interface WeatherData {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  temperature: number;
  humidity: number;
  location: string;
}

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  note: string;
  timestamp: number;
  date: string;
  factors: string[];
  location?: string;
  weather?: WeatherData;
  sleepHours?: number;
  exercise?: boolean;
}

export const useMoodData = () => {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);

  useEffect(() => {
    const savedMoods = StorageManager.load<MoodEntry[]>(STORAGE_KEYS.MOOD_ENTRIES, []);
    setMoodHistory(savedMoods);
  }, []);

  const saveMoodEntry = useCallback((entry: MoodEntry) => {
    const updatedHistory = [entry, ...moodHistory];
    setMoodHistory(updatedHistory);
    StorageManager.save(STORAGE_KEYS.MOOD_ENTRIES, updatedHistory);
  }, [moodHistory]);

  const exportMoodData = useCallback(() => {
    const dataStr = JSON.stringify(moodHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mood-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [moodHistory]);

  return {
    moodHistory,
    setMoodHistory,
    saveMoodEntry,
    exportMoodData
  };
};
