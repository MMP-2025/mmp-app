
import React from 'react';
import { Button } from '@/components/ui/button';

interface SaveMoodButtonProps {
  onSaveMood: () => void;
}

const SaveMoodButton: React.FC<SaveMoodButtonProps> = ({ onSaveMood }) => {
  return (
    <Button onClick={onSaveMood} className="w-full" size="lg">
      Save Mood Entry
    </Button>
  );
};

export default SaveMoodButton;
