import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, TrendingUp, Target, Calendar } from 'lucide-react';

interface ProgressStats {
  weeklyGoal: number;
  weeklyProgress: number;
  monthlyTotal: number;
  lifetimeMilestones: {
    total: number;
    nextMilestone: number;
  };
}

interface ProgressTrackerProps {
  title: string;
  stats: ProgressStats;
  unit?: string;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  title, 
  stats,
  unit = "entries"
}) => {
  const weeklyPercentage = Math.min((stats.weeklyProgress / stats.weeklyGoal) * 100, 100);
  const milestonePercentage = Math.min((stats.lifetimeMilestones.total / stats.lifetimeMilestones.nextMilestone) * 100, 100);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Weekly Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">This Week</span>
            </div>
            <span className="text-sm font-bold text-primary">
              {stats.weeklyProgress}/{stats.weeklyGoal} {unit}
            </span>
          </div>
          <Progress value={weeklyPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {stats.weeklyProgress === 0 
              ? "Start your week strong!" 
              : stats.weeklyProgress >= stats.weeklyGoal
                ? "🎉 Weekly goal achieved!"
                : `${stats.weeklyGoal - stats.weeklyProgress} more to reach your goal`
            }
          </p>
        </div>

        {/* Monthly Total */}
        <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">This Month</span>
          </div>
          <Badge variant="secondary" className="font-bold">
            {stats.monthlyTotal} {unit}
          </Badge>
        </div>

        {/* Lifetime Milestones */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Lifetime Progress</span>
            </div>
            <span className="text-sm font-bold text-yellow-600">
              {stats.lifetimeMilestones.total} total
            </span>
          </div>
          <Progress value={milestonePercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {stats.lifetimeMilestones.total >= stats.lifetimeMilestones.nextMilestone
              ? `🏆 Milestone ${stats.lifetimeMilestones.nextMilestone} achieved!`
              : `${stats.lifetimeMilestones.nextMilestone - stats.lifetimeMilestones.total} more to reach ${stats.lifetimeMilestones.nextMilestone} ${unit}`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
