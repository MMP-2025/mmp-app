
import { useState } from 'react';
import { Quote } from '@/types/provider';
import { quoteSchema } from '@/schemas/providerValidation';
import { VALIDATION_MESSAGES } from '@/constants/provider';

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
  const [isLoading, setIsLoading] = useState(false);

  const handleAddQuote = async () => {
    setIsLoading(true);
    try {
      const validatedQuote = quoteSchema.parse(newQuote);
      
      const quote: Quote = {
        id: Date.now().toString(),
        text: validatedQuote.text,
        author: validatedQuote.author || 'Anonymous',
        category: validatedQuote.category || 'General'
      };
      
      setQuotes(prev => [...prev, quote]);
      setNewQuote({ text: '', author: '', category: '' });
      showSuccess("Quote added", "The inspirational quote has been added to the database.");
    } catch (error: any) {
      if (error.errors) {
        showError("Validation Error", error.errors[0].message);
      } else {
        showError("Error", "Failed to add quote");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
    showSuccess("Quote deleted", "The quote has been removed.");
  };

  const handleBulkImportQuotes = async (items: any[]) => {
    setIsLoading(true);
    try {
      if (items.length === 0) {
        showError("Import Error", VALIDATION_MESSAGES.NO_ITEMS_TO_IMPORT);
        return;
      }
      
      const validatedItems: Quote[] = items.map(item => {
        const validated = quoteSchema.parse(item);
        return {
          id: Date.now().toString() + Math.random(),
          text: validated.text,
          author: validated.author || 'Anonymous',
          category: validated.category || 'General'
        };
      });
      
      setQuotes(prev => [...prev, ...validatedItems]);
      showSuccess("Bulk import successful", `${validatedItems.length} quotes have been imported.`);
    } catch (error: any) {
      showError("Import Error", "Some items failed validation and were not imported");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleAddQuote,
    handleDeleteQuote,
    handleBulkImportQuotes,
    isLoading
  };
};
