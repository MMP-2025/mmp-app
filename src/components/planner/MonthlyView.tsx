
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';

interface MonthlyViewProps {
  selectedDate: Date;
  events: Array<{id: string, title: string, date: Date, time: string}>;
}

export const MonthlyView: React.FC<MonthlyViewProps> = ({ selectedDate, events }) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  
  // Get all days in the month
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Create weeks array (2D array representing calendar grid)
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  // Add empty slots for days before the first day of the month
  const firstDayOfMonth = monthStart.getDay();
  for (let i = 0; i < firstDayOfMonth; i++) {
    currentWeek.push(new Date(0)); // placeholder
  }
  
  // Add the days of the month
  daysInMonth.forEach(day => {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  
  // Add empty slots for remaining days to complete the last week
  while (currentWeek.length < 7) {
    currentWeek.push(new Date(0)); // placeholder
  }
  
  // Add the last week if not empty
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium">
        {format(selectedDate, 'MMMM yyyy')}
      </h3>
      
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-medium p-1">{day}</div>
        ))}
      </div>
      
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => {
              const isValidDate = day.getTime() !== 0;
              const isToday = isValidDate && day.toDateString() === new Date().toDateString();
              const isCurrentMonth = isValidDate && isSameMonth(day, selectedDate);
              
              const dayEvents = isValidDate 
                ? events.filter(event => event.date.toDateString() === day.toDateString())
                : [];
              
              return (
                <div 
                  key={dayIndex} 
                  className={`p-1 min-h-[80px] rounded border ${
                    !isValidDate ? 'opacity-0' : 
                    isToday ? 'bg-mental-blue/20 border-mental-blue' : 
                    !isCurrentMonth ? 'opacity-50' : 'bg-muted/10'
                  }`}
                >
                  {isValidDate && (
                    <>
                      <div className={`text-right text-sm ${isToday ? 'font-bold' : ''}`}>
                        {format(day, 'd')}
                      </div>
                      <div className="mt-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div 
                            key={event.id} 
                            className="text-xs bg-mental-blue/30 p-1 mb-1 rounded truncate"
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-center text-muted-foreground">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
