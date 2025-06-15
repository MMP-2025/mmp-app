
import React from 'react';
import EmergencyResources from '@/components/EmergencyResources';

const CrisisResourcesPage = () => {
  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl ml-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-red-800">Crisis Resources & Support</h1>
        <p className="text-red-700">Immediate help and resources for mental health emergencies</p>
      </div>
      <EmergencyResources />
    </div>
  );
};

export default CrisisResourcesPage;
