
export const calculateEngagementScore = (userBehavior: any): { value: number; trend: 'up' | 'down' | 'stable'; suggestion: string } => {
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
};
