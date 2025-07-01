
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Trash2, ExternalLink, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { pushNotificationService, PushNotification } from '@/services/pushNotificationService';
import { toast } from 'sonner';

// Mock current user ID - in real app, this would come from auth context
const CURRENT_USER_ID = 'user123';

const NotificationInbox: React.FC = () => {
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | PushNotification['type']>('all');

  useEffect(() => {
    const unsubscribe = pushNotificationService.subscribe((allNotifications) => {
      const patientNotifications = pushNotificationService.getNotificationsForPatient(CURRENT_USER_ID);
      setNotifications(patientNotifications);
    });

    return unsubscribe;
  }, []);

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

  const getTypeColor = (type: PushNotification['type']) => {
    const colors = {
      reminder: 'bg-blue-100 text-blue-800',
      appointment: 'bg-green-100 text-green-800',
      wellness_check: 'bg-purple-100 text-purple-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[type];
  };

  const getPriorityColor = (priority: PushNotification['priority']) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const unreadCount = notifications.filter(n => !n.readAt).length;

  return (
    <div className="space-y-4">
      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-[#737373]">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
            <Filter className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Select value={filter} onValueChange={(value: 'all' | 'unread' | 'read') => setFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={(value: 'all' | PushNotification['type']) => setTypeFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="reminder">Reminders</SelectItem>
                <SelectItem value="appointment">Appointments</SelectItem>
                <SelectItem value="wellness_check">Wellness Checks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h4 className="text-lg font-semibold mb-2 text-[#737373]">No notifications</h4>
              <p className="text-gray-500">
                {filter === 'unread' ? "You're all caught up!" : 'No notifications match your filters'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map(notification => (
                <Card 
                  key={notification.id} 
                  className={`${notification.readAt ? 'bg-gray-50' : 'bg-white border-l-4 border-l-blue-500'}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className={`font-medium ${notification.readAt ? 'text-gray-600' : 'text-[#737373] font-semibold'}`}>
                            {notification.title}
                          </h4>
                          <Badge className={getTypeColor(notification.type)} size="sm">
                            {notification.type}
                          </Badge>
                          <Badge className={getPriorityColor(notification.priority)} size="sm">
                            {notification.priority}
                          </Badge>
                        </div>
                        
                        <p className={`text-sm mb-2 ${notification.readAt ? 'text-gray-500' : 'text-[#737373]'}`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-400">
                            From: {notification.fromProvider} • {formatDate(notification.createdAt)}
                            {notification.readAt && (
                              <span className="ml-2">• Read {formatDate(notification.readAt)}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {notification.actionUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleActionClick(notification.actionUrl!)}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Open
                              </Button>
                            )}
                            
                            {!notification.readAt && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Mark Read
                              </Button>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(notification.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationInbox;
