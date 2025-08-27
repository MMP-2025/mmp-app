
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/utils/analytics';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views
    analytics.track('page_view', {
      page: location.pathname,
      timestamp: Date.now()
    });
  }, [location.pathname]);

  const trackAction = (action: string, data: Record<string, any> = {}) => {
    analytics.track('user_action', {
      action,
      page: location.pathname,
      ...data
    });
  };

  const trackMoodEntry = (mood: string, note?: string) => {
    analytics.track('mood_entry', {
      mood,
      hasNote: !!note,
      noteLength: note?.length || 0
    });
  };

  const trackJournalEntry = (hasPrompt: boolean, wordCount: number) => {
    analytics.track('journal_entry', {
      hasPrompt,
      wordCount,
      timestamp: Date.now()
    });
  };

  const trackMindfulnessSession = (exerciseTitle: string, duration: number) => {
    analytics.track('mindfulness_session', {
      exerciseTitle,
      duration,
      completed: true
    });
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
