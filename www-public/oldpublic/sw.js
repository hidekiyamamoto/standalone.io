const CACHE_NAME = 'standalone-os-shell-v2';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([
        '/manifest.webmanifest',
        '/icon-192.png',
        '/css/os-shell.css',
        '/js/os-core.js',
        '/js/os-shell.js',
      ]),
    ),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const accept = req.headers.get('accept') || '';

  // Always go network-first for HTML / navigations so new layouts show
  // without clearing cache; fall back to cache when offline.
  if (req.mode === 'navigate' || accept.includes('text/html')) {
    event.respondWith(
      fetch(req).catch(() => caches.match('/index.html') || Response.error()),
    );
    return;
  }

  // For other resources, use cache-first.
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req)),
  );
});

