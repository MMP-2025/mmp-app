import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Heart, MessageSquare, Globe } from 'lucide-react';
import { StaggeredList } from '@/components/ui/animated';

const EmergencyResources = () => {
  const hotlines = [
    {
      name: "988 Suicide & Crisis Lifeline",
      number: "988",
      description: "For anyone in any mental health crisis",
      options: [
        { type: "call", value: "988", icon: Phone },
        { type: "text", value: "988", icon: MessageSquare },
        { type: "website", value: "988lifeline.org/chat", icon: Globe }
      ]
    },
    {
      name: "NYC WELL",
      number: "1-888-692-9355",
      description: "Emotional support, mental health crisis, substance abuse (200+ languages)",
      options: [
        { type: "call", value: "1-888-692-9355", icon: Phone },
        { type: "text", value: "Text 'WELL' to 65173", icon: MessageSquare }
      ]
    },
    {
      name: "New York State HOPEline",
      number: "1-877-846-7369",
      description: "For gambling and chemical dependencies",
      options: [
        { type: "call", value: "1-877-846-7369", icon: Phone },
        { type: "text", value: "Text 467369", icon: MessageSquare }
      ]
    },
    {
      name: "The Samaritans NYC",
      number: "1-212-673-3000",
      description: "Mental health crisis, trauma, loss, suicidality",
      options: [
        { type: "call", value: "1-212-673-3000", icon: Phone }
      ]
    },
    {
      name: "NY Suicide Prevention Center",
      number: "Text GOT5 to 741741",
      description: "Anonymous crisis text line",
      options: [
        { type: "text", value: "Text GOT5 to 741741", icon: MessageSquare },
        { type: "text", value: "Text GOT5U to 741741 (College Students)", icon: MessageSquare }
      ]
    },
    {
      name: "NY State Domestic Violence and Sexual Violence Hotline",
      number: "1-800-942-6906",
      description: "24-hour hotline available in most languages",
      options: [
        { type: "call", value: "1-800-942-6906", icon: Phone },
        { type: "text", value: "844-997-2121", icon: MessageSquare }
      ]
    },
    {
      name: "Safe Horizon Domestic Violence Hotline",
      number: "1-800-621-4673",
      description: "24-hour hotline for domestic violence (most languages)",
      options: [
        { type: "call", value: "1-800-621-4673", icon: Phone }
      ]
    },
    {
      name: "Safe Horizon Rape and Sexual Assault Hotline",
      number: "1-212-227-3000",
      description: "24-hour hotline for rape and sexual assault victims",
      options: [
        { type: "call", value: "1-212-227-3000", icon: Phone }
      ]
    },
    {
      name: "Safe Horizon Crime Victims Hotline",
      number: "1-866-689-4357",
      description: "24-hour hotline for crime victims and families",
      options: [
        { type: "call", value: "1-866-689-4357", icon: Phone }
      ]
    },
    {
      name: "NY State Central Register of Child Abuse & Maltreatment",
      number: "1-800-342-3720",
      description: "To report child abuse",
      options: [
        { type: "call", value: "1-800-342-3720", icon: Phone }
      ]
    }
  ];

  const handleAction = (type: string, value: string) => {
    if (type === "call") {
      const cleanNumber = value.replace(/[^\d]/g, '');
      if (cleanNumber) {
        window.location.href = `tel:${cleanNumber}`;
      }
    } else if (type === "text") {
      // Text action handler — wire to SMS deep link if needed
    } else if (type === "website") {
      window.open(`https://${value}`, '_blank');
    }
  };

  return (
    <Card className="border-border shadow-card-elevated overflow-hidden">
      <CardHeader className="bg-mental-peach/60 border-b border-border">
        <CardTitle className="flex items-center gap-2.5 text-foreground">
          <div className="p-1.5 rounded-full bg-destructive/10">
            <Heart className="h-4 w-4 text-destructive" />
          </div>
          Emergency Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <p className="text-sm text-muted-foreground">
          If you're in crisis or need immediate support, please reach out:
        </p>
        
        <StaggeredList baseDelay={0} increment={50} className="space-y-3">
          {hotlines.map((hotline, index) => (
            <div key={index} className="p-4 rounded-xl border bg-card shadow-card hover:shadow-card-hover transition-shadow">
              <div className="mb-3">
                <h4 className="font-semibold text-foreground text-sm mb-0.5">{hotline.name}</h4>
                <p className="text-xs text-muted-foreground">{hotline.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {hotline.options.map((option, optionIndex) => (
                  <Button
                    key={optionIndex}
                    onClick={() => handleAction(option.type, option.value)}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2 text-xs rounded-lg"
                  >
                    <option.icon className="h-3.5 w-3.5" />
                    {option.value}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </StaggeredList>
        
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <strong>Emergency:</strong> If you're in immediate danger, call 911 or go to your nearest emergency room.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyResources;
