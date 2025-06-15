
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MoodSelector from './MoodSelector';
import MoodIntensitySlider from './forms/MoodIntensitySlider';
import MoodNoteInput from './forms/MoodNoteInput';
import MoodFactors from './MoodFactors';

interface MoodTrackingFormProps {
  selectedMood: string | null;
  moodIntensity: number[];
  moodNote: string;
  selectedFactors: string[];
  moodFactors: string[];
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
  onMoodSelection,
  onIntensityChange,
  onNoteChange,
  onFactorToggle,
  onSaveMood
}) => {
  return (
    <Card className="p-6 bg-white/90">
      <h2 className="text-2xl font-bold mb-6" style={{color: '#737373'}}>
        How are you feeling today?
      </h2>
      
      <div className="space-y-6">
        <MoodSelector 
          selectedMood={selectedMood} 
          onMoodSelection={onMoodSelection} 
        />
        
        {selectedMood && (
          <>
            <MoodIntensitySlider
              intensity={moodIntensity}
              onIntensityChange={onIntensityChange}
            />
            
            <MoodFactors
              factors={moodFactors}
              selectedFactors={selectedFactors}
              onFactorToggle={onFactorToggle}
            />
            
            <MoodNoteInput
              note={moodNote}
              onNoteChange={onNoteChange}
            />
            
            <Button onClick={onSaveMood} className="w-full" size="lg">
              Save Mood Entry
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default MoodTrackingForm;
