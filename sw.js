/* Offline support: app shell is network-first (always fresh when online),
   exercise photos, icons and fonts are cache-first. */
const VERSION = "v2";
const SHELL = `shell-${VERSION}`;
const ASSETS = `assets-${VERSION}`;
const SHELL_FILES = ["/", "/index.html", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL && k !== ASSETS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Pages: network first, fall back to cached shell when offline
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(SHELL).then((c) => c.put("/index.html", copy)); return res; })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Exercise photos, icons, Google Fonts: cache first
  const cacheFirst = (url.origin === location.origin && (url.pathname.startsWith("/ex/") || url.pathname.startsWith("/icons/")))
    || url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (cacheFirst) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        // only keep real images/fonts; never cache the HTML page that a missing file falls back to
        const type = res.headers.get("content-type") || "";
        const good = res.type === "opaque" || (res.ok && !type.includes("text/html"));
        if (good) { const copy = res.clone(); caches.open(ASSETS).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
  }
});
