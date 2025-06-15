
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HowToUse = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#7e868b]">How to Use These Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none text-[#7e868b]">
          <ul className="space-y-2">
            <li><strong>Worksheets:</strong> Interactive tools to help you practice specific skills and techniques.</li>
            <li><strong>Guides:</strong> Comprehensive materials explaining concepts and providing step-by-step instructions.</li>
            <li><strong>Templates:</strong> Structured formats you can customize for your personal use.</li>
            <li><strong>Reference Materials:</strong> Educational content to help you better understand mental health topics.</li>
          </ul>
          <p className="mt-4 text-sm">
            These resources are designed to complement your therapy sessions and support your mental health journey. 
            If you have questions about any resource, please discuss them with your healthcare provider.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HowToUse;
