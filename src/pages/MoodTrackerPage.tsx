
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Smile, Meh, Frown, Angry, Laugh, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { SidebarLayout } from '@/components/layout/SidebarLayout';

const MoodTrackerPage = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodNote, setMoodNote] = useState('');

  const handleMoodSelection = (moodName: string) => {
    setSelectedMood(moodName);
  };

  const handleSaveMood = () => {
    if (!selectedMood) {
      toast.error('Please select a mood first');
      return;
    }
    
    // Here you would typically save to your data store
    toast.success('Mood entry saved successfully!');
    setSelectedMood(null);
    setMoodNote('');
  };

  return (
    <div className="bg-mental-blue min-h-screen">
      <SidebarLayout>
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-800">Mood Tracker</h1>
              <p className="text-gray-700">Track and understand your emotional patterns</p>
            </div>
          </div>
          
          <Card className="p-6 bg-white/90">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">How are you feeling today?</h2>
            <div className="grid grid-cols-5 gap-2 text-center mb-6">
              {[
                { name: 'Ecstatic', icon: Laugh },
                { name: 'Happy', icon: Smile },
                { name: 'Neutral', icon: Meh },
                { name: 'Sad', icon: Frown },
                { name: 'Angry', icon: Angry }
              ].map((mood) => (
                <button 
                  key={mood.name}
                  onClick={() => handleMoodSelection(mood.name)}
                  className={`p-4 rounded-md transition-all flex flex-col items-center gap-2 ${
                    selectedMood === mood.name 
                      ? 'bg-mental-peach border-2 border-gray-600' 
                      : 'hover:bg-mental-peach/40'
                  }`}
                >
                  <mood.icon className="h-8 w-8 text-gray-700" />
                  <span className="text-gray-700">{mood.name}</span>
                </button>
              ))}
            </div>

            {selectedMood && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-800">
                    Tell us more about feeling {selectedMood.toLowerCase()}...
                  </h3>
                  <Textarea
                    placeholder="What's on your mind? How are you feeling right now?"
                    value={moodNote}
                    onChange={(e) => setMoodNote(e.target.value)}
                    className="min-h-[120px] border-gray-300 focus:border-gray-600 text-gray-800"
                  />
                </div>
                <Button 
                  onClick={handleSaveMood}
                  className="bg-mental-green text-white hover:bg-mental-green/80"
                >
                  Save Mood Entry
                </Button>
              </div>
            )}
          </Card>
          
          <Card className="p-6 bg-white/90">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Mood History</h2>
            <p className="text-gray-700">Mood visualization will appear here</p>
          </Card>
        </div>
      </SidebarLayout>
    </div>
  );
};

export default MoodTrackerPage;
