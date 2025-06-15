
import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, TrendingUp, Brain } from 'lucide-react';

const PredictionExplanation: React.FC = () => {
  return (
    <Card className="p-6 bg-white/90">
      <h3 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>How It Works</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-3 bg-mental-peach/20 rounded-md">
          <Calendar className="h-6 w-6 mx-auto mb-2" style={{color: '#737373'}} />
          <h4 className="font-medium mb-1" style={{color: '#737373'}}>Pattern Analysis</h4>
          <p className="text-xs" style={{color: '#737373'}}>
            Analyzes your mood history to identify recurring patterns and trends
          </p>
        </div>
        <div className="text-center p-3 bg-mental-green/20 rounded-md">
          <TrendingUp className="h-6 w-6 mx-auto mb-2" style={{color: '#737373'}} />
          <h4 className="font-medium mb-1" style={{color: '#737373'}}>Trend Detection</h4>
          <p className="text-xs" style={{color: '#737373'}}>
            Identifies upward, downward, or stable mood trends over time
          </p>
        </div>
        <div className="text-center p-3 bg-mental-blue/20 rounded-md">
          <Brain className="h-6 w-6 mx-auto mb-2" style={{color: '#737373'}} />
          <h4 className="font-medium mb-1" style={{color: '#737373'}}>Smart Recommendations</h4>
          <p className="text-xs" style={{color: '#737373'}}>
            Provides personalized suggestions based on your unique patterns
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PredictionExplanation;
