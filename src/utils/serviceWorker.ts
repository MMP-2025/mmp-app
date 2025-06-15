
// Service Worker for offline functionality
const CACHE_NAME = 'daily-compass-v1';
const urlsToCache = [
  '/',
  '/mood',
  '/journal',
  '/mindfulness',
  '/gratitude',
  '/crisis',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

export const registerSW = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

// Install Service Worker
self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch from cache when offline
self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

export const checkOnlineStatus = () => {
  return navigator.onLine;
};

export const addOfflineStatusListener = (callback: (isOnline: boolean) => void) => {
  window.addEventListener('online', () => callback(true));
  window.addEventListener('offline', () => callback(false));
};
