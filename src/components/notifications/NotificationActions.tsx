
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Trash2, ExternalLink } from 'lucide-react';

interface NotificationActionsProps {
  notificationId: string;
  isRead: boolean;
  actionUrl?: string;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onActionClick: (url: string) => void;
}

const NotificationActions: React.FC<NotificationActionsProps> = ({
  notificationId,
  isRead,
  actionUrl,
  onMarkAsRead,
  onDelete,
  onActionClick
}) => {
  return (
    <div className="flex items-center gap-2">
      {actionUrl && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onActionClick(actionUrl)}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Open
        </Button>
      )}
      
      {!isRead && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onMarkAsRead(notificationId)}
        >
          <Check className="h-3 w-3 mr-1" />
          Mark Read
        </Button>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDelete(notificationId)}
        className="text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default NotificationActions;
