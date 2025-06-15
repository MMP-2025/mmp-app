import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StorageManager } from '@/utils/storage';
import { Award, Trophy, Star, Target, Calendar, Flame, Heart, Brain } from 'lucide-react';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType;
  category: 'streak' | 'milestone' | 'engagement' | 'progress';
  requirement: number;
  currentProgress: number;
  completed: boolean;
  unlockedDate?: string;
  badgeColor: string;
}

interface UserProgress {
  moodEntries: number;
  journalEntries: number;
  mindfulnessSessions: number;
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  featuresUsed: string[];
}

const AchievementBadges: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const defaultAchievements: Omit<Achievement, 'currentProgress' | 'completed' | 'unlockedDate'>[] = [
    {
      id: 'first_mood',
      title: 'First Steps',
      description: 'Log your first mood entry',
      icon: Heart,
      category: 'milestone',
      requirement: 1,
      badgeColor: 'bg-blue-500'
    },
    {
      id: 'mood_streak_7',
      title: 'Week Warrior',
      description: 'Track your mood for 7 days in a row',
      icon: Flame,
      category: 'streak',
      requirement: 7,
      badgeColor: 'bg-orange-500'
    },
    {
      id: 'mood_streak_30',
      title: 'Monthly Master',
      description: 'Track your mood for 30 days in a row',
      icon: Calendar,
      category: 'streak',
      requirement: 30,
      badgeColor: 'bg-red-500'
    },
    {
      id: 'journal_entries_10',
      title: 'Thoughtful Writer',
      description: 'Write 10 journal entries',
      icon: Star,
      category: 'milestone',
      requirement: 10,
      badgeColor: 'bg-green-500'
    },
    {
      id: 'mindfulness_sessions_5',
      title: 'Mindful Beginner',
      description: 'Complete 5 mindfulness sessions',
      icon: Brain,
      category: 'milestone',
      requirement: 5,
      badgeColor: 'bg-purple-500'
    },
    {
      id: 'feature_explorer',
      title: 'Explorer',
      description: 'Try 5 different app features',
      icon: Target,
      category: 'engagement',
      requirement: 5,
      badgeColor: 'bg-indigo-500'
    },
    {
      id: 'mood_entries_100',
      title: 'Dedication Champion',
      description: 'Log 100 mood entries',
      icon: Trophy,
      category: 'milestone',
      requirement: 100,
      badgeColor: 'bg-yellow-500'
    },
    {
      id: 'wellness_warrior',
      title: 'Wellness Warrior',
      description: 'Use the app for 90 days total',
      icon: Award,
      category: 'progress',
      requirement: 90,
      badgeColor: 'bg-pink-500'
    }
  ];

  useEffect(() => {
    loadUserProgress();
    initializeAchievements();
  }, []);

  const loadUserProgress = () => {
    const moodEntries = StorageManager.load('mood_entries', []).length;
    const journalEntries = StorageManager.load('journal_entries', []).length;
    const mindfulnessProgress = StorageManager.load('mindfulness_progress', { sessions: [] });
    const userBehavior = StorageManager.load('user_behavior', null);

    const progress: UserProgress = {
      moodEntries,
      journalEntries,
      mindfulnessSessions: mindfulnessProgress.sessions?.length || 0,
      currentStreak: calculateCurrentStreak(),
      longestStreak: calculateLongestStreak(),
      totalDays: calculateTotalDays(),
      featuresUsed: userBehavior?.mostUsedFeatures || []
    };

    setUserProgress(progress);
  };

  const calculateCurrentStreak = (): number => {
    const moodEntries = StorageManager.load('mood_entries', []);
    if (moodEntries.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    const sortedEntries = moodEntries.sort((a: any, b: any) => b.timestamp - a.timestamp);

    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      const diffDays = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === i) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateLongestStreak = (): number => {
    // Simplified calculation - in real app, would track historical streaks
    return calculateCurrentStreak();
  };

  const calculateTotalDays = (): number => {
    const moodEntries = StorageManager.load('mood_entries', []);
    const uniqueDates = new Set(moodEntries.map((entry: any) => entry.date));
    return uniqueDates.size;
  };

  const initializeAchievements = () => {
    const savedAchievements = StorageManager.load<Achievement[]>('achievements', []);
    
    if (savedAchievements.length === 0) {
      const initialAchievements = defaultAchievements.map(achievement => ({
        ...achievement,
        currentProgress: 0,
        completed: false
      }));
      setAchievements(initialAchievements);
      StorageManager.save('achievements', initialAchievements);
    } else {
      setAchievements(savedAchievements);
    }
  };

  const checkAndUpdateAchievements = () => {
    if (!userProgress) return;

    const updatedAchievements = achievements.map(achievement => {
      let currentProgress = 0;

      switch (achievement.id) {
        case 'first_mood':
          currentProgress = userProgress.moodEntries;
          break;
        case 'mood_streak_7':
        case 'mood_streak_30':
          currentProgress = userProgress.currentStreak;
          break;
        case 'journal_entries_10':
          currentProgress = userProgress.journalEntries;
          break;
        case 'mindfulness_sessions_5':
          currentProgress = userProgress.mindfulnessSessions;
          break;
        case 'feature_explorer':
          currentProgress = userProgress.featuresUsed.length;
          break;
        case 'mood_entries_100':
          currentProgress = userProgress.moodEntries;
          break;
        case 'wellness_warrior':
          currentProgress = userProgress.totalDays;
          break;
        default:
          currentProgress = achievement.currentProgress;
      }

      const wasCompleted = achievement.completed;
      const isNowCompleted = currentProgress >= achievement.requirement;

      if (!wasCompleted && isNowCompleted) {
        toast.success(`🏆 Achievement Unlocked: ${achievement.title}!`);
        return {
          ...achievement,
          currentProgress,
          completed: true,
          unlockedDate: new Date().toISOString().split('T')[0]
        };
      }

      return {
        ...achievement,
        currentProgress: Math.min(currentProgress, achievement.requirement)
      };
    });

    setAchievements(updatedAchievements);
    StorageManager.save('achievements', updatedAchievements);
  };

  useEffect(() => {
    if (userProgress) {
      checkAndUpdateAchievements();
    }
  }, [userProgress]);

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'all') return true;
    if (filter === 'completed') return achievement.completed;
    if (filter === 'in-progress') return !achievement.completed;
    return achievement.category === filter;
  });

  const getProgressPercentage = (achievement: Achievement) => {
    return Math.min((achievement.currentProgress / achievement.requirement) * 100, 100);
  };

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
          {filteredAchievements.map(achievement => {
            const Icon = achievement.icon;
            const progress = getProgressPercentage(achievement);
            
            return (
              <div 
                key={achievement.id} 
                className={`border rounded-lg p-4 transition-all ${
                  achievement.completed 
                    ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300' 
                    : 'bg-mental-peach/20 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-full ${achievement.badgeColor} ${achievement.completed ? 'opacity-100' : 'opacity-50'}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold" style={{color: '#737373'}}>{achievement.title}</h4>
                    {achievement.completed && (
                      <Badge variant="secondary" className="text-xs">
                        Unlocked {achievement.unlockedDate}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-sm mb-3" style={{color: '#737373'}}>
                  {achievement.description}
                </p>
                
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs" style={{color: '#737373'}}>
                    <span>{achievement.currentProgress}/{achievement.requirement}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>
                
                <Badge variant="outline" className="mt-2 text-xs capitalize">
                  {achievement.category}
                </Badge>
              </div>
            );
          })}
        </div>

        {userProgress && (
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
        )}
      </Card>
    </div>
  );
};

export default AchievementBadges;
