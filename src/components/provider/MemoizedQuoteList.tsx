
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Quote, Trash2 } from 'lucide-react';
import { SearchInput } from '@/components/ui/search-input';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useSearch } from '@/hooks/useSearch';

interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
}

interface MemoizedQuoteListProps {
  quotes: Quote[];
  onDeleteQuote: (id: string) => void;
}

const MemoizedQuoteList: React.FC<MemoizedQuoteListProps> = memo(({ quotes, onDeleteQuote }) => {
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(
    quotes,
    ['text', 'author', 'category']
  );

  return (
    <Card className="bg-mental-blue">
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{color: '#737373'}}>
          <Quote className="h-5 w-5" />
          Saved Quotes ({quotes.length})
        </CardTitle>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search quotes..."
          className="mt-2"
        />
      </CardHeader>
      <CardContent>
        {filteredItems.length === 0 ? (
          <p className="text-center py-8" style={{color: '#737373'}}>
            {searchTerm ? 'No quotes found matching your search' : 'No quotes added yet'}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredItems.map(quote => (
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
                  <ConfirmationDialog
                    title="Delete Quote"
                    description="Are you sure you want to delete this quote? This action cannot be undone."
                    onConfirm={() => onDeleteQuote(quote.id)}
                    confirmText="Delete"
                    variant="destructive"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      aria-label={`Delete quote: ${quote.text.substring(0, 50)}...`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </ConfirmationDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

MemoizedQuoteList.displayName = 'MemoizedQuoteList';

export default MemoizedQuoteList;
