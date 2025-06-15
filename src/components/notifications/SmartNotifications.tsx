
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { StorageManager } from '@/utils/storage';
import { personalizationEngine } from '@/utils/personalizationEngine';
import { Bell, Clock, Brain, Settings, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

interface SmartNotification {
  id: string;
  type: 'mood_check' | 'mindfulness_reminder' | 'journal_prompt' | 'break_reminder' | 'achievement_celebration';
  title: string;
  message: string;
  triggerConditions: {
    timeOfDay?: string;
    moodPattern?: string;
    inactivityPeriod?: number; // hours
    streakMilestone?: number;
  };
  enabled: boolean;
  priority: 'low' | 'medium' | 'high';
  lastSent?: string;
  frequency: 'once' | 'daily' | 'weekly' | 'conditional';
}

interface NotificationSettings {
  enabled: boolean;
  quietHours: {
    start: string;
    end: string;
  };
  maxPerDay: number;
  adaptiveScheduling: boolean;
  contextAwareness: boolean;
}

const SmartNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    quietHours: { start: '22:00', end: '08:00' },
    maxPerDay: 5,
    adaptiveScheduling: true,
    contextAwareness: true
  });
  const [pendingNotifications, setPendingNotifications] = useState<SmartNotification[]>([]);

  useEffect(() => {
    loadNotifications();
    loadSettings();
    generateSmartNotifications();
  }, []);

  const loadNotifications = () => {
    const saved = StorageManager.load<SmartNotification[]>('smart_notifications', []);
    setNotifications(saved);
  };

  const loadSettings = () => {
    const saved = StorageManager.load<NotificationSettings>('notification_settings', settings);
    setSettings(saved);
  };

  const saveNotifications = (newNotifications: SmartNotification[]) => {
    setNotifications(newNotifications);
    StorageManager.save('smart_notifications', newNotifications);
  };

  const saveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    StorageManager.save('notification_settings', newSettings);
  };

  const generateSmartNotifications = () => {
    const userBehavior = personalizationEngine.getUserBehavior();
    const moodEntries = StorageManager.load('mood_entries', []);
    const lastActivity = moodEntries.length > 0 ? moodEntries[0].timestamp : Date.now();
    const hoursInactive = (Date.now() - lastActivity) / (1000 * 60 * 60);

    const smartNotifications: SmartNotification[] = [
      {
        id: 'morning_mood_check',
        type: 'mood_check',
        title: 'Good Morning! 🌅',
        message: 'How are you feeling today? Take a moment to check in with yourself.',
        triggerConditions: { timeOfDay: '09:00' },
        enabled: true,
        priority: 'medium',
        frequency: 'daily'
      },
      {
        id: 'afternoon_mindfulness',
        type: 'mindfulness_reminder',
        title: 'Midday Mindfulness 🧘‍♀️',
        message: 'Take a few minutes for a breathing exercise to reset your afternoon.',
        triggerConditions: { timeOfDay: '14:00' },
        enabled: userBehavior?.mostUsedFeatures.includes('mindfulness') ?? true,
        priority: 'low',
        frequency: 'daily'
      },
      {
        id: 'evening_reflection',
        type: 'journal_prompt',
        title: 'Evening Reflection ✨',
        message: 'What was meaningful about your day? Consider writing about it.',
        triggerConditions: { timeOfDay: '20:00' },
        enabled: true,
        priority: 'medium',
        frequency: 'daily'
      },
      {
        id: 'inactivity_gentle_nudge',
        type: 'mood_check',
        title: 'We miss you! 💙',
        message: 'It\'s been a while since your last check-in. How are you doing?',
        triggerConditions: { inactivityPeriod: 72 },
        enabled: true,
        priority: 'high',
        frequency: 'conditional'
      },
      {
        id: 'streak_celebration',
        type: 'achievement_celebration',
        title: 'Amazing streak! 🔥',
        message: 'You\'re on a roll with your daily check-ins. Keep up the great work!',
        triggerConditions: { streakMilestone: 7 },
        enabled: true,
        priority: 'high',
        frequency: 'conditional'
      }
    ];

    // Filter based on user behavior and context
    const contextualNotifications = smartNotifications.filter(notification => {
      if (!notification.enabled) return false;
      
      // Check if conditions are met
      if (notification.triggerConditions.inactivityPeriod) {
        return hoursInactive >= notification.triggerConditions.inactivityPeriod;
      }
      
      if (notification.triggerConditions.timeOfDay) {
        const now = new Date();
        const triggerTime = notification.triggerConditions.timeOfDay;
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        // Check if we're within 30 minutes of trigger time
        const trigger = new Date(`2000-01-01 ${triggerTime}`);
        const current = new Date(`2000-01-01 ${currentTime}`);
        const diffMinutes = Math.abs(trigger.getTime() - current.getTime()) / (1000 * 60);
        
        return diffMinutes <= 30;
      }
      
      return true;
    });

    if (notifications.length === 0) {
      saveNotifications(smartNotifications);
    }
    
    setPendingNotifications(contextualNotifications.slice(0, settings.maxPerDay));
  };

  const toggleNotification = (id: string) => {
    const updated = notifications.map(notification =>
      notification.id === id 
        ? { ...notification, enabled: !notification.enabled }
        : notification
    );
    saveNotifications(updated);
  };

  const updateSettings = (key: keyof NotificationSettings, value: any) => {
    const updated = { ...settings, [key]: value };
    saveSettings(updated);
  };

  const sendTestNotification = () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Mental Health App', {
          body: 'This is a test notification from your wellness companion!',
          icon: '/favicon.ico'
        });
        toast.success('Test notification sent!');
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            sendTestNotification();
          } else {
            toast.error('Notification permission denied');
          }
        });
      } else {
        toast.error('Notifications are disabled in your browser');
      }
    } else {
      toast.error('Notifications not supported in this browser');
    }
  };

  const scheduleNotifications = () => {
    if (!settings.enabled) return;
    
    // In a real app, this would integrate with a background service
    // For demo purposes, we'll show how notifications would be scheduled
    toast.success(`${pendingNotifications.length} smart notifications scheduled based on your patterns!`);
  };

  const isInQuietHours = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const start = settings.quietHours.start;
    const end = settings.quietHours.end;
    
    if (start > end) {
      // Quiet hours span midnight
      return currentTime >= start || currentTime <= end;
    } else {
      return currentTime >= start && currentTime <= end;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5" style={{color: '#737373'}} />
          <h3 className="text-xl font-semibold" style={{color: '#737373'}}>Smart Notifications</h3>
        </div>
        
        <p className="mb-4" style={{color: '#737373'}}>
          Context-aware reminders that adapt to your behavior patterns and preferences
        </p>

        {/* Notification Settings */}
        <Card className="p-4 mb-6 bg-mental-blue/20">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-4 w-4" style={{color: '#737373'}} />
            <h4 className="font-semibold" style={{color: '#737373'}}>Settings</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label style={{color: '#737373'}}>Enable Smart Notifications</Label>
                <p className="text-xs text-gray-500">Turn on adaptive notifications</p>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) => updateSettings('enabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label style={{color: '#737373'}}>Adaptive Scheduling</Label>
                <p className="text-xs text-gray-500">Learn your optimal notification times</p>
              </div>
              <Switch
                checked={settings.adaptiveScheduling}
                onCheckedChange={(checked) => updateSettings('adaptiveScheduling', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label style={{color: '#737373'}}>Context Awareness</Label>
                <p className="text-xs text-gray-500">Adjust based on your mood patterns</p>
              </div>
              <Switch
                checked={settings.contextAwareness}
                onCheckedChange={(checked) => updateSettings('contextAwareness', checked)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block" style={{color: '#737373'}}>Quiet Hours Start</Label>
                <Input
                  type="time"
                  value={settings.quietHours.start}
                  onChange={(e) => updateSettings('quietHours', { ...settings.quietHours, start: e.target.value })}
                />
              </div>
              <div>
                <Label className="mb-2 block" style={{color: '#737373'}}>Quiet Hours End</Label>
                <Input
                  type="time"
                  value={settings.quietHours.end}
                  onChange={(e) => updateSettings('quietHours', { ...settings.quietHours, end: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block" style={{color: '#737373'}}>Max Notifications Per Day</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={settings.maxPerDay}
                onChange={(e) => updateSettings('maxPerDay', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={sendTestNotification} variant="outline" size="sm">
              <Smartphone className="h-4 w-4 mr-2" />
              Test Notification
            </Button>
            <Button onClick={scheduleNotifications} size="sm">
              <Brain className="h-4 w-4 mr-2" />
              Schedule Smart Reminders
            </Button>
          </div>
        </Card>

        {/* Current Status */}
        <div className="mb-6 p-4 bg-mental-peach/20 rounded-lg">
          <h4 className="font-semibold mb-2" style={{color: '#737373'}}>Current Status</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold" style={{color: '#737373'}}>
                {settings.enabled ? 'ON' : 'OFF'}
              </div>
              <div className="text-xs" style={{color: '#737373'}}>Notifications</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold" style={{color: '#737373'}}>
                {pendingNotifications.length}
              </div>
              <div className="text-xs" style={{color: '#737373'}}>Pending</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold" style={{color: '#737373'}}>
                {isInQuietHours() ? 'QUIET' : 'ACTIVE'}
              </div>
              <div className="text-xs" style={{color: '#737373'}}>Current Mode</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold" style={{color: '#737373'}}>
                {settings.maxPerDay}
              </div>
              <div className="text-xs" style={{color: '#737373'}}>Daily Limit</div>
            </div>
          </div>
        </div>

        {/* Notification Types */}
        <div>
          <h4 className="font-semibold mb-4" style={{color: '#737373'}}>Notification Types</h4>
          <div className="space-y-3">
            {notifications.map(notification => (
              <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-medium" style={{color: '#737373'}}>{notification.title}</h5>
                    <Badge variant={notification.priority === 'high' ? 'destructive' : notification.priority === 'medium' ? 'default' : 'secondary'}>
                      {notification.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {notification.frequency}
                    </Badge>
                  </div>
                  <p className="text-sm" style={{color: '#737373'}}>{notification.message}</p>
                  {notification.triggerConditions.timeOfDay && (
                    <p className="text-xs text-gray-500 mt-1">
                      <Clock className="h-3 w-3 inline mr-1" />
                      Triggers at {notification.triggerConditions.timeOfDay}
                    </p>
                  )}
                </div>
                <Switch
                  checked={notification.enabled}
                  onCheckedChange={() => toggleNotification(notification.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SmartNotifications;
