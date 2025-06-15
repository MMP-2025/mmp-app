
import React from 'react';
import { Card } from '@/components/ui/card';

interface MoodAnalyticsStatsProps {
  totalEntries: number;
  currentStreak: number;
  avgIntensity: number;
  topFactor: string;
}

const MoodAnalyticsStats: React.FC<MoodAnalyticsStatsProps> = ({
  totalEntries,
  currentStreak,
  avgIntensity,
  topFactor
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4 bg-white/90">
        <div className="text-center">
          <div className="text-2xl font-bold" style={{color: '#737373'}}>{totalEntries}</div>
          <div className="text-sm" style={{color: '#737373'}}>Total Entries</div>
        </div>
      </Card>
      <Card className="p-4 bg-white/90">
        <div className="text-center">
          <div className="text-2xl font-bold" style={{color: '#737373'}}>{currentStreak}</div>
          <div className="text-sm" style={{color: '#737373'}}>Day Streak</div>
        </div>
      </Card>
      <Card className="p-4 bg-white/90">
        <div className="text-center">
          <div className="text-2xl font-bold" style={{color: '#737373'}}>{avgIntensity}</div>
          <div className="text-sm" style={{color: '#737373'}}>Avg Intensity</div>
        </div>
      </Card>
      <Card className="p-4 bg-white/90">
        <div className="text-center">
          <div className="text-2xl font-bold" style={{color: '#737373'}}>
            {topFactor || 'N/A'}
          </div>
          <div className="text-sm" style={{color: '#737373'}}>Top Factor</div>
        </div>
      </Card>
    </div>
  );
};

export default MoodAnalyticsStats;
