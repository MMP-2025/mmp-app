
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
  sleepHours: number[];
  setSleepHours: (hours: number[]) => void;
  exerciseMinutes: number[];
  setExerciseMinutes: (minutes: number[]) => void;
  cycleTracking: boolean;
  setCycleTracking: (enabled: boolean) => void;
  cycleDay: number[];
  setCycleDay: (day: number[]) => void;
  weather: string;
  setWeather: (weather: string) => void;
  location: string;
  setLocation: (location: string) => void;
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
