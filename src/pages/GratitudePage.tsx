import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToastService } from '@/hooks/useToastService';
import { Heart, Check, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { SidebarLayout } from '@/components/layout/SidebarLayout';

// Sample gratitude exercises - in a real app, these would come from your database
const gratitudeExercises = [{
  id: 1,
  title: "Three Good Things",
  description: "Write down three things that went well today, along with why they happened.",
  instructions: "Think of three positive events from your day, no matter how small. For each event, reflect on what caused it and how you felt afterward."
}, {
  id: 2,
  title: "Gratitude Letter",
  description: "Write a letter expressing gratitude to someone who has positively impacted your life.",
  instructions: "Think of someone who has done something important for you whom you have never properly thanked. Write a detailed letter expressing your gratitude for their specific actions and how they affected you."
}, {
  id: 3,
  title: "Gratitude Jar",
  description: "Create a collection of moments, people, and things you're grateful for.",
  instructions: "Each day, write down one thing you're grateful for on a small piece of paper. Add it to your virtual gratitude jar. When you're feeling down, you can look back at these notes."
}];

const GratitudePage = () => {
  const [selectedExercise, setSelectedExercise] = useState<typeof gratitudeExercises[0] | null>(null);
  const [gratitudeEntries, setGratitudeEntries] = useState<{
    id: number;
    content: string;
    date: Date;
  }[]>([]);
  const [gratitudeContent, setGratitudeContent] = useState('');
  const [threeGoodThings, setThreeGoodThings] = useState(['', '', '']);
  const [letterRecipient, setLetterRecipient] = useState('');
  const [letterContent, setLetterContent] = useState('');
  const [savedExercises, setSavedExercises] = useState<number[]>([]);
  const [currentView, setCurrentView] = useState<'all' | 'saved'>('all');

  const { showSuccess, showWarning } = useToastService();

  const handleThreeGoodThingsChange = (index: number, value: string) => {
    const updated = [...threeGoodThings];
    updated[index] = value;
    setThreeGoodThings(updated);
  };

  const toggleSaved = (exerciseId: number) => {
    setSavedExercises(prev => {
      const isCurrentlySaved = prev.includes(exerciseId);
      if (isCurrentlySaved) {
        showSuccess('Exercise removed from saved');
        return prev.filter(id => id !== exerciseId);
      } else {
        showSuccess('Exercise saved!');
        return [...prev, exerciseId];
      }
    });
  };

  const getDisplayedExercises = () => {
    if (currentView === 'saved') {
      return gratitudeExercises.filter(exercise => savedExercises.includes(exercise.id));
    }
    return gratitudeExercises;
  };

  const saveGratitude = () => {
    let content = '';
    if (selectedExercise?.id === 1) {
      // Three Good Things
      if (threeGoodThings.filter(thing => thing.trim()).length < 3) {
        showWarning("Please fill in all three gratitude items");
        return;
      }
      content = threeGoodThings.join('\n\n');
    } else if (selectedExercise?.id === 2) {
      // Gratitude Letter
      if (!letterRecipient.trim() || !letterContent.trim()) {
        showWarning("Please fill in both recipient and letter content");
        return;
      }
      content = `Dear ${letterRecipient},\n\n${letterContent}`;
    } else {
      // Gratitude Jar or default
      if (!gratitudeContent.trim()) {
        showWarning("Please write something you're grateful for");
        return;
      }
      content = gratitudeContent;
    }
    const newEntry = {
      id: Date.now(),
      content,
      date: new Date()
    };
    setGratitudeEntries(prev => [newEntry, ...prev]);

    // Reset form
    if (selectedExercise?.id === 1) {
      setThreeGoodThings(['', '', '']);
    } else if (selectedExercise?.id === 2) {
      setLetterRecipient('');
      setLetterContent('');
    } else {
      setGratitudeContent('');
    }
    setSelectedExercise(null);
    showSuccess("Gratitude practice saved");
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const renderExerciseForm = () => {
    if (!selectedExercise) return null;
    switch (selectedExercise.id) {
      case 1:
        // Three Good Things
        return <div className="space-y-4">
            <h3 className="font-medium text-[#7e868b]">What are three good things that happened today?</h3>
            {[0, 1, 2].map(index => <div key={index} className="space-y-2">
                <label className="block text-sm font-medium text-[#7e868b]">
                  Good thing #{index + 1}:
                </label>
                <Textarea value={threeGoodThings[index]} onChange={e => handleThreeGoodThingsChange(index, e.target.value)} placeholder={`I'm grateful for...`} className="min-h-[100px]" />
              </div>)}
          </div>;
      case 2:
        // Gratitude Letter
        return <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#7e868b]">
                To whom are you writing this letter?
              </label>
              <Input value={letterRecipient} onChange={e => setLetterRecipient(e.target.value)} placeholder="Recipient's name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#7e868b]">
                Your gratitude letter:
              </label>
              <Textarea value={letterContent} onChange={e => setLetterContent(e.target.value)} placeholder="Express your gratitude..." className="min-h-[200px]" />
            </div>
          </div>;
      case 3: // Gratitude Jar
      default:
        return <div>
            <label className="block text-sm font-medium mb-1 text-[#7e868b]">
              What are you grateful for today?
            </label>
            <Textarea value={gratitudeContent} onChange={e => setGratitudeContent(e.target.value)} placeholder="I'm grateful for..." className="min-h-[150px]" />
          </div>;
    }
  };

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-[#7e868b]">Gratitude Practices</h1>
          <p className="text-[#7e868b]">Cultivate appreciation for life's blessings</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={currentView === 'all' ? 'default' : 'outline'}
            onClick={() => setCurrentView('all')}
            className="bg-mental-peach hover:bg-mental-peach/80"
          >
            All Practices
          </Button>
          <Button
            variant={currentView === 'saved' ? 'default' : 'outline'}
            onClick={() => setCurrentView('saved')}
            className="bg-mental-green hover:bg-mental-green/80"
          >
            Saved Practices ({savedExercises.length})
          </Button>
        </div>
        
        {selectedExercise ? <Card className="p-6 bg-mental-peach/20">
            <h2 className="text-2xl font-semibold mb-2 text-[#7e868b]">{selectedExercise.title}</h2>
            <p className="mb-6 text-[#7e868b]">{selectedExercise.instructions}</p>
            
            {renderExerciseForm()}
            
            <div className="mt-6 flex gap-3">
              <Button onClick={saveGratitude} className="flex-1 bg-mental-green hover:bg-mental-green/80">
                Save Practice
              </Button>
              <Button onClick={() => setSelectedExercise(null)} variant="outline" className="bg-mental-green">
                Cancel
              </Button>
            </div>
          </Card> : <>
            {currentView === 'saved' && savedExercises.length === 0 ? (
              <Card className="p-8 bg-mental-peach/20 text-center">
                <BookmarkPlus className="h-12 w-12 mx-auto mb-4 text-mental-peach" />
                <h3 className="text-xl font-semibold mb-2 text-[#7e868b]">No Saved Practices</h3>
                <p className="text-[#7e868b] mb-4">
                  You haven't saved any practices yet. Browse all practices and save your favorites!
                </p>
                <Button 
                  onClick={() => setCurrentView('all')} 
                  className="bg-mental-peach hover:bg-mental-peach/80"
                >
                  Browse All Practices
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getDisplayedExercises().map(exercise => <Card key={exercise.id} className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold flex items-center gap-2 text-[#7e868b]">
                        <Heart className="h-5 w-5 text-mental-peach" />
                        {exercise.title}
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSaved(exercise.id)}
                        className="p-1"
                      >
                        {savedExercises.includes(exercise.id) ? (
                          <BookmarkCheck className="h-6 w-6 text-blue-600" />
                        ) : (
                          <BookmarkPlus className="h-6 w-6 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    <p className="mb-4 text-[#7e868b]">{exercise.description}</p>
                    <Button onClick={() => setSelectedExercise(exercise)} className="w-full bg-mental-peach hover:bg-mental-peach/80">
                      Start Practice
                    </Button>
                  </Card>)}
              </div>
            )}
          </>}
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#7e868b]">Your Gratitude Collection</h2>
          
          {gratitudeEntries.length === 0 ? <p className="text-center text-[#7e868b]">Your gratitude entries will appear here</p> : <div className="space-y-4">
              {gratitudeEntries.map(entry => <div key={entry.id} className="border border-mental-gray/20 rounded-md p-4">
                  <div className="flex items-center gap-1 mb-2 text-sm text-[#7e868b]">
                    <Check className="h-4 w-4 text-mental-green" />
                    <span>{formatDate(entry.date)}</span>
                  </div>
                  <p className="whitespace-pre-wrap text-[#7e868b]">{entry.content}</p>
                </div>)}
            </div>}
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default GratitudePage;
