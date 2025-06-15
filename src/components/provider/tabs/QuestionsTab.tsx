
import React, { lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { useProviderData } from '@/hooks/useProviderData';
import type { useProviderHandlers } from '@/hooks/useProviderHandlers';

const QuestionForm = lazy(() => import('@/components/provider/QuestionForm'));
const QuestionList = lazy(() => import('@/components/provider/QuestionList'));
const BulkImportModal = lazy(() => import('@/components/provider/BulkImportModal'));

const LoadingFallback = () => (
    <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" text="Loading..." />
    </div>
);

interface QuestionsTabProps {
  data: ReturnType<typeof useProviderData>;
  handlers: ReturnType<typeof useProviderHandlers>;
}

const QuestionsTab: React.FC<QuestionsTabProps> = ({ data, handlers }) => {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Suspense fallback={<LoadingFallback />}>
            <QuestionForm
              newQuestion={data.newQuestion}
              setNewQuestion={data.setNewQuestion}
              onAddQuestion={handlers.handleAddQuestion}
            />
          </Suspense>
        </div>
        <Suspense fallback={<LoadingFallback />}>
          <BulkImportModal type="questions" onImport={handlers.handleBulkImportQuestions}>
            <Button variant="outline" className="h-fit">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
          </BulkImportModal>
        </Suspense>
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <QuestionList questions={data.questions} onDeleteQuestion={handlers.handleDeleteQuestion} />
      </Suspense>
    </div>
  );
};

export default QuestionsTab;
