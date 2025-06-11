
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

type JournalPromptDifficulty = 'beginner' | 'intermediate' | 'advanced';

interface JournalPromptFormProps {
  newPrompt: { prompt: string; category: string; difficulty: JournalPromptDifficulty };
  setNewPrompt: React.Dispatch<React.SetStateAction<{ prompt: string; category: string; difficulty: JournalPromptDifficulty }>>;
  onAddPrompt: () => void;
}

const JournalPromptForm: React.FC<JournalPromptFormProps> = ({ newPrompt, setNewPrompt, onAddPrompt }) => {
  return (
    <Card className="bg-mental-blue">
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{color: '#737373'}}>
          <Plus className="h-5 w-5" />
          Add New Journal Prompt
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter journal prompt..."
          value={newPrompt.prompt}
          onChange={(e) => setNewPrompt(prev => ({ ...prev, prompt: e.target.value }))}
          style={{color: '#737373'}}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Category (e.g., Self-reflection, Goals)"
            value={newPrompt.category}
            onChange={(e) => setNewPrompt(prev => ({ ...prev, category: e.target.value }))}
            style={{color: '#737373'}}
          />
          <select
            value={newPrompt.difficulty}
            onChange={(e) => setNewPrompt(prev => ({ ...prev, difficulty: e.target.value as JournalPromptDifficulty }))}
            className="p-2 border border-gray-300 rounded-md bg-mental-blue"
            style={{color: '#737373'}}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <Button onClick={onAddPrompt} style={{color: '#737373'}}>Add Prompt</Button>
      </CardContent>
    </Card>
  );
};

export default JournalPromptForm;
