
import React from 'react';
import { Button } from '@/components/ui/button';

interface FeelingsWheelProps {
  onEmotionSelect: (emotion: string) => void;
  selectedEmotion?: string;
}

const emotions = [
  // Joy category - using design system colors
  { name: 'Joyful', category: 'joy', variant: 'secondary' },
  { name: 'Happy', category: 'joy', variant: 'secondary' },
  { name: 'Excited', category: 'joy', variant: 'secondary' },
  { name: 'Grateful', category: 'joy', variant: 'secondary' },
  { name: 'Content', category: 'joy', variant: 'secondary' },
  { name: 'Peaceful', category: 'joy', variant: 'secondary' },
  
  // Sadness category
  { name: 'Sad', category: 'sadness', variant: 'outline' },
  { name: 'Lonely', category: 'sadness', variant: 'outline' },
  { name: 'Disappointed', category: 'sadness', variant: 'outline' },
  { name: 'Melancholy', category: 'sadness', variant: 'outline' },
  { name: 'Grief', category: 'sadness', variant: 'outline' },
  
  // Anger category  
  { name: 'Angry', category: 'anger', variant: 'destructive' },
  { name: 'Frustrated', category: 'anger', variant: 'destructive' },
  { name: 'Irritated', category: 'anger', variant: 'destructive' },
  { name: 'Annoyed', category: 'anger', variant: 'destructive' },
  
  // Fear category
  { name: 'Anxious', category: 'fear', variant: 'outline' },
  { name: 'Worried', category: 'fear', variant: 'outline' },
  { name: 'Nervous', category: 'fear', variant: 'outline' },
  { name: 'Overwhelmed', category: 'fear', variant: 'outline' },
  { name: 'Stressed', category: 'fear', variant: 'outline' },
  
  // Surprise category
  { name: 'Surprised', category: 'surprise', variant: 'ghost' },
  { name: 'Confused', category: 'surprise', variant: 'ghost' },
  { name: 'Curious', category: 'surprise', variant: 'ghost' },
  
  // Disgust category
  { name: 'Disgusted', category: 'disgust', variant: 'ghost' },
  { name: 'Bored', category: 'disgust', variant: 'ghost' },
  
  // Additional emotions
  { name: 'Hopeful', category: 'joy', variant: 'secondary' },
  { name: 'Calm', category: 'joy', variant: 'secondary' },
  { name: 'Tired', category: 'neutral', variant: 'ghost' },
  { name: 'Energetic', category: 'joy', variant: 'secondary' },
  { name: 'Proud', category: 'joy', variant: 'secondary' },
  { name: 'Ashamed', category: 'sadness', variant: 'outline' },
];

const FeelingsWheel: React.FC<FeelingsWheelProps> = ({ onEmotionSelect, selectedEmotion }) => {
  const categories = Array.from(new Set(emotions.map(e => e.category)));

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-foreground">How are you feeling?</h3>
      <p className="text-sm mb-4 text-muted-foreground">Choose the emotion that best describes how you're feeling right now</p>
      
      <div className="space-y-4">
        {categories.map(category => (
          <div key={category}>
            <h4 className="text-sm font-medium mb-2 text-foreground capitalize">
              {category === 'joy' ? 'Positive' : category === 'neutral' ? 'Neutral' : category === 'sadness' ? 'Sadness' : category === 'anger' ? 'Anger' : category === 'fear' ? 'Fear & Anxiety' : category === 'disgust' ? 'Disgust' : category === 'surprise' ? 'Surprise' : 'Challenging'}
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {emotions
                .filter(emotion => emotion.category === category)
                .map(emotion => (
                  <Button
                    key={emotion.name}
                    onClick={() => onEmotionSelect(emotion.name)}
                    variant={selectedEmotion === emotion.name ? "default" : emotion.variant as any}
                    size="sm"
                    className={selectedEmotion === emotion.name ? "ring-2 ring-accent" : ""}
                    aria-pressed={selectedEmotion === emotion.name}
                    aria-label={`Select ${emotion.name} emotion`}
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
