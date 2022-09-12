var cacheName = 'Ro';
var filesToCache = [
  './',
  './index.html',
  './js/main.js',
  './js/utils.js',
  './Renderer/Sprite.js',
  './Renderer/Renderer.js',
  './Renderer/Player.js',
  './Data/SprFile.js',
  './Data/Resources.js',
  './Data/MotFile.js',
  './Data/ArrayBufferRead.js',

];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});