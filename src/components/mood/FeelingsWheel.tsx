
import React, { useState, useRef, useEffect } from 'react';
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
  const [categoryPosition, setCategoryPosition] = useState<{ x: number; y: number } | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Find which category the selected emotion belongs to
  const selectedCategory = wheelData.find(cat => 
    cat.emotions.includes(selectedEmotion || '')
  )?.category;

  // Calculate category button position when expanded
  useEffect(() => {
    if (expandedCategory && wheelRef.current) {
      const categoryButton = categoryRefs.current.get(expandedCategory);
      if (categoryButton) {
        const wheelRect = wheelRef.current.getBoundingClientRect();
        const buttonRect = categoryButton.getBoundingClientRect();
        setCategoryPosition({
          x: buttonRect.left + buttonRect.width / 2 - wheelRect.left,
          y: buttonRect.top + buttonRect.height / 2 - wheelRect.top
        });
      }
    } else {
      setCategoryPosition(null);
    }
  }, [expandedCategory]);

  const handleCategoryClick = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleEmotionSelect = (emotion: string) => {
    onEmotionSelect(emotion);
    setExpandedCategory(null);
  };

  // Get expanded category data
  const expandedCategoryData = wheelData.find(cat => cat.category === expandedCategory);

  // Calculate secondary emotion positions in a radial pattern
  const getSecondaryPositions = (emotionCount: number, centerX: number, centerY: number) => {
    const positions: { x: number; y: number; delay: number }[] = [];
    const wheelCenter = { x: 144, y: 144 }; // Half of 288px (w-72)
    
    // Direction vector from wheel center to category center
    const dx = centerX - wheelCenter.x;
    const dy = centerY - wheelCenter.y;
    const baseAngle = Math.atan2(dy, dx);
    
    // Spread secondaries in an arc around the outward direction
    const spreadAngle = Math.PI * 0.8; // 144 degrees spread
    const baseRadius = 70;
    const secondRadius = 120;
    
    for (let i = 0; i < emotionCount; i++) {
      let radius: number;
      let angleOffset: number;
      
      if (emotionCount <= 4) {
        // Single arc for small counts
        radius = baseRadius;
        angleOffset = ((i - (emotionCount - 1) / 2) / Math.max(emotionCount - 1, 1)) * spreadAngle;
      } else {
        // Two rings for larger counts
        if (i < 5) {
          // First ring
          radius = baseRadius;
          angleOffset = ((i - 2) / 4) * spreadAngle;
        } else {
          // Second ring
          radius = secondRadius;
          const secondRowCount = emotionCount - 5;
          angleOffset = ((i - 5 - (secondRowCount - 1) / 2) / Math.max(secondRowCount - 1, 1)) * spreadAngle;
        }
      }
      
      const angle = baseAngle + angleOffset;
      positions.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        delay: i * 40
      });
    }
    
    return positions;
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-1">How are you feeling?</h3>
        <p className="text-sm text-muted-foreground">Tap a category, then choose your emotion</p>
      </div>
      
      {/* Visual Wheel */}
      <div className="relative flex justify-center py-4">
        <div 
          ref={wheelRef}
          className="relative w-72 h-72 sm:w-80 sm:h-80"
        >
          {/* Center circle showing selected emotion */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className={cn(
              "w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300",
              selectedEmotion && "ring-4 ring-offset-2",
              selectedCategory && wheelData.find(c => c.category === selectedCategory)?.selectedRing
            )}>
              <span className={cn(
                "text-xs font-medium text-center px-2 transition-all",
                selectedEmotion ? "text-foreground" : "text-muted-foreground"
              )}>
                {selectedEmotion || 'Select'}
              </span>
            </div>
          </div>
          
          {/* Category segments arranged in a circle */}
          {wheelData.map((cat, index) => {
            const angle = (index * 360) / wheelData.length;
            const isExpanded = expandedCategory === cat.category;
            const isHovered = hoveredCategory === cat.category;
            const isSelected = selectedCategory === cat.category;
            // Larger radius to prevent overlap: 110px for mobile, 130px for sm+
            const radius = 110;
            
            // Calculate position using trigonometry
            const radians = (angle - 90) * (Math.PI / 180);
            const x = Math.cos(radians) * radius;
            const y = Math.sin(radians) * radius;
            
            return (
              <button
                key={cat.category}
                ref={(el) => {
                  if (el) categoryRefs.current.set(cat.category, el);
                }}
                onClick={() => handleCategoryClick(cat.category)}
                onMouseEnter={() => setHoveredCategory(cat.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={cn(
                  "absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all duration-300 shadow-md flex items-center justify-center cursor-pointer",
                  cat.color,
                  cat.hoverColor,
                  isExpanded && "scale-110 shadow-xl ring-4 ring-white z-20",
                  isHovered && !isExpanded && "scale-105",
                  isSelected && !isExpanded && "ring-2 ring-offset-2 ring-foreground/20",
                  !isExpanded && "z-10"
                )}
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                }}
                aria-label={`${cat.label} emotions category`}
                aria-expanded={isExpanded}
              >
                <span className="text-[10px] sm:text-xs font-medium text-gray-800 text-center px-1 leading-tight">
                  {cat.label}
                </span>
              </button>
            );
          })}

          {/* Secondary emotions overlay - rendered separately to avoid transform stacking */}
          {expandedCategory && expandedCategoryData && categoryPosition && (
            <>
              {/* Backdrop to close on outside click */}
              <div 
                className="fixed inset-0 z-25"
                onClick={() => setExpandedCategory(null)}
              />
              
              {/* Secondary emotion buttons */}
              {expandedCategoryData.emotions.map((emotion, index) => {
                const positions = getSecondaryPositions(
                  expandedCategoryData.emotions.length,
                  categoryPosition.x,
                  categoryPosition.y
                );
                const pos = positions[index];
                
                return (
                  <button
                    key={emotion}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEmotionSelect(emotion);
                    }}
                    className={cn(
                      "absolute px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 shadow-md whitespace-nowrap z-30",
                      expandedCategoryData.color,
                      expandedCategoryData.hoverColor,
                      "text-gray-800 animate-scale-in cursor-pointer",
                      selectedEmotion === emotion && "ring-2 ring-offset-1 ring-foreground scale-110 shadow-lg"
                    )}
                    style={{
                      left: pos.x,
                      top: pos.y,
                      transform: 'translate(-50%, -50%)',
                      animationDelay: `${pos.delay}ms`,
                    }}
                    aria-label={`Select emotion: ${emotion}`}
                    aria-pressed={selectedEmotion === emotion}
                  >
                    {emotion}
                  </button>
                );
              })}
            </>
          )}
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
