
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Calendar, TrendingUp, BarChart3, Brain, Activity, Cloud } from 'lucide-react';

interface MoodTrackerTabsProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const MoodTrackerTabs: React.FC<MoodTrackerTabsProps> = ({ currentTab, onTabChange }) => {
  return (
    <TabsList className="flex h-auto w-full flex-wrap justify-start">
      <TabsTrigger value="track" className="flex items-center gap-2">
        <Target className="h-4 w-4" />
        Track Mood
      </TabsTrigger>
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
        <TrendingUp className="h-4 w-4" />
        Correlations
      </TabsTrigger>
      <TabsTrigger value="insights" className="flex items-center gap-2">
        <Brain className="h-4 w-4" />
        AI Insights
      </TabsTrigger>
      <TabsTrigger value="predictions" className="flex items-center gap-2">
        <Brain className="h-4 w-4" />
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
    </TabsList>
  );
};

export default MoodTrackerTabs;
