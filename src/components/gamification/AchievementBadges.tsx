
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StorageManager } from '@/utils/storage';
import { Award, Trophy, Star, Target, Calendar, Flame, Heart, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { AchievementCard } from './AchievementCard';
import { UserStatsCard } from './UserStatsCard';
import { useAchievements } from '@/hooks/useAchievements';

const AchievementBadges: React.FC = () => {
  const {
    achievements,
    userProgress,
    checkAndUpdateAchievements,
    initializeAchievements
  } = useAchievements();
  
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    initializeAchievements();
  }, []);

  useEffect(() => {
    if (userProgress) {
      checkAndUpdateAchievements();
    }
  }, [userProgress, checkAndUpdateAchievements]);

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'all') return true;
    if (filter === 'completed') return achievement.completed;
    if (filter === 'in-progress') return !achievement.completed;
    return achievement.category === filter;
  });

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5" color="#737373" />
          <h3 className="text-xl font-semibold" style={{color: '#737373'}}>Achievement Badges</h3>
        </div>
        
        <p className="mb-4" style={{color: '#737373'}}>
          Earn badges by reaching milestones and maintaining healthy habits
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'completed', 'in-progress', 'streak', 'milestone', 'engagement', 'progress'].map(filterOption => (
            <Button
              key={filterOption}
              variant={filter === filterOption ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filterOption)}
              className="capitalize"
            >
              {filterOption.replace('-', ' ')}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map(achievement => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>

        {userProgress && <UserStatsCard userProgress={userProgress} />}
      </Card>
    </div>
  );
};

export default AchievementBadges;
