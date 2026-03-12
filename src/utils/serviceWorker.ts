// PWA Service Worker utilities
// vite-plugin-pwa handles SW registration automatically via registerType: 'autoUpdate'

export const registerSW = () => {
  // vite-plugin-pwa auto-registers the service worker
  // This function is kept for backward compatibility
};

export const checkOnlineStatus = () => {
  return navigator.onLine;
};

export const addOfflineStatusListener = (callback: (isOnline: boolean) => void) => {
  window.addEventListener('online', () => callback(true));
  window.addEventListener('offline', () => callback(false));
};
