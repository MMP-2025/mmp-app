
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmotionSelectorProps {
  onEmotionSelect: (emotion: string) => void;
  selectedEmotion?: string;
}

const emotions = [
  'Happy', 'Sad', 'Angry', 'Anxious', 'Calm', 'Excited', 
  'Stressed', 'Tired', 'Grateful', 'Lonely', 'Hopeful', 'Overwhelmed'
];

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ onEmotionSelect, selectedEmotion }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-[#737373]">How are you feeling?</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {emotions.map(emotion => (
          <Button
            key={emotion}
            onClick={() => onEmotionSelect(emotion)}
            className={`transition-colors ${
              selectedEmotion === emotion
                ? 'bg-mental-green text-white hover:bg-mental-green/90'
                : 'bg-mental-beige text-[#737373] hover:bg-mental-beige/80'
            }`}
          >
            {emotion}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default EmotionSelector;
