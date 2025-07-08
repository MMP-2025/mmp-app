
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Calendar, TrendingUp, BarChart3, Brain, Activity, Cloud, Spline, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MoodTrackerTabsProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const MoodTrackerTabs: React.FC<MoodTrackerTabsProps> = ({ currentTab, onTabChange }) => {
  const { isGuest } = useAuth();

  const guestRestrictedTabs = ['history', 'analytics', 'advanced', 'correlations', 'insights', 'predictions', 'habits', 'environment'];

  return (
    <TabsList className="flex h-auto w-full flex-wrap justify-start">
      <TabsTrigger value="track" className="flex items-center gap-2">
        <Target className="h-4 w-4" />
        Track Mood
      </TabsTrigger>
      
      {!isGuest && (
        <>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Advanced
          </TabsTrigger>
          <TabsTrigger value="correlations" className="flex items-center gap-2">
            <Spline className="h-4 w-4" />
            Correlations
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="habits" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Habits
          </TabsTrigger>
          <TabsTrigger value="environment" className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            Environment
          </TabsTrigger>
        </>
      )}
      
      {isGuest && (
        <div className="ml-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-700">
            📊 Unlock History, Analytics, AI Insights & more by creating an account!
          </p>
        </div>
      )}
    </TabsList>
  );
};

export default MoodTrackerTabs;
