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
    document.querySelectorAll('[id="v13ClinicalGate"]').forEach(el=>el.id='v14ClinicalGate');
    const mode=document.getElementById('aiMode');
    if(mode){
      mode.innerHTML='<option value="proxy">Server-side Gemini proxy</option>';
      mode.value='proxy';
      mode.disabled=true;
      mode.dispatchEvent(new Event('change',{bubbles:true}));
    }
    const model=document.getElementById('aiModel');
    if(model){
      model.innerHTML='<option value="gemini-3.5-flash-lite">Gemini 3.5 Flash Lite</option><option value="gemini-3.8-flash">Gemini 3.8 Flash</option>';
      model.value='gemini-3.5-flash-lite';
      model.disabled=false;
    }
    const key=document.getElementById('aiKeyWrap'); if(key) key.style.display='none';
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',brand,{once:true}); else brand();
  setTimeout(brand,1200);
  setTimeout(brand,3000);
})();