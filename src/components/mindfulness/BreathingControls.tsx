
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface BreathingControlsProps {
  isActive: boolean;
  onStartPause: () => void;
  onReset: () => void;
}

const BreathingControls: React.FC<BreathingControlsProps> = ({
  isActive,
  onStartPause,
  onReset,
}) => {
  return (
    <div className="flex justify-center gap-4 mb-6">
      <Button
        onClick={onStartPause}
        size="lg"
        className="flex items-center gap-2"
      >
        {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {isActive ? 'Pause' : 'Start'}
      </Button>
      
      <Button
        onClick={onReset}
        variant="outline"
        size="lg"
        className="flex items-center gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>
    </div>
  );
};

export default BreathingControls;
