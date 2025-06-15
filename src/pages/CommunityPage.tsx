
import React from 'react';
import CommunityDashboard from '@/components/community/CommunityDashboard';
import { SidebarLayout } from '@/components/layout/SidebarLayout';

const CommunityPage = () => {
  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{color: '#737373'}}>Community & Social Features</h1>
          <p style={{color: '#737373'}}>Connect anonymously with peers, participate in challenges, and share resources in a safe space.</p>
        </div>
        
        <CommunityDashboard />
      </div>
    </SidebarLayout>
  );
};

export default CommunityPage;
