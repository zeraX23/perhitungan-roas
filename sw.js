const CACHE_NAME = 'roas-pro-v2';
const ASSETS = [
    './index.html',
    './manifest.json',
    './icon.svg'
];

// Instalasi & Caching File Awal
self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

// Bersihkan Cache Lama jika ada Update
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => { if (key !== CACHE_NAME) return caches.delete(key); })
        )).then(() => self.clients.claim())
    );
});

// Strategi Fetch (Buka cache dulu, kalau tidak ada baru ambil dari internet)
self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});
