import React from 'react';
import NotificationSender from '@/components/provider/NotificationSender';
import NotificationHistory from '@/components/provider/NotificationHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Send, Users, MessageSquare, Clock } from 'lucide-react';
import { useProviderNotifications } from '@/hooks/useProviderNotifications';
import { useProviderPatients } from '@/hooks/useProviderPatients';

const NotificationsTab: React.FC = () => {
  const { notifications, loading: notificationsLoading } = useProviderNotifications();
  const { patients, loading: patientsLoading } = useProviderPatients();

  const totalSent = notifications.filter(n => n.status === 'sent' || n.status === 'read').length;
  const pendingScheduled = notifications.filter(n => n.status === 'pending' && n.scheduled_at).length;
  const readCount = notifications.filter(n => n.status === 'read').length;
  const readRate = totalSent > 0 ? Math.round((readCount / totalSent) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-mental-green">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Total Sent</p>
                <p className="text-2xl font-bold text-foreground">
                  {notificationsLoading ? '...' : totalSent}
                </p>
              </div>
              <Send className="h-8 w-8 text-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-mental-peach">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Active Patients</p>
                <p className="text-2xl font-bold text-foreground">
                  {patientsLoading ? '...' : patients.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-mental-gray">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Scheduled</p>
                <p className="text-2xl font-bold text-foreground">
                  {notificationsLoading ? '...' : pendingScheduled}
                </p>
              </div>
              <Clock className="h-8 w-8 text-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-mental-blue">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Read Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {notificationsLoading ? '...' : `${readRate}%`}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Sender */}
      <NotificationSender />

      {/* Notification History */}
      <NotificationHistory />

      {/* Instructions */}
      <Card className="bg-mental-gray">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Bell className="h-5 w-5" />
            Push Notification Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground">
          <div>
            <h4 className="font-semibold mb-2">Notification Types:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>General:</strong> General announcements and updates</li>
              <li><strong>Reminder:</strong> Medication, appointment, or activity reminders</li>
              <li><strong>Appointment:</strong> Upcoming appointments and scheduling changes</li>
              <li><strong>Wellness Check:</strong> Mental health check-ins and support</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Priority Levels:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Low:</strong> Optional information, sent during normal hours</li>
              <li><strong>Medium:</strong> Important reminders and updates</li>
              <li><strong>High:</strong> Urgent notifications that bypass quiet hours</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">New Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Bulk Send:</strong> Select multiple patients to send the same notification</li>
              <li><strong>Scheduling:</strong> Schedule notifications for a future date and time</li>
              <li><strong>Specific Targeting:</strong> Send to all patients, specific patient, or selected group</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsTab;
