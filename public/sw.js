/* Offline support for the whole app (Workout at "/", Diet at "/diet/").
   Pages: network first, so updates show at once; the saved copy is used offline.
   Photos, icons, fonts and libraries: saved after first use. */
const VERSION = "v3";
const SHELL = `shell-${VERSION}`;
const ASSETS = `assets-${VERSION}`;
const PAGES = ["/", "/diet/"];
const SHELL_FILES = PAGES.concat(["/manifest.webmanifest", "/favicon.svg", "/icons/icon-192.png", "/icons/icon-512.png"]);

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

// "/diet", "/diet/index.html" and "/diet/?m=1" all map to "/diet/"; everything else to "/"
const pageKey = (url) => (url.pathname.startsWith("/diet") ? "/diet/" : "/");

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (req.mode === "navigate") {
    const key = pageKey(url);
    e.respondWith(
      fetch(req)
        .then((res) => {
          const type = res.headers.get("content-type") || "";
          if (res.ok && type.includes("text/html")) { const copy = res.clone(); caches.open(SHELL).then((c) => c.put(key, copy)); }
          return res;
        })
        .catch(() => caches.match(key).then((hit) => hit || caches.match("/")))
    );
    return;
  }

  const sameSite = url.origin === location.origin;
  const cacheFirst =
    (sameSite && (url.pathname.startsWith("/ex/") || url.pathname.startsWith("/icons/") || url.pathname === "/favicon.svg")) ||
    url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com" || url.hostname === "cdnjs.cloudflare.com";
  if (!cacheFirst) return;

  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      // keep only real files; never save the HTML page a missing file falls back to
      const type = res.headers.get("content-type") || "";
      const good = res.type === "opaque" || (res.ok && !type.includes("text/html"));
      if (good) { const copy = res.clone(); caches.open(ASSETS).then((c) => c.put(req, copy)); }
      return res;
    }))
  );
});
