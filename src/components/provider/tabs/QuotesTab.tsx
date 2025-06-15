
import React, { lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { useProviderData } from '@/hooks/useProviderData';
import type { useProviderHandlers } from '@/hooks/useProviderHandlers';

const EnhancedQuoteForm = lazy(() => import('@/components/provider/EnhancedQuoteForm'));
const MemoizedQuoteList = lazy(() => import('@/components/provider/MemoizedQuoteList'));
const BulkImportModal = lazy(() => import('@/components/provider/BulkImportModal'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <LoadingSpinner size="lg" text="Loading..." />
  </div>
);

interface QuotesTabProps {
  data: ReturnType<typeof useProviderData>;
  handlers: ReturnType<typeof useProviderHandlers>;
}

const QuotesTab: React.FC<QuotesTabProps> = ({ data, handlers }) => {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Suspense fallback={<LoadingFallback />}>
            <EnhancedQuoteForm
              newQuote={data.newQuote}
              setNewQuote={data.setNewQuote}
              onAddQuote={handlers.handleAddQuote}
              isLoading={handlers.isLoading}
            />
          </Suspense>
        </div>
        <Suspense fallback={<LoadingFallback />}>
          <BulkImportModal type="quotes" onImport={handlers.handleBulkImportQuotes}>
            <Button variant="outline" className="h-fit">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
          </BulkImportModal>
        </Suspense>
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <MemoizedQuoteList quotes={data.quotes} onDeleteQuote={handlers.handleDeleteQuote} />
      </Suspense>
    </div>
  );
};

export default QuotesTab;
