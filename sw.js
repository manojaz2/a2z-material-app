const CACHE_NAME = 'a2z-material-v2';
const SCOPE = self.registration.scope;
const ABS = (p) => new URL(p, SCOPE).toString();
const ASSETS = [ABS('./'), ABS('index.html'), ABS('manifest.json'), ABS('icon-192.png'), ABS('icon-512.png')];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))) .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request).then(res => { const copy=res.clone(); caches.open(CACHE_NAME).then(c=>c.put(e.request, copy)); return res; }).catch(()=>caches.match(e.request)));
});
