const CACHE_NAME = "nyhetsradar-v101";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",

  "./css/styles.css",

  "./js/config.js",
  "./js/storage.js",
  "./js/settings.js",
  "./js/news.js",
  "./js/app.js",

  "./icon-512.png"
];

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
    .then(cache => {

      return cache.addAll(urlsToCache);

    })

  );

});

self.addEventListener("fetch", event => {

  event.respondWith(

    fetch(event.request)
    .catch(() => caches.match(event.request))

  );

});
