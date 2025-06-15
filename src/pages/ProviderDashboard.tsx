import React, { lazy, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorBoundary } from '@/components/provider/ErrorBoundary';

// Lazy load components for better performance
const EnhancedQuoteForm = lazy(() => import('@/components/provider/EnhancedQuoteForm'));
const MemoizedQuoteList = lazy(() => import('@/components/provider/MemoizedQuoteList'));
const JournalPromptForm = lazy(() => import('@/components/provider/JournalPromptForm'));
const JournalPromptList = lazy(() => import('@/components/provider/JournalPromptList'));
const QuestionForm = lazy(() => import('@/components/provider/QuestionForm'));
const QuestionList = lazy(() => import('@/components/provider/QuestionList'));
const ToolkitForm = lazy(() => import('@/components/provider/ToolkitForm'));
const ToolkitList = lazy(() => import('@/components/provider/ToolkitList'));
const ReminderForm = lazy(() => import('@/components/provider/ReminderForm'));
const ReminderList = lazy(() => import('@/components/provider/ReminderList'));
const GratitudeForm = lazy(() => import('@/components/provider/GratitudeForm'));
const GratitudeList = lazy(() => import('@/components/provider/GratitudeList'));
const MindfulnessForm = lazy(() => import('@/components/provider/MindfulnessForm'));
const MindfulnessList = lazy(() => import('@/components/provider/MindfulnessList'));
const BulkImportModal = lazy(() => import('@/components/provider/BulkImportModal'));

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
          document.querySelector('[value="quotes"]')?.click();
        }
      }
    },
    {
      key: '2',
      altKey: true,
      callback: () => {
        const promptsTab = document.querySelector('[data-state="active"][value="prompts"]');
        if (!promptsTab) {
          document.querySelector('[value="prompts"]')?.click();
        }
      }
    }
    // Add more shortcuts as needed
  ]);

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6 space-y-6 ml-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#7e868b] mb-2">Provider Dashboard</h1>
          <p className="text-[#7e868b]">Manage quotes, journal prompts, questions, toolkit items, reminders, gratitude prompts, mindfulness prompts for your app content.</p>
          <div className="mt-2 text-xs text-gray-500">
            Keyboard shortcuts: Alt+1 (Quotes), Alt+2 (Prompts), Ctrl+S (Save), Ctrl+Shift+Q (Focus quote input)
          </div>
        </div>

        <Tabs defaultValue="quotes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-mental-blue">
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="prompts">Journal Prompts</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="toolkit">Toolkit</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="gratitude">Gratitude</TabsTrigger>
            <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
          </TabsList>

          <TabsContent value="quotes" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="prompts" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="toolkit" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="reminders" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="gratitude" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="mindfulness" className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
};

export default ProviderDashboard;
