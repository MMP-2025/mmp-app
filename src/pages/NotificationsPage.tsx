
import React from 'react';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import NotificationInbox from '@/components/notifications/NotificationInbox';
import SmartNotifications from '@/components/notifications/SmartNotifications';
import PushNotificationToggle from '@/components/notifications/PushNotificationToggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Settings } from 'lucide-react';
import { PageTransition } from '@/components/ui/animated';

const NotificationsPage = () => {
  return (
    <SidebarLayout>
      <PageTransition>
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <h1 className="text-2xl font-merriweather font-bold mb-1 text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground">Manage your notifications and preferences</p>
          </div>

          <Tabs defaultValue="inbox" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-mental-blue">
              <TabsTrigger value="inbox" className="flex items-center gap-2 min-h-[44px]">
                <Bell className="h-4 w-4" />
                Inbox
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 min-h-[44px]">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inbox" className="space-y-6">
              <NotificationInbox />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <PushNotificationToggle />
              <SmartNotifications />
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </SidebarLayout>
  );
};

export default NotificationsPage;
