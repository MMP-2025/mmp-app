
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
}

interface QuoteFormProps {
  newQuote: { text: string; author: string; category: string };
  setNewQuote: React.Dispatch<React.SetStateAction<{ text: string; author: string; category: string }>>;
  onAddQuote: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ newQuote, setNewQuote, onAddQuote }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Plus className="h-5 w-5" />
          Add New Quote
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter inspirational quote..."
          value={newQuote.text}
          onChange={(e) => setNewQuote(prev => ({ ...prev, text: e.target.value }))}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Author (optional)"
            value={newQuote.author}
            onChange={(e) => setNewQuote(prev => ({ ...prev, author: e.target.value }))}
          />
          <Input
            placeholder="Category (e.g., Motivation, Healing)"
            value={newQuote.category}
            onChange={(e) => setNewQuote(prev => ({ ...prev, category: e.target.value }))}
          />
        </div>
        <Button onClick={onAddQuote}>Add Quote</Button>
      </CardContent>
    </Card>
  );
};

export default QuoteForm;
