
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Download } from 'lucide-react';
import { parseJSONData, generateJSONTemplate } from '@/utils/importUtils';
import { ImportType } from './BulkImportModal';

interface JSONImportProps {
  type: ImportType;
  onImport: (items: any[]) => void;
}

const JSONImport: React.FC<JSONImportProps> = ({ type, onImport }) => {
  const [jsonData, setJsonData] = useState('');

  const handleImport = () => {
    if (!jsonData.trim()) return;
    
    try {
      const items = parseJSONData(jsonData, type);
      onImport(items);
    } catch (error) {
      console.error('JSON Import error:', error);
    }
  };

  const downloadTemplate = () => {
    const template = generateJSONTemplate(type);
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-template.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Import from JSON
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Template
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          placeholder="Paste JSON data here..."
          className="min-h-[300px] font-mono text-sm"
        />
        
        <Button 
          onClick={handleImport} 
          disabled={!jsonData.trim()}
          className="w-full"
        >
          Import JSON Data
        </Button>
      </CardContent>
    </Card>
  );
};

export default JSONImport;
