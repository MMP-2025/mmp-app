import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Plus, Clock, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DailySchedule } from '@/components/planner/DailySchedule';
import { WeeklyView } from '@/components/planner/WeeklyView';
import { MonthlyView } from '@/components/planner/MonthlyView';
import { YearlyView } from '@/components/planner/YearlyView';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

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

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link to="/" className="flex items-center gap-2" style={{color: '#737373'}}>
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{color: '#737373'}}>Planner</h1>
          <p style={{color: '#737373'}}>Organize your schedule and plan your activities</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="bg-mental-peach">
            <CardTitle className="text-lg" style={{color: '#737373'}}>Calendar & Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block" style={{color: '#737373'}}>Select Date</Label>
              <Calendar 
                mode="single" 
                selected={selectedDate} 
                onSelect={date => date && setSelectedDate(date)} 
                className="rounded-md border w-full bg-mental-peach" 
              />
            </div>
            
            <div className="space-y-3 pt-4 border-t bg-mental-peach">
              <Label className="text-sm font-medium" style={{color: '#737373'}}>Add New Event</Label>
              <div className="space-y-2">
                <Input 
                  placeholder="Event title" 
                  value={newEventTitle} 
                  onChange={e => setNewEventTitle(e.target.value)} 
                  className="text-sm" 
                  style={{color: '#737373'}}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" style={{color: '#737373'}} />
                  <Input 
                    type="time" 
                    value={newEventTime} 
                    onChange={e => setNewEventTime(e.target.value)} 
                    className="text-sm" 
                    style={{color: '#737373'}}
                  />
                </div>
              </div>
              <Button 
                className="w-full hover:opacity-90" 
                onClick={handleAddEvent} 
                size="sm"
                style={{backgroundColor: '#737373', color: 'white'}}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Event
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader className="bg-mental-peach">
            <CardTitle className="text-lg" style={{color: '#737373'}}>Schedule Views</CardTitle>
          </CardHeader>
          <CardContent className="bg-mental-peach">
            <Tabs defaultValue="day" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="day" style={{color: '#737373'}}>Day</TabsTrigger>
                <TabsTrigger value="week" style={{color: '#737373'}}>Week</TabsTrigger>
                <TabsTrigger value="month" style={{color: '#737373'}}>Month</TabsTrigger>
                <TabsTrigger value="year" style={{color: '#737373'}}>Year</TabsTrigger>
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
  );
};

export default PlannerPage;
