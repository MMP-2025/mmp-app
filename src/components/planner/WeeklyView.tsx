
import React from 'react';
import { format, startOfWeek, addDays } from 'date-fns';

interface WeeklyViewProps {
  selectedDate: Date;
  events: Array<{id: string, title: string, date: Date, time: string}>;
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({ selectedDate, events }) => {
  // Get the start of the week for the selected date
  const startDate = startOfWeek(selectedDate, { weekStartsOn: 0 });
  
  // Generate array of days in the week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium">
        Week of {format(startDate, 'MMMM d, yyyy')}
      </h3>
      
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const dayEvents = events.filter(
            event => event.date.toDateString() === day.toDateString()
          );
          
          return (
            <div key={index} className="space-y-2">
              <div className={`text-center p-2 rounded-md ${
                day.toDateString() === new Date().toDateString() 
                  ? 'bg-mental-blue font-bold text-white' 
                  : 'bg-muted/30'
              }`}>
                <div>{format(day, 'EEE')}</div>
                <div>{format(day, 'd')}</div>
              </div>
              
              <div className="min-h-[100px] bg-muted/10 p-2 rounded-md">
                {dayEvents.length > 0 ? (
                  <div className="space-y-1 text-xs">
                    {dayEvents.slice(0, 3).map(event => (
                      <div key={event.id} className="bg-mental-blue/20 p-1 rounded truncate">
                        {event.time} - {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-center text-muted-foreground">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-xs text-muted-foreground italic mt-2">
                    No events
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
