
import React from 'react';
import { Card } from '@/components/ui/card';

interface Quote {
  text: string;
  author: string;
}

interface QuoteOfTheDayProps {
  quote: Quote;
}

const QuoteOfTheDay: React.FC<QuoteOfTheDayProps> = ({ quote }) => {
  return (
    <Card className="p-6 bg-mental-peach/20">
      <h2 className="text-xl font-semibold mb-4 text-[#7e868b]">Quote of the Day</h2>
      <blockquote className="italic text-lg text-[#7e868b]">
        "{quote.text}"
      </blockquote>
      <p className="text-right mt-2 text-[#7e868b]">— {quote.author}</p>
    </Card>
  );
};

export default QuoteOfTheDay;
