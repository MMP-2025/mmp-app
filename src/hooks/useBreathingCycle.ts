
import { useState, useEffect, useRef } from 'react';
import { techniques } from '@/data/breathingTechniques';

export type BreathingTechniqueKey = keyof typeof techniques;

interface UseBreathingCycleProps {
  onComplete?: (durationInMinutes: number) => void;
  defaultTechnique?: BreathingTechniqueKey;
  cycleGoal?: number;
}

export const useBreathingCycle = ({
  onComplete,
  defaultTechnique = '4-4-4-4',
  cycleGoal = 10,
}: UseBreathingCycleProps) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [technique, setTechnique] = useState<BreathingTechniqueKey>(defaultTechnique);
  const [totalTime, setTotalTime] = useState(0);

  const phaseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentTechnique = techniques[technique];

  const getCurrentPhaseDuration = () => {
    switch (phase) {
      case 'inhale': return currentTechnique.inhale;
      case 'hold': return currentTechnique.hold;
      case 'exhale': return currentTechnique.exhale;
      case 'pause': return currentTechnique.pause;
      default: return 4;
    }
  };

  const stopBreathingCycle = () => {
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
      phaseTimeoutRef.current = null;
    }
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

  const startBreathingCycle = () => {
    const executePhase = (currentPhase: typeof phase, duration: number) => {
      setPhase(currentPhase);
      
      phaseTimeoutRef.current = setTimeout(() => {
        if (!phaseTimeoutRef.current) return;

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
          setCycleCount(currentCount => {
            const newCycleCount = currentCount + 1;
            if (cycleGoal && newCycleCount >= cycleGoal) {
              handleReset(true);
              return newCycleCount;
            }
            return newCycleCount;
          });
        }
        
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
      }, duration);
    };

    executePhase('inhale', currentTechnique.inhale * 1000);
  };

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
      }
    };
  }, [isActive]);
  
  useEffect(() => {
    if (isActive) {
        handleReset(false);
        setTimeout(() => setIsActive(true), 100);
    }
  }, [technique, cycleGoal]);

  const handleStart = () => {
    setCycleCount(0);
    setTotalTime(0);
    setPhase('inhale');
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  return {
    isActive,
    phase,
    cycleCount,
    totalTime,
    technique,
    currentTechnique,
    currentPhaseDuration: getCurrentPhaseDuration(),
    actions: {
      start: handleStart,
      pause: handlePause,
      reset: () => handleReset(false),
      setTechnique,
    },
  };
};
