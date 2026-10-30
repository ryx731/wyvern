/* A version stays active until every existing app window is closed. */
const CACHE_PREFIX = 'gesture-garden-';
const CACHE_NAME = `${CACHE_PREFIX}v6-minimal`;
const CORE_ASSETS = [
  './', './index.html', './styles.css', './app.js', './lessons.js',
  './gestures.js', './practice-core.js', './manifest.webmanifest', './icon.svg',
  './app.js?v=3', './styles.css?v=3', './lessons.js?v=3',
  './icon-180.png', './icon-192.png', './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) return response;
        const fallback = await caches.match(new URL('./index.html', self.registration.scope));
        return fallback || response;
      } catch {
        return (await caches.match(new URL('./index.html', self.registration.scope))) ||
          new Response('Open Gesture Garden online once to save it for offline practice.', {
            status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
      }
    })());
    return;
  }
  // Only cache the app shell; never cache unrelated pages, auth, or API responses.
  const asset = CORE_ASSETS.map(path => new URL(path, self.registration.scope).href)
    .includes(url.href);
  if (!asset) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok && response.type === 'basic') await cache.put(request, response.clone());
    return response;
  })());
});

