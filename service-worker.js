// Service Worker для PWA TechCommunity
// Обеспечивает работу приложения офлайн и быструю загрузку

const CACHE_NAME = 'techcommunity-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Установка Service Worker и кеширование файлов
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Активировать сразу
  );
});

// Активация Service Worker и очистка старого кеша
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Контролировать все страницы сразу
  );
});

// Обработка запросов - Cache First Strategy (сначала кеш, потом сеть)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Если есть в кеше - возвращаем из кеша
        if (response) {
          console.log('[Service Worker] Serving from cache:', event.request.url);
          return response;
        }
        
        // Иначе запрашиваем из сети и кешируем
        console.log('[Service Worker] Fetching from network:', event.request.url);
        return fetch(event.request).then((response) => {
          // Проверяем что ответ валидный
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Клонируем ответ для кеша
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch((error) => {
        // Если офлайн и нет в кеше - показываем главную страницу
        console.error('[Service Worker] Fetch failed:', error);
        return caches.match('/index.html');
      })
  );
});
