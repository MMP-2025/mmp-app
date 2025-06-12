
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { parseTextareaData } from '@/utils/importUtils';
import { ImportType } from './BulkImportModal';

interface TextareaImportProps {
  type: ImportType;
  onImport: (items: any[]) => void;
}

const TextareaImport: React.FC<TextareaImportProps> = ({ type, onImport }) => {
  const [textData, setTextData] = useState('');
  const [delimiter, setDelimiter] = useState('\n');
  const [defaultCategory, setDefaultCategory] = useState('');

  const handleImport = () => {
    if (!textData.trim()) return;
    
    try {
      const items = parseTextareaData(textData, type, delimiter, defaultCategory);
      onImport(items);
    } catch (error) {
      console.error('Import error:', error);
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'quotes':
        return 'Enter quotes, one per line:\nThe only way to do great work is to love what you do. - Steve Jobs\nInnovation distinguishes between a leader and a follower. - Steve Jobs';
      case 'journalPrompts':
        return 'Enter journal prompts, one per line:\nWhat are three things I am grateful for today?\nDescribe a moment when I felt truly happy.';
      case 'questions':
        return 'Enter questions, one per line:\nHow are you feeling today?\nWhat brings you the most joy?';
      default:
        return 'Enter items, one per line...';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import from Text</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="delimiter">Line Delimiter</Label>
            <Input
              id="delimiter"
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              placeholder="Enter delimiter (e.g., \n, |, ;)"
            />
          </div>
          <div>
            <Label htmlFor="category">Default Category</Label>
            <Input
              id="category"
              value={defaultCategory}
              onChange={(e) => setDefaultCategory(e.target.value)}
              placeholder="Enter default category"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="textData">Data</Label>
          <Textarea
            id="textData"
            value={textData}
            onChange={(e) => setTextData(e.target.value)}
            placeholder={getPlaceholder()}
            className="min-h-[200px]"
          />
        </div>
        
        <Button 
          onClick={handleImport} 
          disabled={!textData.trim()}
          className="w-full"
        >
          Import Items
        </Button>
      </CardContent>
    </Card>
  );
};

export default TextareaImport;
