import React from 'react';
import TrackingTabContent from './tabs/TrackingTabContent';
import AnalyticsTabContent from './tabs/AnalyticsTabContent';
import AdvancedTabContent from './tabs/AdvancedTabContent';

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

interface MoodTrackerContentProps {
  selectedMood: string | null;
  moodIntensity: number[];
  moodNote: string;
  selectedFactors: string[];
  moodHistory: MoodEntry[];
  moodFactors: string[];
  userBehavior: any;
  onMoodSelection: (mood: string) => void;
  onIntensityChange: (intensity: number[]) => void;
  onNoteChange: (note: string) => void;
  onFactorToggle: (factor: string) => void;
  onSaveMood: () => void;
}

const MoodTrackerContent: React.FC<MoodTrackerContentProps> = ({
  selectedMood,
  moodIntensity,
  moodNote,
  selectedFactors,
  moodHistory,
  moodFactors,
  userBehavior,
  onMoodSelection,
  onIntensityChange,
  onNoteChange,
  onFactorToggle,
  onSaveMood
}) => {
  return (
    <>
      <TrackingTabContent
        selectedMood={selectedMood}
        moodIntensity={moodIntensity}
        moodNote={moodNote}
        selectedFactors={selectedFactors}
        moodFactors={moodFactors}
        onMoodSelection={onMoodSelection}
        onIntensityChange={onIntensityChange}
        onNoteChange={onNoteChange}
        onFactorToggle={onFactorToggle}
        onSaveMood={onSaveMood}
      />

      <AnalyticsTabContent moodHistory={moodHistory} />

      <AdvancedTabContent 
        moodHistory={moodHistory} 
        userBehavior={userBehavior} 
      />
    </>
  );
};

export default MoodTrackerContent;
