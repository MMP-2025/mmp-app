
// Service Worker utilities for offline functionality

export const registerSW = () => {
  // Service worker registration is disabled - no sw.js file exists
  // This prevents MIME type errors in the console
  if ('serviceWorker' in navigator) {
    // Unregister any previously registered service workers
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }
};

export const checkOnlineStatus = () => {
  return navigator.onLine;
};

export const addOfflineStatusListener = (callback: (isOnline: boolean) => void) => {
  window.addEventListener('online', () => callback(true));
  window.addEventListener('offline', () => callback(false));
};
