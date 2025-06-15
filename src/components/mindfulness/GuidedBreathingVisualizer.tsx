
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { techniques } from '@/data/breathingTechniques';

interface GuidedBreathingVisualizerProps {
  onComplete?: (durationInMinutes: number) => void;
  defaultTechnique?: keyof typeof techniques;
  cycleGoal?: number;
}

const GuidedBreathingVisualizer: React.FC<GuidedBreathingVisualizerProps> = ({
  onComplete,
  defaultTechnique = '4-4-4-4',
  cycleGoal = 10,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [technique, setTechnique] = useState(defaultTechnique);
  const [showSettings, setShowSettings] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  const phaseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentTechnique = techniques[technique as keyof typeof techniques];

  useEffect(() => {
    if (isActive) {
      startBreathingCycle();
      totalTimeIntervalRef.current = setInterval(() => {
        setTotalTime(prev => prev + 1);
      }, 1000);
    } else {
      stopBreathingCycle();
      if (totalTimeIntervalRef.current) {
        clearInterval(totalTimeIntervalRef.current);
        totalTimeIntervalRef.current = null;
      }
    }

    return () => {
      stopBreathingCycle();
      if (totalTimeIntervalRef.current) {
        clearInterval(totalTimeIntervalRef.current);
        totalTimeIntervalRef.current = null;
      }
    };
  }, [isActive]);
  
  useEffect(() => {
    // Reset if the technique changes while active
    if (isActive) {
        handleReset(false);
        // A small timeout to allow state to settle before restarting
        setTimeout(() => setIsActive(true), 100);
    }
  }, [technique]);

  const startBreathingCycle = () => {
    const executePhase = (currentPhase: typeof phase, duration: number) => {
      setPhase(currentPhase);
      
      phaseTimeoutRef.current = setTimeout(() => {
        let nextPhase: typeof phase;
        let isCycleEnd = false;

        switch (currentPhase) {
          case 'inhale':
            nextPhase = currentTechnique.hold > 0 ? 'hold' : 'exhale';
            break;
          case 'hold':
            nextPhase = 'exhale';
            break;
          case 'exhale':
            nextPhase = currentTechnique.pause > 0 ? 'pause' : 'inhale';
            if (currentTechnique.pause <= 0) isCycleEnd = true;
            break;
          case 'pause':
            nextPhase = 'inhale';
            isCycleEnd = true;
            break;
        }

        if (isCycleEnd) {
          // Use a functional update to ensure we have the latest cycleCount
          setCycleCount(currentCount => {
            const newCycleCount = currentCount + 1;
            if (newCycleCount >= cycleGoal) {
              handleReset(true);
              return newCycleCount;
            }
            return newCycleCount;
          });
        }
        
        // This check ensures we don't continue if the session has been completed and reset
        if (phaseTimeoutRef.current) {
            let nextDuration: number;
            switch (nextPhase) {
                case 'inhale': nextDuration = currentTechnique.inhale; break;
                case 'hold': nextDuration = currentTechnique.hold; break;
                case 'exhale': nextDuration = currentTechnique.exhale; break;
                case 'pause': nextDuration = currentTechnique.pause; break;
            }
            if (nextDuration > 0) {
              executePhase(nextPhase, nextDuration * 1000);
            }
        }
      }, duration);
    };

    executePhase('inhale', currentTechnique.inhale * 1000);
  };

  const stopBreathingCycle = () => {
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
      phaseTimeoutRef.current = null;
    }
  };

  const handleStart = () => {
    setCycleCount(0);
    setTotalTime(0);
    setPhase('inhale');
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = (isComplete = false) => {
    setIsActive(false);
    stopBreathingCycle();
    if (isComplete && onComplete) {
      const durationInMinutes = Math.max(1, Math.round(totalTime / 60));
      onComplete(durationInMinutes);
    }
    setPhase('inhale');
    setCycleCount(0);
    setTotalTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCircleSize = () => {
    switch (phase) {
      case 'inhale':
        return 'scale-150';
      case 'hold':
        return 'scale-150';
      case 'exhale':
        return 'scale-75';
      case 'pause':
        return 'scale-75';
      default:
        return 'scale-100';
    }
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'pause':
        return 'Pause';
      default:
        return 'Ready';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'bg-blue-400';
      case 'hold':
        return 'bg-yellow-400';
      case 'exhale':
        return 'bg-green-400';
      case 'pause':
        return 'bg-purple-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <Card className="p-8 bg-mental-beige text-center">
      <h3 className="text-xl font-semibold mb-6 text-neutral-500">
        Guided Breathing Visualizer
      </h3>
      
      <div className="flex justify-center mb-8">
        <div className="relative h-32 w-32">
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className={`w-full h-full rounded-full transition-transform duration-1000 ease-in-out ${getPhaseColor()}`}
              style={{ transform: getCircleSize().replace('scale-', 'scale(').replace(')', ''), filter: 'blur(0.5px)' }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white font-semibold text-lg">
              {getPhaseInstruction()}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-around text-sm text-neutral-500">
          <span>Cycle: {cycleCount} / {cycleGoal}</span>
          <span>Time: {formatTime(totalTime)}</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <Button
          onClick={isActive ? handlePause : handleStart}
          size="lg"
          className="flex items-center gap-2"
        >
          {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isActive ? 'Pause' : 'Start'}
        </Button>
        
        <Button
          onClick={() => handleReset(false)}
          variant="outline"
          size="lg"
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        
        <Button
          onClick={() => setShowSettings(!showSettings)}
          variant="outline"
          size="lg"
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>

      {showSettings && (
        <div className="space-y-4 p-4 bg-white/50 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-500">
              Breathing Technique
            </label>
            <Select value={technique} onValueChange={setTechnique}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4-7-8">4-7-8 Technique (Relaxing)</SelectItem>
                <SelectItem value="4-4-4-4">Box Breathing (Balanced)</SelectItem>
                <SelectItem value="6-2-6-2">6-2-6-2 (Calming)</SelectItem>
                <SelectItem value="simple">Simple 4-4 (Beginner)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-neutral-500">
            <p className="font-medium">Current Pattern:</p>
            <p>
              Inhale: {currentTechnique.inhale}s • 
              {currentTechnique.hold > 0 && ` Hold: ${currentTechnique.hold}s • `}
              Exhale: {currentTechnique.exhale}s
              {currentTechnique.pause > 0 && ` • Pause: ${currentTechnique.pause}s`}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default GuidedBreathingVisualizer;
