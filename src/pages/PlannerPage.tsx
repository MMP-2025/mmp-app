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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-mental-peach">
          <CardHeader className="bg-mental-peach">
            <CardTitle className="text-lg text-neutral-500">Calendar & Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 bg-mental-peach">
            <div>
              <Label className="text-sm font-medium mb-2 block text-neutral-500 mx-0 my-[20px]">Select Date</Label>
              <Calendar 
                mode="single" 
                selected={selectedDate} 
                onSelect={date => date && setSelectedDate(date)} 
                className="rounded-md border w-full bg-mental-peach scale-150 origin-top-left transform mx-auto" 
              />
            </div>
            
            <div className="space-y-3 pt-4 border-t bg-mental-peach">
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
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
          <CardHeader className="bg-mental-peach">
            <CardTitle className="text-lg text-neutral-500">Schedule Views</CardTitle>
          </CardHeader>
          <CardContent className="bg-mental-peach">
            <Tabs defaultValue="day" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-mental-gray">
                <TabsTrigger value="day" className="text-neutral-500">Day</TabsTrigger>
                <TabsTrigger value="week" className="text-neutral-500">Week</TabsTrigger>
                <TabsTrigger value="month" className="text-neutral-500">Month</TabsTrigger>
                <TabsTrigger value="year" className="text-neutral-500">Year</TabsTrigger>
              </TabsList>
              
              <TabsContent value="day" className="mt-4">
                <DailySchedule selectedDate={selectedDate} events={events.filter(event => event.date.toDateString() === selectedDate.toDateString())} />
              </TabsContent>
              
              <TabsContent value="week" className="mt-4">
                <WeeklyView selectedDate={selectedDate} events={events} />
              </TabsContent>
              
              <TabsContent value="month" className="mt-4">
                <MonthlyView selectedDate={selectedDate} events={events} />
              </TabsContent>
              
              <TabsContent value="year" className="mt-4">
                <YearlyView selectedDate={selectedDate} events={events} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      </div>
    </SidebarLayout>;
};
export default PlannerPage;