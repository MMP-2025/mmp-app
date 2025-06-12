
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';
import { getBulkData } from '@/utils/importUtils';
import { ImportType } from './BulkImportModal';

interface BulkDataImportProps {
  type: ImportType;
  onImport: (items: any[]) => void;
}

const BulkDataImport: React.FC<BulkDataImportProps> = ({ type, onImport }) => {
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  
  const bulkSets = getBulkData(type);

  const toggleSet = (setId: string) => {
    setSelectedSets(prev => 
      prev.includes(setId) 
        ? prev.filter(id => id !== setId)
        : [...prev, setId]
    );
  };

  const handleImport = () => {
    const items = bulkSets
      .filter(set => selectedSets.includes(set.id))
      .flatMap(set => set.items);
    
    if (items.length > 0) {
      onImport(items);
    }
  };

  const totalItems = bulkSets
    .filter(set => selectedSets.includes(set.id))
    .reduce((sum, set) => sum + set.items.length, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Pre-defined Bulk Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {bulkSets.map((set) => (
            <div
              key={set.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedSets.includes(set.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleSet(set.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-[#7e868b]">{set.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{set.description}</p>
                </div>
                <Badge variant="secondary">
                  {set.items.length} items
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {selectedSets.length > 0 && (
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              Selected: {selectedSets.length} sets ({totalItems} total items)
            </p>
          </div>
        )}

        <Button 
          onClick={handleImport} 
          disabled={selectedSets.length === 0}
          className="w-full"
        >
          Import Selected Data
        </Button>
      </CardContent>
    </Card>
  );
};

export default BulkDataImport;
