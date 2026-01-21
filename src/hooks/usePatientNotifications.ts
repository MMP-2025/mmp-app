import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Notification } from '@/hooks/useProviderNotifications';

export function usePatientNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isPatient } = useAuth();

  const fetchNotifications = async () => {
    if (!user || !isPatient) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .or(`patient_id.eq.${user.id},patient_id.is.null`)
        .in('status', ['sent', 'read'])
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications((data || []) as unknown as Notification[]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user, isPatient]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          status: 'read',
          read_at: new Date().toISOString() 
        })
        .eq('id', notificationId);

      if (error) throw error;
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => n.status === 'sent').length;

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    refresh: fetchNotifications,
  };
}
