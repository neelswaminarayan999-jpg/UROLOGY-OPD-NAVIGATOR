/* V16.6 offline mode: registers the offline worker, shows when the phone is offline,
   and offers a one-tap reload when a new version of the app has been downloaded. */
(function(){
  if(!('serviceWorker' in navigator)) return;
  const css='#offlineBar,#updateBar{position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;border-radius:12px;padding:10px 14px;font:600 13px/1.4 system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.25);display:none}#offlineBar{background:#334155;color:#fff}#updateBar{background:#0f172a;color:#fff;display:none;align-items:center;justify-content:space-between;gap:10px}#updateBar button{background:#38bdf8;color:#0f172a;border:0;border-radius:8px;padding:7px 12px;font-weight:800}';
  function ui(){
    if(document.getElementById('offlineBar')) return;
    const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
    const off=document.createElement('div');off.id='offlineBar';off.textContent='Offline — guidelines, engines and calculators work; the AI Lab needs internet.';
    const up=document.createElement('div');up.id='updateBar';up.innerHTML='<span>A new version of the app is ready.</span><button type="button">Update now</button>';
    document.body.appendChild(off);document.body.appendChild(up);
    const sync=()=>{off.style.display=navigator.onLine?'none':'block';};
    addEventListener('online',sync);addEventListener('offline',sync);sync();
  }
  function offerUpdate(w){
    ui();const bar=document.getElementById('updateBar');bar.style.display='flex';
    bar.querySelector('button').onclick=()=>{bar.querySelector('button').disabled=true;userAskedUpdate=true;w.postMessage('SKIP_WAITING');};
  }
  let reloading=false,userAskedUpdate=false;
  // Reload only after the user tapped "Update now" — never on the first visit, when the worker simply takes over.
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloading||!userAskedUpdate)return;reloading=true;location.reload();});
  addEventListener('load',()=>{
    ui();
    navigator.serviceWorker.register('/sw.js').then(reg=>{
      if(reg.waiting&&navigator.serviceWorker.controller) offerUpdate(reg.waiting);
      reg.addEventListener('updatefound',()=>{const w=reg.installing;if(!w)return;w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)offerUpdate(w);});});
      // Check for a new version each time the app is opened or brought back to the front.
      document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')reg.update().catch(()=>{});});
    }).catch(e=>console.warn('offline worker',e));
  });
})();
