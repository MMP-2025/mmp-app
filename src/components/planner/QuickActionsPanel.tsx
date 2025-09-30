import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Clock } from 'lucide-react';
import { AddEventDialog } from './AddEventDialog';
import { ScheduleMeetingDialog } from './ScheduleMeetingDialog';
import { SetReminderDialog } from './SetReminderDialog';

interface QuickActionsPanelProps {
  onAddEvent: (event: { title: string; date: Date; time: string }) => void;
  onScheduleMeeting: (meeting: { title: string; date: Date; time: string; duration: string; participants: string }) => void;
  onSetReminder: (reminder: { title: string; message: string; date: Date; time: string }) => void;
}

export const QuickActionsPanel = ({ onAddEvent, onScheduleMeeting, onSetReminder }: QuickActionsPanelProps) => {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg text-neutral-500">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AddEventDialog
          trigger={
            <Button 
              className="w-full justify-start bg-neutral-300 hover:bg-neutral-400 border border-mental-gray text-neutral-600"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          }
          onAddEvent={onAddEvent}
        />
        
        <ScheduleMeetingDialog
          trigger={
            <Button 
              variant="outline" 
              className="w-full justify-start text-neutral-500 border-mental-gray"
              size="sm"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Meeting
            </Button>
          }
          onScheduleMeeting={onScheduleMeeting}
        />
        
        <SetReminderDialog
          trigger={
            <Button 
              variant="outline" 
              className="w-full justify-start text-neutral-500 border-mental-gray"
              size="sm"
            >
              <Clock className="mr-2 h-4 w-4" />
              Set Reminder
            </Button>
          }
          onSetReminder={onSetReminder}
        />
      </CardContent>
    </Card>
  );
};