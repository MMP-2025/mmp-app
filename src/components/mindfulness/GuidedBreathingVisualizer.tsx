import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useBreathingCycle } from '@/hooks/useBreathingCycle';
import { breathingTechniques } from '@/data/breathingTechniques';
import BreathingVisualizerCircle from './BreathingVisualizerCircle';
interface GuidedBreathingVisualizerProps {
  defaultTechnique?: string;
  cycleGoal?: number;
  onComplete?: (durationInMinutes: number) => void;
}
const GuidedBreathingVisualizer: React.FC<GuidedBreathingVisualizerProps> = ({
  defaultTechnique = '4-4-4-4',
  cycleGoal = 10,
  onComplete
}) => {
  const [selectedTechnique, setSelectedTechnique] = useState(breathingTechniques[0]);
  const {
    phase,
    isActive,
    currentPhaseDuration,
    actions
  } = useBreathingCycle({
    defaultTechnique: defaultTechnique as any,
    cycleGoal,
    onComplete
  });
  const handleTechniqueChange = (techniqueId: string) => {
    const technique = breathingTechniques.find(t => t.id === techniqueId);
    if (technique) {
      setSelectedTechnique(technique);
      actions.reset();
    }
  };
  return <Card className="p-6 border shadow-lg bg-mental-gray">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-6" style={{
        color: '#737373'
      }}>
          Guided Breathing Visualizer
        </h3>
        
        <div className="mb-6 p-4 rounded-lg bg-mental-blue">
          <label className="block text-sm font-medium mb-2" style={{
          color: '#737373'
        }}>
            Choose Technique:
          </label>
          <Select value={selectedTechnique.id} onValueChange={handleTechniqueChange}>
            <SelectTrigger className="w-full max-w-xs mx-auto bg-white border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 shadow-lg z-50">
              {breathingTechniques.map(technique => <SelectItem key={technique.id} value={technique.id} className="bg-white hover:bg-gray-100">
                  {technique.name}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-4 bg-mental-blue/10 p-4 rounded-lg">
          <p className="text-sm mb-2" style={{
          color: '#737373'
        }}>
            {selectedTechnique.description}
          </p>
          <p className="text-xs" style={{
          color: '#737373'
        }}>
            {selectedTechnique.instructions}
          </p>
        </div>
      </div>

      <div className="mb-16">
        <BreathingVisualizerCircle phase={phase} phaseDuration={currentPhaseDuration} />
      </div>
      
      <div className="flex justify-center gap-4">
        <Button onClick={isActive ? actions.pause : actions.start} size="lg" className="flex items-center gap-2 bg-mental-blue hover:bg-mental-blue/80">
          {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isActive ? 'Pause' : 'Start'}
        </Button>
        
        <Button onClick={actions.reset} variant="outline" size="lg" className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </Card>;
};
export default GuidedBreathingVisualizer;