
import React, { lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { useProviderData } from '@/hooks/useProviderData';
import type { useProviderHandlers } from '@/hooks/useProviderHandlers';

const ReminderForm = lazy(() => import('@/components/provider/ReminderForm'));
const ReminderList = lazy(() => import('@/components/provider/ReminderList'));
const BulkImportModal = lazy(() => import('@/components/provider/BulkImportModal'));

const LoadingFallback = () => (
    <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" text="Loading..." />
    </div>
);

interface RemindersTabProps {
  data: ReturnType<typeof useProviderData>;
  handlers: ReturnType<typeof useProviderHandlers>;
}

const RemindersTab: React.FC<RemindersTabProps> = ({ data, handlers }) => {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Suspense fallback={<LoadingFallback />}>
            <ReminderForm
              newReminder={data.newReminder}
              setNewReminder={data.setNewReminder}
              onAddReminder={handlers.handleAddReminder}
            />
          </Suspense>
        </div>
        <Suspense fallback={<LoadingFallback />}>
          <BulkImportModal type="reminders" onImport={handlers.handleBulkImportReminders}>
            <Button variant="outline" className="h-fit">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
          </BulkImportModal>
        </Suspense>
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <ReminderList reminders={data.reminders} onDeleteReminder={handlers.handleDeleteReminder} />
      </Suspense>
    </div>
  );
};

export default RemindersTab;
