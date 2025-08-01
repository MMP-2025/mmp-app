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
}
const QuoteForm: React.FC<QuoteFormProps> = ({
  newQuote,
  setNewQuote,
  onAddQuote
}) => {
  return <Card className="bg-mental-blue">
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{
        color: '#737373'
      }}>
          <Plus className="h-5 w-5" />
          Add New Quote
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea placeholder="Enter inspirational quote..." value={newQuote.text} onChange={e => setNewQuote(prev => ({
        ...prev,
        text: e.target.value
      }))} style={{
        color: '#737373'
      }} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Author (optional)" value={newQuote.author} onChange={e => setNewQuote(prev => ({
          ...prev,
          author: e.target.value
        }))} style={{
          color: '#737373'
        }} />
          <Input placeholder="Category (e.g., Motivation, Healing)" value={newQuote.category} onChange={e => setNewQuote(prev => ({
          ...prev,
          category: e.target.value
        }))} style={{
          color: '#737373'
        }} />
        </div>
        <Button onClick={onAddQuote} style={{
        color: '#737373'
      }} className="bg-mental-gray">Add Quote</Button>
      </CardContent>
    </Card>;
};
export default QuoteForm;