import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface FeelingsWheelProps {
  onEmotionSelect: (emotion: string) => void;
  selectedEmotion?: string;
}

const wheelData = [
  {
    category: 'joy',
    label: 'Joy',
    color: 'bg-mental-green',
    hoverColor: 'hover:bg-mental-green/80',
    emotions: ['Joyful', 'Happy', 'Excited', 'Grateful', 'Content', 'Peaceful', 'Hopeful', 'Energetic', 'Proud']
  },
  {
    category: 'calm',
    label: 'Calm',
    color: 'bg-mental-blue',
    hoverColor: 'hover:bg-mental-blue/80',
    emotions: ['Calm', 'Relaxed', 'Serene', 'Balanced']
  },
  {
    category: 'sadness',
    label: 'Sadness',
    color: 'bg-blue-300',
    hoverColor: 'hover:bg-blue-400',
    emotions: ['Sad', 'Lonely', 'Disappointed', 'Melancholy', 'Grief', 'Ashamed']
  },
  {
    category: 'anger',
    label: 'Anger',
    color: 'bg-red-300',
    hoverColor: 'hover:bg-red-400',
    emotions: ['Angry', 'Frustrated', 'Irritated', 'Annoyed']
  },
  {
    category: 'fear',
    label: 'Fear',
    color: 'bg-mental-peach',
    hoverColor: 'hover:bg-mental-peach/80',
    emotions: ['Anxious', 'Worried', 'Nervous', 'Overwhelmed', 'Stressed']
  },
  {
    category: 'surprise',
    label: 'Surprise',
    color: 'bg-purple-300',
    hoverColor: 'hover:bg-purple-400',
    emotions: ['Surprised', 'Confused', 'Curious']
  },
  {
    category: 'neutral',
    label: 'Neutral',
    color: 'bg-mental-gray',
    hoverColor: 'hover:bg-mental-gray/80',
    emotions: ['Tired', 'Bored', 'Neutral']
  }
];

const FeelingsWheel: React.FC<FeelingsWheelProps> = ({ onEmotionSelect, selectedEmotion }) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const selectedCategory = useMemo(() => {
    if (!selectedEmotion) return null;
    return wheelData.find(cat => 
      cat.emotions.some(e => e.toLowerCase() === selectedEmotion.toLowerCase())
    );
  }, [selectedEmotion]);

  const handleEmotionSelect = (emotion: string) => {
    onEmotionSelect(emotion);
    setOpenCategory(null);
  };

  const radius = 116;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-1">How are you feeling?</h3>
        <p className="text-sm text-muted-foreground">Tap a category, then choose your emotion</p>
      </div>

      <div className="relative flex justify-center py-4">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80">
          {/* Center circle showing selected emotion */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div
              className={cn(
                "w-20 h-20 rounded-full bg-card shadow-lg flex items-center justify-center transition-all duration-300",
                selectedEmotion && "ring-4 ring-offset-2",
                selectedCategory && `ring-${selectedCategory.color.replace('bg-', '')}`
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium text-center px-2 transition-all",
                  selectedEmotion ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {selectedEmotion || 'Select'}
              </span>
            </div>
          </div>

          {/* Category bubbles with popovers */}
          {wheelData.map((cat, index) => {
            const angle = (index * 360) / wheelData.length;
            const radians = (angle - 90) * (Math.PI / 180);
            const x = Math.cos(radians) * radius;
            const y = Math.sin(radians) * radius;

            const isSelected = selectedCategory?.category === cat.category;
            const isOpen = openCategory === cat.category;

            return (
              <Popover
                key={cat.category}
                open={isOpen}
                onOpenChange={(open) => setOpenCategory(open ? cat.category : null)}
              >
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all duration-200 shadow-md",
                      "flex items-center justify-center cursor-pointer",
                      cat.color,
                      cat.hoverColor,
                      isOpen && "scale-110 shadow-xl ring-4 ring-white z-30",
                      isSelected && !isOpen && "ring-2 ring-offset-2 ring-foreground/30"
                    )}
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`
                    }}
                    aria-label={`${cat.label} emotions`}
                  >
                    <span className="text-[10px] sm:text-xs font-medium text-gray-800 text-center px-1 leading-tight">
                      {cat.label}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-48 p-3"
                  sideOffset={8}
                  collisionPadding={16}
                >
                  <p className="text-sm font-semibold text-foreground mb-2">{cat.label}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {cat.emotions.map((emotion) => (
                      <button
                        key={emotion}
                        onClick={() => handleEmotionSelect(emotion)}
                        className={cn(
                          "px-2 py-1.5 rounded-full text-xs font-medium transition-colors",
                          "text-gray-800 cursor-pointer",
                          cat.color,
                          cat.hoverColor,
                          selectedEmotion?.toLowerCase() === emotion.toLowerCase() &&
                            "ring-2 ring-foreground/50"
                        )}
                        aria-label={`Select ${emotion}`}
                      >
                        {emotion}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      </div>

      {/* Selected emotion display */}
      {selectedEmotion && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Selected: <span className="font-medium text-foreground">{selectedEmotion}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default FeelingsWheel;
