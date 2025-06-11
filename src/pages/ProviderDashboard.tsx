import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

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
const ProviderDashboard = () => {
  // State management
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [journalPrompts, setJournalPrompts] = useState<JournalPrompt[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [toolkitItems, setToolkitItems] = useState<ToolkitItem[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [gratitudePrompts, setGratitudePrompts] = useState<GratitudePrompt[]>([]);

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
  return <div className="container mx-auto p-6 space-y-6 ml-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#7e868b] mb-2">Provider Dashboard</h1>
        <p className="text-[#7e868b]">Manage quotes, journal prompts, questions, toolkit items, reminders, gratitude prompts, and resources for your app content.</p>
      </div>

      <Tabs defaultValue="quotes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-mental-blue">
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="prompts">Journal Prompts</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="toolkit">Toolkit</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="gratitude">Gratitude</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes" className="space-y-6">
          <QuoteForm newQuote={newQuote} setNewQuote={setNewQuote} onAddQuote={handleAddQuote} />
          <QuoteList quotes={quotes} onDeleteQuote={handleDeleteQuote} />
        </TabsContent>

        <TabsContent value="prompts" className="space-y-6">
          <JournalPromptForm newPrompt={newPrompt} setNewPrompt={setNewPrompt} onAddPrompt={handleAddPrompt} />
          <JournalPromptList journalPrompts={journalPrompts} onDeletePrompt={handleDeletePrompt} />
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <QuestionForm newQuestion={newQuestion} setNewQuestion={setNewQuestion} onAddQuestion={handleAddQuestion} />
          <QuestionList questions={questions} onDeleteQuestion={handleDeleteQuestion} />
        </TabsContent>

        <TabsContent value="toolkit" className="space-y-6">
          <ToolkitForm newToolkitItem={newToolkitItem} setNewToolkitItem={setNewToolkitItem} onAddToolkitItem={handleAddToolkitItem} />
          <ToolkitList toolkitItems={toolkitItems} onDeleteToolkitItem={handleDeleteToolkitItem} />
        </TabsContent>

        <TabsContent value="reminders" className="space-y-6">
          <ReminderForm newReminder={newReminder} setNewReminder={setNewReminder} onAddReminder={handleAddReminder} />
          <ReminderList reminders={reminders} onDeleteReminder={handleDeleteReminder} />
        </TabsContent>

        <TabsContent value="gratitude" className="space-y-6">
          <GratitudeForm newGratitudePrompt={newGratitudePrompt} setNewGratitudePrompt={setNewGratitudePrompt} onAddGratitudePrompt={handleAddGratitudePrompt} />
          <GratitudeList gratitudePrompts={gratitudePrompts} onDeleteGratitudePrompt={handleDeleteGratitudePrompt} />
        </TabsContent>
      </Tabs>
    </div>;
};
export default ProviderDashboard;