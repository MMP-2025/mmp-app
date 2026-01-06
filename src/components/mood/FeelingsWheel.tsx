
import React, { useState, useRef, useEffect, useMemo } from 'react';
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

type Point = { x: number; y: number };

function getSecondaryPositions(params: {
  emotionCount: number;
  categoryCenter: Point;
  wheelCenter: Point;
}) {
  const { emotionCount, categoryCenter, wheelCenter } = params;

  const positions: { x: number; y: number; delay: number }[] = [];

  // Direction vector from wheel center to category center
  const dx = categoryCenter.x - wheelCenter.x;
  const dy = categoryCenter.y - wheelCenter.y;
  const baseAngle = Math.atan2(dy, dx);

  // We want a wider spread and more rings for large categories (Joy = 9)
  const spreadAngle = Math.PI * 1.1; // ~198°

  // 1 ring for <=4, 2 rings for 5-7, 3 rings for 8+
  const ringCounts =
    emotionCount <= 4
      ? [emotionCount]
      : emotionCount <= 7
        ? [4, emotionCount - 4]
        : [3, 3, emotionCount - 6];

  const ringRadii = emotionCount <= 4 ? [92] : emotionCount <= 7 ? [96, 148] : [98, 150, 198];

  const angleForIndex = (idx: number, count: number) => {
    if (count <= 1) return 0;
    const t = idx / (count - 1); // 0..1
    return (t - 0.5) * spreadAngle;
  };

  let globalIndex = 0;
  for (let ring = 0; ring < ringCounts.length; ring++) {
    const count = ringCounts[ring];
    const radius = ringRadii[ring] ?? ringRadii[ringRadii.length - 1];

    for (let i = 0; i < count; i++) {
      const angle = baseAngle + angleForIndex(i, count);
      positions.push({
        x: categoryCenter.x + Math.cos(angle) * radius,
        y: categoryCenter.y + Math.sin(angle) * radius,
        delay: globalIndex * 45
      });
      globalIndex++;
    }
  }

  return positions;
}

const FeelingsWheel: React.FC<FeelingsWheelProps> = ({ onEmotionSelect, selectedEmotion }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [categoryCenter, setCategoryCenter] = useState<Point | null>(null);

  const wheelRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Find which category the selected emotion belongs to
  const selectedCategory = wheelData.find(cat => cat.emotions.includes(selectedEmotion || ''))?.category;

  const expandedCategoryData = useMemo(
    () => wheelData.find(cat => cat.category === expandedCategory),
    [expandedCategory]
  );

  const wheelCenter = useMemo<Point | null>(() => {
    if (!wheelRef.current) return null;
    const rect = wheelRef.current.getBoundingClientRect();
    return { x: rect.width / 2, y: rect.height / 2 };
  }, [expandedCategory, categoryCenter]);

  // Update category center when expanded + on resize
  useEffect(() => {
    const compute = () => {
      if (!expandedCategory || !wheelRef.current) {
        setCategoryCenter(null);
        return;
      }

      const categoryButton = categoryRefs.current.get(expandedCategory);
      if (!categoryButton) {
        setCategoryCenter(null);
        return;
      }

      const wheelRect = wheelRef.current.getBoundingClientRect();
      const btnRect = categoryButton.getBoundingClientRect();
      setCategoryCenter({
        x: btnRect.left + btnRect.width / 2 - wheelRect.left,
        y: btnRect.top + btnRect.height / 2 - wheelRect.top
      });
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [expandedCategory]);

  const secondaryPositions = useMemo(() => {
    if (!expandedCategoryData || !categoryCenter || !wheelCenter) return null;
    return getSecondaryPositions({
      emotionCount: expandedCategoryData.emotions.length,
      categoryCenter,
      wheelCenter
    });
  }, [expandedCategoryData, categoryCenter, wheelCenter]);

  const handleCategoryClick = (category: string) => {
    setExpandedCategory(prev => (prev === category ? null : category));
  };

  const handleEmotionSelect = (emotion: string) => {
    onEmotionSelect(emotion);
    setExpandedCategory(null);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-1">How are you feeling?</h3>
        <p className="text-sm text-muted-foreground">Tap a category, then choose your emotion</p>
      </div>

      {/* Visual Wheel */}
      <div className="relative flex justify-center py-4">
        <div ref={wheelRef} className="relative w-72 h-72 sm:w-80 sm:h-80">
          {/* Center circle showing selected emotion */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div
              className={cn(
                "w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300",
                selectedEmotion && "ring-4 ring-offset-2",
                selectedCategory && wheelData.find(c => c.category === selectedCategory)?.selectedRing
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

          {/* Category segments arranged in a circle */}
          {wheelData.map((cat, index) => {
            const angle = (index * 360) / wheelData.length;
            const isExpanded = expandedCategory === cat.category;
            const isHovered = hoveredCategory === cat.category;
            const isSelected = selectedCategory === cat.category;

            // Larger radius to prevent overlap
            const radius = 116;

            // Calculate position using trigonometry
            const radians = (angle - 90) * (Math.PI / 180);
            const x = Math.cos(radians) * radius;
            const y = Math.sin(radians) * radius;

            return (
              <button
                key={cat.category}
                ref={el => {
                  if (el) categoryRefs.current.set(cat.category, el);
                }}
                onClick={() => handleCategoryClick(cat.category)}
                onMouseEnter={() => setHoveredCategory(cat.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={cn(
                  "absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all duration-300 shadow-md flex items-center justify-center cursor-pointer",
                  cat.color,
                  cat.hoverColor,
                  isExpanded && "scale-110 shadow-xl ring-4 ring-white z-30",
                  isHovered && !isExpanded && "scale-105",
                  isSelected && !isExpanded && "ring-2 ring-offset-2 ring-foreground/20",
                  !isExpanded && "z-20"
                )}
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`
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
          {expandedCategoryData && categoryCenter && secondaryPositions && (
            <>
              {/* Click-catcher to close when clicking elsewhere in the wheel */}
              <button
                type="button"
                aria-label="Close emotion list"
                className="absolute inset-0 z-20"
                onClick={() => setExpandedCategory(null)}
              />

              {/* Optional "stems" */}
              <svg
                className="absolute inset-0 z-30 pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {expandedCategoryData.emotions.map((emotion, index) => {
                  const pos = secondaryPositions[index];
                  // Convert px positions into 0..100 viewBox space
                  const x1 = (categoryCenter.x / (wheelRef.current?.getBoundingClientRect().width || 1)) * 100;
                  const y1 = (categoryCenter.y / (wheelRef.current?.getBoundingClientRect().height || 1)) * 100;
                  const x2 = (pos.x / (wheelRef.current?.getBoundingClientRect().width || 1)) * 100;
                  const y2 = (pos.y / (wheelRef.current?.getBoundingClientRect().height || 1)) * 100;

                  return (
                    <line
                      key={emotion}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="hsl(var(--border))"
                      strokeWidth="0.6"
                      opacity="0.6"
                    />
                  );
                })}
              </svg>

              {expandedCategoryData.emotions.map((emotion, index) => {
                const pos = secondaryPositions[index];

                return (
                  <button
                    key={emotion}
                    onClick={e => {
                      e.stopPropagation();
                      handleEmotionSelect(emotion);
                    }}
                    className={cn(
                      "absolute px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-300 shadow-md whitespace-nowrap z-40",
                      expandedCategoryData.color,
                      expandedCategoryData.hoverColor,
                      "text-gray-800 animate-scale-in cursor-pointer",
                      selectedEmotion === emotion && "ring-2 ring-offset-1 ring-foreground scale-110 shadow-lg"
                    )}
                    style={{
                      left: pos.x,
                      top: pos.y,
                      transform: 'translate(-50%, -50%)',
                      animationDelay: `${pos.delay}ms`
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
