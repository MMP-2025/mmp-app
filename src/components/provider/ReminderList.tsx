
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Trash2 } from 'lucide-react';
import { Reminder } from '@/types/provider';

interface ReminderListProps {
  reminders: Reminder[];
  onDeleteReminder: (id: string) => void;
}
const ReminderList: React.FC<ReminderListProps> = ({
  reminders,
  onDeleteReminder
}) => {
  return <Card>
      <CardHeader className="bg-mental-blue">
        <CardTitle className="flex items-center gap-2 text-[#7e868b]">
          <Bell className="h-5 w-5" />
          Saved Reminders ({reminders.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-mental-blue">
        {reminders.length === 0 ? <p className="text-gray-500 text-center py-8">No reminders added yet</p> : <div className="space-y-3">
            {reminders.map(reminder => <div key={reminder.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 mb-2">{reminder.message}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                        {reminder.frequency}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {reminder.time}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onDeleteReminder(reminder.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>)}
          </div>}
      </CardContent>
    </Card>;
};
export default ReminderList;
