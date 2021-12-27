const cacheName = 'v2';
const cacheAssets = [
    'index.html',
    '/js/idb.js',
    '/js/index/js',
    'manifest.json', 
    '/css/styles.css',
    '/icons/icon-512x512.png',
    '/icons/icon-384x384.png',
    '/icons/icon-192x192.png',
    '/icons/icon-152x152.png',
    '/icons/icon-144x144.png',
    '/icons/icon-128x128.png',
    '/icons/icon-96x96.png',
    '/icons/icon-72x72.png'
    
]

self.addEventListener('install', e =>{
    console.log ('service worker installed');
    e.waitUntil(
        caches
        .open(cacheName)
        .then(cache =>{
            console.log('cache installed');
            cache.addAll(cacheAssets);
        })
        .then(()=> self.skipWaiting())
    )
});

self.addEventListener('activate' , e =>{
    console.log('service worker activated');
    e.waitUntil(
        caches.keys().then(cacheNames =>{
            return Promise.all(
                cacheNames.map(cache =>{
                    if (cache !== cacheName){
                        console.log('service worker is cleareaing');
                        return caches.delete(cache)
                    
                    }
                })
            )
        })
    )
});
self.addEventListener('fetch', e=>{
    console.log('fetching');
    e.respondWith(
        fetch(e.request) .catch(()=>caches.match(e.request))
    )
})