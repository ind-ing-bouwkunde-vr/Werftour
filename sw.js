/* Werftour: network first, cache as fallback, so updates arrive immediately and the app still opens offline.
   It also streams videos that are still arriving on a VR headset: wt-stream/<key> serves the requested
   byte range from the pieces already stored in IndexedDB, and waits for pieces that are not in yet. */
const CACHE = "werftour-v3";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const req = e.request;
  const m = /\/wt-stream\/([^/?#]+)/.exec(new URL(req.url).pathname);
  if (m) { e.respondWith(streamVideo(req, decodeURIComponent(m[1]))); return; }
  if (req.method !== "GET" || req.headers.has("range")) return;
  e.respondWith(fetch(req).then(res => {
    if (res.ok && (res.type === "basic" || res.type === "cors")) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req)));
});

let dbP = null;
function db() {
  if (!dbP) dbP = new Promise((ok, no) => {
    const r = indexedDB.open("werftour");
    r.onsuccess = () => { const d = r.result; d.onversionchange = () => { d.close(); dbP = null; }; ok(d); };
    r.onerror = () => { dbP = null; no(r.error); };
  });
  return dbP;
}
async function get(key) {
  try {
    const d = await db();
    if (!d.objectStoreNames.contains("blobs")) return null;
    return await new Promise(ok => { const q = d.transaction("blobs").objectStore("blobs").get(key); q.onsuccess = () => ok(q.result || null); q.onerror = () => ok(null); });
  } catch (e) { dbP = null; return null; }
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function streamVideo(req, key) {
  const whole = await get(key);
  const info = whole ? null : await get(key + "#n");
  const size = whole ? whole.size : info && info.size;
  if (!size) return new Response("", { status: 404 });
  const type = (whole && whole.type) || (info && info.type) || "video/mp4";
  const rh = req.headers.get("range"), rg = rh && /bytes=(\d*)-(\d*)/.exec(rh);
  let start = 0, end = size - 1;
  if (rg) {
    if (rg[1]) { start = +rg[1]; if (rg[2]) end = Math.min(+rg[2], size - 1); }
    else if (rg[2]) start = Math.max(0, size - +rg[2]);
  }
  if (start >= size) return new Response("", { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  const headers = { "Content-Type": type, "Accept-Ranges": "bytes", "Content-Length": String(end - start + 1), "Cache-Control": "no-store" };
  if (rg) headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
  const status = rg ? 206 : 200;
  if (whole) return new Response(whole.slice(start, end + 1), { status, headers });

  const CH = info.ch || 2097152;
  let pos = start, gone = false;
  const body = new ReadableStream({
    async pull(ctrl) {
      if (pos > end) { ctrl.close(); return; }
      const i = Math.floor(pos / CH);
      let piece = null;
      for (let waited = 0; !(piece = await get(key + "#" + i)); waited += 500) {
        if (gone) return;
        if (waited > 180000) { ctrl.error(new Error("dit stuk van de video kwam niet binnen")); return; }
        await sleep(500);
      }
      const off = pos - i * CH, take = Math.min(piece.size - off, end - pos + 1);
      if (take <= 0) { ctrl.close(); return; }
      ctrl.enqueue(new Uint8Array(await piece.slice(off, off + take).arrayBuffer()));
      pos += take;
    },
    cancel() { gone = true; }
  }, { highWaterMark: 0 });
  return new Response(body, { status, headers });
}
