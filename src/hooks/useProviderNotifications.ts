import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  provider_id: string;
  patient_id: string | null;
  title: string;
  message: string;
  type: 'general' | 'reminder' | 'appointment' | 'wellness_check';
  priority: 'low' | 'medium' | 'high';
  action_url: string | null;
  scheduled_at: string | null;
  sent_at: string | null;
  read_at: string | null;
  created_at: string;
  status: 'pending' | 'sent' | 'read' | 'cancelled';
}

export interface CreateNotificationData {
  patient_id?: string | null;
  title: string;
  message: string;
  type: Notification['type'];
  priority: Notification['priority'];
  action_url?: string;
  scheduled_at?: string | null;
}

export function useProviderNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { user, isProvider } = useAuth();

  const fetchNotifications = async () => {
    if (!user || !isProvider) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      // Type assertion since Supabase types may not be updated yet
      setNotifications((data || []) as unknown as Notification[]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user, isProvider]);

  const sendNotification = async (data: CreateNotificationData): Promise<boolean> => {
    if (!user || !isProvider) {
      toast.error('You must be a provider to send notifications');
      return false;
    }

    setSending(true);
    try {
      const notificationData = {
        provider_id: user.id,
        patient_id: data.patient_id || null,
        title: data.title,
        message: data.message,
        type: data.type,
        priority: data.priority,
        action_url: data.action_url || null,
        scheduled_at: data.scheduled_at || null,
        status: data.scheduled_at ? 'pending' : 'sent',
        sent_at: data.scheduled_at ? null : new Date().toISOString(),
      };

      const { error } = await supabase
        .from('notifications')
        .insert(notificationData);

      if (error) throw error;

      toast.success(data.scheduled_at ? 'Notification scheduled!' : 'Notification sent!');
      await fetchNotifications();
      return true;
    } catch (error: any) {
      console.error('Error sending notification:', error);
      toast.error(error.message || 'Failed to send notification');
      return false;
    } finally {
      setSending(false);
    }
  };

  const sendBulkNotifications = async (
    patientIds: string[],
    data: Omit<CreateNotificationData, 'patient_id'>
  ): Promise<boolean> => {
    if (!user || !isProvider) {
      toast.error('You must be a provider to send notifications');
      return false;
    }

    setSending(true);
    try {
      const notifications = patientIds.map(patientId => ({
        provider_id: user.id,
        patient_id: patientId,
        title: data.title,
        message: data.message,
        type: data.type,
        priority: data.priority,
        action_url: data.action_url || null,
        scheduled_at: data.scheduled_at || null,
        status: data.scheduled_at ? 'pending' : 'sent',
        sent_at: data.scheduled_at ? null : new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) throw error;

      toast.success(`${patientIds.length} notifications ${data.scheduled_at ? 'scheduled' : 'sent'}!`);
      await fetchNotifications();
      return true;
    } catch (error: any) {
      console.error('Error sending bulk notifications:', error);
      toast.error(error.message || 'Failed to send notifications');
      return false;
    } finally {
      setSending(false);
    }
  };

  const cancelNotification = async (notificationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ status: 'cancelled' })
        .eq('id', notificationId);

      if (error) throw error;

      toast.success('Notification cancelled');
      await fetchNotifications();
      return true;
    } catch (error: any) {
      console.error('Error cancelling notification:', error);
      toast.error('Failed to cancel notification');
      return false;
    }
  };

  const deleteNotification = async (notificationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      toast.success('Notification deleted');
      await fetchNotifications();
      return true;
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
      return false;
    }
  };

  return {
    notifications,
    loading,
    sending,
    sendNotification,
    sendBulkNotifications,
    cancelNotification,
    deleteNotification,
    refresh: fetchNotifications,
  };
}
