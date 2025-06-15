
import React from 'react';
import { Card } from '@/components/ui/card';
import MoodFormHeader from './forms/MoodFormHeader';
import MoodNoteInput from './forms/MoodNoteInput';
import MoodFactors from './MoodFactors';
import SaveMoodButton from './forms/SaveMoodButton';
import EmotionSelector from './EmotionSelector';
import IntensitySlider from './IntensitySlider';

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
      <MoodFormHeader />
      
      <div className="space-y-6">
        <EmotionSelector 
          onEmotionSelect={onMoodSelection} 
          selectedEmotion={selectedMood || undefined} 
        />
        
        {selectedMood && (
          <>
            <IntensitySlider
              intensity={moodIntensity[0]}
              onIntensityChange={(val) => onIntensityChange([val])}
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
            
            <SaveMoodButton onSaveMood={onSaveMood} />
          </>
        )}
      </div>
    </Card>
  );
};

export default MoodTrackingForm;
