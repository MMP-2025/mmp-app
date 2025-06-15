
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface BodyScanVisualizationProps {
  onComplete: () => void;
}

const BodyScanVisualization: React.FC<BodyScanVisualizationProps> = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentBodyPart, setCurrentBodyPart] = useState(0);
  const [timeInPart, setTimeInPart] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const bodyParts = [
    { name: 'Toes', duration: 30, position: { bottom: '5%', left: '50%' } },
    { name: 'Feet', duration: 30, position: { bottom: '8%', left: '50%' } },
    { name: 'Ankles', duration: 20, position: { bottom: '12%', left: '50%' } },
    { name: 'Calves', duration: 30, position: { bottom: '20%', left: '50%' } },
    { name: 'Knees', duration: 20, position: { bottom: '28%', left: '50%' } },
    { name: 'Thighs', duration: 40, position: { bottom: '40%', left: '50%' } },
    { name: 'Hips', duration: 30, position: { bottom: '50%', left: '50%' } },
    { name: 'Lower Back', duration: 30, position: { bottom: '55%', left: '45%' } },
    { name: 'Abdomen', duration: 30, position: { bottom: '60%', left: '50%' } },
    { name: 'Chest', duration: 30, position: { bottom: '70%', left: '50%' } },
    { name: 'Shoulders', duration: 30, position: { bottom: '80%', left: '50%' } },
    { name: 'Arms', duration: 40, position: { bottom: '70%', left: '35%' } },
    { name: 'Hands', duration: 30, position: { bottom: '60%', left: '25%' } },
    { name: 'Neck', duration: 20, position: { bottom: '85%', left: '50%' } },
    { name: 'Face', duration: 30, position: { bottom: '90%', left: '50%' } },
    { name: 'Head', duration: 30, position: { bottom: '95%', left: '50%' } }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setTimeInPart(prev => prev + 1);
        setTotalTime(prev => prev + 1);
        
        if (timeInPart >= bodyParts[currentBodyPart].duration) {
          if (currentBodyPart < bodyParts.length - 1) {
            setCurrentBodyPart(prev => prev + 1);
            setTimeInPart(0);
          } else {
            // Body scan complete
            setIsActive(false);
            onComplete();
          }
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeInPart, currentBodyPart, onComplete]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentBodyPart(0);
    setTimeInPart(0);
    setTotalTime(0);
  };

  const handlePause = () => {
    setIsActive(!isActive);
  };

  const handleStop = () => {
    setIsActive(false);
    setCurrentBodyPart(0);
    setTimeInPart(0);
    setTotalTime(0);
  };

  const getCurrentProgress = () => {
    const totalDuration = bodyParts.reduce((sum, part) => sum + part.duration, 0);
    const completedTime = bodyParts.slice(0, currentBodyPart).reduce((sum, part) => sum + part.duration, 0) + timeInPart;
    return (completedTime / totalDuration) * 100;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-6 bg-mental-peach/20">
      <h3 className="text-2xl font-semibold mb-6 text-center" style={{color: '#737373'}}>
        Body Scan Meditation
      </h3>

      {/* Progress */}
      <div className="mb-6">
        <Progress value={getCurrentProgress()} className="h-2 mb-2" />
        <div className="flex justify-between text-sm" style={{color: '#737373'}}>
          <span>Part {currentBodyPart + 1} of {bodyParts.length}</span>
          <span>{formatTime(totalTime)}</span>
        </div>
      </div>

      {/* Body Visualization */}
      <div className="relative w-64 h-96 mx-auto mb-6 bg-gray-100 rounded-lg overflow-hidden">
        {/* Simple body outline */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 100 200" className="w-full h-full">
            {/* Head */}
            <circle cx="50" cy="15" r="12" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1"/>
            {/* Neck */}
            <rect x="47" y="25" width="6" height="8" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1"/>
            {/* Torso */}
            <rect x="35" y="33" width="30" height="50" rx="8" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1"/>
            {/* Arms */}
            <rect x="20" y="40" width="12" height="35" rx="6" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1"/>
            <rect x="68" y="40" width="12" height="35" rx="6" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1"/>
            {/* Legs */}
            <rect x="40" y="83" width="8" height="45" rx="4" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1"/>
            <rect x="52" y="83" width="8" height="45" rx="4" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1"/>
            {/* Feet */}
            <ellipse cx="44" cy="135" rx="6" ry="3" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1"/>
            <ellipse cx="56" cy="135" rx="6" ry="3" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1"/>
          </svg>
        </div>

        {/* Current body part highlight */}
        {isActive && (
          <div
            className="absolute w-6 h-6 bg-mental-green rounded-full animate-pulse transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: bodyParts[currentBodyPart].position.left,
              bottom: bodyParts[currentBodyPart].position.bottom,
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.6)'
            }}
          />
        )}
      </div>

      {/* Current Instructions */}
      <div className="text-center mb-6">
        <div className="text-xl font-semibold mb-2" style={{color: '#737373'}}>
          Focus on: {bodyParts[currentBodyPart].name}
        </div>
        <div className="text-sm" style={{color: '#737373'}}>
          Notice any sensations, tension, or relaxation in this area
        </div>
        <div className="text-lg font-mono mt-2" style={{color: '#737373'}}>
          {bodyParts[currentBodyPart].duration - timeInPart}s remaining
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {!isActive && currentBodyPart === 0 && timeInPart === 0 ? (
          <Button onClick={handleStart} className="bg-mental-green hover:bg-mental-green/80">
            <Play className="h-4 w-4 mr-2" />
            Start Body Scan
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

export default BodyScanVisualization;
