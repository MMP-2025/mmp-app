
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Heart, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import MoodCardSelector from './MoodCardSelector';
import IntensitySlider from './IntensitySlider';
import MoodNoteInput from './forms/MoodNoteInput';
import MoodFactors from './MoodFactors';
import HabitTrackers from './HabitTrackers';
import EnvironmentTracker from './EnvironmentTracker';
import { SuccessAnimation } from '@/components/common/SuccessAnimation';

const HIGH_RISK_EMOTIONS = [
  'hopeless', 'heartbroken', 'empty', 'panicked', 'overwhelmed',
  'grieving', 'furious', 'lonely',
];

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

  const isHighRisk =
    !!selectedMood &&
    HIGH_RISK_EMOTIONS.includes(selectedMood.toLowerCase()) &&
    moodIntensity[0] >= 7;

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
      <MoodCardSelector 
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

          {isHighRisk && (
            <Alert className="border-destructive/40 bg-destructive/5">
              <Heart className="h-4 w-4 text-destructive" />
              <AlertTitle className="text-foreground">
                We're glad you shared. You're not alone.
              </AlertTitle>
              <AlertDescription className="text-muted-foreground space-y-3">
                <p>
                  What you're feeling sounds really heavy. If you'd like to talk to
                  someone right now, support is available 24/7.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    asChild
                    size="sm"
                    variant="destructive"
                    className="rounded-lg"
                  >
                    <a href="tel:988">
                      <Phone className="h-3.5 w-3.5 mr-1.5" />
                      Call 988
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="rounded-lg">
                    <Link to="/crisis-resources">View crisis resources</Link>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

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
          
          <Card className="p-6 bg-card">
            <Button 
              onClick={handleSave} 
              className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground"
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
