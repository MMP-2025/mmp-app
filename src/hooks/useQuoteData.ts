
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/types/provider';

export const useQuoteData = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [newQuote, setNewQuote] = useState({
    text: '',
    author: '',
    category: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const { data, error } = await supabase
          .from('quotes')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setQuotes(data || []);
      } catch (error) {
        console.error('Error fetching quotes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  return {
    quotes,
    setQuotes,
    newQuote,
    setNewQuote,
    loading
  };
};
