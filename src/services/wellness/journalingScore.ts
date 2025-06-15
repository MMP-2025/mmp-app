
export const calculateJournalingScore = (journalEntries: any[]): { value: number; trend: 'up' | 'down' | 'stable'; suggestion: string } => {
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
};
