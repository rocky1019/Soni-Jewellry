const CACHE_NAME = "soni-jewellers-v2";
const urlsToCache = [
  "/",                     // root
  "/index.html",
  "/admin.html",
  "/login.html",
  "/signup.html",
  "/search.html",
  "/onboarding.html",
  "/manifest.json",
  "/css/style.css",
  "/js/main.js",
  "/assets/images/logo72.png",
  "/assets/images/logo192.png",
  "/assets/images/logo512.png"
];

// INSTALL SERVICE WORKER
self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching files...");
      return cache.addAll(urlsToCache);
    })
  );
});

// ACTIVATE SERVICE WORKER
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log("[SW] Deleting old cache:", name);
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// FETCH REQUESTS
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // return from cache if available
      }
      return fetch(event.request).catch(() => {
        // Optional: Show fallback message or offline page
        return new Response(
          `<h2 style="font-family:sans-serif;text-align:center;margin-top:50px">You're offline 💫<br>Please reconnect to load content.</h2>`,
          { headers: { "Content-Type": "text/html" } }
        );
      });
    })
  );
});
