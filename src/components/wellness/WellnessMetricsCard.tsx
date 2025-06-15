
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
    if (score >= 80) return 'text-mental-green';
    if (score >= 60) return 'text-mental-beige';
    return 'text-destructive';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-mental-green" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <BarChart3 className="h-4 w-4 text-muted-foreground" />;
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
              <p className="text-xs text-muted-foreground">{metric.suggestion}</p>
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
