
import React from 'react';
import { Bell } from 'lucide-react';

interface EmptyNotificationStateProps {
  filter: 'all' | 'unread' | 'read';
}

const EmptyNotificationState: React.FC<EmptyNotificationStateProps> = ({ filter }) => {
  return (
    <div className="text-center py-8">
      <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
      <h4 className="text-lg font-semibold mb-2 text-muted-foreground">No notifications</h4>
      <p className="text-muted-foreground">
        {filter === 'unread' ? "You're all caught up!" : 'No notifications match your filters'}
      </p>
    </div>
  );
};

export default EmptyNotificationState;
