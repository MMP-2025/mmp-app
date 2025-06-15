
export const calculateMoodScore = (moodEntries: any[]): { value: number; trend: 'up' | 'down' | 'stable'; suggestion: string } => {
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
};
