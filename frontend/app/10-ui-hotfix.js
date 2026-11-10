/* Urology Oracle V14.0 UI compatibility layer — working AI, in-app guideline integration and release branding. */
(function(){
  'use strict';
  
  
  function addMobileUX(){
    if(document.getElementById('v14MobileUX')) return;
    const style=document.createElement('style'); style.id='v14MobileUX';
    style.textContent=[
      '.v14-ai-error{border-left:4px solid #b91c1c;background:#fff7f7;color:#7f1d1d;padding:12px 14px;border-radius:10px;margin-top:10px}',
      '.v14-ai-error-title{font-weight:900;font-size:14px;margin-bottom:5px}',
      '.v14-ai-error-text{font-size:12px;line-height:1.5}',
      '.v14-ai-error-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}',
      '.v14-ai-error-actions button{border:0;border-radius:8px;padding:8px 11px;font-weight:800;cursor:pointer}',
      '.v14-ai-retry{background:#0f6b99;color:#fff}.v14-ai-oracle{background:#0f172a;color:#fff}',
      '.v14-ai-tech{margin-top:8px;font-size:10px;color:#64748b;word-break:break-word}',
      '@media(max-width:600px){#v14ClinicalStatusBar{font-size:10px;padding:7px 9px}.v14-ai-error{padding:11px}.v14-ai-error-actions{display:grid;grid-template-columns:1fr}.v14-ai-error-actions button{width:100%}#onlineAiView{padding-left:0!important;padding-right:0!important}.v14-answer-section,.v14-evidence{border-radius:10px}}'
    ].join('');
    document.head.appendChild(style);
  }

  

  


  /* V15.10: this helper was called but never defined, so the 1.2 s timer threw and later tasks never ran.
     Only legacy-format errors are converted; the AI Lab now writes its own specific messages (data-ai-error). */
  

  

  

  

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

  function guidelineData(disease){
    const ds=window.DISEASES?.[disease];
    const pack=window.UROLOGY_ORACLE_V139_CONTENT;
    const sourceMap={
      'Ca Prostate':'EAU Prostate Cancer 2026',
      'Ca Bladder':'EAU NMIBC + MIBC/Metastatic Bladder Cancer 2026',
      'UTUC':'EAU Upper Urinary Tract Urothelial Cell Carcinoma 2026',
      'Ca Kidney':'EAU Renal Cell Carcinoma 2026',
      'Ca Testis':'EAU Testicular Cancer 2026',
      'Ca Penis':'EAU Penile Cancer 2026',
      'Urethral Cancer':'EAU Primary Urethral Carcinoma 2026',
      'Urethral Stricture':'EAU Urethral Strictures 2026',
      'BPH / Male LUTS':'EAU Non-neurogenic Male LUTS 2026',
      'Stone Disease':'EAU Urolithiasis 2026',
      'Adrenal / Neuroendocrine':'Integrated Oracle endocrine/urologic oncology evidence layer'
    };
    return {ds,pack,source:sourceMap[disease]||'Integrated Oracle evidence layer'};
  }

  function openInAppGuideline(disease){
    const data=guidelineData(disease);
    if(!data.ds) return;
    let modal=document.getElementById('v14GuidelineModal');
    if(!modal){
      modal=document.createElement('div');
      modal.id='v14GuidelineModal';
      modal.className='no-print';
      modal.style.cssText='position:fixed;inset:0;background:rgba(2,6,23,.62);z-index:99999;display:flex;align-items:flex-start;justify-content:center;padding:30px 16px;overflow:auto';
      const panel=document.createElement('div');
      panel.id='v14GuidelinePanel';
      panel.style.cssText='width:min(1100px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:16px;box-shadow:0 25px 70px rgba(2,6,23,.35);padding:24px';
      modal.appendChild(panel);
      modal.addEventListener('click',e=>{if(e.target===modal) modal.remove();});
      document.body.appendChild(modal);
    }
    const panel=modal.querySelector('#v14GuidelinePanel');
    panel.innerHTML='';
    const head=document.createElement('div');
    head.style.cssText='display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:16px';
    const title=document.createElement('div');
    const h2=document.createElement('h2'); h2.textContent=disease+' — In-App Guideline Navigator'; h2.style.cssText='margin:0;font-size:22px;color:#0f172a';
    const sub=document.createElement('div'); sub.textContent=data.source+' · integrated Oracle content · clinician verification required'; sub.style.cssText='margin-top:6px;font-size:11px;color:#64748b;line-height:1.4';
    title.append(h2,sub);
    const close=document.createElement('button'); close.type='button'; close.textContent='Close'; close.style.cssText='border:0;background:#0f172a;color:#fff;border-radius:9px;padding:9px 13px;font-weight:800;cursor:pointer'; close.onclick=()=>modal.remove();
    head.append(title,close); panel.appendChild(head);

    const toc=document.createElement('div');
    toc.style.cssText='position:sticky;top:0;z-index:2;background:#fff;padding:8px 0 10px;margin-bottom:10px;border-bottom:1px solid #e2e8f0;display:flex;gap:6px;flex-wrap:wrap';
    panel.appendChild(toc);

    const note=document.createElement('div');
    note.style.cssText='padding:10px 12px;border:1px solid #cbd5e1;border-radius:10px;background:#f8fafc;color:#475569;font-size:11px;line-height:1.5;margin-bottom:16px';
    note.innerHTML='<b>How to use:</b> This is the disease-specific guideline navigator integrated into Oracle. It surfaces the current disease module\'s diagnostic, staging/risk and treatment content. It is a clinical aid, not a substitute for clinician judgement or local protocols.';
    panel.appendChild(note);

    const sections=(data.ds.sections||[]);
    if(!sections.length){
      const empty=document.createElement('div'); empty.textContent='No integrated guideline sections are currently available for this disease.'; empty.style.cssText='padding:16px;border:1px dashed #cbd5e1;border-radius:10px;color:#64748b'; panel.appendChild(empty);
    } else {
      sections.forEach((sec,secIndex)=>{
        const anchor='v14GuideSec_'+secIndex;
        const jump=document.createElement('button');
        jump.type='button';
        jump.textContent=sec.title||('Section '+(secIndex+1));
        jump.style.cssText='border:1px solid #cbd5e1;background:#f8fafc;color:#334155;border-radius:999px;padding:6px 9px;font-size:10px;font-weight:800;cursor:pointer';
        jump.onclick=()=>document.getElementById(anchor)?.scrollIntoView({behavior:'smooth',block:'start'});
        toc.appendChild(jump);
        const wrap=document.createElement('section');
        wrap.id=anchor; wrap.style.cssText='scroll-margin-top:110px;margin:0 0 14px;padding:15px;border:1px solid #dbe5ec;border-radius:12px;background:#fff';
        const sh=document.createElement('h3'); sh.textContent=sec.title||'Guideline section'; sh.style.cssText='margin:0 0 9px;font-size:15px;color:#0f172a';
        wrap.appendChild(sh);
        const items=Array.isArray(sec.items)?sec.items:[];
        items.forEach(item=>{
          const row=document.createElement('div'); row.style.cssText='padding:9px 0;border-top:1px solid #eef2f7;line-height:1.55';
          const label=document.createElement('div'); label.textContent=String(item?.[0]??''); label.style.cssText='font-weight:800;color:#163247;font-size:12px';
          const body=document.createElement('div'); body.textContent=String(item?.[1]??''); body.style.cssText='margin-top:4px;color:#334155;font-size:12px';
          row.append(label,body); wrap.appendChild(row);
        });
        panel.appendChild(wrap);
      });
    }
    modal.style.display='flex';
  }

  function addGuidelineButton(btn,disease){
    if(!btn || !disease) return;
    btn.dataset.oracleDisease=disease;
    let wrap=btn.parentElement;
    if(!wrap) return;
    let guide=wrap.querySelector('.v14-guideline-link');
    if(!guide){
      guide=document.createElement('button');
      guide.type='button';
      guide.className='v14-guideline-link';
      guide.style.cssText='margin-left:8px;background:#0f766e;color:#fff;border:0;border-radius:9px;padding:10px 14px;font-weight:800;cursor:pointer';
      guide.innerHTML='View in-app guideline';
      wrap.appendChild(guide);
      guide.addEventListener('click',ev=>{
        ev.preventDefault();
        ev.stopPropagation();
        const d=btn.dataset.oracleDisease;
        openInAppGuideline(d);
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
  /* V16: the suggested-Oracle button only appears in the AI Lab, so watch that view rather than the whole page. */
  try{observer.observe(document.getElementById('onlineAiView')||document.body,{subtree:true,childList:true});}catch{}
  enhanceSuggestedOracleHandoff();
  setTimeout(enhanceSuggestedOracleHandoff,1200);
  setTimeout(enhanceSuggestedOracleHandoff,3000);

  addMobileUX();
  setTimeout(addMobileUX,500);
  ;
  // V16: the 1.2 s polling loop is gone; its tasks were either dead or are now done directly in the source.

  /* V14 clinical-audit hardening: wire modal actions, reset state, stone modifiers, emergency alert and print layout. */
  window.modal=function(title,html){
    const existing=document.getElementById('v14ActionModal');
    if(existing) existing.remove();
    const back=document.createElement('div');
    back.id='v14ActionModal';
    back.style.cssText='position:fixed;inset:0;background:rgba(2,6,23,.62);z-index:100000;display:flex;align-items:flex-start;justify-content:center;padding:30px 16px;overflow:auto';
    const panel=document.createElement('div');
    panel.style.cssText='width:min(820px,100%);max-height:88vh;overflow:auto;background:#fff;border-radius:16px;box-shadow:0 25px 70px rgba(2,6,23,.35);padding:22px;color:#0f172a';
    const head=document.createElement('div');
    head.style.cssText='display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:14px';
    const h=document.createElement('h3'); h.textContent=String(title||'Oracle information'); h.style.cssText='margin:0;font-size:20px;font-weight:900';
    const close=document.createElement('button'); close.type='button'; close.textContent='Close'; close.style.cssText='border:0;background:#0f172a;color:#fff;border-radius:9px;padding:8px 12px;font-weight:800;cursor:pointer';
    close.onclick=()=>back.remove();
    head.append(h,close);
    const body=document.createElement('div'); body.innerHTML=String(html||''); body.style.cssText='line-height:1.6';
    panel.append(head,body); back.appendChild(panel); document.body.appendChild(back);
    back.addEventListener('click',e=>{if(e.target===back)back.remove();});
    document.addEventListener('keydown',function escClose(e){if(e.key==='Escape'){back.remove();document.removeEventListener('keydown',escClose);}}, {once:true});
  };

  

  function clearOracleOutputAfterReset(){
    const out=document.getElementById('oracleOutput');
    if(out) out.innerHTML='<div class="text-sm font-black">Management output</div><div class="text-xs text-slate-500 mt-1">Enter explicit clinical criteria to generate a pathway.</div>';
    const modalIds=['v14ActionModal','v14GuidelineModal'];
    modalIds.forEach(id=>document.getElementById(id)?.remove());
  }

  function wireResetHardening(){
    if(document.body.dataset.v14ResetHardening==='1') return;
    document.body.dataset.v14ResetHardening='1';
    document.addEventListener('click',e=>{
      const b=e.target?.closest?.('#oracleResetBtn');
      if(!b) return;
      setTimeout(clearOracleOutputAfterReset,0);
    });
  }

  function collapseFloatingMenus(){
    document.querySelectorAll('.dropdown-menu[open],.select-menu[open],[role="menu"][data-open="true"],[role="listbox"][data-open="true"]').forEach(el=>{
      try{el.removeAttribute('open');}catch{}
      try{el.dataset.open='false';}catch{}
      try{el.hidden=true;}catch{}
    });
  }

  function hardenDropdownLayering(){
    if(document.getElementById('v14DropdownHardening')) return;
    const style=document.createElement('style'); style.id='v14DropdownHardening';
    style.textContent=[
      '.oracle-grid,#oracleForm,#oracleView{overflow:visible!important}',
      '#oracleForm label{position:relative}',
      '#oracleForm select,#oracleForm input{position:relative;z-index:5}',
      '.dropdown-menu,.select-menu,[role="listbox"],[role="menu"]{z-index:100001!important}',
      '@media(max-width:900px){.oracle-grid{gap:10px!important}.v4-toolbar{position:relative;z-index:8}}'
    ].join('');
    document.head.appendChild(style);
    document.addEventListener('change',e=>{
      if(e.target?.tagName==='SELECT') collapseFloatingMenus();
    });
  }

  

  

  

  

  

  

  function hardenProcedurePrint(){
    if(document.getElementById('v14PrintRules')) return;
    const style=document.createElement('style'); style.id='v14PrintRules';
    style.textContent='@media print{body{background:#fff!important;color:#000!important}header,footer,nav,.no-print,#globalSearch,button,select,input,textarea{display:none!important}#procedureView{display:block!important;padding:0!important;margin:0!important}#procedureView .card{box-shadow:none!important;border:1px solid #777!important;break-inside:avoid;page-break-inside:avoid;margin:0 0 12pt!important}#procedureView .grid{display:block!important}#procedureView .section-title{font-size:13pt!important}#procedureView .step{background:#fff!important;border-left:2pt solid #000!important;color:#000!important;break-inside:avoid;page-break-inside:avoid}#procedureView .warn,#procedureView .ok{background:#fff!important;border-left:2pt solid #000!important;color:#000!important;break-inside:avoid;page-break-inside:avoid}#procedureView h2,#procedureView h3{color:#000!important} @page{margin:14mm}}';
    document.head.appendChild(style);
  }

  

  

  ;
  wireResetHardening();
  hardenDropdownLayering();
  ;
  hardenProcedurePrint();
  ;
  ;
  ;

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',brand,{once:true}); else ;
  ;
  ;
})();