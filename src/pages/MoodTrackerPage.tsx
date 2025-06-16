
import React, { useState, useCallback } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { useAnalytics } from '@/hooks/useAnalytics';
import { usePersonalization } from '@/hooks/usePersonalization';
import { useMoodData } from '@/hooks/useMoodData';
import { useMoodForm } from '@/hooks/useMoodForm';
import MoodTrackerHeader from '@/components/mood/MoodTrackerHeader';
import MoodTrackerTabs from '@/components/mood/MoodTrackerTabs';
import MoodTrackerContent from '@/components/mood/MoodTrackerContent';

const MoodTrackerPage = () => {
  const [currentTab, setCurrentTab] = useState('track');
  const { trackMoodEntry, trackAction } = useAnalytics();
  const { trackFeatureUsage, trackMoodEntry: trackMoodEntryPersonalized, userBehavior } = usePersonalization();
  
  const { moodHistory, saveMoodEntry, exportMoodData } = useMoodData();
  const {
    selectedMood,
    setSelectedMood,
    moodIntensity,
    setMoodIntensity,
    moodNote,
    setMoodNote,
    selectedFactors,
    sleepHours,
    setSleepHours,
    exerciseMinutes,
    setExerciseMinutes,
    cycleTracking,
    setCycleTracking,
    cycleDay,
    setCycleDay,
    weather,
    setWeather,
    location,
    setLocation,
    resetForm,
    handleFactorToggle
  } = useMoodForm();

  const moodFactors = [
    'Work/School', 'Relationships', 'Health', 'Sleep', 'Exercise',
    'Weather', 'Social Media', 'Finances', 'Family', 'Friends',
    'Stress', 'Relaxation', 'Entertainment', 'Food', 'Travel'
  ];

  const trackFeatureUsageCallback = useCallback(() => {
    trackFeatureUsage('mood-tracker');
  }, [trackFeatureUsage]);

  React.useEffect(() => {
    trackFeatureUsageCallback();
  }, [trackFeatureUsageCallback]);

  const handleMoodSelection = (moodName: string) => {
    setSelectedMood(moodName);
    trackAction('mood_selected', { mood: moodName });
  };

  const handleSaveMood = () => {
    if (!selectedMood) {
      toast.error('Please select a mood first');
      return;
    }

    const newEntry = {
      id: `mood_${Date.now()}`,
      mood: selectedMood,
      intensity: moodIntensity[0],
      note: moodNote,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
      factors: selectedFactors,
      sleepHours: sleepHours[0],
      exercise: exerciseMinutes[0] > 0
    };

    saveMoodEntry(newEntry);
    trackMoodEntry(selectedMood, moodNote);
    trackMoodEntryPersonalized(selectedMood, selectedFactors);
    
    toast.success('Mood entry saved successfully!');
    resetForm();
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
              sleepHours={sleepHours}
              setSleepHours={setSleepHours}
              exerciseMinutes={exerciseMinutes}
              setExerciseMinutes={setExerciseMinutes}
              cycleTracking={cycleTracking}
              setCycleTracking={setCycleTracking}
              cycleDay={cycleDay}
              setCycleDay={setCycleDay}
              weather={weather}
              setWeather={setWeather}
              location={location}
              setLocation={setLocation}
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
