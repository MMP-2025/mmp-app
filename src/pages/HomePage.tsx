import React from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WellnessScore from '@/components/wellness/WellnessScore';
import PersonalizedRecommendations from '@/components/home/PersonalizedRecommendations';
import DailyQuestion from '@/components/home/DailyQuestion';
import QuickAccess from '@/components/home/QuickAccess';
import MoodCheckIn from '@/components/home/MoodCheckIn';
import QuoteOfTheDay from '@/components/home/QuoteOfTheDay';

const quotes = [{
  text: "You don't have to control your thoughts. You just have to stop letting them control you.",
  author: "Dan Millman"
}, {
  text: "There is hope, even when your brain tells you there isn't.",
  author: "John Green"
}, {
  text: "Self-care is how you take your power back.",
  author: "Lalah Delia"
}, {
  text: "Mental health problems don't define who you are. They are something you experience.",
  author: "Roy Chisholm"
}, {
  text: "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.",
  author: "Unknown"
}, {
  text: "The only journey is the one within.",
  author: "Rainer Maria Rilke"
}, {
  text: "Your present circumstances don't determine where you can go; they merely determine where you start.",
  author: "Nido Qubein"
}];

const questions = ["What brought you joy today?", "What's one small thing you can do for yourself today?", "What are you grateful for right now?", "What's something that challenged you recently, and how did you handle it?", "What's one boundary you want to set this week?", "What helps you feel calm when you're stressed?", "What's one self-care activity you'd like to try?"];

const getRandomItem = (array: any[]) => {
  // Use date as seed to get the same item for the entire day
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const seed = [...dateString].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = seed % array.length;
  return array[index];
};

const HomePage = () => {
  const todaysQuote = getRandomItem(quotes);
  const todaysQuestion = getRandomItem(questions);
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
