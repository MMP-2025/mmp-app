
export const calculateConsistencyScore = (moodEntries: any[]): { value: number; trend: 'up' | 'down' | 'stable'; suggestion: string } => {
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
};
