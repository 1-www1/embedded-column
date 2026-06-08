// Service Worker - 嵌入式专栏离线缓存
const CACHE = 'embedded-column-v1';
const IMMEDIATE = [
  '/',
  'viewer.html',
  'stardew_theme.css',
  'stardew_gamify.js',
  'stardew_npcs.js',
  'manifest.json'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(IMMEDIATE))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // 只缓存同源请求
  if (url.origin !== self.location.origin) return;
  // 跳过manifest.json以免CORS问题
  if (url.pathname.includes('manifest.json')) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    })).catch(() => caches.match('viewer.html'))
  );
});
