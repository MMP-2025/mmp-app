
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Smile, Meh, Frown, Angry, Laugh } from 'lucide-react';

interface MoodOption {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface MoodSelectorProps {
  selectedMood: string | null;
  onMoodSelection: (mood: string) => void;
}

const moodOptions: MoodOption[] = [
  { name: 'Ecstatic', icon: Laugh, color: 'bg-green-500' },
  { name: 'Happy', icon: Smile, color: 'bg-green-400' },
  { name: 'Neutral', icon: Meh, color: 'bg-yellow-400' },
  { name: 'Sad', icon: Frown, color: 'bg-orange-400' },
  { name: 'Angry', icon: Angry, color: 'bg-red-500' }
];

const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onMoodSelection
}) => {
  return (
    <div>
      <Label className="text-lg font-medium mb-3 block" style={{color: '#737373'}}>
        Select your current mood
      </Label>
      <div className="grid grid-cols-5 gap-3">
        {moodOptions.map(mood => {
          const IconComponent = mood.icon;
          return (
            <Button
              key={mood.name}
              variant={selectedMood === mood.name ? "default" : "outline"}
              className={`flex flex-col items-center p-4 h-auto transition-all hover:scale-105 ${
                selectedMood === mood.name 
                  ? 'bg-mental-peach text-gray-700 border-gray-400' 
                  : 'hover:bg-mental-peach/40'
              }`}
              onClick={() => onMoodSelection(mood.name)}
            >
              <IconComponent className="h-8 w-8 mb-2" />
              <span className="text-xs font-medium">{mood.name}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MoodSelector;
