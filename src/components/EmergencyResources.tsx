import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, AlertTriangle, MessageSquare, Globe } from 'lucide-react';
const EmergencyResources = () => {
  const hotlines = [{
    name: "988 Suicide & Crisis Lifeline",
    number: "988",
    description: "For anyone in any mental health crisis",
    options: [{
      type: "call",
      value: "988",
      icon: Phone
    }, {
      type: "text",
      value: "988",
      icon: MessageSquare
    }, {
      type: "website",
      value: "988lifeline.org/chat",
      icon: Globe
    }]
  }, {
    name: "NYC WELL",
    number: "1-888-692-9355",
    description: "Emotional support, mental health crisis, substance abuse (200+ languages)",
    options: [{
      type: "call",
      value: "1-888-692-9355",
      icon: Phone
    }, {
      type: "text",
      value: "Text 'WELL' to 65173",
      icon: MessageSquare
    }]
  }, {
    name: "New York State HOPEline",
    number: "1-877-846-7369",
    description: "For gambling and chemical dependencies",
    options: [{
      type: "call",
      value: "1-877-846-7369",
      icon: Phone
    }, {
      type: "text",
      value: "Text 467369",
      icon: MessageSquare
    }]
  }, {
    name: "The Samaritans NYC",
    number: "1-212-673-3000",
    description: "Mental health crisis, trauma, loss, suicidality",
    options: [{
      type: "call",
      value: "1-212-673-3000",
      icon: Phone
    }]
  }, {
    name: "NY Suicide Prevention Center",
    number: "Text GOT5 to 741741",
    description: "Anonymous crisis text line",
    options: [{
      type: "text",
      value: "Text GOT5 to 741741",
      icon: MessageSquare
    }, {
      type: "text",
      value: "Text GOT5U to 741741 (College Students)",
      icon: MessageSquare
    }]
  }, {
    name: "NY State Domestic Violence and Sexual Violence Hotline",
    number: "1-800-942-6906",
    description: "24-hour hotline available in most languages",
    options: [{
      type: "call",
      value: "1-800-942-6906",
      icon: Phone
    }, {
      type: "text",
      value: "844-997-2121",
      icon: MessageSquare
    }]
  }, {
    name: "Safe Horizon Domestic Violence Hotline",
    number: "1-800-621-4673",
    description: "24-hour hotline for domestic violence (most languages)",
    options: [{
      type: "call",
      value: "1-800-621-4673",
      icon: Phone
    }]
  }, {
    name: "Safe Horizon Rape and Sexual Assault Hotline",
    number: "1-212-227-3000",
    description: "24-hour hotline for rape and sexual assault victims",
    options: [{
      type: "call",
      value: "1-212-227-3000",
      icon: Phone
    }]
  }, {
    name: "Safe Horizon Crime Victims Hotline",
    number: "1-866-689-4357",
    description: "24-hour hotline for crime victims and families",
    options: [{
      type: "call",
      value: "1-866-689-4357",
      icon: Phone
    }]
  }, {
    name: "NY State Central Register of Child Abuse & Maltreatment",
    number: "1-800-342-3720",
    description: "To report child abuse",
    options: [{
      type: "call",
      value: "1-800-342-3720",
      icon: Phone
    }]
  }];
  const handleAction = (type: string, value: string) => {
    if (type === "call") {
      const cleanNumber = value.replace(/[^\d]/g, '');
      if (cleanNumber) {
        window.location.href = `tel:${cleanNumber}`;
      }
    } else if (type === "text") {
      console.log(`Text action: ${value}`);
    } else if (type === "website") {
      window.open(`https://${value}`, '_blank');
    }
  };
  return <Card className="border-red-200 bg-mental-peach">
      <CardHeader className="bg-red-100">
        <CardTitle className="flex items-center gap-2 text-[#7e868b]">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          Emergency Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 bg-mental-peach">
        <p className="text-sm text-[#7e868b] font-medium">
          If you're in crisis or need immediate support, please reach out:
        </p>
        
        <div className="space-y-4">
          {hotlines.map((hotline, index) => <div key={index} className="p-4 rounded-lg border bg-mental-gray">
              <div className="mb-3">
                <h4 className="font-medium text-[#7e868b] mb-1">{hotline.name}</h4>
                <p className="text-sm text-[#7e868b]">{hotline.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {hotline.options.map((option, optionIndex) => <Button key={optionIndex} onClick={() => handleAction(option.type, option.value)} size="sm" className="flex items-center gap-2 text-xs bg-mental-peach text-black">
                    <option.icon className="h-3 w-3" />
                    {option.value}
                  </Button>)}
              </div>
            </div>)}
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-xs text-[#7e868b]">
            <strong>Emergency:</strong> If you're in immediate danger, call 911 or go to your nearest emergency room.
          </p>
        </div>
      </CardContent>
    </Card>;
};
export default EmergencyResources;