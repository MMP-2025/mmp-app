
export const calculateMindfulnessScore = (mindfulnessProgress: any): { value: number; trend: 'up' | 'down' | 'stable'; suggestion: string } => {
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
};
