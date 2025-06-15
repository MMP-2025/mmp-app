
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Target, Share2, Trophy, MessageCircle, Heart, Calendar, Award } from 'lucide-react';
import { contentManager } from '@/utils/contentManager';
import CommunityChallenges from './CommunityChallenges';
import ResourceSharing from './ResourceSharing';

const CommunityDashboard = () => {
  const [activeTab, setActiveTab] = useState('challenges');
  const [communityStats, setCommunityStats] = useState({
    totalMembers: 1247,
    completedChallenges: 156,
    sharedResources: 89
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white/60 rounded-md">
            <div className="text-2xl font-bold text-mental-blue">{communityStats.totalMembers}</div>
            <div className="text-sm" style={{color: '#737373'}}>Community Members</div>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-md">
            <div className="text-2xl font-bold text-mental-peach">{communityStats.completedChallenges}</div>
            <div className="text-sm" style={{color: '#737373'}}>Challenges Completed</div>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-md">
            <div className="text-2xl font-bold text-purple-500">{communityStats.sharedResources}</div>
            <div className="text-sm" style={{color: '#737373'}}>Shared Resources</div>
          </div>
        </div>
      </Card>

      {/* Community Features Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Resource Sharing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges">
          <CommunityChallenges />
        </TabsContent>

        <TabsContent value="resources">
          <ResourceSharing />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityDashboard;
