
import { StorageManager } from '@/utils/storage';

interface WellnessMetric {
  name: string;
  value: number;
  weight: number;
  trend: 'up' | 'down' | 'stable';
  suggestion: string;
}

interface WellnessScore {
  overall: number;
  metrics: WellnessMetric[];
  calculatedAt: string;
  improvements: string[];
  strengths: string[];
}

export const WellnessScoreCalculator = {
  performWellnessCalculation(): WellnessScore {
    const moodEntries = StorageManager.load('mood_entries', []);
    const journalEntries = StorageManager.load('journal_entries', []);
    const mindfulnessProgress = StorageManager.load('mindfulness_progress', { sessions: [] });
    const userBehavior = StorageManager.load('user_behavior', null);

    // Calculate individual metrics
    const moodScore = this.calculateMoodScore(moodEntries);
    const consistencyScore = this.calculateConsistencyScore(moodEntries);
    const engagementScore = this.calculateEngagementScore(userBehavior);
    const mindfulnessScore = this.calculateMindfulnessScore(mindfulnessProgress);
    const journalingScore = this.calculateJournalingScore(journalEntries);

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
  },

  calculateMoodScore(moodEntries: any[]): { value: number; trend: 'up' | 'down' | 'stable'; suggestion: string } {
    const recentEntries = moodEntries.slice(0, 7);
    if (recentEntries.length === 0) {
      return {
        value: 50,
        trend: 'stable',
        suggestion: 'Start tracking your mood daily to build awareness'
      };
    }

    const moodValues = recentEntries.map(entry => {
      const moodMap: { [key: string]: number } = {
        'Ecstatic': 100,
        'Happy': 80,
        'Neutral': 60,
        'Sad': 30,
        'Angry': 20
      };
      return moodMap[entry.mood] || 50;
    });

    const average = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (moodValues.length > 3) {
      const recentAvg = moodValues.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
      const olderAvg = moodValues.slice(-3).reduce((a, b) => a + b, 0) / 3;
      trend = recentAvg > olderAvg ? 'up' : recentAvg < olderAvg ? 'down' : 'stable';
    }

    return {
      value: Math.round(average),
      trend,
      suggestion: average < 60 ? 
        'Consider mindfulness exercises or speaking with someone you trust' :
        'Great mood stability! Keep maintaining your positive habits'
    };
  },

  calculateConsistencyScore(moodEntries: any[]): { value: number; trend: 'up' | 'down' | 'stable'; suggestion: string } {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const trackedDays = last7Days.filter(date => 
      moodEntries.some(entry => entry.date === date)
    ).length;

    const percentage = (trackedDays / 7) * 100;
    const trend: 'up' | 'down' | 'stable' = percentage > 70 ? 'up' : percentage > 40 ? 'stable' : 'down';

    return {
      value: Math.round(percentage),
      trend,
      suggestion: percentage < 50 ? 
        'Try setting daily reminders to track your mood consistently' :
        'Excellent consistency in mood tracking!'
    };
  },

  calculateEngagementScore(userBehavior: any): { value: number; trend: 'up' | 'down' | 'stable'; suggestion: string } {
    if (!userBehavior) {
      return {
        value: 30,
        trend: 'stable',
        suggestion: 'Explore different app features to enhance your wellness journey'
      };
    }

    const featureUsage = userBehavior.mostUsedFeatures?.length || 0;
    const engagementLevel = userBehavior.engagementLevel;
    
    let score = 40;
    if (engagementLevel === 'high') score = 90;
    else if (engagementLevel === 'medium') score = 70;
    
    score += Math.min(featureUsage * 5, 20);
    const trend: 'up' | 'down' | 'stable' = featureUsage > 3 ? 'up' : 'stable';

    return {
      value: Math.min(score, 100),
      trend,
      suggestion: score < 60 ? 
        'Try exploring journaling, mindfulness, or gratitude features' :
        'Great engagement with the app features!'
    };
  },

  calculateMindfulnessScore(mindfulnessProgress: any): { value: number; trend: 'up' | 'down' | 'stable'; suggestion: string } {
    const sessions = mindfulnessProgress.sessions || [];
    const recentSessions = sessions.filter((session: any) => {
      const sessionDate = new Date(session.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    });

    const score = Math.min(recentSessions.length * 20, 100);
    const trend: 'up' | 'down' | 'stable' = recentSessions.length > 2 ? 'up' : recentSessions.length > 0 ? 'stable' : 'down';

    return {
      value: score,
      trend,
      suggestion: score < 40 ? 
        'Regular mindfulness practice can significantly improve wellbeing' :
        'Wonderful mindfulness practice! Keep up the great work'
    };
  },

  calculateJournalingScore(journalEntries: any[]): { value: number; trend: 'up' | 'down' | 'stable'; suggestion: string } {
    const recentEntries = journalEntries.filter((entry: any) => {
      const entryDate = new Date(entry.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });

    const score = Math.min(recentEntries.length * 25, 100);
    const trend: 'up' | 'down' | 'stable' = recentEntries.length > 2 ? 'up' : recentEntries.length > 0 ? 'stable' : 'down';

    return {
      value: score,
      trend,
      suggestion: score < 50 ? 
        'Journaling helps process emotions and track progress' :
        'Excellent self-reflection through journaling!'
    };
  }
};
