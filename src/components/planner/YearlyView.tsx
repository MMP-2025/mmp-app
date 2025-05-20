
import React from 'react';
import { format, setMonth, isSameMonth } from 'date-fns';

interface YearlyViewProps {
  selectedDate: Date;
  events: Array<{id: string, title: string, date: Date, time: string}>;
}

export const YearlyView: React.FC<YearlyViewProps> = ({ selectedDate, events }) => {
  const months = Array.from({ length: 12 }, (_, i) => setMonth(new Date(selectedDate), i));
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium">
        {format(selectedDate, 'yyyy')}
      </h3>
      
      <div className="grid grid-cols-3 gap-4">
        {months.map((month, index) => {
          const monthEvents = events.filter(event => 
            event.date.getMonth() === month.getMonth() && 
            event.date.getFullYear() === month.getFullYear()
          );
          
          const isCurrentMonth = isSameMonth(month, new Date());
          
          return (
            <div 
              key={index} 
              className={`p-3 rounded-lg ${
                isCurrentMonth ? 'bg-mental-blue/20 border border-mental-blue' : 'bg-muted/10'
              }`}
            >
              <h4 className={`text-center mb-2 ${isCurrentMonth ? 'font-bold' : ''}`}>
                {format(month, 'MMMM')}
              </h4>
              
              <div className="text-sm">
                <div className="flex justify-between items-center">
                  <span>Events:</span>
                  <span className="font-medium">{monthEvents.length}</span>
                </div>
                
                {monthEvents.length > 0 && (
                  <div className="mt-2 text-xs space-y-1">
                    <div className="font-medium">Top days:</div>
                    {/* Group events by day and show top 3 days */}
                    {Object.entries(
                      monthEvents.reduce((acc, event) => {
                        const day = format(event.date, 'd');
                        acc[day] = (acc[day] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    )
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3)
                      .map(([day, count]) => (
                        <div key={day} className="flex justify-between">
                          <span>{day}</span>
                          <span>{count} event{count !== 1 ? 's' : ''}</span>
                        </div>
                      ))}
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
