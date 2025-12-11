
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface FeelingsWheelProps {
  onEmotionSelect: (emotion: string) => void;
  selectedEmotion?: string;
}

// Organized emotions by category with colors that match the brand palette
const wheelData = [
  {
    category: 'joy',
    label: 'Joy',
    color: 'bg-mental-green',
    hoverColor: 'hover:bg-mental-green/80',
    selectedRing: 'ring-mental-green',
    emotions: ['Joyful', 'Happy', 'Excited', 'Grateful', 'Content', 'Peaceful', 'Hopeful', 'Energetic', 'Proud']
  },
  {
    category: 'calm',
    label: 'Calm',
    color: 'bg-mental-blue',
    hoverColor: 'hover:bg-mental-blue/80',
    selectedRing: 'ring-mental-blue',
    emotions: ['Calm', 'Relaxed', 'Serene', 'Balanced']
  },
  {
    category: 'sadness',
    label: 'Sadness',
    color: 'bg-blue-300',
    hoverColor: 'hover:bg-blue-400',
    selectedRing: 'ring-blue-400',
    emotions: ['Sad', 'Lonely', 'Disappointed', 'Melancholy', 'Grief', 'Ashamed']
  },
  {
    category: 'anger',
    label: 'Anger',
    color: 'bg-red-300',
    hoverColor: 'hover:bg-red-400',
    selectedRing: 'ring-red-400',
    emotions: ['Angry', 'Frustrated', 'Irritated', 'Annoyed']
  },
  {
    category: 'fear',
    label: 'Fear & Anxiety',
    color: 'bg-mental-peach',
    hoverColor: 'hover:bg-mental-peach/80',
    selectedRing: 'ring-mental-peach',
    emotions: ['Anxious', 'Worried', 'Nervous', 'Overwhelmed', 'Stressed']
  },
  {
    category: 'surprise',
    label: 'Surprise',
    color: 'bg-purple-300',
    hoverColor: 'hover:bg-purple-400',
    selectedRing: 'ring-purple-400',
    emotions: ['Surprised', 'Confused', 'Curious']
  },
  {
    category: 'neutral',
    label: 'Neutral',
    color: 'bg-mental-gray',
    hoverColor: 'hover:bg-mental-gray/80',
    selectedRing: 'ring-mental-gray',
    emotions: ['Tired', 'Bored', 'Neutral']
  }
];

const FeelingsWheel: React.FC<FeelingsWheelProps> = ({ onEmotionSelect, selectedEmotion }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Find which category the selected emotion belongs to
  const selectedCategory = wheelData.find(cat => 
    cat.emotions.includes(selectedEmotion || '')
  )?.category;

  const handleCategoryClick = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-1">How are you feeling?</h3>
        <p className="text-sm text-muted-foreground">Tap a category, then choose your emotion</p>
      </div>
      
      {/* Visual Wheel */}
      <div className="relative flex justify-center py-4">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80">
          {/* Center circle showing selected emotion */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className={cn(
              "w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300",
              selectedEmotion && "ring-4 ring-offset-2",
              selectedCategory && wheelData.find(c => c.category === selectedCategory)?.selectedRing
            )}>
              <span className={cn(
                "text-sm font-medium text-center px-2 transition-all",
                selectedEmotion ? "text-foreground" : "text-muted-foreground"
              )}>
                {selectedEmotion || 'Select a feeling'}
              </span>
            </div>
          </div>
          
          {/* Category segments arranged in a circle */}
          {wheelData.map((cat, index) => {
            const angle = (index * 360) / wheelData.length;
            const isExpanded = expandedCategory === cat.category;
            const isHovered = hoveredCategory === cat.category;
            const isSelected = selectedCategory === cat.category;
            
            return (
              <div
                key={cat.category}
                className="absolute"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-80px)`,
                }}
              >
                {/* Secondary emotions radiating out */}
                {isExpanded && cat.emotions.map((emotion, emotionIndex) => {
                  const emotionCount = cat.emotions.length;
                  const spreadAngle = 120; // Total spread angle for emotions
                  const startAngle = -spreadAngle / 2;
                  const emotionAngle = emotionCount > 1 
                    ? startAngle + (emotionIndex * spreadAngle) / (emotionCount - 1)
                    : 0;
                  const distance = 70 + (emotionIndex % 2) * 15; // Stagger distances
                  
                  return (
                    <button
                      key={emotion}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEmotionSelect(emotion);
                      }}
                      className={cn(
                        "absolute px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 shadow-md whitespace-nowrap z-20",
                        cat.color,
                        cat.hoverColor,
                        "text-gray-800 animate-scale-in",
                        selectedEmotion === emotion && "ring-2 ring-offset-1 ring-foreground scale-110 shadow-lg"
                      )}
                      style={{
                        transform: `rotate(-${angle}deg) rotate(${emotionAngle}deg) translateY(-${distance}px) rotate(-${emotionAngle}deg)`,
                        animationDelay: `${emotionIndex * 50}ms`,
                      }}
                      aria-pressed={selectedEmotion === emotion}
                    >
                      {emotion}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handleCategoryClick(cat.category)}
                  onMouseEnter={() => setHoveredCategory(cat.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={cn(
                    "w-20 h-20 sm:w-24 sm:h-24 rounded-full transition-all duration-300 shadow-md flex items-center justify-center z-10 relative",
                    cat.color,
                    cat.hoverColor,
                    isExpanded && "scale-110 shadow-xl ring-4 ring-white",
                    isHovered && !isExpanded && "scale-105",
                    isSelected && !isExpanded && "ring-2 ring-offset-2 ring-foreground/20"
                  )}
                  style={{
                    transform: `rotate(-${angle}deg)`,
                  }}
                  aria-label={`${cat.label} emotions category`}
                  aria-expanded={isExpanded}
                >
                  <span className="text-xs sm:text-sm font-medium text-gray-800 text-center px-1">
                    {cat.label}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {/* Selected emotion display */}
      {!expandedCategory && selectedEmotion && (
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
