
import { useState, useEffect } from 'react';
import { personalizationEngine, UserBehavior, PersonalizedContent, AdaptiveReminder } from '@/utils/personalizationEngine';

export const usePersonalization = () => {
  const [personalizedQuote, setPersonalizedQuote] = useState<PersonalizedContent | null>(null);
  const [adaptiveReminders, setAdaptiveReminders] = useState<AdaptiveReminder[]>([]);
  const [recommendations, setRecommendations] = useState<Array<{ type: string; reason: string; priority: number }>>([]);
  const [userBehavior, setUserBehavior] = useState<UserBehavior | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPersonalizedContent();
  }, []);

  const loadPersonalizedContent = () => {
    setIsLoading(true);
    try {
      const quote = personalizationEngine.getPersonalizedQuote();
      const reminders = personalizationEngine.getAdaptiveReminders();
      const recs = personalizationEngine.getContentRecommendations();
      const behavior = personalizationEngine.getUserBehavior();
      
      setPersonalizedQuote(quote);
      setAdaptiveReminders(reminders);
      setRecommendations(recs);
      setUserBehavior(behavior);
    } catch (error) {
      console.error('Failed to load personalized content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const trackFeatureUsage = (feature: string) => {
    personalizationEngine.trackFeatureUsage(feature);
    setUserBehavior(personalizationEngine.getUserBehavior());
  };

  const trackMoodEntry = (mood: string, factors: string[]) => {
    personalizationEngine.trackMoodEntry(mood, factors);
    setUserBehavior(personalizationEngine.getUserBehavior());
    // Refresh recommendations after mood entry
    const newRecs = personalizationEngine.getContentRecommendations();
    setRecommendations(newRecs);
  };

  const refreshPersonalizedContent = () => {
    loadPersonalizedContent();
  };

  return {
    personalizedQuote,
    adaptiveReminders,
    recommendations,
    userBehavior,
    isLoading,
    trackFeatureUsage,
    trackMoodEntry,
    refreshPersonalizedContent
  };
};
