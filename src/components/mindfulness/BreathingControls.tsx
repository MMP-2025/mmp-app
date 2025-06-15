
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface BreathingControlsProps {
  isActive: boolean;
  onStartPause: () => void;
  onReset: () => void;
  onToggleSettings: () => void;
}

const BreathingControls: React.FC<BreathingControlsProps> = ({
  isActive,
  onStartPause,
  onReset,
  onToggleSettings,
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
      
      <Button
        onClick={onToggleSettings}
        variant="outline"
        size="lg"
        className="flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        Settings
      </Button>
    </div>
  );
};

export default BreathingControls;
