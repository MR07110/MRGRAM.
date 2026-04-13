// sw.js - MRGRAM Service Worker (Cache First Strategy)

const CACHE_NAME = 'mrgram-v1';

// Root papkadagi barcha kerakli fayllar
const urlsToCache = [
    // Root
    '/',
    '/index.html',
    '/manifest.json',
    '/offline.html',
    
    // Sahifalar
    '/onboard/',
    '/home/',
    '/chats/',
    '/groups/',
    '/channels/',
    '/call/',
    '/settings/',
    
    // CSS fayllar
    '/assets/css/main.css',
    '/assets/css/style.css',
    '/assets/css/base/variables.css',
    '/assets/css/base/reset.css',
    '/assets/css/base/animations.css',
    '/assets/css/base/typography.css',
    '/assets/css/layout/containers.css',
    '/assets/css/layout/flex.css',
    '/assets/css/layout/grid.css',
    '/assets/css/layout/spacing.css',
    '/assets/css/components/buttons.css',
    '/assets/css/components/cards.css',
    '/assets/css/components/forms.css',
    '/assets/css/components/loader.css',
    '/assets/css/components/modals.css',
    '/assets/css/components/toast.css',
    '/assets/css/features/messages.css',
    '/assets/css/pages/onboard.css',
    '/assets/css/themes/dark.css',
    '/assets/css/themes/light.css',
    
    // JS fayllar
    '/assets/js/app.js',
    
    // Sounds
    '/assets/sounds/notification.mp3',
    '/assets/sounds/call-in.mp3',
    '/assets/sounds/call-out.mp3',
    '/assets/sounds/band.mp3',
    '/assets/sounds/abonent-stop.mp3',
    '/assets/sounds/red-btn.mp3',
    '/assets/sounds/tarmoqda_emas.mp3'
];

// ========== INSTALL - KESHLASH ==========
self.addEventListener('install', event => {
    console.log('🚀 Service Worker: O\'rnatilmoqda...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Keshga yuklanmoqda:', urlsToCache.length, 'ta fayl');
                
                // Har bir faylni alohida yuklash (xatolik bo'lsa ham davom etish)
                return Promise.allSettled(
                    urlsToCache.map(url => {
                        return cache.add(url).catch(err => {
                            console.warn('⚠️ Keshga yuklanmadi:', url, err);
                        });
                    })
                );
            })
            .then(() => {
                console.log('✅ Kesh tayyor!');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Kesh yuklashda xatolik:', error);
            })
    );
});

// ========== ACTIVATE - ESKI KESHNI TOZALASH ==========
self.addEventListener('activate', event => {
    console.log('🎯 Service Worker: Faollashtirildi');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('🗑️ Eski kesh o\'chirildi:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker tayyor!');
                return self.clients.claim();
            })
    );
});

// ========== FETCH - CACHE FIRST STRATEGY ==========
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    console.log('⚡ Keshdan:', event.request.url);
                    return cachedResponse;
                }
                
                return fetch(event.request)
                    .then(response => {
                        if (response && response.status === 200) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseClone);
                                    console.log('📦 Keshga saqlandi:', event.request.url);
                                });
                        }
                        return response;
                    })
                    .catch(error => {
                        console.error('❌ Yuklashda xatolik:', event.request.url);
                        return caches.match('/offline.html');
                    });
            })
    );
});

// ========== SKIP WAITING XABAR ==========
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('📱 MRGRAM Service Worker yuklandi!');
