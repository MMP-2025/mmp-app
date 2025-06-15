
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

interface CorrelationInsightsProps {
  moodHistory: MoodEntry[];
}

const CorrelationInsights: React.FC<CorrelationInsightsProps> = ({ moodHistory }) => {
  const getInsights = () => {
    if (moodHistory.length < 7) return [];

    const insights = [];
    const recent7Days = moodHistory.slice(0, 7);

    // Sleep insights
    const sleepData = moodHistory
      .filter(entry => entry.sleepHours !== undefined)
      .map(entry => ({
        sleep: entry.sleepHours!,
        intensity: entry.intensity,
        mood: entry.mood
      }));

    if (sleepData.length > 5) {
      const goodSleepEntries = sleepData.filter(d => d.sleep >= 7);
      const poorSleepEntries = sleepData.filter(d => d.sleep < 6);
      
      if (goodSleepEntries.length > 0 && poorSleepEntries.length > 0) {
        const goodSleepMood = goodSleepEntries.reduce((sum, d) => sum + d.intensity, 0) / goodSleepEntries.length;
        const poorSleepMood = poorSleepEntries.reduce((sum, d) => sum + d.intensity, 0) / poorSleepEntries.length;
        
        if (goodSleepMood - poorSleepMood > 1) {
          insights.push(`Getting 7+ hours of sleep correlates with ${(goodSleepMood - poorSleepMood).toFixed(1)} points higher mood intensity.`);
        }
      }
    }

    // Exercise insights
    const exerciseData = moodHistory.reduce((acc, entry) => {
      const exercised = entry.exercise || entry.factors.includes('Exercise');
      const key = exercised ? 'with_exercise' : 'without_exercise';
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry.intensity);
      return acc;
    }, {} as Record<string, number[]>);

    if (Object.keys(exerciseData).length === 2) {
      const withExercise = exerciseData.with_exercise?.reduce((sum, i) => sum + i, 0) / exerciseData.with_exercise?.length;
      const withoutExercise = exerciseData.without_exercise?.reduce((sum, i) => sum + i, 0) / exerciseData.without_exercise?.length;
      
      if (withExercise && withoutExercise && withExercise > withoutExercise) {
        insights.push(`Exercise days show ${(withExercise - withoutExercise).toFixed(1)} points higher average mood.`);
      }
    }

    // Factor insights
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
        impact: intensities.reduce((sum, i) => sum + i, 0) / intensities.length >= 7 ? 'positive' : 
               intensities.reduce((sum, i) => sum + i, 0) / intensities.length >= 5 ? 'neutral' : 'negative'
      }))
      .sort((a, b) => b.frequency - a.frequency);

    const topPositiveFactor = factorAnalysis.find(f => f.impact === 'positive');
    const topNegativeFactor = factorAnalysis.find(f => f.impact === 'negative');
    
    if (topPositiveFactor) {
      insights.push(`${topPositiveFactor.factor} is your strongest positive mood factor (${topPositiveFactor.avgIntensity.toFixed(1)} avg intensity).`);
    }
    
    if (topNegativeFactor) {
      insights.push(`${topNegativeFactor.factor} tends to correlate with lower mood scores (${topNegativeFactor.avgIntensity.toFixed(1)} avg intensity).`);
    }

    return insights;
  };

  const insights = getInsights();

  if (insights.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-mental-blue/20">
      <h3 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Key Insights</h3>
      <div className="space-y-2">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-2">
            <Badge variant="outline" className="mt-1">💡</Badge>
            <p className="text-sm" style={{color: '#737373'}}>{insight}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CorrelationInsights;
