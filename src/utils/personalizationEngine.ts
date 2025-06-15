import { StorageManager, STORAGE_KEYS } from './storage';

export interface UserBehavior {
  preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  mostUsedFeatures: string[];
  moodPatterns: Array<{ mood: string; time: string; factors: string[] }>;
  engagementLevel: 'low' | 'medium' | 'high';
  streakDays: number;
  lastActiveDate: string;
}

export interface PersonalizedContent {
  quote: string;
  author: string;
  category: string;
  relevanceScore: number;
}

export interface AdaptiveReminder {
  id: string;
  type: 'mood_check' | 'mindfulness' | 'journal' | 'gratitude';
  message: string;
  optimalTime: string;
  frequency: 'daily' | 'weekly' | 'custom';
  enabled: boolean;
}

class PersonalizationEngine {
  private userBehavior: UserBehavior | null = null;

  constructor() {
    this.loadUserBehavior();
  }

  private loadUserBehavior(): void {
    this.userBehavior = StorageManager.load<UserBehavior | null>(STORAGE_KEYS.USER_BEHAVIOR, null);
  }

  private saveUserBehavior(): void {
    if (this.userBehavior) {
      StorageManager.save(STORAGE_KEYS.USER_BEHAVIOR, this.userBehavior);
    }
  }

  trackFeatureUsage(feature: string): void {
    if (!this.userBehavior) {
      this.initializeUserBehavior();
    }

    if (this.userBehavior) {
      const existingIndex = this.userBehavior.mostUsedFeatures.findIndex(f => f === feature);
      if (existingIndex > -1) {
        // Move to front to maintain recency
        this.userBehavior.mostUsedFeatures.splice(existingIndex, 1);
      }
      this.userBehavior.mostUsedFeatures.unshift(feature);
      this.userBehavior.mostUsedFeatures = this.userBehavior.mostUsedFeatures.slice(0, 10);
      this.updateEngagementLevel();
      this.saveUserBehavior();
    }
  }

  trackMoodEntry(mood: string, factors: string[]): void {
    if (!this.userBehavior) {
      this.initializeUserBehavior();
    }

    if (this.userBehavior) {
      const timeOfDay = this.getTimeOfDay();
      this.userBehavior.moodPatterns.push({
        mood,
        time: timeOfDay,
        factors
      });
      
      // Keep only last 50 mood entries for analysis
      this.userBehavior.moodPatterns = this.userBehavior.moodPatterns.slice(-50);
      this.updatePreferredTimeOfDay();
      this.saveUserBehavior();
    }
  }

  private initializeUserBehavior(): void {
    this.userBehavior = {
      preferredTimeOfDay: this.getTimeOfDay(),
      mostUsedFeatures: [],
      moodPatterns: [],
      engagementLevel: 'medium',
      streakDays: 0,
      lastActiveDate: new Date().toISOString().split('T')[0]
    };
  }

  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  private updatePreferredTimeOfDay(): void {
    if (!this.userBehavior || this.userBehavior.moodPatterns.length < 5) return;

    const timeUsage = this.userBehavior.moodPatterns.reduce((acc, pattern) => {
      acc[pattern.time] = (acc[pattern.time] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsedTime = Object.entries(timeUsage)
      .sort(([,a], [,b]) => b - a)[0][0] as 'morning' | 'afternoon' | 'evening' | 'night';

    this.userBehavior.preferredTimeOfDay = mostUsedTime;
  }

  private updateEngagementLevel(): void {
    if (!this.userBehavior) return;

    const featureCount = this.userBehavior.mostUsedFeatures.length;
    const moodCount = this.userBehavior.moodPatterns.length;
    
    if (featureCount >= 8 && moodCount >= 20) {
      this.userBehavior.engagementLevel = 'high';
    } else if (featureCount >= 4 && moodCount >= 10) {
      this.userBehavior.engagementLevel = 'medium';
    } else {
      this.userBehavior.engagementLevel = 'low';
    }
  }

  getPersonalizedQuote(): PersonalizedContent {
    const quotes = [
      {
        quote: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.",
        author: "Alan Watts",
        category: "mindfulness",
        keywords: ["change", "mindfulness", "acceptance"]
      },
      {
        quote: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
        author: "Ralph Waldo Emerson",
        category: "motivation",
        keywords: ["strength", "inner peace", "resilience"]
      },
      {
        quote: "Peace comes from within. Do not seek it without.",
        author: "Buddha",
        category: "inner peace",
        keywords: ["peace", "meditation", "self-discovery"]
      },
      {
        quote: "The present moment is the only time over which we have dominion.",
        author: "Thich Nhat Hanh",
        category: "mindfulness",
        keywords: ["present", "mindfulness", "awareness"]
      },
      {
        quote: "You have been assigned this mountain to show others it can be moved.",
        author: "Mel Robbins",
        category: "motivation",
        keywords: ["challenge", "strength", "inspiration"]
      }
    ];

    if (!this.userBehavior) {
      return { ...quotes[0], relevanceScore: 0.5 };
    }

    // Score quotes based on user behavior
    const scoredQuotes = quotes.map(quote => {
      let score = 0.5; // Base score

      // Boost based on most used features
      if (this.userBehavior!.mostUsedFeatures.includes('mindfulness') && quote.category === 'mindfulness') {
        score += 0.3;
      }
      if (this.userBehavior!.mostUsedFeatures.includes('mood') && quote.category === 'motivation') {
        score += 0.2;
      }

      // Boost based on recent mood patterns
      const recentMoods = this.userBehavior!.moodPatterns.slice(-5);
      const hasStrugglingMoods = recentMoods.some(p => ['Sad', 'Angry'].includes(p.mood));
      if (hasStrugglingMoods && quote.category === 'motivation') {
        score += 0.4;
      }

      return { ...quote, relevanceScore: Math.min(score, 1.0) };
    });

    // Return highest scoring quote
    const bestQuote = scoredQuotes.sort((a, b) => b.relevanceScore - a.relevanceScore)[0];
    return bestQuote;
  }

  getAdaptiveReminders(): AdaptiveReminder[] {
    const baseReminders: Omit<AdaptiveReminder, 'optimalTime'>[] = [
      {
        id: 'mood_check',
        type: 'mood_check',
        message: 'How are you feeling today? Take a moment to check in with yourself.',
        frequency: 'daily',
        enabled: true
      },
      {
        id: 'mindfulness',
        type: 'mindfulness',
        message: 'Time for a mindful moment. Try a quick breathing exercise.',
        frequency: 'daily',
        enabled: true
      },
      {
        id: 'journal',
        type: 'journal',
        message: 'Reflect on your day with a journal entry.',
        frequency: 'daily',
        enabled: true
      },
      {
        id: 'gratitude',
        type: 'gratitude',
        message: 'What are you grateful for today?',
        frequency: 'daily',
        enabled: true
      }
    ];

    const optimalTimes = this.getOptimalReminderTimes();

    return baseReminders.map((reminder, index) => ({
      ...reminder,
      optimalTime: optimalTimes[index] || '09:00'
    }));
  }

  private getOptimalReminderTimes(): string[] {
    if (!this.userBehavior) {
      return ['09:00', '14:00', '19:00', '20:00'];
    }

    const { preferredTimeOfDay, engagementLevel } = this.userBehavior;

    switch (preferredTimeOfDay) {
      case 'morning':
        return engagementLevel === 'high' 
          ? ['08:00', '12:00', '16:00', '20:00']
          : ['09:00', '18:00'];
      case 'afternoon':
        return engagementLevel === 'high'
          ? ['10:00', '14:00', '17:00', '21:00']
          : ['12:00', '19:00'];
      case 'evening':
        return engagementLevel === 'high'
          ? ['11:00', '15:00', '18:00', '21:30']
          : ['14:00', '20:00'];
      case 'night':
        return engagementLevel === 'high'
          ? ['12:00', '16:00', '20:00', '22:00']
          : ['15:00', '21:00'];
      default:
        return ['09:00', '14:00', '19:00', '20:00'];
    }
  }

  getContentRecommendations(): Array<{ type: string; reason: string; priority: number }> {
    if (!this.userBehavior) {
      return [
        { type: 'mood-tracker', reason: 'Start tracking your mood patterns', priority: 1 },
        { type: 'mindfulness', reason: 'Begin with basic breathing exercises', priority: 2 }
      ];
    }

    const recommendations = [];
    const { mostUsedFeatures, moodPatterns, engagementLevel } = this.userBehavior;

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
  }

  getUserBehavior(): UserBehavior | null {
    return this.userBehavior;
  }
}

export const personalizationEngine = new PersonalizationEngine();
