import React from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WellnessScore from '@/components/wellness/WellnessScore';
import PersonalizedRecommendations from '@/components/home/PersonalizedRecommendations';
import DailyQuestion from '@/components/home/DailyQuestion';
import QuickAccess from '@/components/home/QuickAccess';
import RemindersCheckIn from '@/components/home/RemindersCheckIn';
import QuoteOfTheDay from '@/components/home/QuoteOfTheDay';
import ProviderQuestionCard from '@/components/home/ProviderQuestionCard';
import WellnessScoreConditional from '@/components/wellness/WellnessScoreConditional';
import { ProgressTracker } from '@/components/progress/ProgressTracker';
import { useProgressStats } from '@/hooks/useProgressStats';
import { useAuth } from '@/contexts/AuthContext';
import { PageTransition, StaggeredList } from '@/components/ui/animated';

const HomePage = () => {
  const { getRecommendations } = useUserPreferences();
  const { isGuest, isPatient, user } = useAuth();
  const recommendations = getRecommendations();
  
  const moodStats = useProgressStats('moodData', 5);
  const journalStats = useProgressStats('journal_entries', 3);
  const gratitudeStats = useProgressStats('gratitude_entries', 3);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <PageTransition>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Greeting */}
        <div className="pt-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
          <h1 className="text-2xl font-merriweather font-bold text-foreground">
            {greeting()}{user ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isGuest 
              ? "You're exploring as a guest — data won't be saved."
              : "How are you feeling today?"
            }
          </p>
        </div>

        {/* Provider Question Hero — only show for patients */}
        {(isPatient || !isGuest) && (
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
            <ProviderQuestionCard />
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-5">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="overview">Today</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-5">
            <StaggeredList baseDelay={150} increment={100} className="space-y-5">
              <WellnessScoreConditional />
              <PersonalizedRecommendations recommendations={recommendations} />
              <DailyQuestion />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QuickAccess />
                <RemindersCheckIn />
              </div>
              <QuoteOfTheDay />
            </StaggeredList>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <StaggeredList baseDelay={0} increment={100} className="space-y-6">
              <WellnessScore />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProgressTracker title="Mood Tracking" stats={moodStats} unit="logs" />
                <ProgressTracker title="Journal Entries" stats={journalStats} />
                <ProgressTracker title="Gratitude Practice" stats={gratitudeStats} unit="practices" />
              </div>
            </StaggeredList>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default HomePage;
