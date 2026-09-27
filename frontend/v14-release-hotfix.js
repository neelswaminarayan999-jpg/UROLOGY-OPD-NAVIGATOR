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

  function optimizeInvestigationImages(){
    const input=document.querySelector('#onlineAiView input[type="file"][accept*="image"], #onlineAiView input[type="file"]');
    if(!input || input.dataset.v14Optimized==='1') return;
    input.dataset.v14Optimized='1';
    input.addEventListener('change', async ()=>{
      const files=[...(input.files||[])];
      if(!files.length) return;
      const optimized=[];
      for(const file of files){
        if(!file.type.startsWith('image/') || file.size<=2500000){ optimized.push(file); continue; }
        try{
          const bmp=await createImageBitmap(file);
          const maxSide=2200;
          const scale=Math.min(1,maxSide/Math.max(bmp.width,bmp.height));
          const canvas=document.createElement('canvas');
          canvas.width=Math.max(1,Math.round(bmp.width*scale));
          canvas.height=Math.max(1,Math.round(bmp.height*scale));
          const ctx=canvas.getContext('2d');
          ctx.drawImage(bmp,0,0,canvas.width,canvas.height);
          const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.86));
          bmp.close();
          if(blob && blob.size < file.size) optimized.push(new File([blob],file.name.replace(/\.[^.]+$/i,'.jpg'),{type:'image/jpeg',lastModified:file.lastModified}));
          else optimized.push(file);
        }catch{ optimized.push(file); }
      }
      try{
        const dt=new DataTransfer(); optimized.forEach(f=>dt.items.add(f)); input.files=dt.files;
      }catch{}
    });
  }

  function friendlyAIError(){
    document.querySelectorAll('#onlineAiView .v12-error,#onlineAiView .v11-error,.v14-ai-error').forEach(el=>{
      if(el.dataset.v14Friendly==='1') return;
      const raw=el.innerText||'';
      if(!/OpenRouter|Gemini|Groq|Cerebras|429|503|safety-classification|Run the supplied server package/i.test(raw)) return;
      el.dataset.v14Friendly='1';
      const details=document.createElement('details');
      details.style.cssText='margin-top:8px';
      const sum=document.createElement('summary'); sum.textContent='Technical details'; sum.style.cssText='cursor:pointer;font-weight:700;color:#64748b';
      const pre=document.createElement('div'); pre.className='v14-ai-tech'; pre.textContent=raw;
      details.append(sum,pre);
      const box=document.createElement('div'); box.className='v14-ai-error';
      box.innerHTML='<div class="v14-ai-error-title">Online AI temporarily unavailable</div><div class="v14-ai-error-text">The investigation image was uploaded successfully, but the free online AI service is temporarily unavailable. Your data remains in the current session. You can retry shortly or continue with the disease-specific Clinical Oracle.</div>';
      const actions=document.createElement('div'); actions.className='v14-ai-error-actions';
      const retry=document.createElement('button'); retry.className='v14-ai-retry'; retry.textContent='Retry analysis';
      retry.onclick=()=>{ const b=[...document.querySelectorAll('#onlineAiView button')].find(x=>/analyze investigation/i.test(x.innerText||'')); if(b) b.click(); };
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
    const h2=document.createElement('h2'); h2.textContent=disease+' — In-App Guideline Navigator V14.0'; h2.style.cssText='margin:0;font-size:22px;color:#0f172a';
    const sub=document.createElement('div'); sub.textContent=data.source+' · integrated Oracle content · clinician verification required'; sub.style.cssText='margin-top:6px;font-size:11px;color:#64748b;line-height:1.4';
    title.append(h2,sub);
    const close=document.createElement('button'); close.type='button'; close.textContent='Close'; close.style.cssText='border:0;background:#0f172a;color:#fff;border-radius:9px;padding:9px 13px;font-weight:800;cursor:pointer'; close.onclick=()=>modal.remove();
    head.append(title,close); panel.appendChild(head);

    const note=document.createElement('div');
    note.style.cssText='padding:10px 12px;border:1px solid #cbd5e1;border-radius:10px;background:#f8fafc;color:#475569;font-size:11px;line-height:1.5;margin-bottom:16px';
    note.innerHTML='<b>How to use:</b> This is the disease-specific guideline navigator integrated into Oracle. It surfaces the current disease module\'s diagnostic, staging/risk and treatment content. It is a clinical aid, not a substitute for clinician judgement or local protocols.';
    panel.appendChild(note);

    const sections=(data.ds.sections||[]);
    if(!sections.length){
      const empty=document.createElement('div'); empty.textContent='No integrated guideline sections are currently available for this disease.'; empty.style.cssText='padding:16px;border:1px dashed #cbd5e1;border-radius:10px;color:#64748b'; panel.appendChild(empty);
    } else {
      sections.forEach(sec=>{
        const wrap=document.createElement('section');
        wrap.style.cssText='margin:0 0 14px;padding:15px;border:1px solid #dbe5ec;border-radius:12px;background:#fff';
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

  setTimeout(enhanceClinicalUI,1200);
  setTimeout(addEvidenceBlocks,1500);
  setTimeout(addEvidenceBlocks,3500);

  addMobileUX();
  setTimeout(addMobileUX,500);
  setTimeout(optimizeInvestigationImages,1000);
  setInterval(()=>{optimizeInvestigationImages();friendlyAIError();},1200);

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',brand,{once:true}); else brand();
  setTimeout(brand,1200);
  setTimeout(brand,3000);
})();