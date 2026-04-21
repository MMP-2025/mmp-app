
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Filter } from 'lucide-react';
import { pushNotificationService, PushNotification } from '@/services/pushNotificationService';
import { toast } from 'sonner';
import NotificationFilters from './NotificationFilters';
import NotificationCard from './NotificationCard';
import EmptyNotificationState from './EmptyNotificationState';
import { useAuth } from '@/contexts/AuthContext';

const NotificationInbox: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | PushNotification['type']>('all');

  useEffect(() => {
    if (!user?.id) return;
    const unsubscribe = pushNotificationService.subscribe((allNotifications) => {
      const patientNotifications = pushNotificationService.getNotificationsForPatient(user.id);
      setNotifications(patientNotifications);
    });

    return unsubscribe;
  }, [user?.id]);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread' && notification.readAt) return false;
    if (filter === 'read' && !notification.readAt) return false;
    if (typeFilter !== 'all' && notification.type !== typeFilter) return false;
    return true;
  });

  const handleMarkAsRead = (notificationId: string) => {
    pushNotificationService.markAsRead(notificationId);
    toast.success('Marked as read');
  };

  const handleDelete = (notificationId: string) => {
    pushNotificationService.deleteNotification(notificationId);
    toast.success('Notification deleted');
  };

  const handleActionClick = (url: string) => {
    window.open(url, '_blank');
  };

  const unreadCount = notifications.filter(n => !n.readAt).length;

  return (
    <div className="space-y-4">
      <Card className="shadow-card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-foreground">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationFilters
            filter={filter}
            setFilter={setFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
          />

          {filteredNotifications.length === 0 ? (
            <EmptyNotificationState filter={filter} />
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification, i) => (
                <div
                  key={notification.id}
                  className="opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <NotificationCard
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                    onActionClick={handleActionClick}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationInbox;
