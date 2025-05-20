
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

const PlannerPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('12:00');
  const [events, setEvents] = useState<Array<{id: string, title: string, date: Date, time: string}>>([]);
  
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Planner</h1>
        <p className="text-muted-foreground">Organize your schedule and plan your activities</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="p-3 pointer-events-auto"
            />
            
            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Add New Event</h3>
              <div className="space-y-2">
                <Label htmlFor="event-title">Event Title</Label>
                <Input 
                  id="event-title" 
                  placeholder="Enter event title" 
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-time">Time</Label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="event-time" 
                    type="time" 
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                className="w-full"
                onClick={handleAddEvent}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Event
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Schedule View</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="day" className="w-full">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
              
              <TabsContent value="day" className="mt-4">
                <DailySchedule 
                  selectedDate={selectedDate} 
                  events={events.filter(event => 
                    event.date.toDateString() === selectedDate.toDateString()
                  )}
                />
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
  );
};

export default PlannerPage;
