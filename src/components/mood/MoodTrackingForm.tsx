
import React from 'react';
import { Card } from '@/components/ui/card';
import MoodFormHeader from './forms/MoodFormHeader';
import MoodNoteInput from './forms/MoodNoteInput';
import MoodFactors from './MoodFactors';
import SaveMoodButton from './forms/SaveMoodButton';
import EmotionWheel from './EmotionWheel';

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
  const handleEmotionSelect = (emotion: string, intensity: number) => {
    onMoodSelection(emotion);
    onIntensityChange([intensity]);
  };

  return (
    <Card className="p-6 bg-white/90">
      <MoodFormHeader />
      
      <div className="space-y-6">
        <EmotionWheel 
          onEmotionSelect={handleEmotionSelect} 
          selectedEmotion={selectedMood || undefined} 
        />
        
        {selectedMood && (
          <>
            <MoodFactors
              factors={moodFactors}
              selectedFactors={selectedFactors}
              onFactorToggle={onFactorToggle}
            />
            
            <MoodNoteInput
              note={moodNote}
              onNoteChange={onNoteChange}
            />
            
            <SaveMoodButton onSaveMood={onSaveMood} />
          </>
        )}
      </div>
    </Card>
  );
};

export default MoodTrackingForm;
