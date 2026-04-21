
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/utils/analytics';
import { trackEvent, trackFeatureUsed } from '@/utils/trackEvent';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views
    analytics.track('page_view', {
      page: location.pathname,
      timestamp: Date.now()
    });
    trackEvent('page_viewed', { page: location.pathname });
  }, [location.pathname]);

  const trackAction = (action: string, data: Record<string, any> = {}) => {
    analytics.track('user_action', {
      action,
      page: location.pathname,
      ...data
    });
    trackFeatureUsed(action, { page: location.pathname, ...data });
  };

  const trackMoodEntry = (mood: string, note?: string) => {
    analytics.track('mood_entry', {
      mood,
      hasNote: !!note,
      noteLength: note?.length || 0
    });
    trackEvent('mood_logged', { mood, has_note: !!note });
  };

  const trackJournalEntry = (hasPrompt: boolean, wordCount: number) => {
    analytics.track('journal_entry', {
      hasPrompt,
      wordCount,
      timestamp: Date.now()
    });
    trackEvent('journal_entry_created', { has_prompt: hasPrompt, word_count: wordCount });
  };

  const trackMindfulnessSession = (exerciseTitle: string, duration: number) => {
    analytics.track('mindfulness_session', {
      exerciseTitle,
      duration,
      completed: true
    });
    trackEvent('mindfulness_session_completed', { exercise: exerciseTitle, duration });
  };

  const trackResourceDownload = (resourceId: string, resourceTitle: string, category: string) => {
    analytics.track('user_action', {
      action: 'resource_download',
      resourceId,
      resourceTitle,
      category,
      timestamp: Date.now()
    });
  };

  return {
    trackAction,
    trackMoodEntry,
    trackJournalEntry,
    trackMindfulnessSession,
    trackResourceDownload,
    getUserMetrics: analytics.getUserMetrics.bind(analytics)
  };
};
