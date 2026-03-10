
import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, TrendingUp, Brain } from 'lucide-react';

const PredictionExplanation: React.FC = () => {
  return (
    <Card className="p-6 bg-white/90">
      <h3 className="text-lg font-semibold mb-4 text-foreground">How It Works</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-3 bg-mental-peach/20 rounded-md">
          <Calendar className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <h4 className="font-medium mb-1 text-foreground">Pattern Analysis</h4>
          <p className="text-xs text-muted-foreground">
            Analyzes your mood history to identify recurring patterns and trends
          </p>
        </div>
        <div className="text-center p-3 bg-mental-green/20 rounded-md">
          <TrendingUp className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <h4 className="font-medium mb-1 text-foreground">Trend Detection</h4>
          <p className="text-xs text-muted-foreground">
            Identifies upward, downward, or stable mood trends over time
          </p>
        </div>
        <div className="text-center p-3 bg-mental-blue/20 rounded-md">
          <Brain className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <h4 className="font-medium mb-1 text-foreground">Smart Recommendations</h4>
          <p className="text-xs text-muted-foreground">
            Provides personalized suggestions based on your unique patterns
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PredictionExplanation;
