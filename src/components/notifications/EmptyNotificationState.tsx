
import React from 'react';
import { Bell } from 'lucide-react';

interface EmptyNotificationStateProps {
  filter: 'all' | 'unread' | 'read';
}

const EmptyNotificationState: React.FC<EmptyNotificationStateProps> = ({ filter }) => {
  return (
    <div className="text-center py-8">
      <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
      <h4 className="text-lg font-semibold mb-2 text-[#737373]">No notifications</h4>
      <p className="text-gray-500">
        {filter === 'unread' ? "You're all caught up!" : 'No notifications match your filters'}
      </p>
    </div>
  );
};

export default EmptyNotificationState;
