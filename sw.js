var myCache = 'testApp-v1';
var files = [
    './',
    './index.html',
    './manifest.webmanifest',
    './def/phaser.d.ts',
    './src/load-sw.js',
    './src/main.js',
    './src/phaser.min.js',
    './assets/icon-192.png',
    './assets/icon-256.png',
    './assets/icon-512.png'
];

self.addEventListener('install', function(event) {
    console.log('sw instalado');
    event.waitUntil(
        caches.open(myCache).then(function(cache) {
            console.log('sw cacheando ficheros');
            return cache.addAll(files);
        }).catch(function(error) {
            console.log(error)
        })
    )
});

self.addEventListener('fetch', (event) => {
    console.log('sw fetch');
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        }).catch(function(error) {
            console.log(error);
        })
    );
});

self.addEventListener('activate', function(event) {
    console.log('sw activate');
    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if(key !== myCache) {
                    console.log('sw removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});