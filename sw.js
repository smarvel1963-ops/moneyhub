/* SAVE AS: sw.js · LOCATION: C:/MarvelApps/moneyhub/sw.js
 * Money Hub's own offline worker (scope /moneyhub/) - installable, opens
 * offline, shows reminders. The app code is the shared Hub engine in
 * ../dayhub/, cached here too. NETWORK FIRST (same rule as Day Hub's sw.js):
 * online = always the newest files, the cache is only the offline fallback.
 * Updates are announced by ../dayhub/version.json - this file rarely changes. */
const CACHE = "moneyhub-v10";
const SHELL = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png", "icon-180.png",
  "../dayhub/styles.css", "../dayhub/features.js", "../dayhub/app.js", "../dayhub/scenes.js", "../dayhub/cruise.js", "../dayhub/shell.js", "../dayhub/trip.js", "../dayhub/ships.js", "../dayhub/money.js", "../dayhub/moneyviz.js", "../dayhub/moneytiles.js", "../dayhub/moneytiles.css", "../dayhub/ui.js", "../dayhub/privacy.html", "../dayhub/terms.html"];
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
});
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("moneyhub-") && k !== CACHE && k !== SHARED).map(k => caches.delete(k))))
    .then(() => self.clients.claim())));
// v1.47 SHARE TO MONEY HUB (Android, installed app): Share a downloaded statement (CSV / OFX / QFX) from Cash App, Venmo,
// PayPal, a bank app or Files -> Money Hub. The file is kept in this phone's cache for a moment and the app opens on
// ./?share=1, which reads it, shows the check-before-adding screen, then deletes it. Nothing leaves the phone.
const SHARED = "moneyhub-share";
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method === "POST" && u.origin === location.origin && u.pathname.endsWith("/share")) {
    e.respondWith((async () => {
      try { const f = (await e.request.formData()).getAll("file").find(x => x && x.size);
        if (f && f.size <= 5e6) await (await caches.open(SHARED)).put("./shared-file", new Response(await f.text(), { headers: { "x-name": encodeURIComponent(f.name || "shared file") } })); }
      catch (err) { /* nothing usable shared - the app just opens */ }
      return Response.redirect("./?share=1", 303); })());
    return;
  }
  if (u.pathname.endsWith("/version.json") && e.request.method === "GET") return;   // the update check is always live and never piles up in the cache
  if (e.request.cache === "reload" && e.request.destination === "") return;   // applyUpdate's fresh fetch: a failure must really fail, and half a set of new files stays out of the offline copy
  if (u.origin !== location.origin || e.request.method !== "GET") return;   // outside APIs: always live
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }   // never cache an error page
    return r;
  }).catch(() => caches.open(CACHE).then(c => c.match(e.request, { ignoreSearch: true })).then(r => r || caches.match(e.request, { ignoreSearch: true }))));   // offline: our own copy first, because every Hub's cache holds ../dayhub/ files and some are old
});
// Tapping a reminder opens Money Hub (or brings the open one to the front).
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(cs => {
    for (const c of cs) if ("focus" in c) return c.focus();
    return self.clients.openWindow("./");
  }));
});
