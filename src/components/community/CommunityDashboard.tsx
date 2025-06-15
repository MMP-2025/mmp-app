
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';
import CommunityChallenges from './CommunityChallenges';

const CommunityDashboard = () => {
  const [communityStats] = useState({
    totalMembers: 1247,
    completedChallenges: 156,
  });

  return (
    <div className="space-y-6">
      {/* Community Overview */}
      <Card className="p-6 bg-gradient-to-br from-mental-blue/20 to-mental-green/20">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-6 w-6 text-mental-blue" />
          <h2 className="text-xl font-semibold" style={{color: '#737373'}}>Community Hub</h2>
        </div>
        <p className="mb-4" style={{color: '#737373'}}>
          Connect with others on similar mental health journeys, share experiences, and grow together.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white/60 rounded-md">
            <div className="text-2xl font-bold text-mental-blue">{communityStats.totalMembers}</div>
            <div className="text-sm" style={{color: '#737373'}}>Community Members</div>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-md">
            <div className="text-2xl font-bold text-mental-peach">{communityStats.completedChallenges}</div>
            <div className="text-sm" style={{color: '#737373'}}>Challenges Completed</div>
          </div>
        </div>
      </Card>

      <CommunityChallenges />
    </div>
  );
};

export default CommunityDashboard;
