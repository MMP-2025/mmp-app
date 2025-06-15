// Analytics and tracking utilities
export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'user_action' | 'mood_entry' | 'journal_entry' | 'mindfulness_session';
  timestamp: number;
  data: Record<string, any>;
  sessionId: string;
}

export interface UserMetrics {
  totalSessions: number;
  totalMoodEntries: number;
  totalJournalEntries: number;
  totalMindfulnessMinutes: number;
  streakDays: number;
  lastActiveDate: string;
  favoriteFeatures: string[];
}

class AnalyticsManager {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadEvents();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadEvents(): void {
    const savedEvents = localStorage.getItem('analytics_events');
    if (savedEvents) {
      try {
        this.events = JSON.parse(savedEvents);
      } catch (error) {
        console.error('Failed to load analytics events:', error);
        this.events = [];
      }
    }
  }

  private saveEvents(): void {
    try {
      // Keep only last 1000 events to prevent storage bloat
      const recentEvents = this.events.slice(-1000);
      localStorage.setItem('analytics_events', JSON.stringify(recentEvents));
      this.events = recentEvents;
    } catch (error) {
      console.error('Failed to save analytics events:', error);
    }
  }

  track(type: AnalyticsEvent['type'], data: Record<string, any> = {}): void {
    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: Date.now(),
      data,
      sessionId: this.sessionId
    };

    this.events.push(event);
    this.saveEvents();
    
    console.log('Analytics Event:', event);
  }

  getUserMetrics(): UserMetrics {
    const now = new Date();
    const today = now.toDateString();
    
    return {
      totalSessions: new Set(this.events.map(e => e.sessionId)).size,
      totalMoodEntries: this.events.filter(e => e.type === 'mood_entry').length,
      totalJournalEntries: this.events.filter(e => e.type === 'journal_entry').length,
      totalMindfulnessMinutes: this.events
        .filter(e => e.type === 'mindfulness_session')
        .reduce((total, e) => total + (e.data.duration || 0), 0),
      streakDays: this.calculateStreak(),
      lastActiveDate: today,
      favoriteFeatures: this.getFavoriteFeatures()
    };
  }

  private calculateStreak(): number {
    const uniqueDays = new Set(
      this.events.map(e => new Date(e.timestamp).toDateString())
    );
    
    const sortedDays = Array.from(uniqueDays).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );

    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedDays.length; i++) {
      const dayDate = new Date(sortedDays[i]);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (dayDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  private getFavoriteFeatures(): string[] {
    const featureCounts: Record<string, number> = {};
    
    this.events.forEach(event => {
      if (event.type === 'page_view' && event.data.page) {
        featureCounts[event.data.page] = (featureCounts[event.data.page] || 0) + 1;
      }
    });
    
    return Object.entries(featureCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([feature]) => feature);
  }

  getEventsInDateRange(startDate: Date, endDate: Date): AnalyticsEvent[] {
    return this.events.filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }

  clearAnalytics(): void {
    this.events = [];
    localStorage.removeItem('analytics_events');
  }
}

export const analytics = new AnalyticsManager();
