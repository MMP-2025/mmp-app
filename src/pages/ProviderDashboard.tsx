import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Quote, FileText, HelpCircle, Trash2, Edit } from 'lucide-react';
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

const ProviderDashboard = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [journalPrompts, setJournalPrompts] = useState<JournalPrompt[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  
  const [newQuote, setNewQuote] = useState({ text: '', author: '', category: '' });
  const [newPrompt, setNewPrompt] = useState<{ prompt: string; category: string; difficulty: JournalPromptDifficulty }>({ 
    prompt: '', 
    category: '', 
    difficulty: 'beginner'
  });
  const [newResource, setNewResource] = useState({ title: '', description: '', content: '', category: '' });
  
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

  return (
    <div className="container mx-auto p-6 space-y-6 ml-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#7e868b] mb-2">Provider Dashboard</h1>
        <p className="text-[#7e868b]">Manage quotes, journal prompts, and resources for your app content.</p>
      </div>

      <Tabs defaultValue="quotes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quotes">Inspirational Quotes</TabsTrigger>
          <TabsTrigger value="prompts">Journal Prompts</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
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

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#7e868b]">
                <Plus className="h-5 w-5" />
                Add New Resource
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Resource title..."
                value={newResource.title}
                onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
              />
              <Input
                placeholder="Brief description..."
                value={newResource.description}
                onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
              />
              <Textarea
                placeholder="Resource content..."
                value={newResource.content}
                onChange={(e) => setNewResource(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
              />
              <Input
                placeholder="Category (e.g., Coping Skills, Education)"
                value={newResource.category}
                onChange={(e) => setNewResource(prev => ({ ...prev, category: e.target.value }))}
              />
              <Button onClick={handleAddResource}>Add Resource</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#7e868b]">
                <HelpCircle className="h-5 w-5" />
                Saved Resources ({resources.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {resources.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No resources added yet</p>
              ) : (
                <div className="space-y-3">
                  {resources.map(resource => (
                    <div key={resource.id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-[#7e868b] mb-1">{resource.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                          <p className="text-sm text-gray-700 mb-2">{resource.content.substring(0, 100)}...</p>
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                            {resource.category}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteResource(resource.id)}
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
