
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PushNotification } from '@/services/pushNotificationService';

interface NotificationFiltersProps {
  filter: 'all' | 'unread' | 'read';
  setFilter: (value: 'all' | 'unread' | 'read') => void;
  typeFilter: 'all' | PushNotification['type'];
  setTypeFilter: (value: 'all' | PushNotification['type']) => void;
}

const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  filter,
  setFilter,
  typeFilter,
  setTypeFilter
}) => {
  return (
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
  );
};

export default NotificationFilters;
