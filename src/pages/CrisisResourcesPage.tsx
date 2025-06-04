
import React from 'react';
import EmergencyResources from '@/components/EmergencyResources';

const CrisisResourcesPage = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-center mb-2 text-[#7e868b]">Crisis Resources</h1>
        <p className="text-center text-base font-normal text-[#7e868b]">
          Immediate support and resources when you need them most
        </p>
      </div>
      
      <EmergencyResources />
      
      <div className="bg-white rounded-lg p-6 border shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-[#7e868b]">Additional Resources</h2>
        <div className="space-y-4 text-[#7e868b]">
          <div>
            <h3 className="font-medium">When to Seek Emergency Help</h3>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              <li>Having thoughts of harming yourself or others</li>
              <li>Feeling like you might act on suicidal thoughts</li>
              <li>Experiencing severe panic or anxiety attacks</li>
              <li>Having difficulty distinguishing reality from fantasy</li>
              <li>Unable to care for yourself or make rational decisions</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium">Online Resources</h3>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              <li>Crisis Text Line: Text support available 24/7</li>
              <li>National Suicide Prevention Lifeline: 24/7 phone support</li>
              <li>SAMHSA Treatment Locator: Find local mental health services</li>
              <li>Mental Health America: Educational resources and screening tools</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm font-medium text-yellow-800">
              Remember: Seeking help is a sign of strength, not weakness. These resources are here to support you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisResourcesPage;
