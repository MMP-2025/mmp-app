
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
    <Card className="p-6 bg-mental-blue/10">
      <h2 className="text-xl font-semibold mb-4 text-muted-foreground">Personalized Recommendations</h2>
      <div className="space-y-2">
        {recommendations.map((rec, index) => (
          <p key={index} className="text-muted-foreground flex items-center">
            <span className="w-2 h-2 bg-mental-blue rounded-full mr-2"></span>
            {rec}
          </p>
        ))}
      </div>
    </Card>
  );
};

export default PersonalizedRecommendations;
