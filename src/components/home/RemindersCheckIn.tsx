import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const RemindersCheckIn = () => {
  return (
    <Card className="p-6 bg-mental-peach/20">
      <div className="flex items-center gap-2 mb-2">
        <Bell className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-muted-foreground">Your Reminders</h2>
      </div>
      <p className="mb-4 text-muted-foreground">Stay on track with personalized reminders.</p>
      <Button asChild className="w-full bg-mental-blue hover:bg-mental-blue/80">
        <Link to="/reminders">View Reminders</Link>
      </Button>
    </Card>
  );
};

export default RemindersCheckIn;