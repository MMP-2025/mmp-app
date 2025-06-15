import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { WellnessMetric } from '@/types/wellness';

interface WellnessMetricsCardProps {
  metrics: WellnessMetric[];
}

export const WellnessMetricsCard: React.FC<WellnessMetricsCardProps> = ({ metrics }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div>
      <h4 className="font-semibold mb-4" style={{color: '#737373'}}>Detailed Breakdown</h4>
      <div className="space-y-3">
        {metrics.map(metric => (
          <div key={metric.name} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium" style={{color: '#737373'}}>{metric.name}</span>
                {getTrendIcon(metric.trend)}
                <Badge variant="outline" className="text-xs">
                  {Math.round(metric.weight * 100)}% weight
                </Badge>
              </div>
              <Progress value={metric.value} className="mb-2" />
              <p className="text-xs text-gray-600">{metric.suggestion}</p>
            </div>
            <div className={`text-xl font-bold ml-4 ${getScoreColor(metric.value)}`}>
              {metric.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
