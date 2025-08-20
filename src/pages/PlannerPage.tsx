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
      
      <div className="w-full max-w-none overflow-visible">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 min-w-0 w-full">
          {/* Quick Actions Panel */}
          <div className="min-w-0 flex-shrink-0 space-y-6">
            <QuickActionsPanel onAddEvent={() => document.getElementById('add-event-section')?.scrollIntoView({ behavior: 'smooth' })} />
          </div>

          {/* Calendar Section */}
          <div className="min-w-0 flex-shrink-0 space-y-4">
            <Card className="bg-mental-peach">
              <CardHeader className="bg-mental-peach">
                <CardTitle className="text-lg text-neutral-500">Calendar</CardTitle>
              </CardHeader>
              <CardContent className="bg-mental-peach">
                <Calendar mode="single" selected={selectedDate} onSelect={date => date && setSelectedDate(date)} className="rounded-md border w-full bg-mental-peach" />
              </CardContent>
            </Card>

            <Card className="bg-mental-peach">
              <CardHeader className="bg-mental-peach">
                <CardTitle className="text-lg text-neutral-500">Add Event</CardTitle>
              </CardHeader>
              <CardContent id="add-event-section" className="space-y-3 bg-mental-peach">
                <Input placeholder="Event title" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} className="text-sm text-neutral-500" />
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-neutral-500" />
                  <Input type="time" value={newEventTime} onChange={e => setNewEventTime(e.target.value)} className="text-sm text-neutral-500" />
                </div>
                <Button onClick={handleAddEvent} size="sm" className="w-full bg-neutral-300 hover:bg-neutral-400 border border-mental-gray text-neutral-600">
                  <Plus className="mr-2 h-4 w-4" /> Add Event
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-mental-peach">
              <CardHeader className="bg-mental-peach">
                <CardTitle className="text-lg text-neutral-500">Monthly View</CardTitle>
              </CardHeader>
              <CardContent className="bg-mental-peach">
                <MonthlyView selectedDate={selectedDate} events={events} />
              </CardContent>
            </Card>
          </div>

          {/* Time Blocking Assistant */}
          <div className="min-w-0 flex-shrink-0 space-y-6">
            <TimeBlockingAssistant />
          </div>
        </div>
      </div>
      </div>
    </SidebarLayout>;
};
export default PlannerPage;