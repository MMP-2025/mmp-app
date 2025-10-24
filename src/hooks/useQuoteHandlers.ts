
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('quotes')
        .insert({
          text: validatedQuote.text,
          author: validatedQuote.author || 'Anonymous',
          category: validatedQuote.category || 'General',
          provider_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setQuotes(prev => [...prev, data]);
      setNewQuote({ text: '', author: '', category: '' });
      showSuccess("Quote added", "The inspirational quote has been added to the database.");
    } catch (error: any) {
      if (error.errors) {
        showError("Validation Error", error.errors[0].message);
      } else {
        showError("Error", "Failed to add quote. Make sure you have provider role.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setQuotes(prev => prev.filter(q => q.id !== id));
      showSuccess("Quote deleted", "The quote has been removed.");
    } catch (error) {
      console.error('Error deleting quote:', error);
      showError("Error", "Failed to delete quote.");
    }
  };

  const handleBulkImportQuotes = async (items: any[]) => {
    setIsLoading(true);
    try {
      if (items.length === 0) {
        showError("Import Error", VALIDATION_MESSAGES.NO_ITEMS_TO_IMPORT);
        return;
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      
      const quotesToInsert = items.map(item => {
        const validated = quoteSchema.parse(item);
        return {
          text: validated.text,
          author: validated.author || 'Anonymous',
          category: validated.category || 'General',
          provider_id: user?.id
        };
      });

      const { data, error } = await supabase
        .from('quotes')
        .insert(quotesToInsert)
        .select();

      if (error) throw error;

      setQuotes(prev => [...prev, ...(data || [])]);
      showSuccess("Bulk import successful", `${items.length} quotes have been imported.`);
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
