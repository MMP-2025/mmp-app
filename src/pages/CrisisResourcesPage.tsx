
import React from 'react';
import EmergencyResources from '@/components/EmergencyResources';


const CrisisResourcesPage = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-red-800">Crisis Resources & Support</h1>
        <p className="text-red-700">Immediate help and resources for mental health emergencies</p>
      </div>
      <EmergencyResources />
    </div>
  );
};

export default CrisisResourcesPage;
