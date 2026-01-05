
import React from 'react';
import NotificationSender from '@/components/provider/NotificationSender';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Send, Users, MessageSquare } from 'lucide-react';

const NotificationsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-mental-green">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Total Sent</p>
                <p className="text-2xl font-bold text-foreground">127</p>
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
                <p className="text-2xl font-bold text-foreground">23</p>
              </div>
              <Users className="h-8 w-8 text-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-mental-blue">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Response Rate</p>
                <p className="text-2xl font-bold text-foreground">89%</p>
              </div>
              <MessageSquare className="h-8 w-8 text-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Sender */}
      <NotificationSender />

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
            <h4 className="font-semibold mb-2">Best Practices:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Keep titles under 50 characters for better mobile display</li>
              <li>Write clear, actionable messages</li>
              <li>Use high priority sparingly to maintain effectiveness</li>
              <li>Include action URLs when appropriate for direct engagement</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsTab;
