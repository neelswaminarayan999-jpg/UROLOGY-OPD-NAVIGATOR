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

  function enhanceClinicalUI(){
    if(document.getElementById('v14ClinicalStatusBar')) return;
    const style=document.createElement('style');
    style.id='v14ClinicalPolish';
    style.textContent=[
      '#v14ClinicalStatusBar{margin:10px 0;padding:8px 12px;border:1px solid #cbd5e1;border-radius:10px;background:#f8fafc;color:#475569;font-size:11px;line-height:1.45}',
      '#v14ClinicalStatusBar b{color:#0f172a}',
      '#onlineAiView .v12-result-card,#onlineAiView #aiOutput,#onlineAiView #v12AiOutput{border:1px solid #cbd9e6!important;box-shadow:0 8px 22px rgba(15,23,42,.055)!important;background:#fff}',
      '#onlineAiView .v12-title{font-size:18px!important;font-weight:900!important;color:#0f172a!important}',
      '#onlineAiView .v11-status,#onlineAiView .v12-status{border-radius:10px}',
      '.v14-answer-section{margin-top:12px;padding:12px 14px;border:1px solid #dbe5ec;border-radius:10px;background:#fbfdff}',
      '.v14-answer-section h4{margin:0 0 6px;font-size:12px;font-weight:900;color:#163247}',
      '.v14-evidence{margin-top:12px;padding:10px 12px;border-radius:10px;background:#f8fafc;border:1px dashed #cbd5e1;font-size:10px;color:#475569}',
      '.v14-evidence b{color:#0f172a}'
    ].join('');
    document.head.appendChild(style);

    const bar=document.createElement('div');
    bar.id='v14ClinicalStatusBar';
    bar.className='no-print';
    bar.innerHTML='<b>V14.0 • FINAL CLINICAL WORKSTATION</b> · 2026 evidence layer · Online AI: OpenRouter free vision · AI is advisory only · clinician confirmation required';
    const target=document.getElementById('onlineAiRoot')?.parentElement || document.getElementById('onlineAiView');
    if(target) target.insertBefore(bar,target.firstChild);
  }

  function addEvidenceBlocks(){
    ['oracleOutput','aiOutput','v12AiOutput'].forEach(id=>{
      const el=document.getElementById(id);
      if(!el || el.querySelector('.v14-evidence')) return;
      const box=document.createElement('div');
      box.className='v14-evidence';
      let source='EAU 2026 evidence layer / current Oracle rules';
      try{
        const meta=window.UROLOGY_ORACLE_V13;
        if(meta?.guidelines?.EAU) source='EAU '+meta.guidelines.EAU+' evidence layer · TNM '+(meta.guidelines.TNM||'current adopted edition');
      }catch{}
      box.innerHTML='<b>Evidence & safety layer</b><br>'+source+' · AI output does not replace the deterministic Oracle pathway or clinician verification.';
      el.appendChild(box);
    });
  }

  enhanceClinicalUI();

  const GUIDELINES={
    'Ca Prostate':['EAU Prostate Cancer 2026','https://uroweb.org/guidelines/prostate-cancer'],
    'Ca Bladder':['EAU Non-muscle-invasive + Muscle-invasive/Metastatic Bladder Cancer 2026','https://uroweb.org/guidelines/non-muscle-invasive-bladder-cancer'],
    'UTUC':['EAU Upper Urinary Tract Urothelial Cell Carcinoma 2026','https://uroweb.org/guidelines/upper-urinary-tract-urothelial-cell-carcinoma'],
    'Ca Kidney':['EAU Renal Cell Carcinoma 2026','https://uroweb.org/guidelines/renal-cell-carcinoma'],
    'Ca Testis':['EAU Testicular Cancer 2026','https://uroweb.org/guidelines/testicular-cancer'],
    'Ca Penis':['EAU Penile Cancer 2026','https://uroweb.org/guidelines/penile-cancer'],
    'Urethral Cancer':['EAU Primary Urethral Carcinoma 2026','https://uroweb.org/guidelines/primary-urethral-carcinoma'],
    'Urethral Stricture':['EAU Urethral Strictures 2026','https://uroweb.org/guidelines/urethral-strictures'],
    'BPH / Male LUTS':['EAU Non-neurogenic Male LUTS 2026','https://uroweb.org/guidelines/management-of-non-neurogenic-male-luts'],
    'Stone Disease':['EAU Urolithiasis 2026','https://uroweb.org/guidelines/urolithiasis']
  };
  const DISEASES=Object.keys(GUIDELINES);

  function detectSuggestedDisease(btn){
    const attrKeys=['data-disease','data-module','data-suggested-disease','data-suggested-module'];
    for(const k of attrKeys){ const v=btn.getAttribute(k); if(v && DISEASES.includes(v)) return v; }
    const scopes=[];
    let el=btn;
    for(let i=0;i<5 && el;i++,el=el.parentElement) if(el.innerText) scopes.push(el.innerText);
    for(const text of scopes){
      const lower=text.toLowerCase();
      for(const label of ['suggested oracle module','suggested disease','suggested module','clinical oracle']){
        const ix=lower.indexOf(label);
        if(ix>=0){
          const tail=text.slice(ix,ix+500);
          const hit=DISEASES.find(d=>tail.toLowerCase().includes(d.toLowerCase()));
          if(hit) return hit;
        }
      }
    }
    for(const text of scopes){
      const hit=DISEASES.find(d=>text.toLowerCase().includes(d.toLowerCase()+' module'));
      if(hit) return hit;
    }
    return null;
  }

  function revealOracleView(){
    const candidates=[...document.querySelectorAll('button,a,[role="button"]')].filter(x=>{
      const t=(x.innerText||x.textContent||'').trim().toLowerCase();
      return t==='clinical oracle'||t.includes('clinical oracle')||t==='oracle';
    });
    const nav=candidates.find(x=>!x.closest('#onlineAiView'))||candidates[0];
    try{ if(nav) nav.click(); }catch{}
    try{
      if(typeof window.showView==='function') window.showView('oracleView');
      else if(typeof window.showSection==='function') window.showSection('oracleView');
      else if(typeof window.navigateView==='function') window.navigateView('oracleView');
    }catch{}
  }

  function openSpecificOracle(disease){
    if(!disease) return false;
    revealOracleView();
    setTimeout(()=>{
      const sel=document.getElementById('oracleDisease');
      if(!sel) return;
      const opt=[...sel.options].find(o=>o.value===disease || o.textContent.trim()===disease);
      if(opt){
        sel.value=opt.value;
        sel.dispatchEvent(new Event('input',{bubbles:true}));
        sel.dispatchEvent(new Event('change',{bubbles:true}));
      }
      const view=document.getElementById('oracleView');
      if(view) view.scrollIntoView({behavior:'smooth',block:'start'});
    },250);
    return true;
  }

  function addGuidelineButton(btn,disease){
    if(!btn || !disease || !GUIDELINES[disease]) return;
    btn.dataset.oracleDisease=disease;
    let wrap=btn.parentElement;
    if(!wrap) return;
    let guide=wrap.querySelector('.v14-guideline-link');
    if(!guide){
      guide=document.createElement('button');
      guide.type='button';
      guide.className='v14-guideline-link';
      guide.style.cssText='margin-left:8px;background:#0f766e;color:#fff;border:0;border-radius:9px;padding:10px 14px;font-weight:800;cursor:pointer';
      guide.innerHTML='View disease guideline';
      wrap.appendChild(guide);
      guide.addEventListener('click',ev=>{
        ev.preventDefault();
        const d=btn.dataset.oracleDisease;
        const g=GUIDELINES[d];
        if(g) window.open(g[1],'_blank','noopener,noreferrer');
      });
    }
  }

  function enhanceSuggestedOracleHandoff(){
    const buttons=[...document.querySelectorAll('button,a,[role="button"]')].filter(x=>{
      const t=(x.innerText||x.textContent||'').trim().toLowerCase();
      return t.includes('open suggested clinical oracle');
    });
    buttons.forEach(btn=>{
      const disease=btn.dataset.oracleDisease||detectSuggestedDisease(btn);
      if(disease) addGuidelineButton(btn,disease);
      if(btn.dataset.v14Handoff==='1') return;
      btn.dataset.v14Handoff='1';
      btn.addEventListener('click',ev=>{
        const d=btn.dataset.oracleDisease||detectSuggestedDisease(btn);
        if(d){
          ev.preventDefault();
          ev.stopImmediatePropagation();
          openSpecificOracle(d);
        }
      },true);
    });
  }

  const observer=new MutationObserver(()=>enhanceSuggestedOracleHandoff());
  try{observer.observe(document.body,{subtree:true,childList:true});}catch{}
  enhanceSuggestedOracleHandoff();
  setTimeout(enhanceSuggestedOracleHandoff,1200);
  setTimeout(enhanceSuggestedOracleHandoff,3000);

  setTimeout(enhanceClinicalUI,1200);
  setTimeout(addEvidenceBlocks,1500);
  setTimeout(addEvidenceBlocks,3500);

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',brand,{once:true}); else brand();
  setTimeout(brand,1200);
  setTimeout(brand,3000);
})();