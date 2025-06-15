
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { techniques } from '@/data/breathingTechniques';
import { BreathingTechniqueKey } from '@/hooks/useBreathingCycle';

interface BreathingSettingsProps {
  technique: BreathingTechniqueKey;
  onTechniqueChange: (value: BreathingTechniqueKey) => void;
  currentTechnique: typeof techniques[BreathingTechniqueKey];
}

const BreathingSettings: React.FC<BreathingSettingsProps> = ({
  technique,
  onTechniqueChange,
  currentTechnique,
}) => {
  return (
    <div className="space-y-4 p-4 bg-white/50 rounded-lg">
      <div>
        <label className="block text-sm font-medium mb-2 text-neutral-500">
          Breathing Technique
        </label>
        <Select value={technique} onValueChange={(value) => onTechniqueChange(value as BreathingTechniqueKey)}>
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
  );
};

export default BreathingSettings;
