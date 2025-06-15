
import { Quote } from '@/types/provider';

interface UseQuoteHandlersProps {
  quotes: Quote[];
  setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>;
  newQuote: { text: string; author: string; category: string };
  setNewQuote: React.Dispatch<React.SetStateAction<{ text: string; author: string; category: string }>>;
  toast: any;
}

export const useQuoteHandlers = ({
  quotes,
  setQuotes,
  newQuote,
  setNewQuote,
  toast
}: UseQuoteHandlersProps) => {
  const handleAddQuote = () => {
    if (!newQuote.text.trim()) return;
    const quote: Quote = {
      id: Date.now().toString(),
      text: newQuote.text,
      author: newQuote.author || 'Anonymous',
      category: newQuote.category || 'General'
    };
    setQuotes(prev => [...prev, quote]);
    setNewQuote({ text: '', author: '', category: '' });
    toast({
      title: "Quote added",
      description: "The inspirational quote has been added to the database."
    });
  };

  const handleDeleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
    toast({
      title: "Quote deleted",
      description: "The quote has been removed."
    });
  };

  const handleBulkImportQuotes = (items: any[]) => {
    setQuotes(prev => [...prev, ...items]);
    toast({
      title: "Bulk import successful",
      description: `${items.length} quotes have been imported.`
    });
  };

  return {
    handleAddQuote,
    handleDeleteQuote,
    handleBulkImportQuotes
  };
};
