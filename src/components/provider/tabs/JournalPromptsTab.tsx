
import React, { lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { useProviderData } from '@/hooks/useProviderData';
import type { useProviderHandlers } from '@/hooks/useProviderHandlers';

const JournalPromptForm = lazy(() => import('@/components/provider/JournalPromptForm'));
const JournalPromptList = lazy(() => import('@/components/provider/JournalPromptList'));
const BulkImportModal = lazy(() => import('@/components/provider/BulkImportModal'));

const LoadingFallback = () => (
    <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" text="Loading..." />
    </div>
);

interface JournalPromptsTabProps {
  data: ReturnType<typeof useProviderData>;
  handlers: ReturnType<typeof useProviderHandlers>;
}

const JournalPromptsTab: React.FC<JournalPromptsTabProps> = ({ data, handlers }) => {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Suspense fallback={<LoadingFallback />}>
            <JournalPromptForm
              newPrompt={data.newPrompt}
              setNewPrompt={data.setNewPrompt}
              onAddPrompt={handlers.handleAddPrompt}
            />
          </Suspense>
        </div>
        <Suspense fallback={<LoadingFallback />}>
          <BulkImportModal type="journalPrompts" onImport={handlers.handleBulkImportPrompts}>
            <Button variant="outline" className="h-fit">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
          </BulkImportModal>
        </Suspense>
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <JournalPromptList journalPrompts={data.journalPrompts} onDeletePrompt={handlers.handleDeletePrompt} />
      </Suspense>
    </div>
  );
};

export default JournalPromptsTab;
