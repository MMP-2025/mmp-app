
import React from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WellnessScore from '@/components/wellness/WellnessScore';
import PersonalizedRecommendations from '@/components/home/PersonalizedRecommendations';
import DailyQuestion from '@/components/home/DailyQuestion';
import QuickAccess from '@/components/home/QuickAccess';
import MoodCheckIn from '@/components/home/MoodCheckIn';
import QuoteOfTheDay from '@/components/home/QuoteOfTheDay';
import { quotes, questions } from '@/data/homePageContent';
import { getRandomDailyItem } from '@/utils/getRandomDailyItem';

const HomePage = () => {
  const todaysQuote = getRandomDailyItem(quotes);
  const todaysQuestion = getRandomDailyItem(questions);
  const { getRecommendations } = useUserPreferences();

  const recommendations = getRecommendations();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-center mb-2 text-[#7e868b]">Welcome to Making Meaning Psychology</h1>
        <p className="text-center text-base font-normal text-[#7e868b]">Your daily companion for mental wellbeing</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Daily Overview</TabsTrigger>
          <TabsTrigger value="progress">Your Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <PersonalizedRecommendations recommendations={recommendations} />
          
          <DailyQuestion question={todaysQuestion} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickAccess />
            <MoodCheckIn />
          </div>
          
          <QuoteOfTheDay quote={todaysQuote} />
        </TabsContent>

        <TabsContent value="progress">
          <WellnessScore />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomePage;
