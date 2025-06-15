
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useBreathingCycle, BreathingTechniqueKey } from '@/hooks/useBreathingCycle';
import BreathingVisualizerCircle from './BreathingVisualizerCircle';
import BreathingControls from './BreathingControls';
import BreathingSettings from './BreathingSettings';

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

const GuidedBreathingVisualizer: React.FC<GuidedBreathingVisualizerProps> = ({
  onComplete,
  defaultTechnique = '4-4-4-4',
  cycleGoal = 10,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const {
    isActive,
    phase,
    cycleCount,
    totalTime,
    technique,
    currentTechnique,
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
        onToggleSettings={() => setShowSettings(!showSettings)}
      />

      {showSettings && (
        <BreathingSettings
          technique={technique}
          onTechniqueChange={actions.setTechnique}
          currentTechnique={currentTechnique}
        />
      )}
    </Card>
  );
};

export default GuidedBreathingVisualizer;
