
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { useAnalytics } from '@/hooks/useAnalytics';
import { StorageManager, STORAGE_KEYS } from '@/utils/storage';
import { usePersonalization } from '@/hooks/usePersonalization';
import MoodTrackerHeader from '@/components/mood/MoodTrackerHeader';
import MoodTrackerTabs from '@/components/mood/MoodTrackerTabs';
import MoodTrackerContent from '@/components/mood/MoodTrackerContent';

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

const MoodTrackerPage = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodIntensity, setMoodIntensity] = useState<number[]>([5]);
  const [moodNote, setMoodNote] = useState('');
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [currentTab, setCurrentTab] = useState('track');
  const { trackMoodEntry, trackAction } = useAnalytics();
  const { trackFeatureUsage, trackMoodEntry: trackMoodEntryPersonalized, userBehavior } = usePersonalization();

  const moodFactors = [
    'Work/School', 'Relationships', 'Health', 'Sleep', 'Exercise',
    'Weather', 'Social Media', 'Finances', 'Family', 'Friends',
    'Stress', 'Relaxation', 'Entertainment', 'Food', 'Travel'
  ];

  const trackFeatureUsageCallback = useCallback(() => {
    trackFeatureUsage('mood-tracker');
  }, [trackFeatureUsage]);

  useEffect(() => {
    const savedMoods = StorageManager.load<MoodEntry[]>(STORAGE_KEYS.MOOD_ENTRIES, []);
    setMoodHistory(savedMoods);
    trackFeatureUsageCallback();
  }, [trackFeatureUsageCallback]);

  const handleMoodSelection = (moodName: string) => {
    setSelectedMood(moodName);
    trackAction('mood_selected', { mood: moodName });
  };

  const handleFactorToggle = (factor: string) => {
    setSelectedFactors(prev => 
      prev.includes(factor) 
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    );
  };

  const handleSaveMood = () => {
    if (!selectedMood) {
      toast.error('Please select a mood first');
      return;
    }

    const newEntry: MoodEntry = {
      id: `mood_${Date.now()}`,
      mood: selectedMood,
      intensity: moodIntensity[0],
      note: moodNote,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
      factors: selectedFactors,
      sleepHours: Math.floor(Math.random() * 4) + 6,
      exercise: selectedFactors.includes('Exercise')
    };

    const updatedHistory = [newEntry, ...moodHistory];
    setMoodHistory(updatedHistory);
    StorageManager.save(STORAGE_KEYS.MOOD_ENTRIES, updatedHistory);

    trackMoodEntry(selectedMood, moodNote);
    trackMoodEntryPersonalized(selectedMood, selectedFactors);
    
    toast.success('Mood entry saved successfully!');
    setSelectedMood(null);
    setMoodIntensity([5]);
    setMoodNote('');
    setSelectedFactors([]);
  };

  const exportMoodData = () => {
    const dataStr = JSON.stringify(moodHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mood-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Mood data exported successfully!');
  };

  return (
    <div className="bg-mental-blue min-h-screen">
      <SidebarLayout>
        <div className="space-y-6 max-w-4xl mx-auto">
          <MoodTrackerHeader onExportData={exportMoodData} />
          
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <MoodTrackerTabs currentTab={currentTab} onTabChange={setCurrentTab} />
            
            <MoodTrackerContent
              selectedMood={selectedMood}
              moodIntensity={moodIntensity}
              moodNote={moodNote}
              selectedFactors={selectedFactors}
              moodHistory={moodHistory}
              moodFactors={moodFactors}
              userBehavior={userBehavior}
              onMoodSelection={handleMoodSelection}
              onIntensityChange={setMoodIntensity}
              onNoteChange={setMoodNote}
              onFactorToggle={handleFactorToggle}
              onSaveMood={handleSaveMood}
            />
          </Tabs>
        </div>
      </SidebarLayout>
    </div>
  );
};

export default MoodTrackerPage;
