import { useState, useEffect } from 'react';

interface ProgressStats {
  weeklyGoal: number;
  weeklyProgress: number;
  monthlyTotal: number;
  lifetimeMilestones: {
    total: number;
    nextMilestone: number;
  };
}

export const useProgressStats = (
  storageKey: string,
  weeklyGoal: number = 5,
  milestones: number[] = [10, 25, 50, 100, 250, 500, 1000]
) => {
  const [stats, setStats] = useState<ProgressStats>({
    weeklyGoal,
    weeklyProgress: 0,
    monthlyTotal: 0,
    lifetimeMilestones: {
      total: 0,
      nextMilestone: milestones[0]
    }
  });

  useEffect(() => {
    const calculateStats = () => {
      const storedData = localStorage.getItem(storageKey);
      if (!storedData) {
        return;
      }

      try {
        const entries = JSON.parse(storedData);
        const now = new Date();
        
        // Calculate week start (Sunday)
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);

        // Calculate month start
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        // Count entries
        const weeklyCount = entries.filter((entry: any) => {
          const entryDate = new Date(entry.date || entry.timestamp || entry.createdAt);
          return entryDate >= weekStart;
        }).length;

        const monthlyCount = entries.filter((entry: any) => {
          const entryDate = new Date(entry.date || entry.timestamp || entry.createdAt);
          return entryDate >= monthStart;
        }).length;

        const totalCount = entries.length;

        // Find next milestone
        const nextMilestone = milestones.find(m => m > totalCount) || milestones[milestones.length - 1];

        setStats({
          weeklyGoal,
          weeklyProgress: weeklyCount,
          monthlyTotal: monthlyCount,
          lifetimeMilestones: {
            total: totalCount,
            nextMilestone
          }
        });
      } catch (error) {
        console.error('Error calculating progress stats:', error);
      }
    };

    calculateStats();
    
    // Recalculate when storage changes
    const handleStorageChange = () => calculateStats();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [storageKey, weeklyGoal, milestones]);

  return stats;
};
