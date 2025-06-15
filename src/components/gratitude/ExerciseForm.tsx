
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { GratitudeExercise } from '@/types/gratitude';

interface ExerciseFormProps {
  selectedExercise: GratitudeExercise;
  threeGoodThings: string[];
  handleThreeGoodThingsChange: (index: number, value: string) => void;
  letterRecipient: string;
  setLetterRecipient: (value: string) => void;
  letterContent: string;
  setLetterContent: (value: string) => void;
  gratitudeContent: string;
  setGratitudeContent: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({
  selectedExercise,
  threeGoodThings,
  handleThreeGoodThingsChange,
  letterRecipient,
  setLetterRecipient,
  letterContent,
  setLetterContent,
  gratitudeContent,
  setGratitudeContent,
  onSave,
  onCancel,
}) => {
  const renderFormContent = () => {
    switch (selectedExercise.id) {
      case 1: // Three Good Things
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-[#7e868b]">What are three good things that happened today?</h3>
            {[0, 1, 2].map(index => (
              <div key={index} className="space-y-2">
                <label className="block text-sm font-medium text-[#7e868b]">Good thing #{index + 1}:</label>
                <Textarea value={threeGoodThings[index]} onChange={e => handleThreeGoodThingsChange(index, e.target.value)} placeholder={`I'm grateful for...`} className="min-h-[100px]" />
              </div>
            ))}
          </div>
        );
      case 2: // Gratitude Letter
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#7e868b]">To whom are you writing this letter?</label>
              <Input value={letterRecipient} onChange={e => setLetterRecipient(e.target.value)} placeholder="Recipient's name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#7e868b]">Your gratitude letter:</label>
              <Textarea value={letterContent} onChange={e => setLetterContent(e.target.value)} placeholder="Express your gratitude..." className="min-h-[200px]" />
            </div>
          </div>
        );
      default: // Gratitude Jar & others
        return (
          <div>
            <label className="block text-sm font-medium mb-1 text-[#7e868b]">What are you grateful for today?</label>
            <Textarea value={gratitudeContent} onChange={e => setGratitudeContent(e.target.value)} placeholder="I'm grateful for..." className="min-h-[150px]" />
          </div>
        );
    }
  };

  return (
    <Card className="p-6 bg-mental-peach/20">
      <h2 className="text-2xl font-semibold mb-2 text-[#7e868b]">{selectedExercise.title}</h2>
      <p className="mb-6 text-[#7e868b]">{selectedExercise.instructions}</p>
      
      {renderFormContent()}
      
      <div className="mt-6 flex gap-3">
        <Button onClick={onSave} className="flex-1 bg-mental-green hover:bg-mental-green/80">
          Save Practice
        </Button>
        <Button onClick={onCancel} variant="outline" className="bg-mental-green">
          Cancel
        </Button>
      </div>
    </Card>
  );
};

export default ExerciseForm;
