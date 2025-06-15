
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface MoodNoteInputProps {
  note: string;
  onNoteChange: (note: string) => void;
}

const MoodNoteInput: React.FC<MoodNoteInputProps> = ({
  note,
  onNoteChange
}) => {
  return (
    <div>
      <Label className="text-lg font-medium mb-3 block" style={{color: '#737373'}}>
        Additional Notes (Optional)
      </Label>
      <Textarea
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder="How are you feeling? What's on your mind?"
        className="min-h-[100px] resize-none"
      />
    </div>
  );
};

export default MoodNoteInput;
