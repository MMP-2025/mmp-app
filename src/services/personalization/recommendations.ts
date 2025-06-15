
import { UserBehavior } from '@/types/personalization';

export const getContentRecommendations = (userBehavior: UserBehavior | null): Array<{ type: string; reason: string; priority: number }> => {
  if (!userBehavior) {
    return [
      { type: 'mood-tracker', reason: 'Start tracking your mood patterns', priority: 1 },
      { type: 'mindfulness', reason: 'Begin with basic breathing exercises', priority: 2 }
    ];
  }

  const recommendations = [];
  const { mostUsedFeatures, moodPatterns, engagementLevel } = userBehavior;

  // Recommend based on mood patterns
  const recentMoods = moodPatterns.slice(-10);
  const negativeCount = recentMoods.filter(p => ['Sad', 'Angry'].includes(p.mood)).length;
  
  if (negativeCount >= 3) {
    recommendations.push({
      type: 'mindfulness',
      reason: 'Mindfulness exercises can help improve your mood',
      priority: 1
    });
  }

  // Recommend based on unused features
  if (!mostUsedFeatures.includes('journal')) {
    recommendations.push({
      type: 'journal',
      reason: 'Journaling can help process your thoughts and emotions',
      priority: 2
    });
  }

  if (!mostUsedFeatures.includes('gratitude')) {
    recommendations.push({
      type: 'gratitude',
      reason: 'Gratitude practice can boost your overall well-being',
      priority: 3
    });
  }

  // Engagement-based recommendations
  if (engagementLevel === 'high') {
    recommendations.push({
      type: 'analytics',
      reason: 'Explore detailed insights about your mental health patterns',
      priority: 4
    });
  }

  return recommendations.sort((a, b) => a.priority - b.priority);
};
