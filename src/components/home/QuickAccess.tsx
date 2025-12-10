
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const QuickAccess = () => {
  return (
    <Card className="p-6 bg-mental-gray">
      <h2 className="text-xl font-semibold mb-2 text-muted-foreground">Quick Access</h2>
      <div className="grid grid-cols-2 gap-2">
        <Button asChild className="bg-mental-blue hover:bg-mental-blue/80 text-gray-800 w-full text-left justify-start">
          <Link to="/journal">My Journal</Link>
        </Button>
        <Button asChild className="bg-mental-green hover:bg-mental-green/80 text-gray-800 w-full text-left justify-start">
          <Link to="/mood">Mood Check-in</Link>
        </Button>
        <Button asChild className="bg-mental-peach hover:bg-mental-peach/80 text-gray-800 w-full text-left justify-start">
          <Link to="/mindfulness">Mindfulness</Link>
        </Button>
        <Button asChild className="bg-mental-beige hover:bg-mental-beige/80 text-gray-800 w-full text-left justify-start">
          <Link to="/planner">Today's Plan</Link>
        </Button>
      </div>
    </Card>
  );
};

export default QuickAccess;
