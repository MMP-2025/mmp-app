
import React from 'react';
import { format } from 'date-fns';

interface DailyScheduleProps {
  selectedDate: Date;
  events: Array<{id: string, title: string, date: Date, time: string}>;
}

export const DailySchedule: React.FC<DailyScheduleProps> = ({ selectedDate, events }) => {
  // Generate time slots for the day (hourly)
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i < 10 ? `0${i}` : `${i}`;
    return `${hour}:00`;
  });

  // Sort events by time
  const sortedEvents = [...events].sort((a, b) => 
    a.time.localeCompare(b.time)
  );

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium">
        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
      </h3>
      
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
              className={`p-2 rounded-md flex ${
                hourEvents.length > 0 ? 'bg-mental-blue/20' : 'bg-muted/20'
              }`}
            >
              <div className="w-16 font-medium">{timeSlot}</div>
              <div className="flex-1">
                {hourEvents.length > 0 ? (
                  <div className="space-y-1">
                    {hourEvents.map(event => (
                      <div key={event.id} className="bg-mental-blue/40 p-2 rounded">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm italic">No events</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
