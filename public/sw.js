const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/',
  // Add your static assets here, e.g.:
  // '/_next/static/css/...'
  // '/_next/static/js/...'
  // '/images/...'
  // You might need to inspect your built Next.js app to find the correct paths.
];

// Install event: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Add URLs to cache, but handle potential errors
        return Promise.all(urlsToCache.map(url => {
          return cache.add(url).catch(error => {
            console.error(`Failed to cache ${url}: ${error}`);
          });
        }));
      })
  );
});

// Fetch event: Implement caching strategies
self.addEventListener('fetch', (event) => {
  // Cache-first for static assets
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin === location.origin && urlsToCache.includes(requestUrl.pathname)) {
    event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => caches.match('/offline.html')); // Serve an offline page if fetch fails
      })
    );
  }

  // Network-or-cache for other requests
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response because it can only be consumed once
        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // If network request fails, try to get it from the cache
        return caches.match(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          } else {
            return Promise.resolve(); // Keep the cache in the whitelist
          }
        })
      );
    })
  );
});