
import React from 'react';
import { Loader2 } from 'lucide-react';
import { usePersonalization } from '@/hooks/usePersonalization';
import PersonalizedQuoteCard from './PersonalizedQuoteCard';
import RecommendationsCard from './RecommendationsCard';
import RemindersCard from './RemindersCard';
import UserInsightsCard from './UserInsightsCard';

const PersonalizedDashboard = () => {
  const {
    personalizedQuote,
    adaptiveReminders,
    recommendations,
    userBehavior,
    isLoading,
  } = usePersonalization();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-mental-blue" />
        <p className="ml-4 text-neutral-500">Loading your personalized content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {personalizedQuote && (
        <PersonalizedQuoteCard personalizedQuote={personalizedQuote} />
      )}

      {recommendations.length > 0 && (
        <RecommendationsCard recommendations={recommendations} />
      )}

      <RemindersCard adaptiveReminders={adaptiveReminders} />

      {userBehavior && (
        <UserInsightsCard userBehavior={userBehavior} />
      )}
    </div>
  );
};

export default PersonalizedDashboard;
