
import React from 'react';
import { Smile, Meh, Frown, Angry, Laugh } from 'lucide-react';
import MoodOption from './MoodOption';

interface MoodOptionData {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface MoodOptionsGridProps {
  selectedMood: string | null;
  onMoodSelection: (mood: string) => void;
}

const moodOptions: MoodOptionData[] = [
  { name: 'Ecstatic', icon: Laugh, color: 'bg-green-500' },
  { name: 'Happy', icon: Smile, color: 'bg-green-400' },
  { name: 'Neutral', icon: Meh, color: 'bg-yellow-400' },
  { name: 'Sad', icon: Frown, color: 'bg-orange-400' },
  { name: 'Angry', icon: Angry, color: 'bg-red-500' }
];

const MoodOptionsGrid: React.FC<MoodOptionsGridProps> = ({
  selectedMood,
  onMoodSelection
}) => {
  return (
    <div className="grid grid-cols-5 gap-3">
      {moodOptions.map(mood => (
        <MoodOption
          key={mood.name}
          name={mood.name}
          icon={mood.icon}
          isSelected={selectedMood === mood.name}
          onSelect={onMoodSelection}
        />
      ))}
    </div>
  );
};

export default MoodOptionsGrid;
