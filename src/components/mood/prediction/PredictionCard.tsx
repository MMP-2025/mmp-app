
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, Target, Clock } from 'lucide-react';

interface Prediction {
  type: 'risk' | 'improvement' | 'maintenance';
  confidence: number;
  timeframe: string;
  factors: string[];
  recommendation: string;
  description: string;
}

interface PredictionCardProps {
  prediction: Prediction;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction }) => {
  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'risk': return AlertTriangle;
      case 'improvement': return TrendingUp;
      case 'maintenance': return Target;
      default: return Target;
    }
  };

  const getPredictionColor = (type: string) => {
    switch (type) {
      case 'risk': return 'text-red-600 bg-red-50 border-red-200';
      case 'improvement': return 'text-green-600 bg-green-50 border-green-200';
      case 'maintenance': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const IconComponent = getPredictionIcon(prediction.type);

  return (
    <div className={`p-4 rounded-lg border ${getPredictionColor(prediction.type)}`}>
      <div className="flex items-start gap-3">
        <IconComponent className="h-5 w-5 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium capitalize">{prediction.type} Prediction</h4>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {prediction.timeframe}
            </Badge>
          </div>
          
          <p className="text-sm mb-3">{prediction.description}</p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">Confidence:</span>
              <Progress value={prediction.confidence} className="flex-1 h-2" />
              <span className="text-xs">{prediction.confidence}%</span>
            </div>
            
            {prediction.factors.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium">Key factors:</span>
                {prediction.factors.map((factor, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {factor}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="mt-3 p-2 bg-white/60 rounded-md">
              <p className="text-xs font-medium">💡 Recommendation:</p>
              <p className="text-xs">{prediction.recommendation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;
