
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Smile, Meh, Frown, Angry, Laugh, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { useAnalytics } from '@/hooks/useAnalytics';
import { StorageManager, STORAGE_KEYS } from '@/utils/storage';

interface MoodEntry {
  id: string;
  mood: string;
  note: string;
  timestamp: number;
  date: string;
}

const MoodTrackerPage = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const { trackMoodEntry, trackAction } = useAnalytics();

  useEffect(() => {
    // Load mood history from storage
    const savedMoods = StorageManager.load<MoodEntry[]>(STORAGE_KEYS.MOOD_ENTRIES, []);
    setMoodHistory(savedMoods);
  }, []);

  const handleMoodSelection = (moodName: string) => {
    setSelectedMood(moodName);
    trackAction('mood_selected', { mood: moodName });
  };

  const handleSaveMood = () => {
    if (!selectedMood) {
      toast.error('Please select a mood first');
      return;
    }

    const newEntry: MoodEntry = {
      id: `mood_${Date.now()}`,
      mood: selectedMood,
      note: moodNote,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };

    const updatedHistory = [newEntry, ...moodHistory];
    setMoodHistory(updatedHistory);
    StorageManager.save(STORAGE_KEYS.MOOD_ENTRIES, updatedHistory);

    // Track analytics
    trackMoodEntry(selectedMood, moodNote);
    
    toast.success('Mood entry saved successfully!');
    setSelectedMood(null);
    setMoodNote('');
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'Ecstatic': return Laugh;
      case 'Happy': return Smile;
      case 'Neutral': return Meh;
      case 'Sad': return Frown;
      case 'Angry': return Angry;
      default: return Meh;
    }
  };

  return (
    <div className="bg-mental-blue min-h-screen">
      <SidebarLayout>
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/" className="flex items-center gap-2" style={{color: '#737373'}}>
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{color: '#737373'}}>Mood Tracker</h1>
              <p style={{color: '#737373'}}>Track and understand your emotional patterns</p>
            </div>
          </div>
          
          <Card className="p-6 bg-white/90">
            <h2 className="text-xl font-semibold mb-4" style={{color: '#737373'}}>How are you feeling today?</h2>
            <div className="grid grid-cols-5 gap-2 text-center mb-6">
              {[
                { name: 'Ecstatic', icon: Laugh },
                { name: 'Happy', icon: Smile },
                { name: 'Neutral', icon: Meh },
                { name: 'Sad', icon: Frown },
                { name: 'Angry', icon: Angry }
              ].map(mood => (
                <button 
                  key={mood.name} 
                  onClick={() => handleMoodSelection(mood.name)} 
                  className={`p-4 rounded-md transition-all flex flex-col items-center gap-2 ${
                    selectedMood === mood.name 
                      ? 'bg-mental-peach border-2' 
                      : 'hover:bg-mental-peach/40'
                  }`}
                  style={{borderColor: selectedMood === mood.name ? '#737373' : 'transparent'}}
                >
                  <mood.icon className="h-8 w-8" style={{color: '#737373'}} />
                  <span style={{color: '#737373'}}>{mood.name}</span>
                </button>
              ))}
            </div>

            {selectedMood && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2" style={{color: '#737373'}}>
                    Tell us more about feeling {selectedMood.toLowerCase()}...
                  </h3>
                  <Textarea 
                    placeholder="What's on your mind? How are you feeling right now?" 
                    value={moodNote} 
                    onChange={e => setMoodNote(e.target.value)} 
                    className="min-h-[120px] border-border focus:border-ring" 
                    style={{color: '#737373'}}
                  />
                </div>
                <Button 
                  onClick={handleSaveMood} 
                  className="bg-mental-green hover:bg-mental-green/80"
                  style={{color: '#737373'}}
                >
                  Save Mood Entry
                </Button>
              </div>
            )}
          </Card>
          
          <Card className="p-6 bg-white/90">
            <h2 className="text-xl font-semibold mb-4" style={{color: '#737373'}}>Your Mood History</h2>
            {moodHistory.length === 0 ? (
              <p style={{color: '#737373'}}>Your mood entries will appear here</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {moodHistory.slice(0, 10).map(entry => {
                  const MoodIcon = getMoodIcon(entry.mood);
                  return (
                    <div key={entry.id} className="flex items-start gap-3 p-3 bg-mental-peach/20 rounded-md">
                      <MoodIcon className="h-6 w-6 mt-1" style={{color: '#737373'}} />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium" style={{color: '#737373'}}>{entry.mood}</span>
                          <span className="text-sm" style={{color: '#737373'}}>{formatDate(entry.timestamp)}</span>
                        </div>
                        {entry.note && (
                          <p className="text-sm" style={{color: '#737373'}}>{entry.note}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </SidebarLayout>
    </div>
  );
};

export default MoodTrackerPage;
