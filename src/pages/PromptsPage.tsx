import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Prompt {
  id: string;
  text: string;
  category: 'journal' | 'gratitude' | 'mindfulness' | 'other';
}

const PromptsPage = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [newPromptText, setNewPromptText] = useState('');
  const [newPromptCategory, setNewPromptCategory] = useState<'journal' | 'gratitude' | 'mindfulness' | 'other'>('journal');
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [editingPromptText, setEditingPromptText] = useState('');
  
  const handleAddPrompt = () => {
    if (!newPromptText.trim()) {
      toast.error('Please enter prompt text');
      return;
    }
    
    const newPrompt: Prompt = {
      id: Date.now().toString(),
      text: newPromptText,
      category: newPromptCategory
    };
    
    setPrompts([...prompts, newPrompt]);
    setNewPromptText('');
    toast.success('Prompt added successfully!');
  };
  
  const startEditingPrompt = (prompt: Prompt) => {
    setEditingPromptId(prompt.id);
    setEditingPromptText(prompt.text);
  };
  
  const saveEditedPrompt = () => {
    if (!editingPromptText.trim()) {
      toast.error('Prompt text cannot be empty');
      return;
    }
    
    setPrompts(prompts.map(prompt => 
      prompt.id === editingPromptId 
        ? { ...prompt, text: editingPromptText } 
        : prompt
    ));
    
    setEditingPromptId(null);
    setEditingPromptText('');
    toast.success('Prompt updated successfully!');
  };
  
  const cancelEditingPrompt = () => {
    setEditingPromptId(null);
    setEditingPromptText('');
  };
  
  const deletePrompt = (id: string) => {
    setPrompts(prompts.filter(prompt => prompt.id !== id));
    toast.info('Prompt deleted');
  };
  
  // Filter prompts by category
  const journalPrompts = prompts.filter(prompt => prompt.category === 'journal');
  const gratitudePrompts = prompts.filter(prompt => prompt.category === 'gratitude');
  const mindfulnessPrompts = prompts.filter(prompt => prompt.category === 'mindfulness');
  const otherPrompts = prompts.filter(prompt => prompt.category === 'other');
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Prompts</h1>
        <p className="text-muted-foreground">Add and manage your journal, gratitude, and mindfulness prompts</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Pencil className="mr-2 h-5 w-5" />
            Add New Prompt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="prompt-category">Category</Label>
            <select
              id="prompt-category"
              value={newPromptCategory}
              onChange={(e) => setNewPromptCategory(e.target.value as any)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="journal">Journal</option>
              <option value="gratitude">Gratitude</option>
              <option value="mindfulness">Mindfulness</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="prompt-text">Prompt Text</Label>
            <Textarea
              id="prompt-text"
              placeholder="Enter your prompt here..."
              value={newPromptText}
              onChange={(e) => setNewPromptText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <Button onClick={handleAddPrompt}>
            <Plus className="mr-2 h-4 w-4" /> Add Prompt
          </Button>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="journal">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="journal">Journal ({journalPrompts.length})</TabsTrigger>
          <TabsTrigger value="gratitude">Gratitude ({gratitudePrompts.length})</TabsTrigger>
          <TabsTrigger value="mindfulness">Mindfulness ({mindfulnessPrompts.length})</TabsTrigger>
          <TabsTrigger value="other">Other ({otherPrompts.length})</TabsTrigger>
        </TabsList>
        
        {/* Journal Prompts Tab */}
        <TabsContent value="journal">
          <Card>
            <CardHeader>
              <CardTitle>Journal Prompts</CardTitle>
            </CardHeader>
            <CardContent>
              {journalPrompts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No journal prompts yet. Add one above!
                </div>
              ) : (
                <div className="space-y-3">
                  {journalPrompts.map(prompt => (
                    <div 
                      key={prompt.id} 
                      className="p-3 border rounded-md bg-mental-peach/10"
                    >
                      {editingPromptId === prompt.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editingPromptText}
                            onChange={(e) => setEditingPromptText(e.target.value)}
                            className="min-h-[80px]"
                          />
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={saveEditedPrompt}>
                              <Save className="mr-1 h-3 w-3" /> Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEditingPrompt}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <div className="flex-1">{prompt.text}</div>
                          <div className="space-x-2 flex shrink-0">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => startEditingPrompt(prompt)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-destructive" 
                              onClick={() => deletePrompt(prompt.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Gratitude Prompts Tab */}
        <TabsContent value="gratitude">
          <Card>
            <CardHeader>
              <CardTitle>Gratitude Prompts</CardTitle>
            </CardHeader>
            <CardContent>
              {gratitudePrompts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No gratitude prompts yet. Add one above!
                </div>
              ) : (
                <div className="space-y-3">
                  {gratitudePrompts.map(prompt => (
                    <div 
                      key={prompt.id} 
                      className="p-3 border rounded-md bg-mental-green/10"
                    >
                      {editingPromptId === prompt.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editingPromptText}
                            onChange={(e) => setEditingPromptText(e.target.value)}
                            className="min-h-[80px]"
                          />
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={saveEditedPrompt}>
                              <Save className="mr-1 h-3 w-3" /> Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEditingPrompt}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <div className="flex-1">{prompt.text}</div>
                          <div className="space-x-2 flex shrink-0">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => startEditingPrompt(prompt)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-destructive" 
                              onClick={() => deletePrompt(prompt.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Mindfulness Prompts Tab */}
        <TabsContent value="mindfulness">
          <Card>
            <CardHeader>
              <CardTitle>Mindfulness Prompts</CardTitle>
            </CardHeader>
            <CardContent>
              {mindfulnessPrompts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No mindfulness prompts yet. Add one above!
                </div>
              ) : (
                <div className="space-y-3">
                  {mindfulnessPrompts.map(prompt => (
                    <div 
                      key={prompt.id} 
                      className="p-3 border rounded-md bg-mental-blue/10"
                    >
                      {editingPromptId === prompt.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editingPromptText}
                            onChange={(e) => setEditingPromptText(e.target.value)}
                            className="min-h-[80px]"
                          />
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={saveEditedPrompt}>
                              <Save className="mr-1 h-3 w-3" /> Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEditingPrompt}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <div className="flex-1">{prompt.text}</div>
                          <div className="space-x-2 flex shrink-0">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => startEditingPrompt(prompt)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-destructive" 
                              onClick={() => deletePrompt(prompt.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Other Prompts Tab */}
        <TabsContent value="other">
          <Card>
            <CardHeader>
              <CardTitle>Other Prompts</CardTitle>
            </CardHeader>
            <CardContent>
              {otherPrompts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No other prompts yet. Add one above!
                </div>
              ) : (
                <div className="space-y-3">
                  {otherPrompts.map(prompt => (
                    <div 
                      key={prompt.id} 
                      className="p-3 border rounded-md bg-muted/20"
                    >
                      {editingPromptId === prompt.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editingPromptText}
                            onChange={(e) => setEditingPromptText(e.target.value)}
                            className="min-h-[80px]"
                          />
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={saveEditedPrompt}>
                              <Save className="mr-1 h-3 w-3" /> Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEditingPrompt}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <div className="flex-1">{prompt.text}</div>
                          <div className="space-x-2 flex shrink-0">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => startEditingPrompt(prompt)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-destructive" 
                              onClick={() => deletePrompt(prompt.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
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

export default PromptsPage;
