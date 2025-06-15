
import React from 'react';

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

interface Prediction {
  type: 'risk' | 'improvement' | 'maintenance';
  confidence: number;
  timeframe: string;
  factors: string[];
  recommendation: string;
  description: string;
}

interface PredictionAnalyticsProps {
  moodHistory: MoodEntry[];
}

export const usePredictionAnalytics = (moodHistory: MoodEntry[]): Prediction[] => {
  return React.useMemo(() => {
    if (moodHistory.length < 7) return [];

    const recent7Days = moodHistory.slice(0, 7);
    const recent14Days = moodHistory.slice(0, 14);
    const predictions: Prediction[] = [];

    // Helper function to get top factors
    const getTopFactors = (entries: MoodEntry[]): string[] => {
      const factorCounts = entries.reduce((acc, entry) => {
        entry.factors.forEach(factor => {
          acc[factor] = (acc[factor] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(factorCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([factor]) => factor);
    };

    // Calculate trends
    const recentAvg = recent7Days.reduce((sum, entry) => sum + entry.intensity, 0) / recent7Days.length;
    const previousAvg = recent14Days.slice(7).reduce((sum, entry) => sum + entry.intensity, 0) / Math.max(recent14Days.slice(7).length, 1);
    const trend = recentAvg - previousAvg;

    // Risk prediction based on declining mood
    if (trend < -1.5 && recentAvg < 5) {
      predictions.push({
        type: 'risk',
        confidence: Math.min(90, Math.abs(trend) * 30),
        timeframe: 'Next 3-5 days',
        factors: getTopFactors(recent7Days.filter(e => e.intensity < 5)),
        recommendation: 'Consider increasing mindfulness practice and reaching out for support',
        description: 'Your mood has been declining consistently. Early intervention recommended.'
      });
    }

    // Improvement prediction
    if (trend > 1 && recentAvg > 6) {
      predictions.push({
        type: 'improvement',
        confidence: Math.min(85, trend * 25),
        timeframe: 'Continuing trend',
        factors: getTopFactors(recent7Days.filter(e => e.intensity > 6)),
        recommendation: 'Continue current positive practices and build on this momentum',
        description: 'Your mood is showing positive improvement. Keep up the great work!'
      });
    }

    // Maintenance prediction for stable moods
    if (Math.abs(trend) < 0.5 && recentAvg >= 5 && recentAvg <= 7) {
      predictions.push({
        type: 'maintenance',
        confidence: 75,
        timeframe: 'Short term',
        factors: getTopFactors(recent7Days),
        recommendation: 'Maintain current routine while exploring new wellness activities',
        description: 'Your mood is stable. This is a good time to try new wellness strategies.'
      });
    }

    // Pattern-based predictions
    const dayOfWeekPattern = analyzeDayOfWeekPattern(moodHistory);
    if (dayOfWeekPattern) {
      predictions.push(dayOfWeekPattern);
    }

    return predictions;
  }, [moodHistory]);
};

const analyzeDayOfWeekPattern = (history: MoodEntry[]): Prediction | null => {
  if (history.length < 14) return null;

  const dayAverages = history.reduce((acc, entry) => {
    const day = new Date(entry.timestamp).getDay();
    if (!acc[day]) acc[day] = [];
    acc[day].push(entry.intensity);
    return acc;
  }, {} as Record<number, number[]>);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = new Date().getDay();
  const tomorrowDay = (currentDay + 1) % 7;

  if (dayAverages[tomorrowDay] && dayAverages[tomorrowDay].length >= 2) {
    const tomorrowAvg = dayAverages[tomorrowDay].reduce((sum, i) => sum + i, 0) / dayAverages[tomorrowDay].length;
    const overallAvg = history.reduce((sum, entry) => sum + entry.intensity, 0) / history.length;
    
    if (Math.abs(tomorrowAvg - overallAvg) > 1) {
      return {
        type: tomorrowAvg > overallAvg ? 'improvement' : 'risk',
        confidence: 65,
        timeframe: `Tomorrow (${dayNames[tomorrowDay]})`,
        factors: [`${dayNames[tomorrowDay]} pattern`],
        recommendation: tomorrowAvg > overallAvg 
          ? `${dayNames[tomorrowDay]}s tend to be good days for you. Plan something enjoyable!`
          : `${dayNames[tomorrowDay]}s can be challenging. Consider extra self-care.`,
        description: `Based on your historical pattern, ${dayNames[tomorrowDay]}s average ${tomorrowAvg.toFixed(1)}/10 mood intensity.`
      };
    }
  }

  return null;
};
