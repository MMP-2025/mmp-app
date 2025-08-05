import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Plus, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DailySchedule } from '@/components/planner/DailySchedule';
import { WeeklyView } from '@/components/planner/WeeklyView';
import { MonthlyView } from '@/components/planner/MonthlyView';
import { YearlyView } from '@/components/planner/YearlyView';
import { toast } from 'sonner';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { QuickActionsPanel } from '@/components/planner/QuickActionsPanel';
import { TimeBlockingAssistant } from '@/components/planner/TimeBlockingAssistant';
const PlannerPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('12:00');
  const [events, setEvents] = useState<Array<{
    id: string;
    title: string;
    date: Date;
    time: string;
  }>>([]);
  const handleAddEvent = () => {
    if (!newEventTitle.trim()) {
      toast.error('Please enter an event title');
      return;
    }
    const newEvent = {
      id: Date.now().toString(),
      title: newEventTitle,
      date: selectedDate,
      time: newEventTime
    };
    setEvents([...events, newEvent]);
    setNewEventTitle('');
    toast.success('Event added successfully!');
  };
  return <SidebarLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-neutral-500">Planner</h1>
        <p className="text-neutral-500">Organize your schedule and plan your activities</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <div className="space-y-6">
          <QuickActionsPanel onAddEvent={() => document.getElementById('add-event-section')?.scrollIntoView({ behavior: 'smooth' })} />
        </div>

        {/* Calendar Section */}
        <Card className="bg-mental-peach">
          <CardHeader className="bg-mental-peach">
            <CardTitle className="text-lg text-neutral-500">Calendar & Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 bg-mental-peach">
            <div>
              <Label className="text-sm font-medium mb-2 block text-neutral-500 mx-0 my-[20px]">Select Date</Label>
              <Calendar mode="single" selected={selectedDate} onSelect={date => date && setSelectedDate(date)} className="rounded-md border w-full bg-mental-peach scale-110" />
            </div>
            
            <div id="add-event-section" className="space-y-3 pt-4 border-t bg-mental-peach">
              <Label className="text-sm font-medium text-neutral-500">Add New Event</Label>
              <div className="space-y-2">
                <Input placeholder="Event title" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} className="text-sm text-neutral-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-neutral-500" />
                  <Input type="time" value={newEventTime} onChange={e => setNewEventTime(e.target.value)} className="text-sm text-neutral-500" />
                </div>
              </div>
              <Button onClick={handleAddEvent} size="sm" className="w-full bg-neutral-300 hover:bg-neutral-400 border border-mental-gray text-neutral-600">
                <Plus className="mr-2 h-4 w-4" /> Add Event
              </Button>
            </div>

            {/* Monthly View Display */}
            <div className="pt-4 border-t">
              <MonthlyView selectedDate={selectedDate} events={events} />
            </div>
          </CardContent>
        </Card>

        {/* Time Blocking Assistant */}
        <div className="space-y-6">
          <TimeBlockingAssistant />
        </div>
      </div>
      </div>
    </SidebarLayout>;
};
export default PlannerPage;