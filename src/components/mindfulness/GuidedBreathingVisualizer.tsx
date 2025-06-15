import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { techniques } from '@/data/breathingTechniques';

const GuidedBreathingVisualizer: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [technique, setTechnique] = useState('4-7-8');
  const [showSettings, setShowSettings] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentTechnique = techniques[technique as keyof typeof techniques];

  useEffect(() => {
    if (isActive) {
      startBreathingCycle();
    } else {
      stopBreathingCycle();
    }

    return () => {
      stopBreathingCycle();
    };
  }, [isActive, technique]);

  const startBreathingCycle = () => {
    const executePhase = (currentPhase: typeof phase, duration: number) => {
      setPhase(currentPhase);
      
      if (duration > 0) {
        phaseTimeoutRef.current = setTimeout(() => {
          switch (currentPhase) {
            case 'inhale':
              if (currentTechnique.hold > 0) {
                executePhase('hold', currentTechnique.hold * 1000);
              } else {
                executePhase('exhale', currentTechnique.exhale * 1000);
              }
              break;
            case 'hold':
              executePhase('exhale', currentTechnique.exhale * 1000);
              break;
            case 'exhale':
              if (currentTechnique.pause > 0) {
                executePhase('pause', currentTechnique.pause * 1000);
              } else {
                setCycleCount(prev => prev + 1);
                executePhase('inhale', currentTechnique.inhale * 1000);
              }
              break;
            case 'pause':
              setCycleCount(prev => prev + 1);
              executePhase('inhale', currentTechnique.inhale * 1000);
              break;
          }
        }, duration);
      }
    };

    executePhase('inhale', currentTechnique.inhale * 1000);
  };

  const stopBreathingCycle = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
      phaseTimeoutRef.current = null;
    }
  };

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCycleCount(0);
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
      
      {/* Breathing Circle */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div 
            className={`w-32 h-32 rounded-full transition-all duration-1000 ease-in-out ${getCircleSize()} ${getPhaseColor()}`}
            style={{ filter: 'blur(0.5px)' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white font-semibold text-lg">
              {getPhaseInstruction()}
            </div>
          </div>
        </div>
      </div>

      {/* Phase Instructions */}
      <div className="mb-6">
        <p className="text-lg font-medium mb-2 text-neutral-500">
          {getPhaseInstruction()}
        </p>
        <p className="text-sm text-neutral-500">
          Cycle {cycleCount}
        </p>
      </div>

      {/* Controls */}
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
          onClick={handleReset}
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

      {/* Settings */}
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
