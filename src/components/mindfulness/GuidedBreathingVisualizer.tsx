
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBreathingCycle, BreathingTechniqueKey } from '@/hooks/useBreathingCycle';
import BreathingVisualizerCircle from './BreathingVisualizerCircle';
import BreathingControls from './BreathingControls';
import { techniques } from '@/data/breathingTechniques';

interface GuidedBreathingVisualizerProps {
  onComplete?: (durationInMinutes: number) => void;
  defaultTechnique?: BreathingTechniqueKey;
  cycleGoal?: number;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const techniqueDisplayNames: Record<BreathingTechniqueKey, string> = {
  '4-7-8': '4-7-8 (Relaxing)',
  '4-4-4-4': 'Box Breathing',
  '6-2-6-2': 'Calming',
  'simple': 'Simple (Beginner)',
};

const GuidedBreathingVisualizer: React.FC<GuidedBreathingVisualizerProps> = ({
  onComplete,
  defaultTechnique = '4-4-4-4',
  cycleGoal = 10,
}) => {
  const {
    isActive,
    phase,
    cycleCount,
    totalTime,
    technique,
    actions,
  } = useBreathingCycle({ onComplete, defaultTechnique, cycleGoal });

  const handleStartPause = () => {
    if (isActive) {
      actions.pause();
    } else {
      actions.start();
    }
  };

  return (
    <Card className="p-8 bg-mental-beige text-center">
      <h3 className="text-xl font-semibold mb-6 text-neutral-500">
        Guided Breathing Visualizer
      </h3>
      
      <BreathingVisualizerCircle phase={phase} />

      <div className="mb-6">
        <div className="flex justify-around text-sm text-neutral-500">
          <span>Cycle: {cycleCount} / {cycleGoal}</span>
          <span>Time: {formatTime(totalTime)}</span>
        </div>
      </div>

      <BreathingControls
        isActive={isActive}
        onStartPause={handleStartPause}
        onReset={actions.reset}
      />

      <div className="mt-6 space-y-3">
        <p className="text-sm font-medium text-neutral-500">Choose a technique:</p>
        <div className="flex justify-center flex-wrap gap-2">
          {Object.keys(techniques).map((key) => (
            <Button
              key={key}
              variant={technique === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => actions.setTechnique(key as BreathingTechniqueKey)}
            >
              {techniqueDisplayNames[key as BreathingTechniqueKey]}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default GuidedBreathingVisualizer;
