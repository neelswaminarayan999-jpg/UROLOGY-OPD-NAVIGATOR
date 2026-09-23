const CACHE='urology-oracle-v13.9-core';
const CORE=['./','./index.html','./oracle-config.js','./v13-clinical-engine.js','./v13.9-content-pack.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()).then(()=>self.clients.matchAll()).then(clients=>clients.forEach(client=>client.postMessage({type:'UROLOGY_ORACLE_OFFLINE_READY',version:'13.9.0'}))));
});
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(url.pathname.includes('/api/')) return;
  if(event.request.method!=='GET') return;
  event.respondWith(
    caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
      if(response.ok && url.origin===location.origin){
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
      }
      return response;
    }).catch(()=>caches.match('./index.html')))
  );
});
