
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, AlertTriangle } from 'lucide-react';

const EmergencyResources = () => {
  const hotlines = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 crisis support"
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "24/7 text-based crisis support"
    },
    {
      name: "National Domestic Violence Hotline",
      number: "1-800-799-7233",
      description: "24/7 confidential support"
    },
    {
      name: "SAMHSA National Helpline",
      number: "1-800-662-4357",
      description: "Treatment referral and information"
    },
    {
      name: "Trevor Project (LGBTQ+ Youth)",
      number: "1-866-488-7386",
      description: "24/7 crisis support for LGBTQ+ youth"
    }
  ];

  const handleCall = (number: string) => {
    // Remove non-numeric characters for tel: link
    const cleanNumber = number.replace(/[^\d]/g, '');
    if (cleanNumber) {
      window.location.href = `tel:${cleanNumber}`;
    }
  };

  return (
    <Card className="bg-red-50 border-red-200">
      <CardHeader className="bg-red-100">
        <CardTitle className="flex items-center gap-2 text-[#7e868b]">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          Emergency Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-[#7e868b] font-medium">
          If you're in crisis or need immediate support, please reach out:
        </p>
        
        <div className="space-y-3">
          {hotlines.map((hotline, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div className="flex-1">
                <h4 className="font-medium text-[#7e868b]">{hotline.name}</h4>
                <p className="text-sm text-[#7e868b]">{hotline.description}</p>
              </div>
              <Button
                onClick={() => handleCall(hotline.number)}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 shrink-0"
                size="sm"
              >
                <Phone className="h-4 w-4" />
                {hotline.number}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-xs text-[#7e868b]">
            <strong>Emergency:</strong> If you're in immediate danger, call 911 or go to your nearest emergency room.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyResources;
