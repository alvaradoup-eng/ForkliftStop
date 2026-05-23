const CACHE_NAME = "safety-montacargas-v1";
const ARCHIVOS_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo.png",
  "/icon-192.png",
  "/icon-512.png"
];

// Instalación del Service Worker - guarda archivos en caché
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARCHIVOS_CACHE);
    })
  );
});

// Activación - limpia cachés viejos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Estrategia: primero caché, luego red (offline-first)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((respuestaCache) => {
      if (respuestaCache) {
        return respuestaCache;
      }
      return fetch(event.request).then((respuestaRed) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, respuestaRed.clone());
          return respuestaRed;
        });
      });
    })
  );
});