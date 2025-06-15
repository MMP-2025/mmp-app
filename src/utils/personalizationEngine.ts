import { StorageManager, STORAGE_KEYS } from './storage';
import { getPersonalizedQuote } from '@/services/personalization/quotes';
import { getAdaptiveReminders } from '@/services/personalization/reminders';
import { getContentRecommendations } from '@/services/personalization/recommendations';
import { UserBehavior, PersonalizedContent, AdaptiveReminder } from '@/types/personalization';
import { userBehaviorService } from '@/services/personalization/userBehaviorService';

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
      userBehaviorService.trackFeatureUsage(this.userBehavior, feature);
      this.updateEngagementLevel();
      this.saveUserBehavior();
    }
  }

  trackMoodEntry(mood: string, factors: string[]): void {
    if (!this.userBehavior) {
      this.initializeUserBehavior();
    }

    if (this.userBehavior) {
      userBehaviorService.trackMoodEntry(this.userBehavior, mood, factors);
      this.updatePreferredTimeOfDay();
      this.saveUserBehavior();
    }
  }

  private initializeUserBehavior(): void {
    this.userBehavior = userBehaviorService.initializeUserBehavior();
  }

  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    return userBehaviorService.getTimeOfDay();
  }

  private updatePreferredTimeOfDay(): void {
    if (!this.userBehavior || this.userBehavior.moodPatterns.length < 5) return;

    userBehaviorService.updatePreferredTimeOfDay(this.userBehavior);
  }

  private updateEngagementLevel(): void {
    if (!this.userBehavior) return;

    userBehaviorService.updateEngagementLevel(this.userBehavior);
  }

  getPersonalizedQuote(): PersonalizedContent {
    return getPersonalizedQuote(this.userBehavior);
  }

  getAdaptiveReminders(): AdaptiveReminder[] {
    return getAdaptiveReminders(this.userBehavior);
  }

  getContentRecommendations(): Array<{ type: string; reason: string; priority: number }> {
    return getContentRecommendations(this.userBehavior);
  }

  getUserBehavior(): UserBehavior | null {
    return this.userBehavior;
  }
}

export const personalizationEngine = new PersonalizationEngine();
