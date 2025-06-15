
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import MoodAnalyticsStats from './analytics/MoodAnalyticsStats';
import MoodTrendChart from './analytics/MoodTrendChart';
import MoodDistributionChart from './analytics/MoodDistributionChart';
import TopFactorsDisplay from './analytics/TopFactorsDisplay';
import IntensityByMoodChart from './analytics/IntensityByMoodChart';

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  note: string;
  timestamp: number;
  date: string;
  factors: string[];
}

interface MoodAnalyticsProps {
  moodHistory: MoodEntry[];
}

const MoodAnalytics = ({ moodHistory }: MoodAnalyticsProps) => {
  const analytics = useMemo(() => {
    if (moodHistory.length === 0) return null;

    // Mood distribution
    const moodCounts = moodHistory.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Average intensity by mood
    const intensityByMood = moodHistory.reduce((acc, entry) => {
      if (!acc[entry.mood]) acc[entry.mood] = { total: 0, count: 0 };
      acc[entry.mood].total += entry.intensity;
      acc[entry.mood].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const avgIntensityByMood = Object.entries(intensityByMood).map(([mood, data]) => ({
      mood,
      avgIntensity: Math.round((data.total / data.count) * 10) / 10
    }));

    // Factor frequency
    const factorCounts = moodHistory.reduce((acc, entry) => {
      entry.factors.forEach(factor => {
        acc[factor] = (acc[factor] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const topFactors = Object.entries(factorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([factor, count]) => ({ factor, count }));

    // Weekly trend (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const weeklyTrend = last7Days.map(date => {
      const dayEntries = moodHistory.filter(entry => entry.date === date);
      const avgIntensity = dayEntries.length > 0 
        ? dayEntries.reduce((sum, entry) => sum + entry.intensity, 0) / dayEntries.length
        : 0;
      return {
        date: new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        intensity: Math.round(avgIntensity * 10) / 10,
        entries: dayEntries.length
      };
    });

    // Streak calculation
    const sortedDates = [...new Set(moodHistory.map(entry => entry.date))].sort();
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - currentStreak);
      const expectedDateStr = expectedDate.toISOString().split('T')[0];
      
      if (sortedDates[i] === expectedDateStr) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      totalEntries: moodHistory.length,
      currentStreak,
      avgIntensity: Math.round((moodHistory.reduce((sum, entry) => sum + entry.intensity, 0) / moodHistory.length) * 10) / 10,
      moodDistribution: Object.entries(moodCounts).map(([mood, count]) => ({ mood, count })),
      avgIntensityByMood,
      topFactors,
      weeklyTrend
    };
  }, [moodHistory]);

  if (!analytics) {
    return (
      <Card className="p-6 bg-white/90">
        <h2 className="text-xl font-semibold mb-4" style={{color: '#737373'}}>Mood Analytics</h2>
        <p style={{color: '#737373'}}>Start tracking your mood to see analytics and insights!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <MoodAnalyticsStats
        totalEntries={analytics.totalEntries}
        currentStreak={analytics.currentStreak}
        avgIntensity={analytics.avgIntensity}
        topFactor={analytics.topFactors[0]?.factor || 'N/A'}
      />

      <MoodTrendChart weeklyTrend={analytics.weeklyTrend} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MoodDistributionChart moodDistribution={analytics.moodDistribution} />
        <TopFactorsDisplay topFactors={analytics.topFactors} />
      </div>

      <IntensityByMoodChart avgIntensityByMood={analytics.avgIntensityByMood} />
    </div>
  );
};

export default MoodAnalytics;
