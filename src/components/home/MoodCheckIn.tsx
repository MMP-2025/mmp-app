import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Smile } from 'lucide-react';

const MoodCheckIn = () => {
  return (
    <Card className="p-6 bg-gradient-to-br from-sage-light/60 to-mental-green/40 border-border/50 card-elevated hover-card-subtle">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-primary/15 p-3 shrink-0">
          <Smile className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="mb-1 text-foreground">How are you feeling?</h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Take a moment to check in with yourself.
          </p>
          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11">
            <Link to="/mood">Track My Mood</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MoodCheckIn;
