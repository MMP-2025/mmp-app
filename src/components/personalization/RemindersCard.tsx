
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdaptiveReminder } from '@/types/personalization';

interface RemindersCardProps {
  adaptiveReminders: AdaptiveReminder[];
}

const RemindersCard: React.FC<RemindersCardProps> = ({ adaptiveReminders }) => {
  return (
    <Card className="p-6 bg-white/90">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-5 w-5 text-mental-blue" />
        <h3 className="text-lg font-semibold text-neutral-500">
          Smart Reminders
        </h3>
      </div>
      <div className="space-y-3">
        {adaptiveReminders.slice(0, 2).map(reminder => (
          <div key={reminder.id} className="flex items-center justify-between p-3 bg-mental-green/20 rounded-md">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-neutral-500" />
              <div>
                <div className="font-medium text-neutral-500">
                  {reminder.optimalTime}
                </div>
                <div className="text-sm text-neutral-500">
                  {reminder.message}
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {reminder.frequency}
            </Badge>
          </div>
        ))}
      </div>
      <Button asChild className="w-full mt-4" variant="outline">
        <Link to="/reminders">
          Manage All Reminders
        </Link>
      </Button>
    </Card>
  );
};

export default RemindersCard;
