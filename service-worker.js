const CACHE = "translator-v2";

const FILES = ["/", "/index.html", "/style.css", "/app.js", "/manifest.json"];

/* =========================
   INSTALL (PRECACHE CORE)
========================= */
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)));

  self.skipWaiting();
});

/* =========================
   ACTIVATE (CLEAN OLD CACHE)
========================= */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      ),
  );

  self.clients.claim();
});

/* =========================
   FETCH STRATEGY
========================= */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 1. HTML → network first (always fresh app shell)
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match("/index.html")),
    );
    return;
  }

  // 2. JS/CSS → network first but cached fallback
  if (url.pathname.endsWith(".js") || url.pathname.endsWith(".css")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req)),
    );
    return;
  }

  // 3. EVERYTHING ELSE → cache first (important for model files!)
  event.respondWith(
    caches.match(req).then((cached) => {
      return (
        cached ||
        fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
      );
    }),
  );
});
