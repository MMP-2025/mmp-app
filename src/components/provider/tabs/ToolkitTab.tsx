
import React, { lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { useProviderData } from '@/hooks/useProviderData';
import type { useProviderHandlers } from '@/hooks/useProviderHandlers';

const ToolkitForm = lazy(() => import('@/components/provider/ToolkitForm'));
const ToolkitList = lazy(() => import('@/components/provider/ToolkitList'));
const BulkImportModal = lazy(() => import('@/components/provider/BulkImportModal'));

const LoadingFallback = () => (
    <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" text="Loading..." />
    </div>
);

interface ToolkitTabProps {
  data: ReturnType<typeof useProviderData>;
  handlers: ReturnType<typeof useProviderHandlers>;
}

const ToolkitTab: React.FC<ToolkitTabProps> = ({ data, handlers }) => {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Suspense fallback={<LoadingFallback />}>
            <ToolkitForm
              newToolkitItem={data.newToolkitItem}
              setNewToolkitItem={data.setNewToolkitItem}
              onAddToolkitItem={handlers.handleAddToolkitItem}
            />
          </Suspense>
        </div>
        <Suspense fallback={<LoadingFallback />}>
          <BulkImportModal type="toolkitItems" onImport={handlers.handleBulkImportToolkitItems}>
            <Button variant="outline" className="h-fit">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
          </BulkImportModal>
        </Suspense>
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <ToolkitList toolkitItems={data.toolkitItems} onDeleteToolkitItem={handlers.handleDeleteToolkitItem} />
      </Suspense>
    </div>
  );
};

export default ToolkitTab;
