// Gerado por gerar-arquivo-unico.py a partir de ferramentas/sw-modelo.js — não edite sw.js à mão.
// Guarda os arquivos do app no aparelho: abre rápido e funciona sem internet.
const CACHE = "cartaz-vozes-negras-747546184b";
const ARQUIVOS = [
  "./",
  "index.html",
  "style.css",
  "app.js",
  "manifest.webmanifest",
  "vendor/html2canvas.min.js",
  "vendor/jspdf.umd.min.js",
  "img/fundo.jpg",
  "img/icone-64.png",
  "img/icone-180.png",
  "img/icone-192.png",
  "img/icone-512.png",
  "img/icone-maskable-512.png",
  "fonts/archivo-black-latin-400-normal.woff2",
  "fonts/carlito-latin-400-italic.woff2",
  "fonts/carlito-latin-400-normal.woff2",
  "fonts/carlito-latin-700-italic.woff2",
  "fonts/carlito-latin-700-normal.woff2",
  "fonts/caveat-latin-400-normal.woff2",
  "fonts/caveat-latin-700-normal.woff2",
  "fonts/comic-neue-latin-400-italic.woff2",
  "fonts/comic-neue-latin-400-normal.woff2",
  "fonts/comic-neue-latin-700-italic.woff2",
  "fonts/comic-neue-latin-700-normal.woff2",
  "fonts/courier-prime-latin-400-italic.woff2",
  "fonts/courier-prime-latin-400-normal.woff2",
  "fonts/courier-prime-latin-700-italic.woff2",
  "fonts/courier-prime-latin-700-normal.woff2",
  "fonts/lora-latin-400-italic.woff2",
  "fonts/lora-latin-400-normal.woff2",
  "fonts/lora-latin-700-italic.woff2",
  "fonts/lora-latin-700-normal.woff2",
  "fonts/merriweather-latin-400-italic.woff2",
  "fonts/merriweather-latin-400-normal.woff2",
  "fonts/merriweather-latin-700-italic.woff2",
  "fonts/merriweather-latin-700-normal.woff2",
  "fonts/patrick-hand-latin-400-normal.woff2"
];

self.addEventListener("install", (ev) => {
  ev.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(nomes.filter((n) => n.startsWith("cartaz-vozes-negras-") && n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Responde com o que está guardado e atualiza em segundo plano
self.addEventListener("fetch", (ev) => {
  const req = ev.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  ev.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const guardado = await cache.match(req, { ignoreSearch: true });
      const rede = fetch(req).then((resp) => {
        if (resp && resp.ok) cache.put(req, resp.clone());
        return resp;
      }).catch(() => guardado);
      return guardado || rede;
    })
  );
});
