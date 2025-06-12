
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Upload } from 'lucide-react';
import { parseCSVData, generateCSVTemplate } from '@/utils/importUtils';
import { ImportType } from './BulkImportModal';

interface CSVImportProps {
  type: ImportType;
  onImport: (items: any[]) => void;
}

const CSVImport: React.FC<CSVImportProps> = ({ type, onImport }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    
    try {
      const text = await file.text();
      const items = parseCSVData(text, type);
      onImport(items);
    } catch (error) {
      console.error('CSV Import error:', error);
    }
  };

  const downloadTemplate = () => {
    const template = generateCSVTemplate(type);
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Import from CSV
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Template
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="csvFile">Select CSV File</Label>
          <Input
            id="csvFile"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="mt-1"
          />
        </div>
        
        {file && (
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          </div>
        )}
        
        <Button 
          onClick={handleImport} 
          disabled={!file}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Import CSV Data
        </Button>
      </CardContent>
    </Card>
  );
};

export default CSVImport;
