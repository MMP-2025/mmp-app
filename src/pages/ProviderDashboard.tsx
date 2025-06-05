import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Quote, FileText, HelpCircle, Trash2, Edit, Bell, Heart, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [journalPrompts, setJournalPrompts] = useState<JournalPrompt[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [toolkitItems, setToolkitItems] = useState<ToolkitItem[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [gratitudePrompts, setGratitudePrompts] = useState<GratitudePrompt[]>([]);
  
  const [newQuote, setNewQuote] = useState({ text: '', author: '', category: '' });
  const [newPrompt, setNewPrompt] = useState<{ prompt: string; category: string; difficulty: JournalPromptDifficulty }>({ 
    prompt: '', 
    category: '', 
    difficulty: 'beginner'
  });
  const [newResource, setNewResource] = useState({ title: '', description: '', content: '', category: '' });
  
  const [newQuestion, setNewQuestion] = useState({ question: '', category: '', type: 'reflection' as const });
  const [newToolkitItem, setNewToolkitItem] = useState({ title: '', description: '', instructions: '', category: '', duration: '' });
  const [newReminder, setNewReminder] = useState({ title: '', message: '', frequency: 'daily' as const, category: '' });
  const [newGratitudePrompt, setNewGratitudePrompt] = useState({ prompt: '', category: '', difficulty: 'simple' as const });
  
  const { toast } = useToast();

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

  const handleDeleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
    toast({ title: "Quote deleted", description: "The quote has been removed." });
  };

  const handleDeletePrompt = (id: string) => {
    setJournalPrompts(prev => prev.filter(p => p.id !== id));
    toast({ title: "Prompt deleted", description: "The journal prompt has been removed." });
  };

  const handleDeleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
    toast({ title: "Resource deleted", description: "The resource has been removed." });
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    toast({ title: "Question deleted", description: "The question has been removed." });
  };

  const handleDeleteToolkitItem = (id: string) => {
    setToolkitItems(prev => prev.filter(t => t.id !== id));
    toast({ title: "Toolkit item deleted", description: "The toolkit item has been removed." });
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    toast({ title: "Reminder deleted", description: "The reminder has been removed." });
  };

  const handleDeleteGratitudePrompt = (id: string) => {
    setGratitudePrompts(prev => prev.filter(g => g.id !== id));
    toast({ title: "Gratitude prompt deleted", description: "The gratitude prompt has been removed." });
  };

  return (
    <div className="container mx-auto p-6 space-y-6 ml-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#7e868b] mb-2">Provider Dashboard</h1>
        <p className="text-[#7e868b]">Manage quotes, journal prompts, questions, toolkit items, reminders, gratitude prompts, and resources for your app content.</p>
      </div>

      <Tabs defaultValue="quotes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="prompts">Journal Prompts</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="toolkit">Toolkit</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="gratitude">Gratitude</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#7e868b]">
                <Plus className="h-5 w-5" />
                Add New Quote
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter inspirational quote..."
                value={newQuote.text}
                onChange={(e) => setNewQuote(prev => ({ ...prev, text: e.target.value }))}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Author (optional)"
                  value={newQuote.author}
                  onChange={(e) => setNewQuote(prev => ({ ...prev, author: e.target.value }))}
                />
                <Input
                  placeholder="Category (e.g., Motivation, Healing)"
                  value={newQuote.category}
                  onChange={(e) => setNewQuote(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
              <Button onClick={handleAddQuote}>Add Quote</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#7e868b]">
                <Quote className="h-5 w-5" />
                Saved Quotes ({quotes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quotes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No quotes added yet</p>
              ) : (
                <div className="space-y-3">
                  {quotes.map(quote => (
                    <div key={quote.id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-[#7e868b] mb-2">"{quote.text}"</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>— {quote.author}</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {quote.category}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteQuote(quote.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#7e868b]">
                <Plus className="h-5 w-5" />
                Add New Journal Prompt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter journal prompt..."
                value={newPrompt.prompt}
                onChange={(e) => setNewPrompt(prev => ({ ...prev, prompt: e.target.value }))}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Category (e.g., Self-reflection, Goals)"
                  value={newPrompt.category}
                  onChange={(e) => setNewPrompt(prev => ({ ...prev, category: e.target.value }))}
                />
                <select
                  value={newPrompt.difficulty}
                  onChange={(e) => setNewPrompt(prev => ({ ...prev, difficulty: e.target.value as JournalPromptDifficulty }))}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <Button onClick={handleAddPrompt}>Add Prompt</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#7e868b]">
                <FileText className="h-5 w-5" />
                Saved Prompts ({journalPrompts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {journalPrompts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No prompts added yet</p>
              ) : (
                <div className="space-y-3">
                  {journalPrompts.map(prompt => (
                    <div key={prompt.id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-[#7e868b] mb-2">{prompt.prompt}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              {prompt.category}
                            </span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                              {prompt.difficulty}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePrompt(prompt.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#7e868b]">
                <Plus className="h-5 w-5" />
                Add New Question
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter question..."
                value={newQuestion.question}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Category (e.g., Mental Health, Wellness)"
                  value={newQuestion.category}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, category: e.target.value }))}
                />
                <select
                  value={newQuestion.type}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, type: e.target.value as Question['type'] }))}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="reflection">Reflection</option>
                  <option value="assessment">Assessment</option>
                  <option value="screening">Screening</option>
                </select>
              </div>
              <Button onClick={handleAddQuestion}>Add Question</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#7e868b]">
                <HelpCircle className="h-5 w-5" />
                Saved Questions ({questions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No questions added yet</p>
              ) : (
                <div className="space-y-3">
                  {questions.map(question => (
                    <div key={question.id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-[#7e868b] mb-2">{question.question}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {question.category}
                            </span>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                              {question.type}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="toolkit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#7e868b]">
                <Plus className="h-5 w-5" />
                Add New Toolkit Item
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Toolkit item title..."
                value={newToolkitItem.title}
                onChange={(e) => setNewToolkitItem(prev => ({ ...prev, title: e.target.value }))}
              />
              <Input
                placeholder="Brief description..."
                value={newToolkitItem.description}
                onChange={(e) => setNewToolkitItem(prev => ({ ...prev, description: e.target.value }))}
              />
              <Textarea
                placeholder="Step-by-step instructions..."
                value={newToolkitItem.instructions}
                onChange={(e) => setNewToolkitItem(prev => ({ ...prev, instructions: e.target.value }))}
                rows={4}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Category (e.g., Breathing, Grounding)"
                  value={newToolkitItem.category}
                  onChange={(e) => setNewToolkitItem(prev => ({ ...prev, category: e.target.value }))}
                />
                <Input
                  placeholder="Duration (e.g., 5 minutes)"
                  value={newToolkitItem.duration}
                  onChange={(e) => setNewToolkitItem(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>
              <Button onClick={handleAddToolkitItem}>Add Toolkit Item</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#7e868b]">
                <Wrench className="h-5 w-5" />
                Saved Toolkit Items ({toolkitItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {toolkitItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No toolkit items added yet</p>
              ) : (
                <div className="space-y-3">
                  {toolkitItems.map(item => (
                    <div key={item.id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-[#7e868b] mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          <p className="text-sm text-gray-700 mb-2">{item.instructions.substring(0, 100)}...</p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              {item.category}
                            </span>
                            {item.duration && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {item.duration}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteToolkitItem(item.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#7e868b]">
                <Plus className="h-5 w-5" />
                Add New Reminder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Reminder title..."
                value={newReminder.title}
                onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="Reminder message..."
                value={newReminder.message}
                onChange={(e) => setNewReminder(prev => ({ ...prev, message: e.target.value }))}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Category (e.g., Self-care, Medication)"
                  value={newReminder.category}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, category: e.target.value }))}
                />
                <select
                  value={newReminder.frequency}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, frequency: e.target.value as Reminder['frequency'] }))}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <Button onClick={handleAddReminder}>Add Reminder</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#7e868b]">
                <Bell className="h-5 w-5" />
                Saved Reminders ({reminders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reminders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No reminders added yet</p>
              ) : (
                <div className="space-y-3">
                  {reminders.map(reminder => (
                    <div key={reminder.id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-[#7e868b] mb-1">{reminder.title}</h4>
                          <p className="text-sm text-gray-700 mb-2">{reminder.message}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                              {reminder.category}
                            </span>
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                              {reminder.frequency}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteReminder(reminder.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gratitude" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#7e868b]">
                <Plus className="h-5 w-5" />
                Add New Gratitude Prompt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter gratitude prompt..."
                value={newGratitudePrompt.prompt}
                onChange={(e) => setNewGratitudePrompt(prev => ({ ...prev, prompt: e.target.value }))}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Category (e.g., Daily, Relationships)"
                  value={newGratitudePrompt.category}
                  onChange={(e) => setNewGratitudePrompt(prev => ({ ...prev, category: e.target.value }))}
                />
                <select
                  value={newGratitudePrompt.difficulty}
                  onChange={(e) => setNewGratitudePrompt(prev => ({ ...prev, difficulty: e.target.value as GratitudePrompt['difficulty'] }))}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="simple">Simple</option>
                  <option value="moderate">Moderate</option>
                  <option value="deep">Deep</option>
                </select>
              </div>
              <Button onClick={handleAddGratitudePrompt}>Add Gratitude Prompt</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#7e868b]">
                <Heart className="h-5 w-5" />
                Saved Gratitude Prompts ({gratitudePrompts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {gratitudePrompts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No gratitude prompts added yet</p>
              ) : (
                <div className="space-y-3">
                  {gratitudePrompts.map(prompt => (
                    <div key={prompt.id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-[#7e868b] mb-2">{prompt.prompt}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-xs">
                              {prompt.category}
                            </span>
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                              {prompt.difficulty}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteGratitudePrompt(prompt.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProviderDashboard;
