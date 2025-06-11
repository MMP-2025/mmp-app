
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

interface GratitudePrompt {
  id: string;
  prompt: string;
  category: string;
  difficulty: 'simple' | 'moderate' | 'deep';
}

interface GratitudeFormProps {
  newGratitudePrompt: { prompt: string; category: string; difficulty: GratitudePrompt['difficulty'] };
  setNewGratitudePrompt: React.Dispatch<React.SetStateAction<{ prompt: string; category: string; difficulty: GratitudePrompt['difficulty'] }>>;
  onAddGratitudePrompt: () => void;
}

const GratitudeForm: React.FC<GratitudeFormProps> = ({ newGratitudePrompt, setNewGratitudePrompt, onAddGratitudePrompt }) => {
  return (
    <Card className="bg-mental-blue">
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{color: '#737373'}}>
          <Plus className="h-5 w-5" />
          Add New Gratitude Prompt
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter gratitude prompt..."
          value={newGratitudePrompt.prompt}
          onChange={(e) => setNewGratitudePrompt(prev => ({ ...prev, prompt: e.target.value }))}
          style={{color: '#737373'}}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Category (e.g., Daily, Relationships)"
            value={newGratitudePrompt.category}
            onChange={(e) => setNewGratitudePrompt(prev => ({ ...prev, category: e.target.value }))}
            style={{color: '#737373'}}
          />
          <select
            value={newGratitudePrompt.difficulty}
            onChange={(e) => setNewGratitudePrompt(prev => ({ ...prev, difficulty: e.target.value as GratitudePrompt['difficulty'] }))}
            className="p-2 border border-gray-300 rounded-md bg-mental-blue"
            style={{color: '#737373'}}
          >
            <option value="simple">Simple</option>
            <option value="moderate">Moderate</option>
            <option value="deep">Deep</option>
          </select>
        </div>
        <Button onClick={onAddGratitudePrompt} style={{color: '#737373'}}>Add Gratitude Prompt</Button>
      </CardContent>
    </Card>
  );
};

export default GratitudeForm;
