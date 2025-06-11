
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Quote, Trash2 } from 'lucide-react';

interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
}

interface QuoteListProps {
  quotes: Quote[];
  onDeleteQuote: (id: string) => void;
}

const QuoteList: React.FC<QuoteListProps> = ({ quotes, onDeleteQuote }) => {
  return (
    <Card className="bg-mental-blue">
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{color: '#737373'}}>
          <Quote className="h-5 w-5" />
          Saved Quotes ({quotes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {quotes.length === 0 ? (
          <p className="text-center py-8" style={{color: '#737373'}}>No quotes added yet</p>
        ) : (
          <div className="space-y-3">
            {quotes.map(quote => (
              <div key={quote.id} className="p-4 border rounded-lg bg-mental-peach/30">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="mb-2" style={{color: '#737373'}}>"{quote.text}"</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span style={{color: '#737373'}}>— {quote.author}</span>
                      <span className="px-2 py-1 bg-mental-green/50 rounded-full text-xs" style={{color: '#737373'}}>
                        {quote.category}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteQuote(quote.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuoteList;
