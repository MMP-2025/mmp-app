
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FeelingsWheel from './FeelingsWheel';
import IntensitySlider from './IntensitySlider';
import MoodNoteInput from './forms/MoodNoteInput';
import MoodFactors from './MoodFactors';
import HabitTrackers from './HabitTrackers';
import EnvironmentTracker from './EnvironmentTracker';
import { SuccessAnimation } from '@/components/common/SuccessAnimation';

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
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    onSaveMood();
    setShowSuccess(true);
  };

  return (
    <>
      {showSuccess && (
        <SuccessAnimation 
          message="Mood logged! 💙"
          onComplete={() => setShowSuccess(false)}
        />
      )}
    <div className="space-y-6">
      <FeelingsWheel 
        selectedEmotion={selectedMood} 
        onEmotionSelect={onMoodSelection} 
      />
      
      {selectedMood && (
        <>
          <IntensitySlider 
            intensity={moodIntensity[0]} 
            onIntensityChange={(intensity) => onIntensityChange([intensity])} 
          />
          
          <MoodNoteInput 
            note={moodNote} 
            onNoteChange={onNoteChange} 
          />
          
          <MoodFactors 
            selectedFactors={selectedFactors}
            factors={moodFactors}
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
              onClick={handleSave} 
              className="w-full bg-mental-blue hover:bg-mental-blue/80 hover-scale"
              size="lg"
            >
              Save Mood Entry
            </Button>
          </Card>
        </>
      )}
    </div>
    </>
  );
};

export default MoodTrackingForm;
