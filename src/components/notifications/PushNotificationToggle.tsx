import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Loader2, Smartphone } from 'lucide-react';
import { usePushSubscription } from '@/hooks/usePushSubscription';

const PushNotificationToggle: React.FC = () => {
  const { isSubscribed, isSupported, permission, loading, subscribe, unsubscribe } = usePushSubscription();

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Smartphone className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Push notifications not supported</p>
              <p className="text-xs">Install this app on your home screen for push notification support.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (permission === 'denied') {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <BellOff className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Notifications blocked</p>
              <p className="text-xs">Please enable notifications in your browser/device settings.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Push Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground mb-3">
          {isSubscribed
            ? 'You will receive notifications from your provider on your device.'
            : 'Enable to receive notifications from your provider on your home screen.'}
        </p>
        <Button
          onClick={isSubscribed ? unsubscribe : subscribe}
          disabled={loading}
          variant={isSubscribed ? 'outline' : 'default'}
          size="sm"
          className="w-full"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : isSubscribed ? (
            <BellOff className="h-4 w-4 mr-2" />
          ) : (
            <Bell className="h-4 w-4 mr-2" />
          )}
          {loading ? 'Processing...' : isSubscribed ? 'Disable Notifications' : 'Enable Notifications'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PushNotificationToggle;
