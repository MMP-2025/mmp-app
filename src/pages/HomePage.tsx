
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "@/components/ui/sonner";

const quotes = [
  { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
  { text: "There is hope, even when your brain tells you there isn't.", author: "John Green" },
  { text: "Self-care is how you take your power back.", author: "Lalah Delia" },
  { text: "Mental health problems don't define who you are. They are something you experience.", author: "Roy Chisholm" },
  { text: "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.", author: "Unknown" },
  { text: "The only journey is the one within.", author: "Rainer Maria Rilke" },
  { text: "Your present circumstances don't determine where you can go; they merely determine where you start.", author: "Nido Qubein" }
];

const questions = [
  "What brought you joy today?",
  "What's one small thing you can do for yourself today?",
  "What are you grateful for right now?",
  "What's something that challenged you recently, and how did you handle it?",
  "What's one boundary you want to set this week?",
  "What helps you feel calm when you're stressed?",
  "What's one self-care activity you'd like to try?"
];

const getRandomItem = (array: any[]) => {
  // Use date as seed to get the same item for the entire day
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const seed = [...dateString].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = seed % array.length;
  return array[index];
};

const HomePage = () => {
  const todaysQuote = getRandomItem(quotes);
  const todaysQuestion = getRandomItem(questions);
  const [response, setResponse] = useState('');
  
  const handleSubmitResponse = () => {
    if (!response.trim()) {
      toast.warning("Please write a response before submitting");
      return;
    }
    
    // In a real app, this would save to a database
    toast.success("Your response has been recorded");
    console.log("Response submitted:", response);
    setResponse('');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-center mb-2">Welcome to MindfulPath</h1>
        <p className="text-center text-muted-foreground">Your daily companion for mental wellbeing</p>
      </div>
      
      <Card className="p-6 bg-mental-peach/20">
        <h2 className="text-xl font-semibold mb-4">Quote of the Day</h2>
        <blockquote className="italic text-lg">
          "{todaysQuote.text}"
        </blockquote>
        <p className="text-right mt-2">— {todaysQuote.author}</p>
      </Card>
      
      <Card className="p-6 bg-mental-blue/20">
        <h2 className="text-xl font-semibold mb-4">Question of the Day</h2>
        <p className="text-lg mb-4">{todaysQuestion}</p>
        
        <div className="space-y-4">
          <Input
            placeholder="Write your response..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="bg-white"
          />
          <Button 
            onClick={handleSubmitResponse}
            className="w-full bg-mental-green hover:bg-mental-green/80"
          >
            Submit Response
          </Button>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-mental-beige/20">
          <h2 className="text-xl font-semibold mb-2">Quick Access</h2>
          <div className="grid grid-cols-2 gap-2">
            <Button className="bg-mental-blue hover:bg-mental-blue/80 w-full text-left justify-start">
              My Journal
            </Button>
            <Button className="bg-mental-green hover:bg-mental-green/80 w-full text-left justify-start">
              Mood Check-in
            </Button>
            <Button className="bg-mental-peach hover:bg-mental-peach/80 w-full text-left justify-start">
              Mindfulness
            </Button>
            <Button className="bg-mental-gray hover:bg-mental-gray/80 w-full text-left justify-start">
              Today's Plan
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 bg-mental-green/20">
          <h2 className="text-xl font-semibold mb-2">How are you feeling?</h2>
          <p className="mb-4">Take a moment to check in with yourself.</p>
          <Button className="w-full bg-mental-blue hover:bg-mental-blue/80">
            Track My Mood
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
