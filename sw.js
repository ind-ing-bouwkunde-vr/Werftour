/* Werftour: network first, cache as fallback, so updates arrive immediately and the app still opens offline. */
const CACHE = "werftour-v2";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || req.headers.has("range")) return;
  e.respondWith(fetch(req).then(res => {
    if (res.ok && (res.type === "basic" || res.type === "cors")) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req)));
});
