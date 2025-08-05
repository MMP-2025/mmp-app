import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Clock, Users, Target } from 'lucide-react';

interface QuickActionsPanelProps {
  onAddEvent: () => void;
}

export const QuickActionsPanel = ({ onAddEvent }: QuickActionsPanelProps) => {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg text-neutral-500">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={onAddEvent}
          className="w-full justify-start bg-neutral-300 hover:bg-neutral-400 border border-mental-gray text-neutral-600"
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start text-neutral-500 border-mental-gray"
          size="sm"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Meeting
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start text-neutral-500 border-mental-gray"
          size="sm"
        >
          <Clock className="mr-2 h-4 w-4" />
          Set Reminder
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start text-neutral-500 border-mental-gray"
          size="sm"
        >
          <Users className="mr-2 h-4 w-4" />
          Invite Others
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start text-neutral-500 border-mental-gray"
          size="sm"
        >
          <Target className="mr-2 h-4 w-4" />
          Create Goal
        </Button>
      </CardContent>
    </Card>
  );
};