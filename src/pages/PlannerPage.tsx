import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyView } from '@/components/planner/MonthlyView';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { QuickActionsPanel } from '@/components/planner/QuickActionsPanel';
import { TimeBlockingAssistant } from '@/components/planner/TimeBlockingAssistant';
const PlannerPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Array<{
    id: string;
    title: string;
    date: Date;
    time: string;
    type?: 'event' | 'meeting' | 'reminder';
    duration?: string;
    participants?: string;
    message?: string;
  }>>([]);

  const handleAddEvent = (event: { title: string; date: Date; time: string }) => {
    setEvents(prev => [...prev, {
      id: crypto.randomUUID(),
      ...event,
      type: 'event'
    }]);
  };

  const handleScheduleMeeting = (meeting: { title: string; date: Date; time: string; duration: string; participants: string }) => {
    setEvents(prev => [...prev, {
      id: crypto.randomUUID(),
      ...meeting,
      type: 'meeting'
    }]);
  };

  const handleSetReminder = (reminder: { title: string; message: string; date: Date; time: string }) => {
    setEvents(prev => [...prev, {
      id: crypto.randomUUID(),
      title: reminder.title,
      date: reminder.date,
      time: reminder.time,
      message: reminder.message,
      type: 'reminder'
    }]);
  };

  const handleAddTimeBlock = (block: { title: string; startTime: string; endTime: string }) => {
    setEvents(prev => [...prev, {
      id: crypto.randomUUID(),
      title: block.title,
      date: new Date(),
      time: block.startTime,
      type: 'event'
    }]);
  };

  return <SidebarLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-neutral-500">Planner</h1>
        <p className="text-neutral-500">Organize your schedule and plan your activities</p>
      </div>
      
      <div className="w-full max-w-none overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0 w-full">
          {/* Quick Actions Panel */}
          <div className="min-w-0 flex-shrink-0">
            <QuickActionsPanel 
              onAddEvent={handleAddEvent}
              onScheduleMeeting={handleScheduleMeeting}
              onSetReminder={handleSetReminder}
            />
          </div>

          {/* Monthly View Section */}
          <div className="min-w-0 flex-shrink-0">
            <Card className="bg-mental-peach h-fit">
              <CardHeader className="bg-mental-peach">
                <CardTitle className="text-lg text-neutral-500">Monthly View</CardTitle>
              </CardHeader>
              <CardContent className="bg-mental-peach">
                <MonthlyView selectedDate={selectedDate} events={events} />
              </CardContent>
            </Card>
          </div>

          {/* Time Blocking Assistant */}
          <div className="min-w-0 flex-shrink-0">
            <TimeBlockingAssistant onAddTimeBlock={handleAddTimeBlock} />
          </div>
        </div>
      </div>
      </div>
    </SidebarLayout>;
};
export default PlannerPage;