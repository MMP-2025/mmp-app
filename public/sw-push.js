// Custom push notification handler for the service worker
// This file is imported by the VitePWA-generated service worker

self.addEventListener('push', function(event) {
  console.log('[SW] Push received:', event);

  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'New Notification', body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'Making Meaning Psychology';
  const options = {
    body: data.body || '',
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/icon-192.png',
    tag: data.notification_id || 'default',
    renotify: true,
    requireInteraction: true,
    data: data.data || {},
    actions: data.actions || [],
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('[SW] Notification click:', event.action);
  event.notification.close();

  const notificationData = event.notification.data || {};
  const notificationId = notificationData.notification_id;
  const actionUrl = notificationData.action_url || '/';

  // Determine the response based on which action was clicked
  let response = null;
  if (event.action === 'option1' && notificationData.action_option_1) {
    response = notificationData.action_option_1;
  } else if (event.action === 'option2' && notificationData.action_option_2) {
    response = notificationData.action_option_2;
  }

  // If a response action was clicked, send it back to the server
  if (response && notificationId) {
    event.waitUntil(
      sendResponse(notificationId, response).then(() => {
        return clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
          // Focus existing window or open new one
          for (const client of clientList) {
            if (client.url && 'focus' in client) {
              return client.focus();
            }
          }
          return clients.openWindow(actionUrl);
        });
      })
    );
  } else {
    // No action button clicked, just open the app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
        for (const client of clientList) {
          if (client.url && 'focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow(actionUrl);
      })
    );
  }
});

async function sendResponse(notificationId, response) {
  // Get the Supabase URL and key from the service worker's origin
  try {
    // We post to our edge function to record the response
    const supabaseUrl = self.location.origin;
    
    // Try to get credentials from IndexedDB or post message to client
    const clientList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    
    if (clientList.length > 0) {
      // Send message to client to handle the response
      clientList[0].postMessage({
        type: 'NOTIFICATION_RESPONSE',
        notificationId: notificationId,
        response: response,
      });
    } else {
      // Store response for later sync
      console.log('[SW] No client available, storing response for later sync');
      // Use a simple cache to store pending responses
      const cache = await caches.open('pending-responses');
      await cache.put(
        new Request(`/pending-response/${notificationId}`),
        new Response(JSON.stringify({ notificationId, response, timestamp: Date.now() }))
      );
    }
  } catch (error) {
    console.error('[SW] Error sending response:', error);
  }
}

self.addEventListener('notificationclose', function(event) {
  console.log('[SW] Notification closed without action');
});
