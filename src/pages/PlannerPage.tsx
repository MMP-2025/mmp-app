import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyView } from '@/components/planner/MonthlyView';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { QuickActionsPanel } from '@/components/planner/QuickActionsPanel';
import { TimeBlockingAssistant } from '@/components/planner/TimeBlockingAssistant';
const PlannerPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Array<{
    id: string;
    title: string;
    date: Date;
    time: string;
  }>>([]);

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
            <QuickActionsPanel onAddEvent={() => {}} />
          </div>

          {/* Monthly View Section */}
          <div className="min-w-0 flex-shrink-0">
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