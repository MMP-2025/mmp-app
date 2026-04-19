
import React from 'react';
import { Card } from '@/components/ui/card';

interface PersonalizedRecommendationsProps {
  recommendations: string[];
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({ recommendations }) => {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-card border-border/50 card-elevated hover-card-subtle">
      <h2 className="mb-4 text-foreground">Personalized Recommendations</h2>
      <div className="space-y-2">
        {recommendations.map((rec, index) => (
          <p key={index} className="text-sm text-muted-foreground flex items-center leading-relaxed">
            <span className="w-2 h-2 bg-primary rounded-full mr-2 shrink-0"></span>
            {rec}
          </p>
        ))}
      </div>
    </Card>
  );
};

export default PersonalizedRecommendations;
