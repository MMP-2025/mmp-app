import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

interface EmotionWheelProps {
  onEmotionSelect: (emotion: string, intensity: number) => void;
  selectedEmotion?: string;
}

const EmotionWheel: React.FC<EmotionWheelProps> = ({ onEmotionSelect, selectedEmotion }) => {
  const [selectedIntensity, setSelectedIntensity] = useState(5);

  const emotions = {
    joy: {
      primary: 'Joy',
      secondary: ['Elated', 'Euphoric', 'Cheerful', 'Content', 'Satisfied', 'Pleased'],
      color: '#FFD700'
    },
    trust: {
      primary: 'Trust',
      secondary: ['Admiring', 'Accepting', 'Trusting', 'Confident', 'Hopeful', 'Faithful'],
      color: '#90EE90'
    },
    fear: {
      primary: 'Fear',
      secondary: ['Terrified', 'Anxious', 'Worried', 'Nervous', 'Concerned', 'Uneasy'],
      color: '#8A2BE2'
    },
    surprise: {
      primary: 'Surprise',
      secondary: ['Amazed', 'Astonished', 'Startled', 'Confused', 'Perplexed', 'Disillusioned'],
      color: '#FFA500'
    },
    sadness: {
      primary: 'Sadness',
      secondary: ['Grief', 'Melancholy', 'Disappointed', 'Hurt', 'Lonely', 'Dejected'],
      color: '#4169E1'
    },
    disgust: {
      primary: 'Disgust',
      secondary: ['Loathing', 'Revulsion', 'Contempt', 'Boredom', 'Tired', 'Apathetic'],
      color: '#228B22'
    },
    anger: {
      primary: 'Anger',
      secondary: ['Rage', 'Furious', 'Annoyed', 'Irritated', 'Frustrated', 'Agitated'],
      color: '#DC143C'
    },
    anticipation: {
      primary: 'Anticipation',
      secondary: ['Vigilant', 'Eager', 'Optimistic', 'Hopeful', 'Interested', 'Expectant'],
      color: '#FF6347'
    }
  };

  const handleEmotionClick = (emotion: string) => {
    onEmotionSelect(emotion, selectedIntensity);
  };

  return (
    <Card className="p-6 bg-mental-blue">
      <h3 className="text-lg font-semibold mb-4 text-neutral-500">
        Emotion Wheel
      </h3>
      <p className="text-sm mb-4 text-neutral-500">
        Select an emotion that best describes how you're feeling
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(emotions).map(([key, emotion]) => (
          <div key={key} className="space-y-2">
            <button
              onClick={() => handleEmotionClick(emotion.primary)}
              className={`w-full p-3 rounded-lg transition-all ${
                selectedEmotion === emotion.primary 
                  ? 'ring-2 ring-blue-500 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              style={{ 
                backgroundColor: emotion.color,
                opacity: selectedEmotion === emotion.primary ? 1 : 0.8
              }}
            >
              <div className="text-white font-medium text-sm">
                {emotion.primary}
              </div>
            </button>
            
            <div className="space-y-1">
              {emotion.secondary.map((secondaryEmotion) => (
                <button
                  key={secondaryEmotion}
                  onClick={() => handleEmotionClick(secondaryEmotion)}
                  className={`w-full text-xs p-1 rounded transition-all ${
                    selectedEmotion === secondaryEmotion
                      ? 'bg-blue-100 text-blue-800'
                      : 'hover:bg-gray-100 text-neutral-500'
                  }`}
                >
                  {secondaryEmotion}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-500">
          Intensity Level: {selectedIntensity}/10
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={selectedIntensity}
          onChange={(e) => setSelectedIntensity(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </Card>
  );
};

export default EmotionWheel;
