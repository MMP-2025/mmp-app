
import React from 'react';
import { Label } from '@/components/ui/label';
import MoodOptionsGrid from './selector/MoodOptionsGrid';

interface MoodSelectorProps {
  selectedMood: string | null;
  onMoodSelection: (mood: string) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onMoodSelection
}) => {
  return (
    <div>
      <Label className="text-lg font-medium mb-3 block" style={{color: '#737373'}}>
        Select your current mood
      </Label>
      <MoodOptionsGrid 
        selectedMood={selectedMood}
        onMoodSelection={onMoodSelection}
      />
    </div>
  );
};

export default MoodSelector;
