
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send, Bell, Users, User } from 'lucide-react';
import { pushNotificationService, PushNotification } from '@/services/pushNotificationService';
import { toast } from 'sonner';

const NotificationSender: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<PushNotification['type']>('general');
  const [priority, setPriority] = useState<PushNotification['priority']>('medium');
  const [targetPatient, setTargetPatient] = useState<string>('all');
  const [customPatientId, setCustomPatientId] = useState('');
  const [actionUrl, setActionUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Title and message are required');
      return;
    }

    setIsLoading(true);
    
    try {
      const notification = await pushNotificationService.sendNotification({
        title: title.trim(),
        message: message.trim(),
        type,
        priority,
        fromProvider: 'Dr. Smith', // In real app, get from auth context
        toPatient: targetPatient === 'all' ? undefined : (targetPatient === 'custom' ? customPatientId : targetPatient),
        actionUrl: actionUrl.trim() || undefined
      });

      toast.success('Notification sent successfully!');
      
      // Reset form
      setTitle('');
      setMessage('');
      setType('general');
      setPriority('medium');
      setTargetPatient('all');
      setCustomPatientId('');
      setActionUrl('');
    } catch (error) {
      toast.error('Failed to send notification');
    } finally {
      setIsLoading(false);
    }
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

  return (
    <Card className="bg-mental-blue">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#7e868b]">
          <Send className="h-5 w-5" />
          Send Push Notification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-[#7e868b]">Title</label>
          <Input
            placeholder="Notification title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
          />
          <div className="text-xs text-gray-500 mt-1">{title.length}/50 characters</div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-[#7e868b]">Message</label>
          <Textarea
            placeholder="Notification message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={200}
          />
          <div className="text-xs text-gray-500 mt-1">{message.length}/200 characters</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#7e868b]">Type</label>
            <Select value={type} onValueChange={(value: PushNotification['type']) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="appointment">Appointment</SelectItem>
                <SelectItem value="wellness_check">Wellness Check</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#7e868b]">Priority</label>
            <Select value={priority} onValueChange={(value: PushNotification['priority']) => setPriority(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-[#7e868b]">Target Audience</label>
          <Select value={targetPatient} onValueChange={setTargetPatient}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patients</SelectItem>
              <SelectItem value="user123">John Doe (user123)</SelectItem>
              <SelectItem value="user456">Jane Smith (user456)</SelectItem>
              <SelectItem value="custom">Custom Patient ID</SelectItem>
            </SelectContent>
          </Select>
          
          {targetPatient === 'custom' && (
            <Input
              placeholder="Enter patient ID..."
              value={customPatientId}
              onChange={(e) => setCustomPatientId(e.target.value)}
              className="mt-2"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-[#7e868b]">Action URL (Optional)</label>
          <Input
            placeholder="https://... (optional link for notification)"
            value={actionUrl}
            onChange={(e) => setActionUrl(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Badge className={getTypeColor(type)}>{type}</Badge>
          <Badge className={getPriorityColor(priority)}>{priority}</Badge>
          {targetPatient === 'all' ? (
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              All Patients
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {targetPatient === 'custom' ? customPatientId || 'Custom ID' : targetPatient}
            </Badge>
          )}
        </div>

        <Button 
          onClick={handleSendNotification}
          disabled={isLoading || !title.trim() || !message.trim()}
          className="w-full bg-mental-gray hover:bg-mental-gray/80"
        >
          {isLoading ? (
            'Sending...'
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Notification
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSender;
