
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface EnhancedQuoteFormProps {
  newQuote: {
    text: string;
    author: string;
    category: string;
  };
  setNewQuote: React.Dispatch<React.SetStateAction<{
    text: string;
    author: string;
    category: string;
  }>>;
  onAddQuote: () => void;
  isLoading?: boolean;
}

const EnhancedQuoteForm: React.FC<EnhancedQuoteFormProps> = ({
  newQuote,
  setNewQuote,
  onAddQuote,
  isLoading = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [draftQuote, setDraftQuote] = useLocalStorage('draft-quote', newQuote);

  // Load draft on mount
  useEffect(() => {
    if (draftQuote && (draftQuote.text || draftQuote.author || draftQuote.category)) {
      setNewQuote(draftQuote);
    }
  }, []);

  // Save draft on change
  useEffect(() => {
    setDraftQuote(newQuote);
  }, [newQuote, setDraftQuote]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 's',
      ctrlKey: true,
      callback: () => {
        if (newQuote.text.trim()) {
          onAddQuote();
        }
      }
    },
    {
      key: 'q',
      ctrlKey: true,
      shiftKey: true,
      callback: () => {
        textareaRef.current?.focus();
      }
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddQuote();
  };

  return (
    <Card className="bg-mental-blue">
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{color: '#737373'}}>
          <Plus className="h-5 w-5" />
          Add New Quote
          <span className="ml-auto text-xs text-gray-500">Ctrl+S to save, Ctrl+Shift+Q to focus</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="quote-text" className="sr-only">Quote text</label>
            <Textarea 
              id="quote-text"
              ref={textareaRef}
              placeholder="Enter inspirational quote..." 
              value={newQuote.text} 
              onChange={e => setNewQuote(prev => ({...prev, text: e.target.value}))} 
              style={{color: '#737373'}}
              aria-describedby="quote-text-help"
              required
            />
            <p id="quote-text-help" className="sr-only">Enter the text of the inspirational quote</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quote-author" className="sr-only">Author</label>
              <Input 
                id="quote-author"
                placeholder="Author (optional)" 
                value={newQuote.author} 
                onChange={e => setNewQuote(prev => ({...prev, author: e.target.value}))} 
                style={{color: '#737373'}}
                aria-describedby="quote-author-help"
              />
              <p id="quote-author-help" className="sr-only">Enter the author of the quote (optional)</p>
            </div>
            <div>
              <label htmlFor="quote-category" className="sr-only">Category</label>
              <Input 
                id="quote-category"
                placeholder="Category (e.g., Motivation, Healing)" 
                value={newQuote.category} 
                onChange={e => setNewQuote(prev => ({...prev, category: e.target.value}))} 
                style={{color: '#737373'}}
                aria-describedby="quote-category-help"
              />
              <p id="quote-category-help" className="sr-only">Enter a category for the quote</p>
            </div>
          </div>
          <Button 
            type="submit"
            disabled={isLoading || !newQuote.text.trim()}
            style={{color: '#737373'}} 
            className="bg-mental-gray"
            aria-label="Add quote to database"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" text="Adding..." />
            ) : (
              'Add Quote'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedQuoteForm;
