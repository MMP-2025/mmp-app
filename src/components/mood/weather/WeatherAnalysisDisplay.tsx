import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface WeatherMoodCorrelation {
  condition: string;
  averageMood: number;
  count: number;
}

interface WeatherAnalysisDisplayProps {
  correlations: WeatherMoodCorrelation[] | null;
  dataCount: number;
}

const WeatherAnalysisDisplay: React.FC<WeatherAnalysisDisplayProps> = ({
  correlations,
  dataCount
}) => {
  if (!correlations || correlations.length === 0) {
    return (
      <Card className="p-6 bg-mental-blue">
        <div className="flex items-center gap-3 text-center">
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
          <div>
            <h4 className="text-lg font-semibold mb-2 text-foreground">
              Not Enough Data
            </h4>
            <p className="text-sm text-muted-foreground">
              Need at least 5 weather entries to analyze correlations. 
              Current entries: {dataCount}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/90">
      <h4 className="text-lg font-semibold mb-4 text-foreground">
        Weather Analysis Results
      </h4>
      <div className="space-y-3">
        {correlations.map(({ condition, averageMood, count }) => (
          <div key={condition} className="flex justify-between items-center p-3 bg-mental-peach/20 rounded">
            <span className="capitalize font-medium text-foreground">
              {condition} Weather
            </span>
            <div className="text-right">
              <div className="font-semibold text-foreground">
                Avg Mood: {averageMood.toFixed(1)}/10
              </div>
              <div className="text-xs text-muted-foreground">
                {count} entries
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WeatherAnalysisDisplay;
