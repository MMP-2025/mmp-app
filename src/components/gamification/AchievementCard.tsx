
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: 'streak' | 'milestone' | 'engagement' | 'progress';
  requirement: number;
  currentProgress: number;
  completed: boolean;
  unlockedDate?: string;
  badgeColor: string;
}

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const Icon = achievement.icon;
  const progress = Math.min((achievement.currentProgress / achievement.requirement) * 100, 100);
  
  return (
    <div 
      className={`border rounded-lg p-4 transition-all ${
        achievement.completed 
          ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300' 
          : 'bg-mental-peach/20 border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-full ${achievement.badgeColor} ${achievement.completed ? 'opacity-100' : 'opacity-50'}`}>
          <Icon size={20} color="white" />
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
};
