
import { Quote } from '@/types/provider';

interface UseQuoteHandlersProps {
  quotes: Quote[];
  setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>;
  newQuote: { text: string; author: string; category: string };
  setNewQuote: React.Dispatch<React.SetStateAction<{ text: string; author: string; category: string }>>;
  showSuccess: (title: string, description?: string) => void;
  showError: (title: string, description?: string) => void;
}

export const useQuoteHandlers = ({
  quotes,
  setQuotes,
  newQuote,
  setNewQuote,
  showSuccess,
  showError
}: UseQuoteHandlersProps) => {
  const handleAddQuote = () => {
    if (!newQuote.text.trim()) {
      showError("Validation Error", "Quote text is required");
      return;
    }
    
    const quote: Quote = {
      id: Date.now().toString(),
      text: newQuote.text,
      author: newQuote.author || 'Anonymous',
      category: newQuote.category || 'General'
    };
    setQuotes(prev => [...prev, quote]);
    setNewQuote({ text: '', author: '', category: '' });
    showSuccess("Quote added", "The inspirational quote has been added to the database.");
  };

  const handleDeleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
    showSuccess("Quote deleted", "The quote has been removed.");
  };

  const handleBulkImportQuotes = (items: any[]) => {
    if (items.length === 0) {
      showError("Import Error", "No valid quotes found to import");
      return;
    }
    
    setQuotes(prev => [...prev, ...items]);
    showSuccess("Bulk import successful", `${items.length} quotes have been imported.`);
  };

  return {
    handleAddQuote,
    handleDeleteQuote,
    handleBulkImportQuotes
  };
};
