
import {
  Quote,
  JournalPrompt,
  Resource,
  Question,
  ToolkitItem,
  Reminder,
  GratitudePrompt,
  MindfulnessPrompt
} from '@/types/provider';

interface UseProviderHandlersProps {
  quotes: Quote[];
  setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>;
  journalPrompts: JournalPrompt[];
  setJournalPrompts: React.Dispatch<React.SetStateAction<JournalPrompt[]>>;
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  toolkitItems: ToolkitItem[];
  setToolkitItems: React.Dispatch<React.SetStateAction<ToolkitItem[]>>;
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  gratitudePrompts: GratitudePrompt[];
  setGratitudePrompts: React.Dispatch<React.SetStateAction<GratitudePrompt[]>>;
  mindfulnessPrompts: MindfulnessPrompt[];
  setMindfulnessPrompts: React.Dispatch<React.SetStateAction<MindfulnessPrompt[]>>;
  newQuote: { text: string; author: string; category: string };
  setNewQuote: React.Dispatch<React.SetStateAction<{ text: string; author: string; category: string }>>;
  newPrompt: { prompt: string; category: string; difficulty: JournalPrompt['difficulty'] };
  setNewPrompt: React.Dispatch<React.SetStateAction<{ prompt: string; category: string; difficulty: JournalPrompt['difficulty'] }>>;
  newResource: { title: string; description: string; content: string; category: string };
  setNewResource: React.Dispatch<React.SetStateAction<{ title: string; description: string; content: string; category: string }>>;
  newQuestion: { question: string; category: string; type: Question['type'] };
  setNewQuestion: React.Dispatch<React.SetStateAction<{ question: string; category: string; type: Question['type'] }>>;
  newToolkitItem: { title: string; description: string; instructions: string; category: string; duration: string };
  setNewToolkitItem: React.Dispatch<React.SetStateAction<{ title: string; description: string; instructions: string; category: string; duration: string }>>;
  newReminder: { title: string; message: string; frequency: Reminder['frequency']; category: string };
  setNewReminder: React.Dispatch<React.SetStateAction<{ title: string; message: string; frequency: Reminder['frequency']; category: string }>>;
  newGratitudePrompt: { prompt: string; category: string; difficulty: GratitudePrompt['difficulty'] };
  setNewGratitudePrompt: React.Dispatch<React.SetStateAction<{ prompt: string; category: string; difficulty: GratitudePrompt['difficulty'] }>>;
  newMindfulnessPrompt: { prompt: string; category: string; duration: string };
  setNewMindfulnessPrompt: React.Dispatch<React.SetStateAction<{ prompt: string; category: string; duration: string }>>;
  toast: any;
}

export const useProviderHandlers = (props: UseProviderHandlersProps) => {
  const {
    quotes, setQuotes, journalPrompts, setJournalPrompts, resources, setResources,
    questions, setQuestions, toolkitItems, setToolkitItems, reminders, setReminders,
    gratitudePrompts, setGratitudePrompts, mindfulnessPrompts, setMindfulnessPrompts,
    newQuote, setNewQuote, newPrompt, setNewPrompt, newResource, setNewResource,
    newQuestion, setNewQuestion, newToolkitItem, setNewToolkitItem,
    newReminder, setNewReminder, newGratitudePrompt, setNewGratitudePrompt,
    newMindfulnessPrompt, setNewMindfulnessPrompt, toast
  } = props;

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
    setNewQuote({ text: '', author: '', category: '' });
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
    setNewPrompt({ prompt: '', category: '', difficulty: 'beginner' });
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
    setNewResource({ title: '', description: '', content: '', category: '' });
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
    setNewQuestion({ question: '', category: '', type: 'reflection' });
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
    setNewToolkitItem({ title: '', description: '', instructions: '', category: '', duration: '' });
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
    setNewReminder({ title: '', message: '', frequency: 'daily', category: '' });
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
    setNewGratitudePrompt({ prompt: '', category: '', difficulty: 'simple' });
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
    setNewMindfulnessPrompt({ prompt: '', category: '', duration: '5 minutes' });
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

  return {
    handleAddQuote,
    handleAddPrompt,
    handleAddResource,
    handleAddQuestion,
    handleAddToolkitItem,
    handleAddReminder,
    handleAddGratitudePrompt,
    handleAddMindfulnessPrompt,
    handleBulkImportQuotes,
    handleBulkImportPrompts,
    handleBulkImportQuestions,
    handleBulkImportToolkitItems,
    handleBulkImportReminders,
    handleBulkImportGratitudePrompts,
    handleBulkImportMindfulnessPrompts,
    handleDeleteQuote,
    handleDeletePrompt,
    handleDeleteResource,
    handleDeleteQuestion,
    handleDeleteToolkitItem,
    handleDeleteReminder,
    handleDeleteGratitudePrompt,
    handleDeleteMindfulnessPrompt
  };
};
