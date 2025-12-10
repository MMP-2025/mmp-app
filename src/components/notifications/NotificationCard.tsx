
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PushNotification } from '@/services/pushNotificationService';
import NotificationActions from './NotificationActions';

interface NotificationCardProps {
  notification: PushNotification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onActionClick: (url: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  onActionClick
}) => {
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

  return (
    <Card 
      className={`${notification.readAt ? 'bg-gray-50' : 'bg-white border-l-4 border-l-blue-500'}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className={`font-medium ${notification.readAt ? 'text-muted-foreground/70' : 'text-muted-foreground font-semibold'}`}>
                {notification.title}
              </h4>
              <Badge className={getTypeColor(notification.type)}>
                {notification.type}
              </Badge>
              <Badge className={getPriorityColor(notification.priority)}>
                {notification.priority}
              </Badge>
            </div>
            
            <p className={`text-sm mb-2 ${notification.readAt ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
              {notification.message}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground/60">
                From: {notification.fromProvider} • {formatDate(notification.createdAt)}
                {notification.readAt && (
                  <span className="ml-2">• Read {formatDate(notification.readAt)}</span>
                )}
              </div>
              
              <NotificationActions
                notificationId={notification.id}
                isRead={!!notification.readAt}
                actionUrl={notification.actionUrl}
                onMarkAsRead={onMarkAsRead}
                onDelete={onDelete}
                onActionClick={onActionClick}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
