
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  note: string;
  timestamp: number;
  date: string;
  factors: string[];
  sleepHours?: number;
  exercise?: boolean;
}

interface FactorAnalysisDisplayProps {
  moodHistory: MoodEntry[];
}

const FactorAnalysisDisplay: React.FC<FactorAnalysisDisplayProps> = ({ moodHistory }) => {
  const getImpactLevel = (avgIntensity: number): 'positive' | 'neutral' | 'negative' => {
    if (avgIntensity >= 7) return 'positive';
    if (avgIntensity >= 5) return 'neutral';
    return 'negative';
  };

  const factorMoodData = moodHistory.reduce((acc, entry) => {
    entry.factors.forEach(factor => {
      if (!acc[factor]) acc[factor] = [];
      acc[factor].push(entry.intensity);
    });
    return acc;
  }, {} as Record<string, number[]>);

  const factorAnalysis = Object.entries(factorMoodData)
    .map(([factor, intensities]) => ({
      factor,
      avgIntensity: intensities.reduce((sum, i) => sum + i, 0) / intensities.length,
      frequency: intensities.length,
      impact: getImpactLevel(intensities.reduce((sum, i) => sum + i, 0) / intensities.length)
    }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 8);

  return (
    <Card className="p-6 bg-white/90">
      <h3 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Factor Impact Analysis</h3>
      <div className="space-y-3">
        {factorAnalysis.map((factor, index) => (
          <div key={factor.factor} className="flex items-center justify-between p-3 bg-mental-peach/20 rounded-md">
            <div className="flex items-center gap-3">
              <Badge 
                variant={factor.impact === 'positive' ? 'default' : factor.impact === 'negative' ? 'destructive' : 'outline'}
              >
                {factor.factor}
              </Badge>
              <span className="text-sm" style={{color: '#737373'}}>
                {factor.frequency} occurrences
              </span>
            </div>
            <div className="text-right">
              <div className="font-medium" style={{color: '#737373'}}>
                {factor.avgIntensity.toFixed(1)} avg
              </div>
              <div className="text-xs" style={{color: '#737373'}}>
                {factor.impact} impact
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FactorAnalysisDisplay;
