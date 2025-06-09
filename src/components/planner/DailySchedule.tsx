
import React from 'react';
import { format } from 'date-fns';

interface DailyScheduleProps {
  selectedDate: Date;
  events: Array<{id: string, title: string, date: Date, time: string}>;
}

export const DailySchedule: React.FC<DailyScheduleProps> = ({ selectedDate, events }) => {
  // Sort events by time
  const sortedEvents = [...events].sort((a, b) => 
    a.time.localeCompare(b.time)
  );

  // Get unique hours that have events
  const hoursWithEvents = [...new Set(sortedEvents.map(event => {
    const hour = event.time.split(':')[0];
    return hour < '10' ? `0${parseInt(hour)}` : hour;
  }))].sort();

  // Generate time slots only for hours with events
  const timeSlots = hoursWithEvents.map(hour => `${hour}:00`);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium text-foreground">
        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
      </h3>
      
      {timeSlots.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No events scheduled for this day</p>
        </div>
      ) : (
        <div className="space-y-2">
          {timeSlots.map((timeSlot) => {
            const hourEvents = sortedEvents.filter(event => {
              const eventHour = event.time.split(':')[0];
              const slotHour = timeSlot.split(':')[0];
              return eventHour === slotHour;
            });
            
            return (
              <div 
                key={timeSlot} 
                className="p-2 rounded-md flex bg-mental-blue/20"
              >
                <div className="w-16 font-medium text-foreground">{timeSlot}</div>
                <div className="flex-1">
                  <div className="space-y-1">
                    {hourEvents.map(event => (
                      <div key={event.id} className="bg-mental-blue/40 p-2 rounded">
                        <p className="font-medium text-foreground">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
