
import React from 'react';
import AnalyticsMetricsRow from './AnalyticsMetricsRow';

interface MoodAnalyticsStatsProps {
  totalEntries: number;
  currentStreak: number;
  avgIntensity: number;
  topFactor: string;
}

const MoodAnalyticsStats: React.FC<MoodAnalyticsStatsProps> = ({
  totalEntries,
  currentStreak,
  avgIntensity,
  topFactor
}) => {
  const metrics = [
    { value: totalEntries, label: 'Total Entries' },
    { value: currentStreak, label: 'Day Streak' },
    { value: avgIntensity, label: 'Avg Intensity' },
    { value: topFactor || 'N/A', label: 'Top Factor' }
  ];

  return <AnalyticsMetricsRow metrics={metrics} />;
};

export default MoodAnalyticsStats;
