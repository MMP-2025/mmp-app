import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Smile, Moon, CloudRain, Flame, AlertTriangle, Sparkles, Circle, Check } from 'lucide-react';

interface MoodCardSelectorProps {
  onEmotionSelect: (emotion: string) => void;
  selectedEmotion?: string;
}

const moodCategories = [
  {
    name: 'joy',
    label: 'Joy',
    icon: Smile,
    color: 'bg-mental-green',
    activeColor: 'bg-accent/40',
    borderColor: 'border-accent',
    emotions: ['Joyful', 'Happy', 'Excited', 'Grateful', 'Content', 'Peaceful', 'Hopeful', 'Energetic', 'Proud']
  },
  {
    name: 'calm',
    label: 'Calm',
    icon: Moon,
    color: 'bg-mental-blue',
    activeColor: 'bg-secondary/40',
    borderColor: 'border-secondary',
    emotions: ['Relaxed', 'Serene', 'Balanced', 'Mindful', 'Centered', 'Tranquil', 'At Peace', 'Comfortable']
  },
  {
    name: 'sadness',
    label: 'Sadness',
    icon: CloudRain,
    color: 'bg-secondary/20',
    activeColor: 'bg-secondary/35',
    borderColor: 'border-secondary',
    emotions: ['Sad', 'Melancholy', 'Lonely', 'Disappointed', 'Hopeless', 'Grieving', 'Empty', 'Heartbroken']
  },
  {
    name: 'anger',
    label: 'Anger',
    icon: Flame,
    color: 'bg-mental-peach',
    activeColor: 'bg-primary/35',
    borderColor: 'border-primary',
    emotions: ['Angry', 'Frustrated', 'Irritated', 'Resentful', 'Annoyed', 'Bitter', 'Hostile', 'Furious']
  },
  {
    name: 'fear',
    label: 'Fear',
    icon: AlertTriangle,
    color: 'bg-mental-warm',
    activeColor: 'bg-primary/30',
    borderColor: 'border-primary',
    emotions: ['Anxious', 'Worried', 'Nervous', 'Scared', 'Overwhelmed', 'Panicked', 'Insecure', 'Uneasy']
  },
  {
    name: 'surprise',
    label: 'Surprise',
    icon: Sparkles,
    color: 'bg-mental-gray',
    activeColor: 'bg-muted/50',
    borderColor: 'border-muted',
    emotions: ['Surprised', 'Amazed', 'Astonished', 'Confused', 'Shocked', 'Curious', 'Intrigued']
  },
  {
    name: 'neutral',
    label: 'Neutral',
    icon: Circle,
    color: 'bg-mental-gray',
    activeColor: 'bg-muted/50',
    borderColor: 'border-muted',
    emotions: ['Okay', 'Fine', 'Indifferent', 'Numb', 'Detached', 'Bored', 'Tired', 'Drained']
  }
];

const MoodCardSelector: React.FC<MoodCardSelectorProps> = ({ onEmotionSelect, selectedEmotion }) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const selectedCategory = useMemo(() => {
    if (!selectedEmotion) return null;
    return moodCategories.find(cat =>
      cat.emotions.some(e => e.toLowerCase() === selectedEmotion.toLowerCase())
    );
  }, [selectedEmotion]);

  const handleCategoryClick = (categoryName: string) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  const handleEmotionSelect = (emotion: string) => {
    onEmotionSelect(emotion);
    setOpenCategory(null);
  };

  return (
    <Card className="p-4 bg-card">
      <h3 className="text-lg font-semibold mb-3 text-foreground">How are you feeling?</h3>
      
      {selectedEmotion && (
        <div className="mb-4 p-3 rounded-lg bg-mental-blue border border-secondary/30 text-center">
          <span className="text-sm text-muted-foreground">Selected: </span>
          <span className="font-semibold text-foreground">{selectedEmotion}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {moodCategories.map((category) => {
          const Icon = category.icon;
          const isOpen = openCategory === category.name;
          const isSelected = selectedCategory?.name === category.name;

          return (
            <Collapsible
              key={category.name}
              open={isOpen}
              onOpenChange={() => handleCategoryClick(category.name)}
              className={cn(
                isOpen ? "col-span-2" : "col-span-1",
                category.name === 'neutral' && !isOpen && "col-span-2"
              )}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "w-full p-4 rounded-xl border-2 transition-all duration-200",
                    "flex flex-col items-center gap-2 cursor-pointer",
                    "hover:scale-[1.02] hover:shadow-md",
                    "focus:outline-none focus:ring-2 focus:ring-ring/50",
                    isOpen ? category.activeColor : category.color,
                    isSelected && !isOpen ? `${category.activeColor} ${category.borderColor}` : "border-transparent"
                  )}
                >
                  <Icon className="w-8 h-8 text-foreground/80" />
                  <span className="font-medium text-foreground">{category.label}</span>
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                <div className="pt-3 pb-1">
                  <div className="flex flex-wrap gap-2">
                    {category.emotions.map((emotion) => {
                      const isEmotionSelected = selectedEmotion?.toLowerCase() === emotion.toLowerCase();

                      return (
                        <button
                          key={emotion}
                          onClick={() => handleEmotionSelect(emotion)}
                          className={cn(
                            "px-3 py-2 rounded-lg text-xs font-medium transition-all",
                            "text-center break-words cursor-pointer text-foreground",
                            "hover:scale-105",
                            "focus:outline-none focus:ring-2 focus:ring-ring/50",
                            category.color,
                            isEmotionSelected && `${category.activeColor} ring-2 ring-secondary`
                          )}
                        >
                          <span className="flex items-center justify-center gap-1">
                            {isEmotionSelected && <Check className="w-3 h-3" />}
                            {emotion}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </Card>
  );
};

export default MoodCardSelector;
