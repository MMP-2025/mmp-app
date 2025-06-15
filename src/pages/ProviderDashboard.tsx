
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

// Import form and list components
import QuoteForm from '@/components/provider/QuoteForm';
import QuoteList from '@/components/provider/QuoteList';
import JournalPromptForm from '@/components/provider/JournalPromptForm';
import JournalPromptList from '@/components/provider/JournalPromptList';
import QuestionForm from '@/components/provider/QuestionForm';
import QuestionList from '@/components/provider/QuestionList';
import ToolkitForm from '@/components/provider/ToolkitForm';
import ToolkitList from '@/components/provider/ToolkitList';
import ReminderForm from '@/components/provider/ReminderForm';
import ReminderList from '@/components/provider/ReminderList';
import GratitudeForm from '@/components/provider/GratitudeForm';
import GratitudeList from '@/components/provider/GratitudeList';
import MindfulnessForm from '@/components/provider/MindfulnessForm';
import MindfulnessList from '@/components/provider/MindfulnessList';
import BulkImportModal from '@/components/provider/BulkImportModal';

// Import custom hooks
import { useProviderData } from '@/hooks/useProviderData';
import { useProviderHandlers } from '@/hooks/useProviderHandlers';

const ProviderDashboard = () => {
  const data = useProviderData();
  const handlers = useProviderHandlers(data);

  return (
    <div className="container mx-auto p-6 space-y-6 ml-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#7e868b] mb-2">Provider Dashboard</h1>
        <p className="text-[#7e868b]">Manage quotes, journal prompts, questions, toolkit items, reminders, gratitude prompts, mindfulness prompts for your app content.</p>
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
              <QuoteForm 
                newQuote={data.newQuote} 
                setNewQuote={data.setNewQuote} 
                onAddQuote={handlers.handleAddQuote} 
              />
            </div>
            <BulkImportModal type="quotes" onImport={handlers.handleBulkImportQuotes}>
              <Button variant="outline" className="h-fit">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
            </BulkImportModal>
          </div>
          <QuoteList quotes={data.quotes} onDeleteQuote={handlers.handleDeleteQuote} />
        </TabsContent>

        <TabsContent value="prompts" className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <JournalPromptForm 
                newPrompt={data.newPrompt} 
                setNewPrompt={data.setNewPrompt} 
                onAddPrompt={handlers.handleAddPrompt} 
              />
            </div>
            <BulkImportModal type="journalPrompts" onImport={handlers.handleBulkImportPrompts}>
              <Button variant="outline" className="h-fit">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
            </BulkImportModal>
          </div>
          <JournalPromptList journalPrompts={data.journalPrompts} onDeletePrompt={handlers.handleDeletePrompt} />
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <QuestionForm 
                newQuestion={data.newQuestion} 
                setNewQuestion={data.setNewQuestion} 
                onAddQuestion={handlers.handleAddQuestion} 
              />
            </div>
            <BulkImportModal type="questions" onImport={handlers.handleBulkImportQuestions}>
              <Button variant="outline" className="h-fit">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
            </BulkImportModal>
          </div>
          <QuestionList questions={data.questions} onDeleteQuestion={handlers.handleDeleteQuestion} />
        </TabsContent>

        <TabsContent value="toolkit" className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <ToolkitForm 
                newToolkitItem={data.newToolkitItem} 
                setNewToolkitItem={data.setNewToolkitItem} 
                onAddToolkitItem={handlers.handleAddToolkitItem} 
              />
            </div>
            <BulkImportModal type="toolkitItems" onImport={handlers.handleBulkImportToolkitItems}>
              <Button variant="outline" className="h-fit">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
            </BulkImportModal>
          </div>
          <ToolkitList toolkitItems={data.toolkitItems} onDeleteToolkitItem={handlers.handleDeleteToolkitItem} />
        </TabsContent>

        <TabsContent value="reminders" className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <ReminderForm 
                newReminder={data.newReminder} 
                setNewReminder={data.setNewReminder} 
                onAddReminder={handlers.handleAddReminder} 
              />
            </div>
            <BulkImportModal type="reminders" onImport={handlers.handleBulkImportReminders}>
              <Button variant="outline" className="h-fit">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
            </BulkImportModal>
          </div>
          <ReminderList reminders={data.reminders} onDeleteReminder={handlers.handleDeleteReminder} />
        </TabsContent>

        <TabsContent value="gratitude" className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <GratitudeForm 
                newGratitudePrompt={data.newGratitudePrompt} 
                setNewGratitudePrompt={data.setNewGratitudePrompt} 
                onAddGratitudePrompt={handlers.handleAddGratitudePrompt} 
              />
            </div>
            <BulkImportModal type="gratitudePrompts" onImport={handlers.handleBulkImportGratitudePrompts}>
              <Button variant="outline" className="h-fit">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
            </BulkImportModal>
          </div>
          <GratitudeList gratitudePrompts={data.gratitudePrompts} onDeleteGratitudePrompt={handlers.handleDeleteGratitudePrompt} />
        </TabsContent>

        <TabsContent value="mindfulness" className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <MindfulnessForm 
                newMindfulnessPrompt={data.newMindfulnessPrompt}
                setNewMindfulnessPrompt={data.setNewMindfulnessPrompt}
                onAddMindfulnessPrompt={handlers.handleAddMindfulnessPrompt}
              />
            </div>
            <BulkImportModal type="mindfulnessPrompts" onImport={handlers.handleBulkImportMindfulnessPrompts}>
              <Button variant="outline" className="h-fit">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
            </BulkImportModal>
          </div>
          <MindfulnessList 
            mindfulnessPrompts={data.mindfulnessPrompts} 
            onDeleteMindfulnessPrompt={handlers.handleDeleteMindfulnessPrompt} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProviderDashboard;
