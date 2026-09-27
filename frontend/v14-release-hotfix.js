/* Urology Oracle V14.0 release hotfix. Injected by backend-server.mjs so the large clinical index.html is not overwritten. */
(function(){
  'use strict';
  const RELEASE='14.0';
  const LABEL='FINAL CLINICAL WORKSTATION';
  function replaceText(oldText,newText){
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const nodes=[]; let n;
    while(n=walker.nextNode()) if(n.nodeValue && n.nodeValue.includes(oldText)) nodes.push(n);
    nodes.forEach(node=>node.nodeValue=node.nodeValue.split(oldText).join(newText));
  }
  function brand(){
    document.title='Urology Oracle V14.0 — Final Clinical Workstation';
    replaceText('Urology Oracle — decision support + surgical workstation','Urology Oracle V14.0 — Final Clinical Workstation');
    replaceText('V13.3 evidence-and-reasoning layer • updated 27 Sep 2026','V14.0 clinical reasoning and evidence layer • updated 27 Sep 2026');
    replaceText('V13.3 • 27 Sep 2026','V14.0 • 27 Sep 2026');
    replaceText('V13 clinical gate:','V14 clinical gate:');
    replaceText('V13.3 evidence-and-reasoning layer','V14.0 clinical reasoning and evidence layer');
    replaceText('V13.3 deep clinical','V14.0 clinical');
    document.querySelectorAll('h1').forEach(el=>{ if(el.textContent.trim()==='Urology Oracle') el.textContent='Urology Oracle V14.0'; });
    replaceText('Decision support • treatment pathways • surgical atlas • scores • trials • dose references • follow-up','FINAL CLINICAL WORKSTATION • decision support • treatment pathways • surgical atlas • scores • trials • dose references • follow-up');
    replaceText('Run the supplied server package on this computer so the app can reach its governed AI endpoint.','Online AI endpoint: Render server → OpenRouter free vision model.');
    document.querySelectorAll('[id="v13ClinicalGate"]').forEach(el=>el.id='v14ClinicalGate');
    const mode=document.getElementById('aiMode');
    if(mode){
      mode.innerHTML='<option value="proxy">Server-side OpenRouter proxy</option>';
      mode.value='proxy';
      mode.disabled=true;
      mode.dispatchEvent(new Event('change',{bubbles:true}));
    }
    const model=document.getElementById('aiModel');
    if(model){
      model.innerHTML='<option value="qwen/qwen3.8-27b:free">OpenRouter — Qwen 3.8 27B (free vision)</option>';
      model.value='qwen/qwen3.8-27b:free';
      model.disabled=true;
    }
    const key=document.getElementById('aiKeyWrap'); if(key) key.style.display='none';
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',brand,{once:true}); else brand();
  setTimeout(brand,1200);
  setTimeout(brand,3000);
})();