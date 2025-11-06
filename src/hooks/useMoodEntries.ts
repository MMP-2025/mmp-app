import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

export const useMoodEntries = () => {
  const { user } = useAuth();
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setMoodHistory([]);
      setLoading(false);
      return;
    }

    const fetchMoodEntries = async () => {
      try {
        const { data, error } = await supabase
          .from('mood_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedEntries: MoodEntry[] = (data || []).map(entry => ({
          id: entry.id,
          mood: entry.mood,
          intensity: entry.intensity,
          note: entry.note || '',
          timestamp: new Date(entry.created_at).getTime(),
          date: entry.date,
          factors: entry.factors || [],
          location: entry.location || undefined,
          weather: entry.weather_condition ? {
            condition: entry.weather_condition as any,
            temperature: entry.weather_temperature || 0,
            humidity: entry.weather_humidity || 0,
            location: entry.weather_location || ''
          } : undefined,
          sleepHours: entry.sleep_hours ? Number(entry.sleep_hours) : undefined,
          exercise: entry.exercise || false
        }));

        setMoodHistory(formattedEntries);
      } catch (error) {
        console.error('Error fetching mood entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodEntries();
  }, [user]);

  const saveMoodEntry = useCallback(async (entry: Omit<MoodEntry, 'id'>) => {
    if (!user) {
      throw new Error('You must be logged in to save mood entries');
    }

    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          mood: entry.mood,
          intensity: entry.intensity,
          note: entry.note,
          date: entry.date,
          factors: entry.factors,
          location: entry.location,
          weather_condition: entry.weather?.condition,
          weather_temperature: entry.weather?.temperature,
          weather_humidity: entry.weather?.humidity,
          weather_location: entry.weather?.location,
          sleep_hours: entry.sleepHours,
          exercise: entry.exercise
        })
        .select()
        .single();

      if (error) throw error;

      const newEntry: MoodEntry = {
        id: data.id,
        mood: data.mood,
        intensity: data.intensity,
        note: data.note || '',
        timestamp: new Date(data.created_at).getTime(),
        date: data.date,
        factors: data.factors || [],
        location: data.location || undefined,
        weather: data.weather_condition ? {
          condition: data.weather_condition as any,
          temperature: data.weather_temperature || 0,
          humidity: data.weather_humidity || 0,
          location: data.weather_location || ''
        } : undefined,
        sleepHours: data.sleep_hours ? Number(data.sleep_hours) : undefined,
        exercise: data.exercise || false
      };

      setMoodHistory(prev => [newEntry, ...prev]);
    } catch (error) {
      console.error('Error saving mood entry:', error);
      throw error;
    }
  }, [user]);

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
    loading,
    saveMoodEntry,
    exportMoodData
  };
};
