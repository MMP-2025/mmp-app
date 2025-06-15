
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Quote } from 'lucide-react';
import { PersonalizedContent } from '@/types/personalization';

interface PersonalizedQuoteCardProps {
  personalizedQuote: PersonalizedContent;
}

const PersonalizedQuoteCard: React.FC<PersonalizedQuoteCardProps> = ({ personalizedQuote }) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-mental-blue/20 to-mental-green/20">
      <div className="flex items-start gap-3">
        <Quote className="h-6 w-6 mt-1 text-mental-blue" />
        <div className="flex-1">
          <blockquote className="text-lg font-medium mb-2 text-neutral-500">
            "{personalizedQuote.quote}"
          </blockquote>
          <cite className="text-sm text-neutral-500">
            — {personalizedQuote.author}
          </cite>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className="text-xs">
              {Math.round(personalizedQuote.relevanceScore * 100)}% match
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {personalizedQuote.category}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PersonalizedQuoteCard;
