
import React from 'react';
import CommunityDashboard from '@/components/community/CommunityDashboard';

const CommunityPage = () => {
  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl ml-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{color: '#737373'}}>Community & Social Features</h1>
        <p style={{color: '#737373'}}>Connect anonymously with peers, participate in challenges, and share resources in a safe space.</p>
      </div>
      
      <CommunityDashboard />
    </div>
  );
};

export default CommunityPage;
