
import React from 'react';

type Phase = 'inhale' | 'hold' | 'exhale' | 'pause';

interface BreathingVisualizerCircleProps {
  phase: Phase;
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

const BreathingVisualizerCircle: React.FC<BreathingVisualizerCircleProps> = ({ phase }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative h-32 w-32">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`w-full h-full rounded-full transition-transform duration-1000 ease-in-out ${getPhaseColor(phase)}`}
            style={{ transform: getCircleTransform(phase), filter: 'blur(0.5px)' }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white font-semibold text-lg">
            {getPhaseInstruction(phase)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingVisualizerCircle;
