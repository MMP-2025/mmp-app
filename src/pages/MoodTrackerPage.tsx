
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Smile, Meh, Frown, Angry, Laugh } from 'lucide-react';
import { toast } from 'sonner';

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
    <div className="min-h-screen bg-mental-blue p-6">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-mental-gray">Mood Tracker</h1>
          <p className="text-mental-gray">Track and understand your emotional patterns</p>
        </div>
        
        <Card className="p-6 bg-white/90">
          <h2 className="text-xl font-semibold mb-4 text-mental-gray">How are you feeling today?</h2>
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
                    ? 'bg-mental-peach border-2 border-mental-gray' 
                    : 'hover:bg-mental-peach/40'
                }`}
              >
                <mood.icon className="h-8 w-8 text-mental-gray" />
                <span className="text-mental-gray">{mood.name}</span>
              </button>
            ))}
          </div>

          {selectedMood && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2 text-mental-gray">
                  Tell us more about feeling {selectedMood.toLowerCase()}...
                </h3>
                <Textarea
                  placeholder="What's on your mind? How are you feeling right now?"
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  className="min-h-[120px] border-mental-gray/30 focus:border-mental-gray text-mental-gray"
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
          <h2 className="text-xl font-semibold mb-4 text-mental-gray">Your Mood History</h2>
          <p className="text-mental-gray">Mood visualization will appear here</p>
        </Card>
      </div>
    </div>
  );
};

export default MoodTrackerPage;
