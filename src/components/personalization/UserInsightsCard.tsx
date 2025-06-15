
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserBehavior } from '@/types/personalization';

interface UserInsightsCardProps {
  userBehavior: UserBehavior;
}

const UserInsightsCard: React.FC<UserInsightsCardProps> = ({ userBehavior }) => {
  return (
    <Card className="p-6 bg-white/90">
      <h3 className="text-lg font-semibold mb-4 text-neutral-500">
        Your Mental Health Journey
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-mental-blue">
            {userBehavior.streakDays}
          </div>
          <div className="text-sm text-neutral-500">Day Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-mental-green">
            {userBehavior.mostUsedFeatures.length}
          </div>
          <div className="text-sm text-neutral-500">Features Used</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-mental-peach">
            {userBehavior.engagementLevel}
          </div>
          <div className="text-sm text-neutral-500">Engagement</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-sm mb-2 text-neutral-500">
          Most active time: <Badge variant="outline">{userBehavior.preferredTimeOfDay}</Badge>
        </div>
        {userBehavior.mostUsedFeatures.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {userBehavior.mostUsedFeatures.slice(0, 5).map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default UserInsightsCard;
