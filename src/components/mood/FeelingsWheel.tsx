
import React from 'react';
import { Button } from '@/components/ui/button';

interface FeelingsWheelProps {
  onEmotionSelect: (emotion: string) => void;
  selectedEmotion?: string;
}

const emotions = [
  // Joy category - warm, bright colors
  { name: 'Joyful', category: 'joy', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200' },
  { name: 'Happy', category: 'joy', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200' },
  { name: 'Excited', category: 'joy', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200' },
  { name: 'Grateful', category: 'joy', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200' },
  { name: 'Content', category: 'joy', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200' },
  { name: 'Peaceful', category: 'joy', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200' },
  
  // Sadness category - cool blues
  { name: 'Sad', category: 'sadness', color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200' },
  { name: 'Lonely', category: 'sadness', color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200' },
  { name: 'Disappointed', category: 'sadness', color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200' },
  { name: 'Melancholy', category: 'sadness', color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200' },
  { name: 'Grief', category: 'sadness', color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200' },
  
  // Anger category - warm reds
  { name: 'Angry', category: 'anger', color: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200' },
  { name: 'Frustrated', category: 'anger', color: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200' },
  { name: 'Irritated', category: 'anger', color: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200' },
  { name: 'Annoyed', category: 'anger', color: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200' },
  
  // Fear category - warm oranges
  { name: 'Anxious', category: 'fear', color: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200' },
  { name: 'Worried', category: 'fear', color: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200' },
  { name: 'Nervous', category: 'fear', color: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200' },
  { name: 'Overwhelmed', category: 'fear', color: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200' },
  { name: 'Stressed', category: 'fear', color: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200' },
  
  // Surprise category - purples
  { name: 'Surprised', category: 'surprise', color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200' },
  { name: 'Confused', category: 'surprise', color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200' },
  { name: 'Curious', category: 'surprise', color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200' },
  
  // Disgust category - yellow-greens
  { name: 'Disgusted', category: 'disgust', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200' },
  { name: 'Bored', category: 'disgust', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200' },
  
  // Additional emotions
  { name: 'Hopeful', category: 'joy', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200' },
  { name: 'Calm', category: 'joy', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200' },
  { name: 'Tired', category: 'neutral', color: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200' },
  { name: 'Energetic', category: 'joy', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200' },
  { name: 'Proud', category: 'joy', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200' },
  { name: 'Ashamed', category: 'sadness', color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200' },
];

const getCategoryInfo = (category: string) => {
  const categoryMap: Record<string, { label: string; headerColor: string }> = {
    joy: { label: 'Positive', headerColor: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    sadness: { label: 'Sadness', headerColor: 'text-blue-700 bg-blue-50 border-blue-200' },
    anger: { label: 'Anger', headerColor: 'text-red-700 bg-red-50 border-red-200' },
    fear: { label: 'Fear & Anxiety', headerColor: 'text-orange-700 bg-orange-50 border-orange-200' },
    surprise: { label: 'Surprise', headerColor: 'text-purple-700 bg-purple-50 border-purple-200' },
    disgust: { label: 'Disgust', headerColor: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
    neutral: { label: 'Neutral', headerColor: 'text-gray-700 bg-gray-50 border-gray-200' }
  };
  return categoryMap[category] || { label: 'Other', headerColor: 'text-gray-700 bg-gray-50 border-gray-200' };
};

const FeelingsWheel: React.FC<FeelingsWheelProps> = ({ onEmotionSelect, selectedEmotion }) => {
  const categories = Array.from(new Set(emotions.map(e => e.category)));

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-foreground">How are you feeling?</h3>
      <p className="text-sm mb-4 text-muted-foreground">Choose the emotion that best describes how you're feeling right now</p>
      
      <div className="space-y-4">
        {categories.map(category => {
          const categoryInfo = getCategoryInfo(category);
          return (
            <div key={category}>
              <div className={`inline-block px-3 py-1 mb-2 rounded-full border ${categoryInfo.headerColor}`}>
                <h4 className="text-sm font-medium">
                  {categoryInfo.label}
                </h4>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {emotions
                  .filter(emotion => emotion.category === category)
                  .map(emotion => (
                    <Button
                      key={emotion.name}
                      onClick={() => onEmotionSelect(emotion.name)}
                      variant="outline"
                      size="sm"
                      className={`border transition-all ${
                        selectedEmotion === emotion.name
                          ? 'ring-2 ring-primary ring-offset-2 shadow-md transform scale-105' + ' ' + emotion.color
                          : emotion.color
                      }`}
                      aria-pressed={selectedEmotion === emotion.name}
                      aria-label={`Select ${emotion.name} emotion`}
                    >
                      {emotion.name}
                    </Button>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeelingsWheel;
