
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Sun, CloudRain, Snowflake } from 'lucide-react';

interface WeatherMoodCorrelation {
  condition: string;
  averageMood: number;
  count: number;
}

interface WeatherCorrelationChartProps {
  correlations: WeatherMoodCorrelation[];
}

const WeatherCorrelationChart: React.FC<WeatherCorrelationChartProps> = ({ correlations }) => {
  const weatherIcons = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain,
    snowy: Snowflake,
    windy: Cloud
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 7) return 'text-green-600';
    if (mood >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="p-6 bg-white/90">
      <h4 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Weather-Mood Correlations</h4>
      <div className="space-y-3">
        {correlations.map(({ condition, averageMood, count }) => {
          const IconComponent = weatherIcons[condition as keyof typeof weatherIcons];
          return (
            <div key={condition} className="flex items-center justify-between p-3 bg-mental-peach/20 rounded">
              <div className="flex items-center gap-3">
                <IconComponent className="h-5 w-5" style={{color: '#737373'}} />
                <span className="capitalize font-medium" style={{color: '#737373'}}>{condition}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{count} entries</Badge>
                <span className={`font-semibold ${getMoodColor(averageMood)}`}>
                  {averageMood.toFixed(1)}/10
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default WeatherCorrelationChart;
