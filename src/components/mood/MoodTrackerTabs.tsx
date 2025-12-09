import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Calendar, TrendingUp, BarChart3, Brain, Activity, Cloud, Spline, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
interface MoodTrackerTabsProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}
const MoodTrackerTabs: React.FC<MoodTrackerTabsProps> = ({
  currentTab,
  onTabChange
}) => {
  const {
    isGuest
  } = useAuth();
  const guestRestrictedTabs = ['history', 'analytics', 'advanced', 'correlations', 'insights', 'predictions', 'habits', 'environment'];
  const tabTriggerClass = "flex items-center gap-2 data-[state=active]:bg-mental-blue data-[state=active]:text-white data-[state=active]:shadow-md transition-all";

  return <TabsList className="flex h-auto w-full flex-wrap justify-start bg-mental-peach/50">
      <TabsTrigger value="track" className={tabTriggerClass}>
        <Target className="h-4 w-4" />
        Track Mood
      </TabsTrigger>
      
      {!isGuest && <>
          <TabsTrigger value="history" className={tabTriggerClass}>
            <Calendar className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="analytics" className={tabTriggerClass}>
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="advanced" className={tabTriggerClass}>
            <BarChart3 className="h-4 w-4" />
            Advanced
          </TabsTrigger>
          <TabsTrigger value="correlations" className={tabTriggerClass}>
            <Spline className="h-4 w-4" />
            Correlations
          </TabsTrigger>
          <TabsTrigger value="insights" className={tabTriggerClass}>
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="predictions" className={tabTriggerClass}>
            <Sparkles className="h-4 w-4" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="habits" className={tabTriggerClass}>
            <Activity className="h-4 w-4" />
            Habits
          </TabsTrigger>
          <TabsTrigger value="environment" className={tabTriggerClass}>
            <Cloud className="h-4 w-4" />
            Environment
          </TabsTrigger>
        </>}
      
      {isGuest && <div className="ml-4 px-4 py-2 bg-mental-peach/30 border border-mental-peach rounded-md">
          <p className="text-xs text-gray-700">
            📊 Unlock History, Analytics, AI Insights & more by scheduling a consultation!
          </p>
        </div>}
    </TabsList>;
};
export default MoodTrackerTabs;