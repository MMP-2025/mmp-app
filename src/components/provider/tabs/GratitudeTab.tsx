
import React, { lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { useProviderData } from '@/hooks/useProviderData';
import type { useProviderHandlers } from '@/hooks/useProviderHandlers';

const GratitudeForm = lazy(() => import('@/components/provider/GratitudeForm'));
const GratitudeList = lazy(() => import('@/components/provider/GratitudeList'));
const BulkImportModal = lazy(() => import('@/components/provider/BulkImportModal'));

const LoadingFallback = () => (
    <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" text="Loading..." />
    </div>
);

interface GratitudeTabProps {
  data: ReturnType<typeof useProviderData>;
  handlers: ReturnType<typeof useProviderHandlers>;
}

const GratitudeTab: React.FC<GratitudeTabProps> = ({ data, handlers }) => {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Suspense fallback={<LoadingFallback />}>
            <GratitudeForm
              newGratitudePrompt={data.newGratitudePrompt}
              setNewGratitudePrompt={data.setNewGratitudePrompt}
              onAddGratitudePrompt={handlers.handleAddGratitudePrompt}
            />
          </Suspense>
        </div>
        <Suspense fallback={<LoadingFallback />}>
          <BulkImportModal type="gratitudePrompts" onImport={handlers.handleBulkImportGratitudePrompts}>
            <Button variant="outline" className="h-fit">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
          </BulkImportModal>
        </Suspense>
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <GratitudeList gratitudePrompts={data.gratitudePrompts} onDeleteGratitudePrompt={handlers.handleDeleteGratitudePrompt} />
      </Suspense>
    </div>
  );
};

export default GratitudeTab;
