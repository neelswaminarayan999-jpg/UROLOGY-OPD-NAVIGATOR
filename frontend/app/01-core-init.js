
/* ===== SINGLE FINAL INITIALIZER — V9 ===== */
(function(){
  if(window.__URO_ORACLE_V9_READY)return;
  window.__URO_ORACLE_V9_READY=true;
  document.addEventListener('DOMContentLoaded',function(){
    try{renderHome();}catch(e){console.error('Home init failed',e);}
    const sel=document.getElementById('oracleDisease');
    if(sel){
      sel.innerHTML='<option value="">Select clinical condition...</option>'+Object.keys(ORACLE_FIELDS).map(n=>`<option>${esc(n)}</option>`).join('');
      sel.value='Ca Bladder';
    }
  });
})();
