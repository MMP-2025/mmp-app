
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Bell, FileText, Calendar, Shield } from 'lucide-react';

interface NotificationSettings {
  moodReminders: boolean;
  journalReminders: boolean;
  appointmentReminders: boolean;
  crisisAlerts: boolean;
}

interface NotificationPreferencesCardProps {
  notifications: NotificationSettings;
  onNotificationChange: (field: string, value: boolean) => void;
}

const NotificationPreferencesCard = ({ notifications, onNotificationChange }: NotificationPreferencesCardProps) => {
  const notificationOptions = [
    { key: 'moodReminders', label: 'Mood tracking reminders', icon: Heart },
    { key: 'journalReminders', label: 'Journal writing reminders', icon: FileText },
    { key: 'appointmentReminders', label: 'Appointment reminders', icon: Calendar },
    { key: 'crisisAlerts', label: 'Crisis resource alerts', icon: Shield }
  ];

  return (
    <Card className="bg-mental-blue">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#737373]">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notificationOptions.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-center justify-between p-3 border rounded-lg border-[#737373]">
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-[#737373]" />
              <span className="text-[#737373]">{label}</span>
            </div>
            <Button
              variant={notifications[key as keyof NotificationSettings] ? "default" : "outline"}
              size="sm"
              onClick={() => onNotificationChange(key, !notifications[key as keyof NotificationSettings])}
            >
              {notifications[key as keyof NotificationSettings] ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NotificationPreferencesCard;
