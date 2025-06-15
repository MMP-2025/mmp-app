
import React from 'react';

interface UserProgress {
  moodEntries: number;
  journalEntries: number;
  mindfulnessSessions: number;
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  featuresUsed: string[];
}

interface UserStatsCardProps {
  userProgress: UserProgress;
}

export const UserStatsCard: React.FC<UserStatsCardProps> = ({ userProgress }) => {
  return (
    <div className="mt-6 p-4 bg-mental-blue/20 rounded-lg">
      <h4 className="font-semibold mb-2" style={{color: '#737373'}}>Your Stats</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-lg font-bold" style={{color: '#737373'}}>{userProgress.moodEntries}</div>
          <div className="text-xs" style={{color: '#737373'}}>Mood Entries</div>
        </div>
        <div>
          <div className="text-lg font-bold" style={{color: '#737373'}}>{userProgress.currentStreak}</div>
          <div className="text-xs" style={{color: '#737373'}}>Current Streak</div>
        </div>
        <div>
          <div className="text-lg font-bold" style={{color: '#737373'}}>{userProgress.journalEntries}</div>
          <div className="text-xs" style={{color: '#737373'}}>Journal Entries</div>
        </div>
        <div>
          <div className="text-lg font-bold" style={{color: '#737373'}}>{userProgress.totalDays}</div>
          <div className="text-xs" style={{color: '#737373'}}>Active Days</div>
        </div>
      </div>
    </div>
  );
};
