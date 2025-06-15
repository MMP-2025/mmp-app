
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square } from 'lucide-react';

interface BreathingExerciseProps {
  onComplete: () => void;
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(4);
  const [totalTime, setTotalTime] = useState(0);

  const phaseDurations = {
    inhale: 4,
    hold: 4,
    exhale: 6
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Move to next phase
            setPhase(currentPhase => {
              if (currentPhase === 'inhale') return 'hold';
              if (currentPhase === 'hold') return 'exhale';
              // If exhale, complete cycle and return to inhale
              setCycleCount(count => count + 1);
              return 'inhale';
            });
            return phaseDurations[phase === 'inhale' ? 'hold' : phase === 'hold' ? 'exhale' : 'inhale'];
          }
          return prev - 1;
        });
        
        setTotalTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, phase]);

  useEffect(() => {
    // Complete after 10 cycles (about 2-3 minutes)
    if (cycleCount >= 10 && isActive) {
      setIsActive(false);
      onComplete();
    }
  }, [cycleCount, isActive, onComplete]);

  const handleStart = () => {
    setIsActive(true);
    setPhase('inhale');
    setTimeRemaining(4);
    setCycleCount(0);
    setTotalTime(0);
  };

  const handlePause = () => {
    setIsActive(!isActive);
  };

  const handleStop = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimeRemaining(4);
    setCycleCount(0);
    setTotalTime(0);
  };

  const getCircleScale = () => {
    const baseScale = 0.6;
    const maxScale = 1.0;
    
    if (phase === 'inhale') {
      return baseScale + (maxScale - baseScale) * ((phaseDurations.inhale - timeRemaining) / phaseDurations.inhale);
    } else if (phase === 'exhale') {
      return maxScale - (maxScale - baseScale) * ((phaseDurations.exhale - timeRemaining) / phaseDurations.exhale);
    }
    return maxScale; // hold phase
  };

  const getInstructions = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-8 bg-mental-blue/20 text-center">
      <h3 className="text-2xl font-semibold mb-8" style={{color: '#737373'}}>
        4-4-6 Breathing Exercise
      </h3>

      {/* Breathing Circle Animation */}
      <div className="relative w-64 h-64 mx-auto mb-8">
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-br from-mental-green to-mental-blue opacity-30 transition-transform duration-1000 ease-in-out"
          style={{ 
            transform: `scale(${getCircleScale()})`,
            background: phase === 'inhale' ? 'linear-gradient(135deg, #4ade80, #06b6d4)' :
                       phase === 'hold' ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)' :
                       'linear-gradient(135deg, #8b5cf6, #4ade80)'
          }}
        />
        <div className="absolute inset-8 rounded-full bg-white/20 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2" style={{color: '#737373'}}>
              {timeRemaining}
            </div>
            <div className="text-lg" style={{color: '#737373'}}>
              {getInstructions()}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold" style={{color: '#737373'}}>{cycleCount}</div>
          <div className="text-sm" style={{color: '#737373'}}>Cycles</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{color: '#737373'}}>{formatTime(totalTime)}</div>
          <div className="text-sm" style={{color: '#737373'}}>Total Time</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {!isActive && cycleCount === 0 ? (
          <Button onClick={handleStart} className="bg-mental-green hover:bg-mental-green/80">
            <Play className="h-4 w-4 mr-2" />
            Start Exercise
          </Button>
        ) : (
          <>
            <Button onClick={handlePause} variant="outline">
              {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button onClick={handleStop} variant="outline">
              <Square className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default BreathingExercise;
