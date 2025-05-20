
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const JournalPage = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Journal</h1>
        <p className="text-muted-foreground">Express your thoughts and feelings</p>
      </div>
      
      <Card className="p-6 bg-mental-beige/20">
        <h2 className="text-xl font-semibold mb-4">New Entry</h2>
        <Button className="bg-mental-green hover:bg-mental-green/80">
          Create New Journal Entry
        </Button>
      </Card>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
        <p>Your journal entries will appear here</p>
      </Card>
    </div>
  );
};

export default JournalPage;
