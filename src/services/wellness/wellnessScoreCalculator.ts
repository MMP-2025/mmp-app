
import { StorageManager } from '@/utils/storage';
import { WellnessMetric, WellnessScore } from '@/types/wellness';
import { calculateMoodScore } from './moodScore';
import { calculateConsistencyScore } from './consistencyScore';
import { calculateEngagementScore } from './engagementScore';
import { calculateMindfulnessScore } from './mindfulnessScore';
import { calculateJournalingScore } from './journalingScore';

export const WellnessScoreCalculator = {
  performWellnessCalculation(): WellnessScore {
    const moodEntries = StorageManager.load('mood_entries', []);
    const journalEntries = StorageManager.load('journal_entries', []);
    const mindfulnessProgress = StorageManager.load('mindfulness_progress', { sessions: [] });
    const userBehavior = StorageManager.load('user_behavior', null);

    // Calculate individual metrics
    const moodScore = calculateMoodScore(moodEntries);
    const consistencyScore = calculateConsistencyScore(moodEntries);
    const engagementScore = calculateEngagementScore(userBehavior);
    const mindfulnessScore = calculateMindfulnessScore(mindfulnessProgress);
    const journalingScore = calculateJournalingScore(journalEntries);

    const metrics: WellnessMetric[] = [
      {
        name: 'Mood Stability',
        value: moodScore.value,
        weight: 0.3,
        trend: moodScore.trend,
        suggestion: moodScore.suggestion
      },
      {
        name: 'Consistency',
        value: consistencyScore.value,
        weight: 0.25,
        trend: consistencyScore.trend,
        suggestion: consistencyScore.suggestion
      },
      {
        name: 'App Engagement',
        value: engagementScore.value,
        weight: 0.2,
        trend: engagementScore.trend,
        suggestion: engagementScore.suggestion
      },
      {
        name: 'Mindfulness Practice',
        value: mindfulnessScore.value,
        weight: 0.15,
        trend: mindfulnessScore.trend,
        suggestion: mindfulnessScore.suggestion
      },
      {
        name: 'Self-Reflection',
        value: journalingScore.value,
        weight: 0.1,
        trend: journalingScore.trend,
        suggestion: journalingScore.suggestion
      }
    ];

    // Calculate weighted overall score
    const overallScore = metrics.reduce((total, metric) => {
      return total + (metric.value * metric.weight);
    }, 0);

    // Generate improvements and strengths
    const improvements = metrics
      .filter(metric => metric.value < 70)
      .sort((a, b) => a.value - b.value)
      .slice(0, 3)
      .map(metric => metric.suggestion);

    const strengths = metrics
      .filter(metric => metric.value >= 80)
      .map(metric => `Strong ${metric.name.toLowerCase()}`);

    return {
      overall: Math.round(overallScore),
      metrics,
      calculatedAt: new Date().toISOString(),
      improvements,
      strengths
    };
  }
};
