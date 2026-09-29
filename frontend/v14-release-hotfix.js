/* Urology Oracle V14.0 UI compatibility layer — working AI, in-app guideline integration and release branding. */
(function(){
  'use strict';
  function replaceText(oldText,newText){
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const nodes=[]; let n;
    while(n=walker.nextNode()) if(n.nodeValue && n.nodeValue.includes(oldText)) nodes.push(n);
    nodes.forEach(node=>node.nodeValue=node.nodeValue.split(oldText).join(newText));
  }
  function brand(){
    document.title='Urology Oracle V14.0 — Final Clinical Workstation';
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
    const key=document.getElementById('aiKeyWrap');
    if(key) key.style.display='none';
  }
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

  async function optimizeImageFile(file){
    if(!file || !file.type.startsWith('image/') || file.size<=2500000) return file;
    try{
      const bmp=await createImageBitmap(file);
      const maxSide=2200;
      const scale=Math.min(1,maxSide/Math.max(bmp.width,bmp.height));
      const canvas=document.createElement('canvas');
      canvas.width=Math.max(1,Math.round(bmp.width*scale));
      canvas.height=Math.max(1,Math.round(bmp.height*scale));
      const ctx=canvas.getContext('2d',{alpha:false});
      ctx.drawImage(bmp,0,0,canvas.width,canvas.height);
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.86));
      bmp.close();
      if(blob && blob.size<file.size){
        return new File([blob],file.name.replace(/\.[^.]+$/i,'.jpg'),{type:'image/jpeg',lastModified:file.lastModified});
      }
    }catch{}
    return file;
  }

  function optimizeInvestigationImages(){
    const input=document.querySelector('#onlineAiView input[type="file"]');
    if(!input || input.dataset.v14Optimized==='1') return;
    input.dataset.v14Optimized='1';
    input.addEventListener('change',async()=>{
      const files=[...(input.files||[])];
      if(!files.length) return;
      const optimized=[];
      for(const file of files) optimized.push(await optimizeImageFile(file));
      try{
        const dt=new DataTransfer();
        optimized.forEach(file=>dt.items.add(file));
        input.files=dt.files;
      }catch{}
    });
  }


  function friendlyAIError(){
    findAIErrorContainers().forEach(el=>{
      if(el.dataset.v14Friendly==='1') return;
      const raw=el.innerText||'';
      el.dataset.v14Friendly='1';
      const details=document.createElement('details');
      details.style.cssText='margin-top:8px';
      const sum=document.createElement('summary'); sum.textContent='Technical details'; sum.style.cssText='cursor:pointer;font-weight:700;color:#64748b';
      const pre=document.createElement('div'); pre.className='v14-ai-tech'; pre.textContent=raw;
      details.append(sum,pre);

      const box=document.createElement('div'); box.className='v14-ai-error';
      box.innerHTML='<div class="v14-ai-error-title">Online AI temporarily unavailable</div><div class="v14-ai-error-text">The investigation image was uploaded successfully, but the free online AI service is currently busy or rate-limited. Please retry shortly. Your investigation remains in the current session.</div>';
      const actions=document.createElement('div'); actions.className='v14-ai-error-actions';
      const retry=document.createElement('button'); retry.className='v14-ai-retry'; retry.textContent='Retry analysis';
      retry.onclick=()=>{
        const b=[...document.querySelectorAll('#onlineAiView button')].find(x=>/analyze investigation/i.test(x.innerText||''));
        if(b) b.click();
      };
      const oracle=document.createElement('button'); oracle.className='v14-ai-oracle'; oracle.textContent='Open Clinical Oracle';
      oracle.onclick=()=>revealOracleView();
      actions.append(retry,oracle); box.append(actions,details);
      el.replaceWith(box);
    });
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
  try{observer.observe(document.body,{subtree:true,childList:true});}catch{}
  enhanceSuggestedOracleHandoff();
  setTimeout(enhanceSuggestedOracleHandoff,1200);
  setTimeout(enhanceSuggestedOracleHandoff,3000);

  addMobileUX();
  setTimeout(addMobileUX,500);
  setTimeout(optimizeInvestigationImages,1000);
  setInterval(()=>{optimizeInvestigationImages();friendlyAIError();},1200);

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

  function normalizeHeaderBrand(){
    const h=document.querySelector('header .text-lg');
    if(h) h.textContent='Urology Oracle V14.0';
    replaceText('Decision support • treatment pathways • surgical atlas • scores • trials • dose references • follow-up',
      'Decision support • Treatment pathways • Surgical atlas • Scores • Trials • Dose references • Follow-up');
  }

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

  function addStoneClinicalFields(){
    if(typeof ORACLE_FIELDS==='undefined' || !ORACLE_FIELDS['Stone Disease']) return;
    const fields=ORACLE_FIELDS['Stone Disease'];
    const has=id=>fields.some(f=>f.id===id);
    if(!has('lowerPole')) fields.push({
      id:'lowerPole',label:'Lower-pole renal stone',options:['No','Yes'],show:v=>v.site==='Kidney'&&v.size==='10–20 mm'&&v.infection==='No'
    });
    if(!has('lpAnatomy')) fields.push({
      id:'lpAnatomy',label:'Lower-pole anatomy relevant to SWL clearance',options:['Favourable / not obviously adverse','Unfavourable: steep IPA / long calyx / narrow infundibulum','Not assessed'],show:v=>v.lowerPole==='Yes'
    });
    if(!has('density')) fields.push({
      id:'density',label:'Stone attenuation on NCCT',options:['<900 HU','900–1000 HU','>1000 HU','Not available'],show:v=>v.site==='Kidney'&&v.size==='10–20 mm'&&v.infection==='No'
    });
    if(!has('ssd')) fields.push({
      id:'ssd',label:'Skin-to-stone distance',options:['<10 cm','≥10 cm','Not measured'],show:v=>v.site==='Kidney'&&v.size==='10–20 mm'&&v.infection==='No'
    });
    if(!has('composition')) fields.push({
      id:'composition',label:'Stone composition / SWL resistance',options:['Not known','Likely SWL-sensitive','Known/likely SWL-resistant'],show:v=>v.site==='Kidney'&&v.size==='10–20 mm'&&v.infection==='No'
    });
  }

  function stoneDecisionV14(v){
    if(v.infection==='Yes'){
      return '<div style="border-left:6px solid #b91c1c;background:#fef2f2;padding:15px 16px;border-radius:12px;font-size:14px;line-height:1.6"><b>🚨 UROLOGICAL EMERGENCY — DRAIN FIRST</b><br>Sepsis/infected obstruction takes priority over definitive stone treatment. Urgently decompress with ureteral stenting or percutaneous nephrostomy; obtain urine and blood cultures and start antibiotics immediately. Definitive stone treatment should be delayed until sepsis has resolved and the patient is clinically stabilised.</div><div class="mt-4 p-4 border border-slate-200 rounded-xl"><b>Why this branch:</b> An infected obstructed collecting system requires urgent source control; stent and nephrostomy are accepted decompression routes. <span class="badge badge-red" style="margin-left:6px">Do not lithotripsy in the acute septic phase</span></div><div class="mt-4 text-[11px] text-slate-500">Source layer: EAU Urolithiasis 2026</div>';
    }
    if(v.site==='Kidney'&&v.size==='10–20 mm'){
      const lower=v.lowerPole==='Yes';
      const unfavLower=lower&&v.lpAnatomy&&v.lpAnatomy.startsWith('Unfavourable');
      const highHU=v.density==='>1000 HU';
      const longSSD=v.ssd==='≥10 cm';
      const resistant=v.composition==='Known/likely SWL-resistant';
      const swlUnfavourable=unfavLower||highHU||longSSD||resistant;
      let pathway='';
      if(lower){
        pathway=swlUnfavourable
          ? 'For a 10–20 mm lower-pole stone with unfavourable SWL predictors, favour an endoscopic strategy (RIRS or mini-PCNL) rather than SWL. The choice between RIRS and mini-PCNL should reflect stone burden, anatomy, bleeding risk, operative goals and patient preference.'
          : 'For a 10–20 mm lower-pole stone, RIRS and mini-PCNL are the principal endoscopic options; SWL has lower/less predictable clearance in the lower pole, and selection should account for calyceal anatomy and CT predictors of SWL success.';
      }else{
        pathway=swlUnfavourable
          ? 'For a 10–20 mm renal stone outside the lower pole with adverse SWL predictors, RIRS/mini-PCNL become more attractive because SWL fragmentation/clearance is less favourable. Exact selection depends on burden, anatomy, bleeding risk and patient preference.'
          : 'For a 10–20 mm non-lower-pole renal stone with favourable anatomy and CT characteristics, SWL, RIRS and mini-PCNL are established options. The trade-off is repeated SWL sessions versus endoscopic/percutaneous invasiveness and stone-free probability.';
      }
      const mods=[
        ['Location',lower?'Lower pole':'Non-lower pole'],
        ['Lower-pole anatomy',lower?(v.lpAnatomy||'Not assessed'):'Not applicable'],
        ['CT attenuation',v.density||'Not assessed'],
        ['Skin-to-stone distance',v.ssd||'Not assessed'],
        ['Composition',v.composition||'Not assessed']
      ];
      return '<div class="flex flex-wrap gap-2 items-center"><span class="badge badge-green">Renal stone — 10–20 mm</span><span class="badge badge-blue">V14 CT/anatomy branch</span></div>'+
        '<h3 class="text-lg font-black mt-2">Definitive treatment pathway</h3>'+
        '<div class="rule mt-3 text-sm leading-6"><b>Recommended pathway:</b><br>'+pathway+'</div>'+
        '<div class="decision mt-3 text-sm leading-6"><b>Decision modifiers recorded</b><br>'+mods.map(x=>'<b>'+esc(x[0])+':</b> '+esc(x[1])).join('<br>')+'</div>'+
        '<div class="warn mt-3 text-xs leading-5"><b>SWL limitations to check:</b><br>EAU 2026 identifies lower-pole location, steep infundibulopelvic angle, long calyx, narrow infundibulum, long skin-to-stone distance and hard stone composition as negative predictors; CT attenuation >1000 HU with high homogeneity makes disintegration less likely. These are modifiers, not standalone absolute treatment rules.</div>'+
        '<div class="mt-4 text-[11px] text-slate-500">Source layer: EAU Urolithiasis 2026; AUA Surgical Management of Stones (CT selection parameters and lower-pole guidance).</div>';
    }
    if(v.staghorn==='Yes'||v.size==='>20 mm'){
      return '<div class="flex flex-wrap gap-2 items-center"><span class="badge badge-green">Large / branching renal stone</span></div><h3 class="text-lg font-black mt-2">PCNL-centred pathway</h3><div class="rule mt-3 text-sm leading-6"><b>Recommended pathway:</b><br>PCNL is the core treatment route for renal stone burden >20 mm and complex branching/staghorn stones, with staged or adjunctive procedures according to burden and anatomy.</div><div class="warn mt-3 text-xs leading-5"><b>Do not miss:</b><br>Pre-op urine culture; infection control; bleeding/antithrombotic planning; consider stone or renal-pelvic urine culture during PCNL when possible.</div><div class="mt-4 text-[11px] text-slate-500">Source layer: EAU Urolithiasis 2026</div>';
    }
    if(v.site==='Distal ureter'){
      return '<div class="flex flex-wrap gap-2 items-center"><span class="badge badge-green">Distal ureter stone</span></div><h3 class="text-lg font-black mt-2">Ureteral pathway</h3><div class="rule mt-3 text-sm leading-6"><b>Recommended pathway:</b><br>For a stable non-infected distal ureter stone, observation/medical expulsive management may be used when spontaneous passage is plausible; ureteroscopy or SWL is used when active intervention is indicated.</div><div class="warn mt-3 text-xs leading-5"><b>Urgency gate:</b><br>Do not delay drainage or definitive management when infection, anuria, uncontrolled pain or threatened renal function is present.</div><div class="mt-4 text-[11px] text-slate-500">Source layer: EAU Urolithiasis 2026</div>';
    }
    if(v.site==='Proximal ureter'){
      return '<div class="flex flex-wrap gap-2 items-center"><span class="badge badge-green">Proximal ureter stone</span></div><h3 class="text-lg font-black mt-2">Ureteral pathway</h3><div class="rule mt-3 text-sm leading-6"><b>Recommended pathway:</b><br>Select SWL or ureteroscopy according to stone size, obstruction, anatomy and the need for rapid definitive clearance; consider antegrade removal for selected large/impacted proximal stones when retrograde access is not suitable.</div><div class="warn mt-3 text-xs leading-5"><b>Urgency gate:</b><br>Infection or anuria changes the pathway to urgent drainage first.</div><div class="mt-4 text-[11px] text-slate-500">Source layer: EAU Urolithiasis 2026</div>';
    }
    return '<div class="flex flex-wrap gap-2 items-center"><span class="badge badge-green">Renal / bladder stone pathway</span></div><h3 class="text-lg font-black mt-2">Individualised stone treatment</h3><div class="rule mt-3 text-sm leading-6"><b>Recommended pathway:</b><br>Match intervention to stone burden, location, anatomy, infection status, bleeding risk and patient preference.</div><div class="warn mt-3 text-xs leading-5"><b>Safety gate:</b><br>Treat or exclude clinically significant infection before definitive stone removal.</div><div class="mt-4 text-[11px] text-slate-500">Source layer: EAU Urolithiasis 2026</div>';
  }

  function hardenStoneOracle(){
    addStoneClinicalFields();
    if(typeof ORACLE_FIELDS==='undefined') return;
    const originalIncomplete=window.oracleIncomplete;
    if(typeof originalIncomplete==='function'){}
    if(typeof oracleRequired!=='undefined'){
      /* oracleRequired is a global function declaration in the base build; replace the public binding for stone-specific readiness. */
      const priorRequired=window.oracleRequired;
      window.oracleRequired=function(name,v){
        if(name!=='Stone Disease') return priorRequired?priorRequired(name,v):[];
        const req=['site','size','infection'];
        if(v.site==='Kidney'&&v.size==='10–20 mm'&&v.infection==='No'){
          req.push('lowerPole','density','ssd','composition');
          if(v.lowerPole==='Yes') req.push('lpAnatomy');
        }
        return req;
      };
    }
  }

  function updateStoneProgress(){
    const sel=document.getElementById('oracleDisease');
    if(!sel||sel.value!=='Stone Disease') return;
    const p=document.getElementById('oracleProgress');
    if(!p) return;
    const v=window.__v14StoneState||{};
    const required=['site','size','infection'];
    const baseDone=required.filter(k=>v[k]!=null&&v[k]!=='').length;
    const special=v.site==='Kidney'&&v.size==='10–20 mm'&&v.infection==='No';
    if(!special){
      p.innerHTML='Core decision inputs: <b>'+baseDone+'/3</b> • modifiers: assessed as applicable after location/size/infection are selected.';
      return;
    }
    const mods=['lowerPole','density','ssd','composition'];
    if(v.lowerPole==='Yes') mods.push('lpAnatomy');
    const modDone=mods.filter(k=>v[k]!=null&&v[k]!=='').length;
    const total=required.length+mods.length;
    const done=baseDone+modDone;
    p.innerHTML='Pathway readiness: <b>'+done+'/'+total+'</b> • core inputs '+baseDone+'/3 • CT/anatomy modifiers '+modDone+'/'+mods.length+' assessed.';
  }

  function syncStoneStateFromForm(){
    const sel=document.getElementById('oracleDisease');
    if(!sel||sel.value!=='Stone Disease') return;
    const ids=['site','size','infection','lowerPole','lpAnatomy','density','ssd','composition'];
    const v={};
    ids.forEach(id=>{
      const e=document.getElementById('of-'+id);
      if(e) v[id]=e.value;
    });
    window.__v14StoneState=v;
    updateStoneProgress();
  }

  function wireStoneCapture(){
    if(document.body.dataset.v14StoneWire==='1') return;
    document.body.dataset.v14StoneWire='1';
    document.addEventListener('change',e=>{
      if(e.target?.id?.startsWith('of-') || e.target?.id==='oracleDisease'){
        setTimeout(()=>{syncStoneStateFromForm();collapseFloatingMenus();},0);
      }
    });
    document.addEventListener('click',e=>{
      const run=e.target?.closest?.('#oracleRunBtn');
      const sel=document.getElementById('oracleDisease');
      if(!run||!sel||sel.value!=='Stone Disease') return;
      syncStoneStateFromForm();
      const v=window.__v14StoneState||{};
      if(v.site==='Kidney'&&v.size==='10–20 mm'&&v.infection==='No'){
        const required=['lowerPole','density','ssd','composition'];
        if(v.lowerPole==='Yes') required.push('lpAnatomy');
        const missing=required.filter(k=>!v[k]);
        if(missing.length){
          e.preventDefault(); e.stopImmediatePropagation();
          const out=document.getElementById('oracleOutput');
          out.innerHTML='<div class="warn text-sm"><b>Pathway incomplete.</b><br>Complete the CT/anatomy modifiers before generating the 10–20 mm renal-stone recommendation: '+esc(missing.join(', '))+'.</div>';
          return;
        }
        e.preventDefault(); e.stopImmediatePropagation();
        document.getElementById('oracleOutput').innerHTML=stoneDecisionV14(v);
      }else if(v.infection==='Yes'){
        e.preventDefault(); e.stopImmediatePropagation();
        document.getElementById('oracleOutput').innerHTML=stoneDecisionV14(v);
      }
      setTimeout(updateStoneProgress,0);
    },true);
  }

  function hardenProcedurePrint(){
    if(document.getElementById('v14PrintRules')) return;
    const style=document.createElement('style'); style.id='v14PrintRules';
    style.textContent='@media print{body{background:#fff!important;color:#000!important}header,footer,nav,.no-print,#globalSearch,button,select,input,textarea{display:none!important}#procedureView{display:block!important;padding:0!important;margin:0!important}#procedureView .card{box-shadow:none!important;border:1px solid #777!important;break-inside:avoid;page-break-inside:avoid;margin:0 0 12pt!important}#procedureView .grid{display:block!important}#procedureView .section-title{font-size:13pt!important}#procedureView .step{background:#fff!important;border-left:2pt solid #000!important;color:#000!important;break-inside:avoid;page-break-inside:avoid}#procedureView .warn,#procedureView .ok{background:#fff!important;border-left:2pt solid #000!important;color:#000!important;break-inside:avoid;page-break-inside:avoid}#procedureView h2,#procedureView h3{color:#000!important} @page{margin:14mm}}';
    document.head.appendChild(style);
  }

  hardenStoneOracle();
  wireResetHardening();
  hardenDropdownLayering();
  wireStoneCapture();
  hardenProcedurePrint();
  normalizeHeaderBrand();
  setTimeout(()=>{normalizeHeaderBrand();syncStoneStateFromForm();},600);
  setTimeout(()=>{normalizeHeaderBrand();syncStoneStateFromForm();},1600);

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',brand,{once:true}); else brand();
  setTimeout(brand,1200);
  setTimeout(brand,3000);
})();