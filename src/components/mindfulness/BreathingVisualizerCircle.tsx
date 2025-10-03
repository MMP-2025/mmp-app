
import React from 'react';

type Phase = 'inhale' | 'hold' | 'exhale' | 'pause';

interface BreathingVisualizerCircleProps {
  phase: Phase;
  phaseDuration: number;
}

const getCircleTransform = (phase: Phase) => {
  switch (phase) {
    case 'inhale':
    case 'hold':
      return 'scale(1.5)';
    case 'exhale':
    case 'pause':
      return 'scale(0.75)';
    default:
      return 'scale(1)';
  }
};

const getPhaseInstruction = (phase: Phase) => {
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

const getPhaseColor = (phase: Phase) => {
  switch (phase) {
    case 'inhale':
      return 'bg-mental-blue';
    case 'hold':
      return 'bg-mental-peach';
    case 'exhale':
      return 'bg-mental-green';
    case 'pause':
      return 'bg-mental-beige';
    default:
      return 'bg-mental-gray';
  }
};

const BreathingVisualizerCircle: React.FC<BreathingVisualizerCircleProps> = ({ phase, phaseDuration }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative h-32 w-32">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`w-full h-full rounded-full transition-transform ease-in-out ${getPhaseColor(phase)}`}
            style={{ 
              transform: getCircleTransform(phase), 
              filter: 'blur(0.5px)',
              transitionDuration: `${phaseDuration}s`
            }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-white font-semibold text-lg" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
            {getPhaseInstruction(phase)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingVisualizerCircle;
