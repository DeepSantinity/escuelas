const CACHE_NAME = "mapa-escolar-v6";
const DATA_CACHE_NAME = `${CACHE_NAME}-geojson`;
const CURRENT_CACHES = [CACHE_NAME, DATA_CACHE_NAME];
const APP_SHELL = [
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./css/styles.css",
  "./css/offline.css",
  "./css/account-profile.css",
  "./css/drawing-tools.css",
  "./css/reviews.css",
  "./vendor/leaflet/leaflet.css",
  "./vendor/leaflet/leaflet.js",
  "./vendor/leaflet/images/layers.png",
  "./vendor/leaflet/images/layers-2x.png",
  "./vendor/leaflet/images/marker-icon.png",
  "./vendor/leaflet/images/marker-icon-2x.png",
  "./vendor/leaflet/images/marker-shadow.png",
  "./vendor/supabase/supabase.min.js",
  "./js/supabase-config.js",
  "./js/account.js",
  "./js/app.js",
  "./js/drawing-tools.js",
  "./js/pwa.js"
];
const OFFLINE_DATA = [
  "./geojson/2026-10-19/modalidades/artistica/secundaria/estatal/modalidad_artistica_secundaria_gestion_estatal_2026-10-19.geojson",
  "./geojson/2026-10-19/modalidades/artistica/superior/estatal/modalidad_artistica_superior_gestion_estatal_2026-10-19.geojson",
  "./geojson/2026-10-19/modalidades/especial/formacion-integral/estatal/modalidad_especial_formacion-integral_gestion_estatal_2026-10-19.geojson",
  "./geojson/2026-10-19/modalidades/especial/formacion-laboral/estatal/modalidad_especial_formacion-laboral_gestion_estatal_2026-10-19.geojson",
  "./geojson/2026-10-19/modalidades/especial/inicial/estatal/modalidad_especial_inicial_gestion_estatal_2026-10-19.geojson",
  "./geojson/2026-10-19/modalidades/especial/primaria/estatal/modalidad_especial_primaria_gestion_estatal_2026-10-19.geojson",
  "./geojson/2026-10-19/modalidades/tecnico-profesional/secundaria/estatal/modalidad_tecnico-profesional_secundaria_gestion_estatal_2026-10-19.geojson",
  "./geojson/2026-10-19/modalidades/tecnico-profesional/superior/estatal/modalidad_tecnico-profesional_superior_gestion_estatal_2026-10-19.geojson",
  "./geojson/2026-10-19/niveles/inicial/estatal/nivel_inicial_gestion_estatal_2026-10-19.geojson",
  "./geojson/2026-10-19/niveles/inicial/privada/nivel_inicial_gestion_privada_2026-10-19.geojson",
  "./geojson/2026-10-19/niveles/primario/estatal/nivel_primario_gestion_estatal_2026-10-19.geojson",
  "./geojson/2026-10-19/niveles/primario/privada/nivel_primario_gestion_privada_2026-10-19.geojson",
  "./geojson/2026-10-19/niveles/secundario/estatal/nivel_secundario_gestion_estatal_2026-10-19.geojson",
  "./geojson/2026-10-19/niveles/secundario/privada/nivel_secundario_gestion_privada_2026-10-19.geojson",
  "./geojson/2026-10-19/niveles/superior/estatal/nivel_superior_gestion_estatal_2026-10-19.geojson",
  "./geojson/2026-10-19/niveles/superior/privada/nivel_superior_gestion_privada_2026-10-19.geojson"
];
const OFFLINE_DATA_PATHS = new Set(OFFLINE_DATA.map(path => new URL(path, self.registration.scope).pathname));

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const appCache = await caches.open(CACHE_NAME);
    await appCache.addAll(APP_SHELL.map(path => new URL(path, self.registration.scope)));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith("mapa-escolar-") && !CURRENT_CACHES.includes(key)).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", event => {
  if (event.data?.type === "check-offline-data") {
    event.waitUntil(
      caches.open(DATA_CACHE_NAME)
        .then(cache => Promise.all(OFFLINE_DATA.map(path => cache.match(new URL(path, self.registration.scope)))))
        .then(matches => {
          const ready = matches.every(Boolean);
          event.source?.postMessage({ type: ready ? "offline-data-ready" : "offline-data-error" });
        })
    );
  }
});

self.addEventListener("fetch", event => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(navigate(request));
    return;
  }

  if (request.destination === "script" || request.destination === "style") {
    event.respondWith(networkFirst(request, event));
    return;
  }

  const cacheName = OFFLINE_DATA_PATHS.has(url.pathname) ? DATA_CACHE_NAME : CACHE_NAME;
  event.respondWith(cacheFirst(request, event, cacheName));
});

async function navigate(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(new URL("./index.html", self.registration.scope), response.clone());
    }
    return response;
  } catch (error) {
    const cachedPage = await caches.match(new URL("./index.html", self.registration.scope));
    if (cachedPage) return cachedPage;
    throw error;
  }
}

async function cacheFirst(request, event, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    event.waitUntil(
      caches.open(cacheName)
        .then(cache => cache.put(request, response.clone()))
        .catch(error => console.error("No se pudo guardar un recurso para uso sin conexión.", error))
    );
  }
  return response;
}

async function networkFirst(request, event) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then(cache => cache.put(request, response.clone()))
          .catch(error => console.error("No se pudo actualizar un recurso guardado sin conexión.", error))
      );
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw error;
  }
}
