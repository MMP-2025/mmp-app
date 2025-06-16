
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import MoodTrackingForm from '../MoodTrackingForm';

interface TrackingTabContentProps {
  selectedMood: string | null;
  moodIntensity: number[];
  moodNote: string;
  selectedFactors: string[];
  moodFactors: string[];
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

const TrackingTabContent: React.FC<TrackingTabContentProps> = ({
  selectedMood,
  moodIntensity,
  moodNote,
  selectedFactors,
  moodFactors,
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
    <TabsContent value="track" className="space-y-6">
      <MoodTrackingForm
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
    </TabsContent>
  );
};

export default TrackingTabContent;
