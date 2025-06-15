import { UserBehavior } from '@/types/personalization';

class UserBehaviorService {
  initializeUserBehavior(): UserBehavior {
    const now = new Date().toISOString();
    return {
      preferredTimeOfDay: 'morning',
      mostUsedFeatures: [],
      moodPatterns: [],
      engagementLevel: 'low',
      streakDays: 0,
      lastActiveDate: now,
    };
  }

  getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  trackFeatureUsage(userBehavior: UserBehavior, feature: string): void {
    if (!userBehavior.mostUsedFeatures.includes(feature)) {
      userBehavior.mostUsedFeatures.push(feature);
    }
  }

  trackMoodEntry(userBehavior: UserBehavior, mood: string, factors: string[]): void {
    const newEntry = {
      mood,
      time: new Date().toISOString(),
      factors,
    };
    userBehavior.moodPatterns.push(newEntry);
    // Keep mood patterns to a reasonable size
    if (userBehavior.moodPatterns.length > 100) {
      userBehavior.moodPatterns.shift();
    }
  }

  updatePreferredTimeOfDay(userBehavior: UserBehavior): void {
    const timeCounts: Record<string, number> = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    userBehavior.moodPatterns.forEach(entry => {
      const hour = new Date(entry.time).getHours();
      if (hour >= 5 && hour < 12) timeCounts.morning++;
      else if (hour >= 12 && hour < 17) timeCounts.afternoon++;
      else if (hour >= 17 && hour < 21) timeCounts.evening++;
      else timeCounts.night++;
    });

    const preferredTime = Object.keys(timeCounts).reduce((a, b) => timeCounts[a] > timeCounts[b] ? a : b);
    userBehavior.preferredTimeOfDay = preferredTime as 'morning' | 'afternoon' | 'evening' | 'night';
  }

  updateEngagementLevel(userBehavior: UserBehavior): void {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = new Date(userBehavior.lastActiveDate).toISOString().split('T')[0];
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastDate === today) {
      // Already active today, do nothing to streak
    } else if (lastDate === yesterdayStr) {
      userBehavior.streakDays += 1;
    } else {
      userBehavior.streakDays = 1; // Reset streak
    }
    userBehavior.lastActiveDate = new Date().toISOString();

    const actionsCount = userBehavior.moodPatterns.length + userBehavior.mostUsedFeatures.length;
    if (userBehavior.streakDays > 7 && actionsCount > 20) {
      userBehavior.engagementLevel = 'high';
    } else if (userBehavior.streakDays > 2 && actionsCount > 5) {
      userBehavior.engagementLevel = 'medium';
    } else {
      userBehavior.engagementLevel = 'low';
    }
  }
}

export const userBehaviorService = new UserBehaviorService();
