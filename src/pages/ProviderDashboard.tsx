import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
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
import BulkImportModal from '@/components/provider/BulkImportModal';

// Type definitions
interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
}
type JournalPromptDifficulty = 'beginner' | 'intermediate' | 'advanced';
interface JournalPrompt {
  id: string;
  prompt: string;
  category: string;
  difficulty: JournalPromptDifficulty;
}
interface Resource {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
}
interface Question {
  id: string;
  question: string;
  category: string;
  type: 'reflection' | 'assessment' | 'screening';
}
interface ToolkitItem {
  id: string;
  title: string;
  description: string;
  instructions: string;
  category: string;
  duration: string;
}
interface Reminder {
  id: string;
  title: string;
  message: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  category: string;
}
interface GratitudePrompt {
  id: string;
  prompt: string;
  category: string;
  difficulty: 'simple' | 'moderate' | 'deep';
}
interface MindfulnessPrompt {
  id: string;
  prompt: string;
  category: string;
  duration: string;
}

const ProviderDashboard = () => {
  // State management
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [journalPrompts, setJournalPrompts] = useState<JournalPrompt[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [toolkitItems, setToolkitItems] = useState<ToolkitItem[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [gratitudePrompts, setGratitudePrompts] = useState<GratitudePrompt[]>([]);
  const [mindfulnessPrompts, setMindfulnessPrompts] = useState<MindfulnessPrompt[]>([]);

  // Form states
  const [newQuote, setNewQuote] = useState({
    text: '',
    author: '',
    category: ''
  });
  const [newPrompt, setNewPrompt] = useState<{
    prompt: string;
    category: string;
    difficulty: JournalPromptDifficulty;
  }>({
    prompt: '',
    category: '',
    difficulty: 'beginner'
  });
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    content: '',
    category: ''
  });
  const [newQuestion, setNewQuestion] = useState<{
    question: string;
    category: string;
    type: Question['type'];
  }>({
    question: '',
    category: '',
    type: 'reflection'
  });
  const [newToolkitItem, setNewToolkitItem] = useState({
    title: '',
    description: '',
    instructions: '',
    category: '',
    duration: ''
  });
  const [newReminder, setNewReminder] = useState<{
    title: string;
    message: string;
    frequency: Reminder['frequency'];
    category: string;
  }>({
    title: '',
    message: '',
    frequency: 'daily',
    category: ''
  });
  const [newGratitudePrompt, setNewGratitudePrompt] = useState<{
    prompt: string;
    category: string;
    difficulty: GratitudePrompt['difficulty'];
  }>({
    prompt: '',
    category: '',
    difficulty: 'simple'
  });
  const [newMindfulnessPrompt, setNewMindfulnessPrompt] = useState({
    prompt: '',
    category: '',
    duration: '5 minutes'
  });
  const {
    toast
  } = useToast();

  // Handler functions
  const handleAddQuote = () => {
    if (!newQuote.text.trim()) return;
    const quote: Quote = {
      id: Date.now().toString(),
      text: newQuote.text,
      author: newQuote.author || 'Anonymous',
      category: newQuote.category || 'General'
    };
    setQuotes(prev => [...prev, quote]);
    setNewQuote({
      text: '',
      author: '',
      category: ''
    });
    toast({
      title: "Quote added",
      description: "The inspirational quote has been added to the database."
    });
  };
  const handleAddPrompt = () => {
    if (!newPrompt.prompt.trim()) return;
    const prompt: JournalPrompt = {
      id: Date.now().toString(),
      prompt: newPrompt.prompt,
      category: newPrompt.category || 'General',
      difficulty: newPrompt.difficulty
    };
    setJournalPrompts(prev => [...prev, prompt]);
    setNewPrompt({
      prompt: '',
      category: '',
      difficulty: 'beginner'
    });
    toast({
      title: "Journal prompt added",
      description: "The journal prompt has been added to the database."
    });
  };
  const handleAddResource = () => {
    if (!newResource.title.trim() || !newResource.content.trim()) return;
    const resource: Resource = {
      id: Date.now().toString(),
      title: newResource.title,
      description: newResource.description,
      content: newResource.content,
      category: newResource.category || 'General'
    };
    setResources(prev => [...prev, resource]);
    setNewResource({
      title: '',
      description: '',
      content: '',
      category: ''
    });
    toast({
      title: "Resource added",
      description: "The resource has been added to the database."
    });
  };
  const handleAddQuestion = () => {
    if (!newQuestion.question.trim()) return;
    const question: Question = {
      id: Date.now().toString(),
      question: newQuestion.question,
      category: newQuestion.category || 'General',
      type: newQuestion.type
    };
    setQuestions(prev => [...prev, question]);
    setNewQuestion({
      question: '',
      category: '',
      type: 'reflection'
    });
    toast({
      title: "Question added",
      description: "The question has been added to the database."
    });
  };
  const handleAddToolkitItem = () => {
    if (!newToolkitItem.title.trim() || !newToolkitItem.instructions.trim()) return;
    const toolkitItem: ToolkitItem = {
      id: Date.now().toString(),
      title: newToolkitItem.title,
      description: newToolkitItem.description,
      instructions: newToolkitItem.instructions,
      category: newToolkitItem.category || 'General',
      duration: newToolkitItem.duration
    };
    setToolkitItems(prev => [...prev, toolkitItem]);
    setNewToolkitItem({
      title: '',
      description: '',
      instructions: '',
      category: '',
      duration: ''
    });
    toast({
      title: "Toolkit item added",
      description: "The toolkit item has been added to the database."
    });
  };
  const handleAddReminder = () => {
    if (!newReminder.title.trim() || !newReminder.message.trim()) return;
    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      message: newReminder.message,
      frequency: newReminder.frequency,
      category: newReminder.category || 'General'
    };
    setReminders(prev => [...prev, reminder]);
    setNewReminder({
      title: '',
      message: '',
      frequency: 'daily',
      category: ''
    });
    toast({
      title: "Reminder added",
      description: "The reminder has been added to the database."
    });
  };
  const handleAddGratitudePrompt = () => {
    if (!newGratitudePrompt.prompt.trim()) return;
    const gratitudePrompt: GratitudePrompt = {
      id: Date.now().toString(),
      prompt: newGratitudePrompt.prompt,
      category: newGratitudePrompt.category || 'General',
      difficulty: newGratitudePrompt.difficulty
    };
    setGratitudePrompts(prev => [...prev, gratitudePrompt]);
    setNewGratitudePrompt({
      prompt: '',
      category: '',
      difficulty: 'simple'
    });
    toast({
      title: "Gratitude prompt added",
      description: "The gratitude prompt has been added to the database."
    });
  };
  const handleAddMindfulnessPrompt = () => {
    if (!newMindfulnessPrompt.prompt.trim()) return;
    const mindfulnessPrompt: MindfulnessPrompt = {
      id: Date.now().toString(),
      prompt: newMindfulnessPrompt.prompt,
      category: newMindfulnessPrompt.category || 'General',
      duration: newMindfulnessPrompt.duration
    };
    setMindfulnessPrompts(prev => [...prev, mindfulnessPrompt]);
    setNewMindfulnessPrompt({
      prompt: '',
      category: '',
      duration: '5 minutes'
    });
    toast({
      title: "Mindfulness prompt added",
      description: "The mindfulness prompt has been added to the database."
    });
  };

  // Bulk import handlers
  const handleBulkImportQuotes = (items: any[]) => {
    setQuotes(prev => [...prev, ...items]);
    toast({
      title: "Bulk import successful",
      description: `${items.length} quotes have been imported.`
    });
  };

  const handleBulkImportPrompts = (items: any[]) => {
    setJournalPrompts(prev => [...prev, ...items]);
    toast({
      title: "Bulk import successful", 
      description: `${items.length} journal prompts have been imported.`
    });
  };

  const handleBulkImportQuestions = (items: any[]) => {
    setQuestions(prev => [...prev, ...items]);
    toast({
      title: "Bulk import successful",
      description: `${items.length} questions have been imported.`
    });
  };

  const handleBulkImportToolkitItems = (items: any[]) => {
    setToolkitItems(prev => [...prev, ...items]);
    toast({
      title: "Bulk import successful",
      description: `${items.length} toolkit items have been imported.`
    });
  };

  const handleBulkImportReminders = (items: any[]) => {
    setReminders(prev => [...prev, ...items]);
    toast({
      title: "Bulk import successful",
      description: `${items.length} reminders have been imported.`
    });
  };

  const handleBulkImportGratitudePrompts = (items: any[]) => {
    setGratitudePrompts(prev => [...prev, ...items]);
    toast({
      title: "Bulk import successful",
      description: `${items.length} gratitude prompts have been imported.`
    });
  };

  const handleBulkImportMindfulnessPrompts = (items: any[]) => {
    setMindfulnessPrompts(prev => [...prev, ...items]);
    toast({
      title: "Bulk import successful",
      description: `${items.length} mindfulness prompts have been imported.`
    });
  };

  // Delete handlers
  const handleDeleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
    toast({
      title: "Quote deleted",
      description: "The quote has been removed."
    });
  };
  const handleDeletePrompt = (id: string) => {
    setJournalPrompts(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Prompt deleted",
      description: "The journal prompt has been removed."
    });
  };
  const handleDeleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Resource deleted",
      description: "The resource has been removed."
    });
  };
  const handleDeleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    toast({
      title: "Question deleted",
      description: "The question has been removed."
    });
  };
  const handleDeleteToolkitItem = (id: string) => {
    setToolkitItems(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Toolkit item deleted",
      description: "The toolkit item has been removed."
    });
  };
  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Reminder deleted",
      description: "The reminder has been removed."
    });
  };
  const handleDeleteGratitudePrompt = (id: string) => {
    setGratitudePrompts(prev => prev.filter(g => g.id !== id));
    toast({
      title: "Gratitude prompt deleted",
      description: "The gratitude prompt has been removed."
    });
  };
  const handleDeleteMindfulnessPrompt = (id: string) => {
    setMindfulnessPrompts(prev => prev.filter(m => m.id !== id));
    toast({
      title: "Mindfulness prompt deleted",
      description: "The mindfulness prompt has been removed."
    });
  };

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
              <QuoteForm newQuote={newQuote} setNewQuote={setNewQuote} onAddQuote={handleAddQuote} />
            </div>
            <BulkImportModal type="quotes" onImport={handleBulkImportQuotes}>
              <Button variant="outline" className="h-fit">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
            </BulkImportModal>
          </div>
          <QuoteList quotes={quotes} onDeleteQuote={handleDeleteQuote} />
        </TabsContent>

        <TabsContent value="prompts" className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <JournalPromptForm newPrompt={newPrompt} setNewPrompt={setNewPrompt} onAddPrompt={handleAddPrompt} />
            </div>
            <BulkImportModal type="journalPrompts" onImport={handleBulkImportPrompts}>
              <Button variant="outline" className="h-fit">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
            </BulkImportModal>
          </div>
          <JournalPromptList journalPrompts={journalPrompts} onDeletePrompt={handleDeletePrompt} />
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <QuestionForm newQuestion={newQuestion} setNewQuestion={setNewQuestion} onAddQuestion={handleAddQuestion} />
            </div>
            <BulkImportModal type="questions" onImport={handleBulkImportQuestions}>
              <Button variant="outline" className="h-fit">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
            </BulkImportModal>
          </div>
          <QuestionList questions={questions} onDeleteQuestion={handleDeleteQuestion} />
        </TabsContent>

        <TabsContent value="toolkit" className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <ToolkitForm newToolkitItem={newToolkitItem} setNewToolkitItem={setNewToolkitItem} onAddToolkitItem={handleAddToolkitItem} />
            </div>
            <BulkImportModal type="toolkitItems" onImport={handleBulkImportToolkitItems}>
              <Button variant="outline" className="h-fit">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
            </BulkImportModal>
          </div>
          <ToolkitList toolkitItems={toolkitItems} onDeleteToolkitItem={handleDeleteToolkitItem} />
        </TabsContent>

        <TabsContent value="reminders" className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <ReminderForm newReminder={newReminder} setNewReminder={setNewReminder} onAddReminder={handleAddReminder} />
            </div>
            <BulkImportModal type="reminders" onImport={handleBulkImportReminders}>
              <Button variant="outline" className="h-fit">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
            </BulkImportModal>
          </div>
          <ReminderList reminders={reminders} onDeleteReminder={handleDeleteReminder} />
        </TabsContent>

        <TabsContent value="gratitude" className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <GratitudeForm newGratitudePrompt={newGratitudePrompt} setNewGratitudePrompt={setNewGratitudePrompt} onAddGratitudePrompt={handleAddGratitudePrompt} />
            </div>
            <BulkImportModal type="gratitudePrompts" onImport={handleBulkImportGratitudePrompts}>
              <Button variant="outline" className="h-fit">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
            </BulkImportModal>
          </div>
          <GratitudeList gratitudePrompts={gratitudePrompts} onDeleteGratitudePrompt={handleDeleteGratitudePrompt} />
        </TabsContent>

        <TabsContent value="mindfulness" className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-[#7e868b] mb-4">Add New Mindfulness Prompt</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#7e868b] mb-1">Prompt</label>
                    <textarea
                      value={newMindfulnessPrompt.prompt}
                      onChange={(e) => setNewMindfulnessPrompt({...newMindfulnessPrompt, prompt: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-mental-blue focus:border-transparent"
                      rows={3}
                      placeholder="Enter mindfulness prompt..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#7e868b] mb-1">Category</label>
                      <input
                        type="text"
                        value={newMindfulnessPrompt.category}
                        onChange={(e) => setNewMindfulnessPrompt({...newMindfulnessPrompt, category: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-mental-blue focus:border-transparent"
                        placeholder="e.g., Breathing, Body Scan..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7e868b] mb-1">Duration</label>
                      <input
                        type="text"
                        value={newMindfulnessPrompt.duration}
                        onChange={(e) => setNewMindfulnessPrompt({...newMindfulnessPrompt, duration: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-mental-blue focus:border-transparent"
                        placeholder="e.g., 5 minutes"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleAddMindfulnessPrompt}
                    className="w-full"
                  >
                    Add Mindfulness Prompt
                  </Button>
                </div>
              </div>
            </div>
            <BulkImportModal type="mindfulnessPrompts" onImport={handleBulkImportMindfulnessPrompts}>
              <Button variant="outline" className="h-fit">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
            </BulkImportModal>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-[#7e868b]">Mindfulness Prompts ({mindfulnessPrompts.length})</h2>
            </div>
            <div className="p-6">
              {mindfulnessPrompts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No mindfulness prompts added yet.</p>
              ) : (
                <div className="space-y-4">
                  {mindfulnessPrompts.map((prompt) => (
                    <div key={prompt.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-[#7e868b] mb-2">{prompt.prompt}</p>
                          <div className="flex gap-2">
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {prompt.category}
                            </span>
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              {prompt.duration}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteMindfulnessPrompt(prompt.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProviderDashboard;
