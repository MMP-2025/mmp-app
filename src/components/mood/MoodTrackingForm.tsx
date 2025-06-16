
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import EmotionSelector from './EmotionSelector';
import IntensitySlider from './IntensitySlider';
import MoodNoteInput from './MoodNoteInput';
import MoodFactors from './MoodFactors';
import HabitTrackers from './HabitTrackers';
import EnvironmentTracker from './EnvironmentTracker';

interface MoodTrackingFormProps {
  selectedMood: string | null;
  moodIntensity: number[];
  moodNote: string;
  selectedFactors: string[];
  moodFactors: string[];
  sleepHours?: number[];
  setSleepHours?: (hours: number[]) => void;
  exerciseMinutes?: number[];
  setExerciseMinutes?: (minutes: number[]) => void;
  cycleTracking?: boolean;
  setCycleTracking?: (enabled: boolean) => void;
  cycleDay?: number[];
  setCycleDay?: (day: number[]) => void;
  weather?: string;
  setWeather?: (weather: string) => void;
  location?: string;
  setLocation?: (location: string) => void;
  onMoodSelection: (mood: string) => void;
  onIntensityChange: (intensity: number[]) => void;
  onNoteChange: (note: string) => void;
  onFactorToggle: (factor: string) => void;
  onSaveMood: () => void;
}

const MoodTrackingForm: React.FC<MoodTrackingFormProps> = ({
  selectedMood,
  moodIntensity,
  moodNote,
  selectedFactors,
  moodFactors,
  sleepHours = [7],
  setSleepHours = () => {},
  exerciseMinutes = [30],
  setExerciseMinutes = () => {},
  cycleTracking = false,
  setCycleTracking = () => {},
  cycleDay = [1],
  setCycleDay = () => {},
  weather = '',
  setWeather = () => {},
  location = '',
  setLocation = () => {},
  onMoodSelection,
  onIntensityChange,
  onNoteChange,
  onFactorToggle,
  onSaveMood
}) => {
  return (
    <div className="space-y-6">
      <EmotionSelector 
        selectedMood={selectedMood} 
        onMoodSelection={onMoodSelection} 
      />
      
      {selectedMood && (
        <>
          <IntensitySlider 
            moodIntensity={moodIntensity} 
            onIntensityChange={onIntensityChange} 
          />
          
          <MoodNoteInput 
            moodNote={moodNote} 
            onNoteChange={onNoteChange} 
          />
          
          <MoodFactors 
            selectedFactors={selectedFactors}
            moodFactors={moodFactors}
            onFactorToggle={onFactorToggle}
          />

          <HabitTrackers
            sleepHours={sleepHours}
            setSleepHours={setSleepHours}
            exerciseMinutes={exerciseMinutes}
            setExerciseMinutes={setExerciseMinutes}
            cycleTracking={cycleTracking}
            setCycleTracking={setCycleTracking}
            cycleDay={cycleDay}
            setCycleDay={setCycleDay}
          />

          <EnvironmentTracker
            weather={weather}
            setWeather={setWeather}
            location={location}
            setLocation={setLocation}
          />
          
          <Card className="p-6 bg-white/90">
            <Button 
              onClick={onSaveMood} 
              className="w-full bg-mental-blue hover:bg-mental-blue/80"
              size="lg"
            >
              Save Mood Entry
            </Button>
          </Card>
        </>
      )}
    </div>
  );
};

export default MoodTrackingForm;
