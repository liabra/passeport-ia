/*
 * Service worker « Passeport IA ».
 * Objectif : l'app et tout le contenu jouable fonctionnent hors-ligne après la
 * première visite (PC de bibliothèques, connexions faibles).
 *
 * Stratégie :
 *  - app shell (routes principales, manifest, icône) précaché à l'install ;
 *  - navigations : réseau d'abord, repli sur le cache si hors-ligne ;
 *  - autres ressources same-origin (chunks _next, etc.) : stale-while-revalidate.
 */

const CACHE = "passeport-ia-v1";
const APP_SHELL = ["/", "/liste", "/passeport", "/manifest.webmanifest", "/icone.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cles) => Promise.all(cles.filter((c) => c !== CACHE).map((c) => caches.delete(c))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((reponse) => {
          const copie = reponse.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copie));
          return reponse;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/"))),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cache) => {
      const reseau = fetch(request)
        .then((reponse) => {
          if (reponse && reponse.status === 200) {
            const copie = reponse.clone();
            caches.open(CACHE).then((c) => c.put(request, copie));
          }
          return reponse;
        })
        .catch(() => cache);
      return cache || reseau;
    }),
  );
});
