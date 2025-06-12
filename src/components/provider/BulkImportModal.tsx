
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Database, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TextareaImport from './TextareaImport';
import JSONImport from './JSONImport';
import CSVImport from './CSVImport';
import BulkDataImport from './BulkDataImport';

export type ImportType = 'quotes' | 'journalPrompts' | 'questions' | 'toolkitItems' | 'reminders' | 'gratitudePrompts' | 'mindfulnessPrompts';

interface BulkImportModalProps {
  type: ImportType;
  onImport: (items: any[]) => void;
  children: React.ReactNode;
}

const BulkImportModal: React.FC<BulkImportModalProps> = ({
  type,
  onImport,
  children
}) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleImportSuccess = (items: any[]) => {
    onImport(items);
    setOpen(false);
    toast({
      title: "Import successful",
      description: `${items.length} items have been imported successfully.`
    });
  };

  const getTypeLabel = () => {
    const labels = {
      quotes: 'Quotes',
      journalPrompts: 'Journal Prompts',
      questions: 'Questions',
      toolkitItems: 'Toolkit Items',
      reminders: 'Reminders',
      gratitudePrompts: 'Gratitude Prompts',
      mindfulnessPrompts: 'Mindfulness Prompts'
    };
    return labels[type];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Import {getTypeLabel()}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="textarea" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="textarea" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Text
            </TabsTrigger>
            <TabsTrigger value="json" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              JSON
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              CSV
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Pre-defined
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="textarea">
            <TextareaImport type={type} onImport={handleImportSuccess} />
          </TabsContent>
          
          <TabsContent value="json">
            <JSONImport type={type} onImport={handleImportSuccess} />
          </TabsContent>
          
          <TabsContent value="csv">
            <CSVImport type={type} onImport={handleImportSuccess} />
          </TabsContent>
          
          <TabsContent value="bulk">
            <BulkDataImport type={type} onImport={handleImportSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BulkImportModal;
