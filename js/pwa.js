const mapElement = document.getElementById("map");
const connectionBadge = document.querySelector(".live-tag");
let offlineDataReady = false;
let baseMapUnavailable = window.sirioniBaseMapUnavailable === true;
let connectionCheck = 0;
const offlineNotice = document.createElement("div");
offlineNotice.className = "offline-map-notice";
offlineNotice.setAttribute("role", "status");
mapElement.append(offlineNotice);

function renderConnectionStatus(offline) {
  const unavailable = offline || baseMapUnavailable;
  connectionBadge.textContent = offline ? "Sin conexión" : baseMapUnavailable ? "Mapa sin conexión" : "Mapa activo";
  connectionBadge.classList.toggle("offline", unavailable);
  offlineNotice.textContent = offline
    ? offlineDataReady
      ? "Sin conexión. Las capas y la búsqueda descargadas siguen disponibles; el fondo del mapa y las cuentas requieren internet."
      : "Sin conexión y sin datos guardados. Conectate una vez para descargar las capas escolares."
    : "El fondo cartográfico no responde. Las capas y la búsqueda siguen disponibles; verificá la conexión.";
  offlineNotice.hidden = !unavailable;
}

async function updateConnectionStatus() {
  const check = ++connectionCheck;
  let offline = !navigator.onLine;
  if (!offline && window.isSecureContext) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 3000);
    const probe = new URL("./service-worker.js", location.href);
    probe.searchParams.set("connection-check", String(Date.now()));
    try {
      const response = await fetch(probe, { method: "HEAD", cache: "no-store", signal: controller.signal });
      offline = !response.ok;
    } catch {
      offline = true;
    } finally {
      window.clearTimeout(timeout);
    }
  }
  if (check !== connectionCheck) return;

  renderConnectionStatus(offline);
}

function handleOfflineDataMessage(message) {
  if (message.type === "offline-data-ready") {
    offlineDataReady = true;
    console.info("Las capas escolares están guardadas para uso sin conexión.");
    updateConnectionStatus();
  } else if (message.type === "offline-data-error") {
    offlineDataReady = false;
    console.error("El almacenamiento sin conexión no contiene todas las capas escolares.");
    updateConnectionStatus();
  }
}

updateConnectionStatus();
window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);
window.addEventListener("sirioni:basemap-unavailable", () => {
  baseMapUnavailable = true;
  renderConnectionStatus(!navigator.onLine);
});
window.addEventListener("sirioni:basemap-available", () => {
  baseMapUnavailable = false;
  renderConnectionStatus(!navigator.onLine);
});
window.setInterval(updateConnectionStatus, 30_000);
window.addEventListener("sirioni:offline-data-ready", () => handleOfflineDataMessage({ type: "offline-data-ready" }));
window.addEventListener("sirioni:offline-data-error", () => handleOfflineDataMessage({ type: "offline-data-error" }));

if ("serviceWorker" in navigator && window.isSecureContext) {
  navigator.serviceWorker.addEventListener("message", event => {
    handleOfflineDataMessage(event.data || {});
  });

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then(() => navigator.serviceWorker.ready)
      .then(registration => {
        registration.active?.postMessage({ type: "check-offline-data" });
      })
      .catch(error => {
        console.error("No se pudo registrar el service worker.", error);
      });
  });
}
