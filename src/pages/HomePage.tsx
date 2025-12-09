
import React from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WellnessScore from '@/components/wellness/WellnessScore';
import PersonalizedRecommendations from '@/components/home/PersonalizedRecommendations';
import DailyQuestion from '@/components/home/DailyQuestion';
import QuickAccess from '@/components/home/QuickAccess';
import RemindersCheckIn from '@/components/home/RemindersCheckIn';
import QuoteOfTheDay from '@/components/home/QuoteOfTheDay';
import { ProgressTracker } from '@/components/progress/ProgressTracker';
import { useProgressStats } from '@/hooks/useProgressStats';
const HomePage = () => {
  const { getRecommendations } = useUserPreferences();

  const recommendations = getRecommendations();
  
  // Get progress stats for different activities
  const moodStats = useProgressStats('moodData', 5);
  const journalStats = useProgressStats('journal_entries', 3);
  const gratitudeStats = useProgressStats('gratitude_entries', 3);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-center mb-2 text-muted-foreground">Welcome to Making Meaning Psychology</h1>
        <p className="text-center text-base font-normal text-muted-foreground">Your daily companion for mental wellbeing</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-mental-peach/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-mental-blue data-[state=active]:text-white data-[state=active]:shadow-md transition-all">Daily Overview</TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-mental-blue data-[state=active]:text-white data-[state=active]:shadow-md transition-all">Your Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <PersonalizedRecommendations recommendations={recommendations} />
          
          <DailyQuestion />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickAccess />
            <RemindersCheckIn />
          </div>
          
          <QuoteOfTheDay />
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <WellnessScore />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProgressTracker 
              title="Mood Tracking" 
              stats={moodStats}
              unit="logs"
            />
            <ProgressTracker 
              title="Journal Entries" 
              stats={journalStats}
            />
            <ProgressTracker 
              title="Gratitude Practice" 
              stats={gratitudeStats}
              unit="practices"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomePage;
