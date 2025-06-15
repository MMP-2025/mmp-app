
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Smile, Meh, Frown, Angry, Laugh } from 'lucide-react';
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
  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return 'text-red-500';
    if (intensity <= 6) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Card className="p-6 bg-white/90">
      <h2 className="text-xl font-semibold mb-4" style={{color: '#737373'}}>How are you feeling today?</h2>
      
      <div className="grid grid-cols-5 gap-2 text-center mb-6">
        {[
          { name: 'Ecstatic', icon: Laugh },
          { name: 'Happy', icon: Smile },
          { name: 'Neutral', icon: Meh },
          { name: 'Sad', icon: Frown },
          { name: 'Angry', icon: Angry }
        ].map(mood => (
          <button 
            key={mood.name} 
            onClick={() => onMoodSelection(mood.name)} 
            className={`p-4 rounded-md transition-all flex flex-col items-center gap-2 ${
              selectedMood === mood.name 
                ? 'bg-mental-peach border-2' 
                : 'hover:bg-mental-peach/40'
            }`}
            style={{borderColor: selectedMood === mood.name ? '#737373' : 'transparent'}}
          >
            <mood.icon className="h-8 w-8" style={{color: '#737373'}} />
            <span style={{color: '#737373'}}>{mood.name}</span>
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="space-y-6">
          <div>
            <Label className="text-lg font-medium mb-3 block" style={{color: '#737373'}}>
              Intensity Level: {moodIntensity[0]}/10
            </Label>
            <Slider
              value={moodIntensity}
              onValueChange={onIntensityChange}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm mt-2" style={{color: '#737373'}}>
              <span>Low</span>
              <span className={getIntensityColor(moodIntensity[0])}>
                {moodIntensity[0] <= 3 ? 'Mild' : moodIntensity[0] <= 6 ? 'Moderate' : 'Strong'}
              </span>
              <span>High</span>
            </div>
          </div>

          <MoodFactors 
            factors={moodFactors}
            selectedFactors={selectedFactors}
            onFactorToggle={onFactorToggle}
          />

          <div>
            <Label className="text-lg font-medium mb-2 block" style={{color: '#737373'}}>
              Additional Notes (Optional)
            </Label>
            <Textarea 
              placeholder="What's on your mind? Any specific thoughts or events that influenced your mood?" 
              value={moodNote} 
              onChange={e => onNoteChange(e.target.value)} 
              className="min-h-[120px] border-border focus:border-ring" 
              style={{color: '#737373'}}
            />
          </div>

          <Button 
            onClick={onSaveMood} 
            className="bg-mental-green hover:bg-mental-green/80 w-full"
            style={{color: '#737373'}}
          >
            Save Mood Entry
          </Button>
        </div>
      )}
    </Card>
  );
};

export default MoodTrackingForm;
