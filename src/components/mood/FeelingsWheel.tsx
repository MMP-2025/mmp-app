
import React from 'react';
import { Button } from '@/components/ui/button';

interface FeelingsWheelProps {
  onEmotionSelect: (emotion: string) => void;
  selectedEmotion?: string;
}

const emotions = [
  // Joy category
  { name: 'Joyful', category: 'joy', color: 'bg-yellow-200 hover:bg-yellow-300' },
  { name: 'Happy', category: 'joy', color: 'bg-yellow-200 hover:bg-yellow-300' },
  { name: 'Excited', category: 'joy', color: 'bg-yellow-200 hover:bg-yellow-300' },
  { name: 'Grateful', category: 'joy', color: 'bg-yellow-200 hover:bg-yellow-300' },
  { name: 'Content', category: 'joy', color: 'bg-yellow-200 hover:bg-yellow-300' },
  { name: 'Peaceful', category: 'joy', color: 'bg-yellow-200 hover:bg-yellow-300' },
  
  // Sadness category
  { name: 'Sad', category: 'sadness', color: 'bg-blue-200 hover:bg-blue-300' },
  { name: 'Lonely', category: 'sadness', color: 'bg-blue-200 hover:bg-blue-300' },
  { name: 'Disappointed', category: 'sadness', color: 'bg-blue-200 hover:bg-blue-300' },
  { name: 'Melancholy', category: 'sadness', color: 'bg-blue-200 hover:bg-blue-300' },
  { name: 'Grief', category: 'sadness', color: 'bg-blue-200 hover:bg-blue-300' },
  
  // Anger category
  { name: 'Angry', category: 'anger', color: 'bg-red-200 hover:bg-red-300' },
  { name: 'Frustrated', category: 'anger', color: 'bg-red-200 hover:bg-red-300' },
  { name: 'Irritated', category: 'anger', color: 'bg-red-200 hover:bg-red-300' },
  { name: 'Annoyed', category: 'anger', color: 'bg-red-200 hover:bg-red-300' },
  
  // Fear category
  { name: 'Anxious', category: 'fear', color: 'bg-purple-200 hover:bg-purple-300' },
  { name: 'Worried', category: 'fear', color: 'bg-purple-200 hover:bg-purple-300' },
  { name: 'Nervous', category: 'fear', color: 'bg-purple-200 hover:bg-purple-300' },
  { name: 'Overwhelmed', category: 'fear', color: 'bg-purple-200 hover:bg-purple-300' },
  { name: 'Stressed', category: 'fear', color: 'bg-purple-200 hover:bg-purple-300' },
  
  // Surprise category
  { name: 'Surprised', category: 'surprise', color: 'bg-orange-200 hover:bg-orange-300' },
  { name: 'Confused', category: 'surprise', color: 'bg-orange-200 hover:bg-orange-300' },
  { name: 'Curious', category: 'surprise', color: 'bg-orange-200 hover:bg-orange-300' },
  
  // Disgust category
  { name: 'Disgusted', category: 'disgust', color: 'bg-green-200 hover:bg-green-300' },
  { name: 'Bored', category: 'disgust', color: 'bg-green-200 hover:bg-green-300' },
  
  // Additional emotions
  { name: 'Hopeful', category: 'joy', color: 'bg-yellow-200 hover:bg-yellow-300' },
  { name: 'Calm', category: 'joy', color: 'bg-yellow-200 hover:bg-yellow-300' },
  { name: 'Tired', category: 'neutral', color: 'bg-gray-200 hover:bg-gray-300' },
  { name: 'Energetic', category: 'joy', color: 'bg-yellow-200 hover:bg-yellow-300' },
  { name: 'Proud', category: 'joy', color: 'bg-yellow-200 hover:bg-yellow-300' },
  { name: 'Ashamed', category: 'sadness', color: 'bg-blue-200 hover:bg-blue-300' },
];

const FeelingsWheel: React.FC<FeelingsWheelProps> = ({ onEmotionSelect, selectedEmotion }) => {
  const categories = Array.from(new Set(emotions.map(e => e.category)));

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-[#737373]">How are you feeling?</h3>
      <p className="text-sm mb-4 text-[#737373]">Choose the emotion that best describes how you're feeling right now</p>
      
      <div className="space-y-4">
        {categories.map(category => (
          <div key={category}>
            <h4 className="text-sm font-medium mb-2 text-[#737373] capitalize">
              {category === 'joy' ? 'Positive' : category === 'neutral' ? 'Neutral' : category === 'sadness' ? 'Sadness' : category === 'anger' ? 'Anger' : category === 'fear' ? 'Fear & Anxiety' : category === 'disgust' ? 'Disgust' : category === 'surprise' ? 'Surprise' : 'Challenging'}
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {emotions
                .filter(emotion => emotion.category === category)
                .map(emotion => (
                  <Button
                    key={emotion.name}
                    onClick={() => onEmotionSelect(emotion.name)}
                    className={`transition-all text-gray-700 border ${
                      selectedEmotion === emotion.name
                        ? 'ring-2 ring-mental-green ring-offset-2 bg-mental-green text-white'
                        : emotion.color
                    }`}
                    variant="outline"
                    size="sm"
                  >
                    {emotion.name}
                  </Button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeelingsWheel;
