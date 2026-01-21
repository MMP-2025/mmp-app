import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, Trash2, XCircle, Users, User, Loader2, Clock, Check, Bell } from 'lucide-react';
import { useProviderNotifications, type Notification } from '@/hooks/useProviderNotifications';
import { useProviderPatients } from '@/hooks/useProviderPatients';
import { format } from 'date-fns';

const NotificationHistory: React.FC = () => {
  const { notifications, loading, cancelNotification, deleteNotification } = useProviderNotifications();
  const { patients } = useProviderPatients();

  const getPatientName = (patientId: string | null) => {
    if (!patientId) return 'All Patients';
    const patient = patients.find(p => p.id === patientId);
    return patient?.name || 'Unknown Patient';
  };

  const getStatusBadge = (status: Notification['status']) => {
    const styles: Record<Notification['status'], string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-blue-100 text-blue-800',
      read: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-500',
    };

    const icons: Record<Notification['status'], React.ReactNode> = {
      pending: <Clock className="h-3 w-3" />,
      sent: <Bell className="h-3 w-3" />,
      read: <Check className="h-3 w-3" />,
      cancelled: <XCircle className="h-3 w-3" />,
    };

    return (
      <Badge className={`${styles[status]} flex items-center gap-1`}>
        {icons[status]}
        {status}
      </Badge>
    );
  };

  const getTypeBadge = (type: Notification['type']) => {
    const colors: Record<Notification['type'], string> = {
      reminder: 'bg-blue-50 text-blue-700 border-blue-200',
      appointment: 'bg-green-50 text-green-700 border-green-200',
      wellness_check: 'bg-purple-50 text-purple-700 border-purple-200',
      general: 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return <Badge variant="outline" className={colors[type]}>{type.replace('_', ' ')}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Notification History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No notifications sent yet.</p>
            <p className="text-sm">Use the form above to send your first notification.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border ${
                  notification.status === 'cancelled' ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-medium truncate">{notification.title}</h4>
                      {getStatusBadge(notification.status)}
                      {getTypeBadge(notification.type)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {notification.patient_id ? <User className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                        {getPatientName(notification.patient_id)}
                      </span>
                      <span>
                        {notification.scheduled_at && notification.status === 'pending' 
                          ? `Scheduled: ${format(new Date(notification.scheduled_at), 'MMM d, yyyy h:mm a')}`
                          : notification.sent_at
                            ? `Sent: ${format(new Date(notification.sent_at), 'MMM d, yyyy h:mm a')}`
                            : `Created: ${format(new Date(notification.created_at), 'MMM d, yyyy h:mm a')}`
                        }
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {notification.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => cancelNotification(notification.id)}
                        title="Cancel notification"
                      >
                        <XCircle className="h-4 w-4 text-orange-500" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                      title="Delete notification"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationHistory;
