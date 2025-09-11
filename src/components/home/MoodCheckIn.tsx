
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MoodCheckIn = () => {
  return (
    <Card className="p-6 bg-mental-green/20">
      <h2 className="text-lg font-semibold mb-2 text-[#7e868b] leading-tight">Mood Check-in</h2>
      <p className="mb-4 text-[#7e868b] text-sm">Take a moment to check in with yourself.</p>
      <Button asChild className="w-full bg-mental-blue hover:bg-mental-blue/80">
        <Link to="/mood">Track My Mood</Link>
      </Button>
    </Card>
  );
};

export default MoodCheckIn;
