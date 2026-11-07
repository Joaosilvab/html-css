/* Service worker: deixa o app funcionando offline e sempre pega a versão nova quando há internet */
const VERSION = 16;
const CACHE = 'notas-v' + VERSION;
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', e => {
  // cache: 'reload' ignora o cache HTTP do navegador (senão podia guardar a versão antiga)
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data === 'version' && e.source) e.source.postMessage({ version: VERSION });
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Fontes do Google e biblioteca de QR: cache primeiro, atualiza em segundo plano
  if (['fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com'].includes(url.hostname)) {
    e.respondWith(
      caches.open(CACHE).then(async cache => {
        const cached = await cache.match(req);
        const network = fetch(req).then(res => { if (res.ok || res.type === 'opaque') cache.put(req, res.clone()); return res; }).catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  if (url.origin !== location.origin) return;

  // Arquivos do app: sempre da rede, sem cache HTTP; se estiver offline, usa a cópia salva
  e.respondWith(
    fetch(url.href, { cache: 'no-store', credentials: 'same-origin' })
      .then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
