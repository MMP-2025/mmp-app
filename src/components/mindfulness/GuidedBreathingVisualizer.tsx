
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useBreathingCycle } from '@/hooks/useBreathingCycle';
import { breathingTechniques } from '@/data/breathingTechniques';
import BreathingVisualizerCircle from './BreathingVisualizerCircle';

const GuidedBreathingVisualizer: React.FC = () => {
  const [selectedTechnique, setSelectedTechnique] = useState(breathingTechniques[0]);
  const { phase, isActive, startCycle, pauseCycle, resetCycle } = useBreathingCycle(selectedTechnique.timing);

  const handleTechniqueChange = (techniqueId: string) => {
    const technique = breathingTechniques.find(t => t.id === techniqueId);
    if (technique) {
      setSelectedTechnique(technique);
      resetCycle();
    }
  };

  return (
    <Card className="p-6 bg-mental-green">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold mb-4" style={{color: '#737373'}}>
          Guided Breathing Visualizer
        </h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{color: '#737373'}}>
            Choose Technique:
          </label>
          <Select value={selectedTechnique.id} onValueChange={handleTechniqueChange}>
            <SelectTrigger className="w-full max-w-xs mx-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {breathingTechniques.map(technique => (
                <SelectItem key={technique.id} value={technique.id}>
                  {technique.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-4">
          <p className="text-sm mb-2" style={{color: '#737373'}}>
            {selectedTechnique.description}
          </p>
          <p className="text-xs" style={{color: '#737373'}}>
            {selectedTechnique.instructions}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <BreathingVisualizerCircle phase={phase} />
      </div>
      
      <div className="flex justify-center gap-4">
        <Button
          onClick={isActive ? pauseCycle : startCycle}
          size="lg"
          className="flex items-center gap-2 bg-mental-blue hover:bg-mental-blue/80"
        >
          {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isActive ? 'Pause' : 'Start'}
        </Button>
        
        <Button
          onClick={resetCycle}
          variant="outline"
          size="lg"
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </Card>
  );
};

export default GuidedBreathingVisualizer;
