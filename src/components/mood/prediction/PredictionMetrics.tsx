
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PredictionMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

interface PredictionMetricsProps {
  metrics: PredictionMetric[];
}

const PredictionMetrics: React.FC<PredictionMetricsProps> = ({ metrics }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-mental-green';
      case 'down': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => {
        const TrendIcon = getTrendIcon(metric.trend);
        return (
          <Card key={index} className="p-4 bg-white/90">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium" style={{color: '#737373'}}>{metric.label}</h4>
              <TrendIcon className={`h-4 w-4 ${getTrendColor(metric.trend)}`} />
            </div>
            <div className="text-lg font-bold mb-2" style={{color: '#737373'}}>
              {metric.value}
            </div>
            <Badge variant="outline" className="text-xs">
              {metric.confidence}% confidence
            </Badge>
          </Card>
        );
      })}
    </div>
  );
};

export default PredictionMetrics;
