import React, { Suspense, lazy } from 'react';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy load heavy analytics components with proper default exports
const AdvancedAnalytics = lazy(() => import('@/components/analytics/AdvancedAnalytics'));
const MoodAnalytics = lazy(() => import('@/components/mood/MoodAnalytics'));

const AnalyticsLoadingFallback = () => (
  <Card className="p-6 bg-card text-center">
    <LoadingSpinner />
    <p className="text-muted-foreground mt-2">Loading analytics...</p>
  </Card>
);

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  note: string;
  timestamp: number;
  date: string;
  factors: string[];
}

interface LazyAnalyticsProps {
  type: 'advanced' | 'mood';
  moodHistory?: MoodEntry[];
}

export const LazyAnalytics: React.FC<LazyAnalyticsProps> = ({ type, moodHistory }) => {
  const getComponent = () => {
    switch (type) {
      case 'advanced':
        return <AdvancedAnalytics />;
      case 'mood':
        return <MoodAnalytics moodHistory={moodHistory || []} />;
      default:
        return <div>Unknown analytics type</div>;
    }
  };

  return (
    <Suspense fallback={<AnalyticsLoadingFallback />}>
      {getComponent()}
    </Suspense>
  );
};

export default LazyAnalytics;