
import { toast } from 'sonner';

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  fromProvider: string;
  toPatient?: string; // If undefined, sent to all patients
  type: 'reminder' | 'appointment' | 'wellness_check' | 'general';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  readAt?: string;
  actionUrl?: string;
}

class PushNotificationService {
  private notifications: PushNotification[] = [];
  private subscribers: ((notifications: PushNotification[]) => void)[] = [];

  constructor() {
    this.loadNotifications();
    this.requestNotificationPermission();
  }

  private async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Push notifications enabled!');
      }
    }
  }

  private loadNotifications() {
    const saved = localStorage.getItem('push_notifications');
    if (saved) {
      this.notifications = JSON.parse(saved);
    }
  }

  private saveNotifications() {
    localStorage.setItem('push_notifications', JSON.stringify(this.notifications));
    this.notifySubscribers();
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.notifications));
  }

  subscribe(callback: (notifications: PushNotification[]) => void) {
    this.subscribers.push(callback);
    callback(this.notifications);
    
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  async sendNotification(notification: Omit<PushNotification, 'id' | 'createdAt'>) {
    const newNotification: PushNotification = {
      ...notification,
      id: `notification_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();

    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/favicon.ico',
        tag: newNotification.id
      });
    }

    // Show toast notification
    toast.success(`New notification: ${newNotification.title}`);

    return newNotification;
  }

  getNotificationsForPatient(patientId: string): PushNotification[] {
    return this.notifications.filter(n => 
      !n.toPatient || n.toPatient === patientId
    );
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.readAt) {
      notification.readAt = new Date().toISOString();
      this.saveNotifications();
    }
  }

  deleteNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveNotifications();
  }

  getUnreadCount(patientId?: string): number {
    const notifications = patientId 
      ? this.getNotificationsForPatient(patientId)
      : this.notifications;
    
    return notifications.filter(n => !n.readAt).length;
  }
}

export const pushNotificationService = new PushNotificationService();
