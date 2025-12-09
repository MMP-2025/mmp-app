
import React from 'react';
import CommunityDashboard from '@/components/community/CommunityDashboard';


const CommunityPage = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-muted-foreground">Community & Social Features</h1>
        <p className="text-muted-foreground">Connect anonymously with peers, participate in challenges, and share resources in a safe space.</p>
      </div>
      
      <CommunityDashboard />
    </div>
  );
};

export default CommunityPage;
