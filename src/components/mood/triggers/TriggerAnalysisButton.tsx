
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface TriggerAnalysisButtonProps {
  onAnalyze: () => void;
  isAnalyzing: boolean;
  canAnalyze: boolean;
}

const TriggerAnalysisButton: React.FC<TriggerAnalysisButtonProps> = ({
  onAnalyze,
  isAnalyzing,
  canAnalyze
}) => {
  return (
    <div className="mb-6">
      <p className="text-sm mb-4" style={{color: '#737373'}}>
        Our AI analyzes your journal entries and mood data to identify personal triggers and patterns.
      </p>
      <Button 
        onClick={onAnalyze} 
        disabled={isAnalyzing || !canAnalyze}
        className="w-full"
      >
        {isAnalyzing ? 'Analyzing Patterns...' : 'Analyze My Triggers'}
      </Button>
      {isAnalyzing && (
        <div className="mt-4">
          <Progress value={66} className="w-full" />
          <p className="text-sm text-center mt-2" style={{color: '#737373'}}>
            AI is processing your data...
          </p>
        </div>
      )}
    </div>
  );
};

export default TriggerAnalysisButton;
