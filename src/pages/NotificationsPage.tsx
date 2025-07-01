
import React from 'react';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import NotificationInbox from '@/components/notifications/NotificationInbox';
import SmartNotifications from '@/components/notifications/SmartNotifications';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Settings } from 'lucide-react';

const NotificationsPage = () => {
  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-[#737373]">Notifications</h1>
          <p className="text-[#737373]">Manage your notifications and preferences</p>
        </div>

        <Tabs defaultValue="inbox" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-mental-blue">
            <TabsTrigger value="inbox" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Inbox
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="space-y-6">
            <NotificationInbox />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SmartNotifications />
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default NotificationsPage;
