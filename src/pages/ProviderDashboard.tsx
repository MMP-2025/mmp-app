import React, { lazy, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorBoundary } from '@/components/provider/ErrorBoundary';
import PatientInvitations from '@/components/provider/PatientInvitations';

// Lazy load tab components
const QuotesTab = lazy(() => import('@/components/provider/tabs/QuotesTab'));
const JournalPromptsTab = lazy(() => import('@/components/provider/tabs/JournalPromptsTab'));
const QuestionsTab = lazy(() => import('@/components/provider/tabs/QuestionsTab'));
const ToolkitTab = lazy(() => import('@/components/provider/tabs/ToolkitTab'));
const RemindersTab = lazy(() => import('@/components/provider/tabs/RemindersTab'));
const GratitudeTab = lazy(() => import('@/components/provider/tabs/GratitudeTab'));
const MindfulnessTab = lazy(() => import('@/components/provider/tabs/MindfulnessTab'));
const NotificationsTab = lazy(() => import('@/components/provider/tabs/NotificationsTab'));

// Import custom hooks
import { useProviderData } from '@/hooks/useProviderData';
import { useProviderHandlers } from '@/hooks/useProviderHandlers';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <LoadingSpinner size="lg" text="Loading..." />
  </div>
);

const ProviderDashboard = () => {
  const data = useProviderData();
  const handlers = useProviderHandlers(data);

  // Keyboard shortcuts for tab navigation
  useKeyboardShortcuts([
    {
      key: '1',
      altKey: true,
      callback: () => {
        const quotesTab = document.querySelector('[data-state="active"][value="quotes"]');
        if (!quotesTab) {
          const quotesTabTrigger = document.querySelector('[value="quotes"]') as HTMLElement;
          quotesTabTrigger?.click();
        }
      }
    },
    {
      key: '2',
      altKey: true,
      callback: () => {
        const promptsTab = document.querySelector('[data-state="active"][value="prompts"]');
        if (!promptsTab) {
          const promptsTabTrigger = document.querySelector('[value="prompts"]') as HTMLElement;
          promptsTabTrigger?.click();
        }
      }
    }
    // Add more shortcuts as needed
  ]);

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6 space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#7e868b] mb-2">Provider Dashboard</h1>
          <p className="text-[#7e868b]">Manage quotes, journal prompts, questions, toolkit items, reminders, gratitude prompts, mindfulness prompts, push notifications, and patient invitations.</p>
          <div className="mt-2 text-xs text-gray-500">
            Keyboard shortcuts: Alt+1 (Quotes), Alt+2 (Prompts), Ctrl+S (Save), Ctrl+Shift+Q (Focus quote input)
          </div>
        </div>

        {/* Patient Invitations Section */}
        <div className="mb-6">
          <PatientInvitations />
        </div>

        <Tabs defaultValue="quotes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-mental-blue">
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="prompts">Journal Prompts</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="toolkit">Toolkit</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="gratitude">Gratitude</TabsTrigger>
            <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
            <TabsTrigger value="notifications">Push Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="quotes">
            <Suspense fallback={<LoadingFallback />}>
              <QuotesTab data={data} handlers={handlers} />
            </Suspense>
          </TabsContent>

          <TabsContent value="prompts">
            <Suspense fallback={<LoadingFallback />}>
              <JournalPromptsTab data={data} handlers={handlers} />
            </Suspense>
          </TabsContent>

          <TabsContent value="questions">
             <Suspense fallback={<LoadingFallback />}>
              <QuestionsTab data={data} handlers={handlers} />
            </Suspense>
          </TabsContent>

          <TabsContent value="toolkit">
            <Suspense fallback={<LoadingFallback />}>
              <ToolkitTab data={data} handlers={handlers} />
            </Suspense>
          </TabsContent>

          <TabsContent value="reminders">
             <Suspense fallback={<LoadingFallback />}>
              <RemindersTab data={data} handlers={handlers} />
            </Suspense>
          </TabsContent>

          <TabsContent value="gratitude">
            <Suspense fallback={<LoadingFallback />}>
              <GratitudeTab data={data} handlers={handlers} />
            </Suspense>
          </TabsContent>

          <TabsContent value="mindfulness">
            <Suspense fallback={<LoadingFallback />}>
              <MindfulnessTab data={data} handlers={handlers} />
            </Suspense>
          </TabsContent>

          <TabsContent value="notifications">
            <Suspense fallback={<LoadingFallback />}>
              <NotificationsTab />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
};

export default ProviderDashboard;
