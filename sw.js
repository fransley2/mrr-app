const CACHE_NAME = 'mrr-app-nery-v2'; // Mudei a versão para garantir atualização

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './maskable_icon_x192.png',
  // Adicionando os arquivos locais
  './assets/tailwind.js',
  './assets/xlsx.js',
  './assets/phosphor.js'
];

self.addEventListener('install', (e) => {
  // Força o SW a ativar imediatamente após instalar
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cacheando arquivos locais...');
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (e) => {
  // Limpa caches antigos se mudar a versão
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Retorna do cache se tiver, senão tenta baixar (mas agora tudo deve estar no cache)
      return response || fetch(e.request);
    })
  );
});