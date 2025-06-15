
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  note: string;
  timestamp: number;
  date: string;
  factors: string[];
  sleepHours?: number;
  weatherCondition?: string;
  exercise?: boolean;
}

interface MoodCorrelationTrackerProps {
  moodHistory: MoodEntry[];
}

const MoodCorrelationTracker: React.FC<MoodCorrelationTrackerProps> = ({ moodHistory }) => {
  const analyzeCorrelations = () => {
    if (moodHistory.length === 0) return null;

    // Sleep correlation
    const sleepData = moodHistory
      .filter(entry => entry.sleepHours !== undefined)
      .map(entry => ({
        sleep: entry.sleepHours!,
        intensity: entry.intensity,
        mood: entry.mood
      }));

    // Exercise correlation
    const exerciseData = moodHistory.reduce((acc, entry) => {
      const exercised = entry.exercise || entry.factors.includes('Exercise');
      const key = exercised ? 'with_exercise' : 'without_exercise';
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry.intensity);
      return acc;
    }, {} as Record<string, number[]>);

    const exerciseComparison = Object.entries(exerciseData).map(([key, intensities]) => ({
      category: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      avgIntensity: intensities.reduce((sum, i) => sum + i, 0) / intensities.length,
      count: intensities.length
    }));

    // Factor frequency vs mood
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

    return {
      sleepData,
      exerciseComparison,
      factorAnalysis
    };
  };

  const getImpactLevel = (avgIntensity: number): 'positive' | 'neutral' | 'negative' => {
    if (avgIntensity >= 7) return 'positive';
    if (avgIntensity >= 5) return 'neutral';
    return 'negative';
  };

  const getInsights = () => {
    const analysis = analyzeCorrelations();
    if (!analysis) return [];

    const insights = [];

    // Sleep insights
    if (analysis.sleepData.length > 5) {
      const avgSleep = analysis.sleepData.reduce((sum, d) => sum + d.sleep, 0) / analysis.sleepData.length;
      const goodSleepEntries = analysis.sleepData.filter(d => d.sleep >= 7);
      const poorSleepEntries = analysis.sleepData.filter(d => d.sleep < 6);
      
      if (goodSleepEntries.length > 0 && poorSleepEntries.length > 0) {
        const goodSleepMood = goodSleepEntries.reduce((sum, d) => sum + d.intensity, 0) / goodSleepEntries.length;
        const poorSleepMood = poorSleepEntries.reduce((sum, d) => sum + d.intensity, 0) / poorSleepEntries.length;
        
        if (goodSleepMood - poorSleepMood > 1) {
          insights.push(`Getting 7+ hours of sleep correlates with ${(goodSleepMood - poorSleepMood).toFixed(1)} points higher mood intensity.`);
        }
      }
    }

    // Exercise insights
    if (analysis.exerciseComparison.length === 2) {
      const withExercise = analysis.exerciseComparison.find(e => e.category.includes('With'));
      const withoutExercise = analysis.exerciseComparison.find(e => e.category.includes('Without'));
      
      if (withExercise && withoutExercise && withExercise.avgIntensity > withoutExercise.avgIntensity) {
        insights.push(`Exercise days show ${(withExercise.avgIntensity - withoutExercise.avgIntensity).toFixed(1)} points higher average mood.`);
      }
    }

    // Factor insights
    const topPositiveFactor = analysis.factorAnalysis.find(f => f.impact === 'positive');
    const topNegativeFactor = analysis.factorAnalysis.find(f => f.impact === 'negative');
    
    if (topPositiveFactor) {
      insights.push(`${topPositiveFactor.factor} is your strongest positive mood factor (${topPositiveFactor.avgIntensity.toFixed(1)} avg intensity).`);
    }
    
    if (topNegativeFactor) {
      insights.push(`${topNegativeFactor.factor} tends to correlate with lower mood scores (${topNegativeFactor.avgIntensity.toFixed(1)} avg intensity).`);
    }

    return insights;
  };

  const analysis = analyzeCorrelations();
  const insights = getInsights();

  if (!analysis) {
    return (
      <Card className="p-6 bg-white/90">
        <h3 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Mood Correlations</h3>
        <p style={{color: '#737373'}}>Track more mood entries to see correlations with sleep, exercise, and activities.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Insights Summary */}
      {insights.length > 0 && (
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
      )}

      {/* Exercise vs Mood */}
      {analysis.exerciseComparison.length > 0 && (
        <Card className="p-6 bg-white/90">
          <h3 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Exercise Impact on Mood</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analysis.exerciseComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Bar dataKey="avgIntensity" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Sleep vs Mood Scatter */}
      {analysis.sleepData.length > 5 && (
        <Card className="p-6 bg-white/90">
          <h3 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Sleep vs Mood Intensity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart data={analysis.sleepData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sleep" label={{ value: 'Hours of Sleep', position: 'insideBottom', offset: -5 }} />
              <YAxis dataKey="intensity" label={{ value: 'Mood Intensity', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Scatter dataKey="intensity" fill="#3b82f6" />
            </ScatterChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Factor Analysis */}
      <Card className="p-6 bg-white/90">
        <h3 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Factor Impact Analysis</h3>
        <div className="space-y-3">
          {analysis.factorAnalysis.map((factor, index) => (
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
    </div>
  );
};

export default MoodCorrelationTracker;
