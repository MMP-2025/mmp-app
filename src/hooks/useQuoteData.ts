
import { useState } from 'react';
import { Quote } from '@/types/provider';

export const useQuoteData = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [newQuote, setNewQuote] = useState({
    text: '',
    author: '',
    category: ''
  });

  return {
    quotes,
    setQuotes,
    newQuote,
    setNewQuote
  };
};
