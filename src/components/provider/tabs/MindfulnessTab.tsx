
import React, { lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { useProviderData } from '@/hooks/useProviderData';
import type { useProviderHandlers } from '@/hooks/useProviderHandlers';

const MindfulnessForm = lazy(() => import('@/components/provider/MindfulnessForm'));
const MindfulnessList = lazy(() => import('@/components/provider/MindfulnessList'));
const BulkImportModal = lazy(() => import('@/components/provider/BulkImportModal'));

const LoadingFallback = () => (
    <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" text="Loading..." />
    </div>
);

interface MindfulnessTabProps {
  data: ReturnType<typeof useProviderData>;
  handlers: ReturnType<typeof useProviderHandlers>;
}

const MindfulnessTab: React.FC<MindfulnessTabProps> = ({ data, handlers }) => {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Suspense fallback={<LoadingFallback />}>
            <MindfulnessForm
              newMindfulnessPrompt={data.newMindfulnessPrompt}
              setNewMindfulnessPrompt={data.setNewMindfulnessPrompt}
              onAddMindfulnessPrompt={handlers.handleAddMindfulnessPrompt}
            />
          </Suspense>
        </div>
        <Suspense fallback={<LoadingFallback />}>
          <BulkImportModal type="mindfulnessPrompts" onImport={handlers.handleBulkImportMindfulnessPrompts}>
            <Button variant="outline" className="h-fit">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
          </BulkImportModal>
        </Suspense>
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <MindfulnessList
          mindfulnessPrompts={data.mindfulnessPrompts}
          onDeleteMindfulnessPrompt={handlers.handleDeleteMindfulnessPrompt}
        />
      </Suspense>
    </div>
  );
};

export default MindfulnessTab;
