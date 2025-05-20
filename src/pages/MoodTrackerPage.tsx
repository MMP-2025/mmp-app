
import React from 'react';
import { Card } from '@/components/ui/card';

const MoodTrackerPage = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mood Tracker</h1>
        <p className="text-muted-foreground">Track and understand your emotional patterns</p>
      </div>
      
      <Card className="p-6 bg-mental-blue/20">
        <h2 className="text-xl font-semibold mb-4">How are you feeling today?</h2>
        <div className="grid grid-cols-5 gap-2 text-center">
          {['Very Bad', 'Bad', 'Neutral', 'Good', 'Very Good'].map((mood) => (
            <button 
              key={mood}
              className="p-4 rounded-md hover:bg-mental-blue/40 transition-all"
            >
              {mood}
            </button>
          ))}
        </div>
      </Card>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Your Mood History</h2>
        <p>Mood visualization will appear here</p>
      </Card>
    </div>
  );
};

export default MoodTrackerPage;
