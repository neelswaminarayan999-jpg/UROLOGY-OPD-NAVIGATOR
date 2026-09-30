(() => {
  'use strict';

  const VERSION = '15.9.0';
  const EXCLUDE_IDS = new Set([
    'globalSearch','stRef','stDate','stPreset','stDays',
    'oracleThemeToggle','oracleCopyNote','oracleClearPatient'
  ]);

  function esc(v){
    return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function visible(el){
    if(!el || !el.isConnected) return false;
    const s=getComputedStyle(el);
    return s.display!=='none' && s.visibility!=='hidden' && s.opacity!=='0';
  }

  function fieldLabel(el){
    const id=el.id;
    if(id){
      const lab=document.querySelector('label[for="'+CSS.escape(id)+'"]');
      if(lab?.textContent.trim()) return lab.textContent.trim();
    }
    const row=el.closest('.row,.field,.input-group,.form-group,.card');
    const lab=row?.querySelector('.label,label,.section-title,.field-label');
    if(lab?.textContent.trim() && lab!==el) return lab.textContent.trim();
    return el.getAttribute('aria-label') || el.getAttribute('name') || el.id || 'Clinical input';
  }

  function valueOf(el){
    if(el.type==='checkbox' || el.type==='radio') return el.checked ? 'Yes' : 'No';
    if(el.tagName==='SELECT'){
      const o=el.options[el.selectedIndex];
      return o ? (o.textContent.trim() || el.value) : el.value;
    }
    return String(el.value ?? '').trim();
  }

  function activeRoots(){
    const preferred=[
      '#oracleView','#diseaseView','#calcView','#procedureView','#drugView','#trialView','#searchView',
      '#v141ToolkitPanel','#bookLabView'
    ];
    const roots=preferred.map(s=>document.querySelector(s)).filter(visible);
    return roots.length ? [...new Set(roots)] : [document.body];
  }

  function clinicalInputs(){
    const seen=new Set(), out=[];
    for(const root of activeRoots()){
      root.querySelectorAll('input,select,textarea').forEach(el=>{
        if(seen.has(el)||!visible(el)||!el.isConnected||!el.disabled||EXCLUDE_IDS.has(el.id)){}
        if(seen.has(el)||!visible(el)||!el.isConnected||el.disabled||EXCLUDE_IDS.has(el.id)) return;
        const type=String(el.type||'').toLowerCase();
        if(['button','submit','reset','file','hidden'].includes(type)) return;
        seen.add(el); out.push(el);
      });
    }
    return out;
  }

  function oracleStateRows(){
    const rows=[];
    try{
      const disease=document.getElementById('oracleDisease')?.value||'';
      const state=(typeof oracleState!=='undefined' && oracleState) ? oracleState : null;
      const defs=(typeof ORACLE_FIELDS!=='undefined' && disease && ORACLE_FIELDS[disease]) ? ORACLE_FIELDS[disease] : [];
      if(state && defs.length){
        defs.forEach(f=>{
          const v=state[f.id];
          if(v===undefined||v===null||v==='') return;
          rows.push({label:f.label||f.id,value:String(v)});
        });
      }
    }catch{}
    return rows;
  }

  function collectTextOutputs(){
    const selectors=[
      '#oracleView #oracleOutput','#oracleView #riskPanelContent','#oracleView .result',
      '#oracleView .v141-result','#oracleView .result-card','#oracleView .treatment-plan',
      '#oracleView .pathway-result','#oracleView .decision-output','#oracleView .oracle-result',
      '#v141ToolkitPanel .v141-result','#v141ToolkitPanel .row',
      '#calcView .result','#procedureView .result','#bookLabView .v10-result'
    ];
    const seen=new Set(), out=[];
    for(const root of activeRoots()){
      for(const sel of selectors){
        root.querySelectorAll(sel).forEach(el=>{
          if(!visible(el)||seen.has(el)) return;
          const t=el.innerText?.trim();
          if(t && t.length>1){seen.add(el);out.push(t);}
        });
      }
    }
    return out;
  }

  function buildOpdNote(){
    const lines=[];
    const now=new Date();
    const disease=document.getElementById('oracleDisease')?.value||'';
    const inputs=clinicalInputs();
    const stateRows=oracleStateRows();
    const rows=[];
    for(const el of inputs){
      const v=valueOf(el);
      if(!v) continue;
      const label=fieldLabel(el).replace(/\s+/g,' ').trim();
      if(!rows.some(x=>x.label===label && x.value===v)) rows.push({label,value:v});
    }
    const merged=[...stateRows];
    rows.forEach(x=>{if(!merged.some(y=>y.label===x.label&&y.value===x.value)) merged.push(x);});

    lines.push('UROLOGY OPD CLINICAL SUMMARY');
    lines.push('Generated: '+now.toLocaleString());
    lines.push('Oracle workflow: '+VERSION);
    lines.push('Clinical decision support only — verify patient-specific factors, current product labels, institutional protocols and MDT requirements before treatment.');
    lines.push('');
    if(disease) lines.push('Clinical module: '+disease);

    if(merged.length){
      lines.push('');
      lines.push('CLINICAL INPUTS');
      merged.slice(0,160).forEach(x=>lines.push('- '+x.label+': '+x.value));
    }

    const outputs=collectTextOutputs();
    if(outputs.length){
      lines.push('');
      lines.push('ASSESSMENT / RISK / MANAGEMENT OUTPUT');
      outputs.join('\n').split('\n').map(x=>x.trim()).filter(Boolean).slice(0,220)
        .forEach(x=>lines.push(x));
    }

    const patientFields=rows.filter(x=>/^(patient|name|age|sex|gender|uhid|mrn|registration|hospital|date of birth|dob)\b/i.test(x.label));
    if(patientFields.length){
      lines.push('');
      lines.push('PATIENT IDENTIFIERS ENTERED IN ORACLE');
      patientFields.forEach(x=>lines.push('- '+x.label+': '+x.value));
    }else{
      lines.push('');
      lines.push('PATIENT IDENTIFIERS');
      lines.push('- No patient name / UHID / demographic identifier was entered in the Oracle workspace.');
    }

    if(!merged.length && !outputs.length){
      lines.push('');
      lines.push('No populated clinical inputs or decision output were found.');
    }

    return lines.join('\n').slice(0,20000);
  }

  async function copyOpdNote(){
    const note=buildOpdNote();
    let copied=false;
    try{
      if(navigator.clipboard && window.isSecureContext){
        await navigator.clipboard.writeText(note);
        copied=true;
      }
    }catch{}
    if(!copied){
      const ta=document.createElement('textarea');
      ta.value=note; ta.setAttribute('readonly','');
      ta.style.cssText='position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:.01';
      document.body.appendChild(ta); ta.focus(); ta.select(); ta.setSelectionRange(0,note.length);
      try{copied=document.execCommand('copy');}catch{}
      ta.remove();
    }
    if(copied){
      toast('OPD note copied to clipboard.');
      return;
    }
    openCopyNoteDialog(note);
  }

  function openCopyNoteDialog(note){
    const old=document.getElementById('oracle158CopyDialog'); if(old) old.remove();
    const back=document.createElement('div');
    back.id='oracle158CopyDialog';
    back.className='oracle158-copy-backdrop no-print';
    back.innerHTML='<div class="oracle158-copy-panel">'+
      '<div class="oracle158-copy-head"><div><b>OPD note</b><div class="oracle158-copy-sub">Clipboard access was blocked by the browser. Tap and hold the text, then choose Copy.</div></div>'+
      '<button type="button" class="oracle158-copy-close">Close</button></div>'+
      '<textarea class="oracle158-copy-text" readonly aria-label="OPD note">'+esc(note)+'</textarea>'+
      '<div class="oracle158-copy-actions"><button type="button" class="oracle158-copy-now">Copy again</button><button type="button" class="oracle158-copy-select">Select all</button></div>'+
      '</div>';
    document.body.appendChild(back);
    const ta=back.querySelector('.oracle158-copy-text');
    const selectAll=()=>{ta.focus();ta.select();ta.setSelectionRange(0,ta.value.length);};
    back.querySelector('.oracle158-copy-close').onclick=()=>back.remove();
    back.querySelector('.oracle158-copy-select').onclick=selectAll;
    back.querySelector('.oracle158-copy-now').onclick=async()=>{
      try{
        await navigator.clipboard.writeText(note);
        toast('OPD note copied to clipboard.');
        back.remove();
      }catch{
        selectAll();
        toast('Text selected — use Copy from the device menu.',false);
      }
    };
    back.addEventListener('click',e=>{if(e.target===back)back.remove();});
    setTimeout(selectAll,50);
  }

  function clearPatientData(){
    let count=0;
    try{
      if(typeof oracleState!=='undefined'){
        const keys=Object.keys(oracleState||{});
        if(keys.length) count+=keys.length;
        oracleState={};
      }
    }catch{}

    document.querySelectorAll('input,select,textarea').forEach(el=>{
      if(!el.isConnected || EXCLUDE_IDS.has(el.id) || el.disabled) return;
      const type=String(el.type||'').toLowerCase();
      if(['button','submit','reset','hidden'].includes(type)) return;
      if(type==='file'){try{if(el.value){el.value='';count++;}}catch{};return;}
      if(type==='checkbox'||type==='radio'){
        if(el.checked){el.checked=false;count++;}
        el.dispatchEvent(new Event('change',{bubbles:true}));
        return;
      }
      if(el.tagName==='SELECT'){
        const blank=[...el.options].findIndex(o=>o.value==='' || /^select\b/i.test(o.textContent.trim()));
        const next=blank>=0?blank:0;
        if(el.selectedIndex!==next) count++;
        el.selectedIndex=next;
        el.dispatchEvent(new Event('change',{bubbles:true}));
        return;
      }
      if(el.value){
        el.value='';
        count++;
        el.dispatchEvent(new Event('input',{bubbles:true}));
        el.dispatchEvent(new Event('change',{bubbles:true}));
      }
    });

    const disease=document.getElementById('oracleDisease');
    if(disease){
      disease.selectedIndex=0;
      disease.dispatchEvent(new Event('change',{bubbles:true}));
    }

    try{
      if(typeof renderOracleForm==='function' && disease?.value) renderOracleForm();
    }catch{}
    try{
      if(typeof renderOracleRisk==='function' && disease?.value){
        renderOracleRisk(disease.value, (typeof oracleState!=='undefined') ? oracleState : {});
      }
    }catch{}

    document.querySelectorAll(
      '#oracleView #oracleOutput,#oracleView #riskPanelContent,#oracleView .result,#oracleView .v141-result,'+
      '#oracleView .result-card,#oracleView .treatment-plan,#oracleView .pathway-result,'+
      '#oracleView .decision-output,#oracleView .oracle-result,#v141ToolkitPanel .v141-result'
    ).forEach(el=>{
      if(visible(el)) el.innerHTML='';
    });

    document.querySelectorAll(
      '#oracle158CopyDialog,#v141ToolkitModal,.oracle-modal,[role="dialog"]'
    ).forEach(el=>{
      if(el.id==='oracle158CopyDialog'||el.id==='v141ToolkitModal') el.remove();
    });

    toast(count ? 'Current patient clinical state cleared.' : 'No patient clinical data found to clear.');
  }

  function toast(msg,success=true){
    let t=document.getElementById('oracle158Toast');
    if(!t){t=document.createElement('div');t.id='oracle158Toast';t.className='oracle158-toast';document.body.appendChild(t);}
    t.textContent=msg;t.dataset.error=success?'0':'1';t.classList.add('show');
    clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),2200);
  }

  function setTheme(theme){
    const next=theme==='light'?'light':'dark';
    document.documentElement.dataset.oracleTheme=next;
    document.body.dataset.oracleTheme=next;
    document.documentElement.style.colorScheme=next;
    localStorage.setItem('uroOracleTheme',next);
    const b=document.getElementById('oracleThemeToggle');
    if(b){
      b.textContent=next==='light'?'🌙 Dark':'☀ Light';
      b.setAttribute('aria-label',next==='light'?'Switch to dark mode':'Switch to light mode');
      b.setAttribute('aria-pressed',next==='dark'?'true':'false');
    }
  }

  function toggleTheme(){
    setTheme(document.body.dataset.oracleTheme==='light'?'dark':'light');
  }

  function addStyles(){
    if(document.getElementById('oracle158Styles')) return;
    const s=document.createElement('style');s.id='oracle158Styles';
    s.textContent=`
      #oracle158Toolbar{position:fixed;right:14px;bottom:14px;z-index:10050;display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;max-width:min(96vw,520px)}
      #oracle158Toolbar button{border:1px solid rgba(148,163,184,.45);border-radius:9px;padding:8px 11px;background:rgba(15,23,42,.92);color:#fff;font:600 12px system-ui;cursor:pointer;box-shadow:0 3px 12px rgba(0,0,0,.18)}
      #oracle158Toolbar button:hover{filter:brightness(1.08)}
      #oracle158Toolbar .primary{background:#0f766e}
      #oracle158Toolbar .danger{background:#991b1b}
      .oracle158-toast{position:fixed;right:14px;bottom:72px;z-index:10051;max-width:min(92vw,460px);padding:10px 13px;border-radius:9px;background:#0f172a;color:#fff;font:600 13px system-ui;opacity:0;transform:translateY(6px);pointer-events:none;transition:.18s}
      .oracle158-toast.show{opacity:1;transform:none}.oracle158-toast[data-error="1"]{background:#991b1b}
      body[data-oracle-theme="light"]{background:#f7f8fa!important;color:#172033!important}
      body[data-oracle-theme="light"] header,body[data-oracle-theme="light"] nav,body[data-oracle-theme="light"] main,body[data-oracle-theme="light"] footer{background:#f7f8fa!important;color:#172033!important}
      body[data-oracle-theme="light"] .card,body[data-oracle-theme="light"] .panel,body[data-oracle-theme="light"] .bg-slate-900,body[data-oracle-theme="light"] .bg-gray-900{background:#fff!important;color:#172033!important;border-color:#cbd5e1!important}
      body[data-oracle-theme="light"] input,body[data-oracle-theme="light"] select,body[data-oracle-theme="light"] textarea{background:#fff!important;color:#172033!important;border-color:#94a3b8!important}
      body[data-oracle-theme="light"] .sub,body[data-oracle-theme="light"] .muted,body[data-oracle-theme="light"] small{color:#475569!important}
      body[data-oracle-theme="dark"]{background:#0b1220!important;color:#e5edf7!important}
      body[data-oracle-theme="dark"] header,body[data-oracle-theme="dark"] nav,body[data-oracle-theme="dark"] main,body[data-oracle-theme="dark"] footer{background:#0b1220!important;color:#e5edf7!important}
      body[data-oracle-theme="dark"] .card,body[data-oracle-theme="dark"] .panel,body[data-oracle-theme="dark"] .bg-white,body[data-oracle-theme="dark"] .bg-slate-50,body[data-oracle-theme="dark"] .bg-slate-100{background:#111827!important;color:#e5edf7!important;border-color:#334155!important}
      body[data-oracle-theme="dark"] .card *,body[data-oracle-theme="dark"] .panel *{border-color:#334155}
      body[data-oracle-theme="dark"] input,body[data-oracle-theme="dark"] select,body[data-oracle-theme="dark"] textarea{background:#0f172a!important;color:#e5edf7!important;border-color:#475569!important}
      body[data-oracle-theme="dark"] input::placeholder,body[data-oracle-theme="dark"] textarea::placeholder{color:#94a3b8!important}
      body[data-oracle-theme="dark"] .text-slate-900,body[data-oracle-theme="dark"] .text-slate-800,body[data-oracle-theme="dark"] .text-gray-900,body[data-oracle-theme="dark"] .text-gray-800{color:#e5edf7!important}
      body[data-oracle-theme="dark"] .text-slate-700,body[data-oracle-theme="dark"] .text-slate-600,body[data-oracle-theme="dark"] .text-gray-700,body[data-oracle-theme="dark"] .text-gray-600,body[data-oracle-theme="dark"] .muted,body[data-oracle-theme="dark"] small{color:#aebdce!important}
      body[data-oracle-theme="dark"] table,body[data-oracle-theme="dark"] th,body[data-oracle-theme="dark"] td{background:#111827!important;color:#e5edf7!important;border-color:#334155!important}
      .oracle158-copy-backdrop{position:fixed;inset:0;z-index:100060;background:rgba(2,6,23,.72);display:flex;align-items:center;justify-content:center;padding:14px}
      .oracle158-copy-panel{width:min(760px,96vw);max-height:92vh;background:#fff;color:#172033;border-radius:14px;padding:15px;box-shadow:0 25px 80px rgba(0,0,0,.4)}
      .oracle158-copy-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.oracle158-copy-head b{font-size:16px}.oracle158-copy-sub{font-size:11px;color:#64748b;margin-top:4px;line-height:1.45}
      .oracle158-copy-close,.oracle158-copy-actions button{border:0;border-radius:8px;padding:8px 11px;font-weight:800;cursor:pointer;background:#0f172a;color:#fff}
      .oracle158-copy-text{display:block;width:100%;height:min(62vh,520px);margin-top:10px;border:1px solid #cbd5e1;border-radius:9px;padding:10px;resize:none;font:12px/1.5 ui-monospace,monospace;background:#f8fafc;color:#172033}
      .oracle158-copy-actions{display:flex;gap:8px;margin-top:9px}.oracle158-copy-actions button+button{background:#475569}
      @media(max-width:700px){#oracle158Toolbar{left:8px;right:8px;bottom:8px;justify-content:center}#oracle158Toolbar button{font-size:11px;padding:7px 9px}}
      @media print{#oracle158Toolbar,#oracle158Toast,.oracle158-copy-backdrop{display:none!important}}
      /* V15.9 theme hardening: these selectors intentionally sit last so the toggle overrides earlier UI !important rules. */
      html[data-oracle-theme="light"] body,
      html[data-oracle-theme="light"] body>div.max-w-7xl{
        background:#f7f8fa!important;color:#172033!important;
      }
      html[data-oracle-theme="light"] body>div.max-w-7xl header.sticky-top{
        background:#ffffff!important;color:#172033!important;border-color:#cbd5e1!important;
      }
      html[data-oracle-theme="light"] body>div.max-w-7xl header.sticky-top .text-lg,
      html[data-oracle-theme="light"] body>div.max-w-7xl header.sticky-top .text-slate-300{
        color:#172033!important;
      }
      html[data-oracle-theme="light"] body>div.max-w-7xl .card,
      html[data-oracle-theme="light"] body>div.max-w-7xl .panel,
      html[data-oracle-theme="light"] body>div.max-w-7xl [class*="bg-slate-"],
      html[data-oracle-theme="light"] body>div.max-w-7xl [class*="bg-gray-"]{
        color:#172033!important;border-color:#cbd5e1!important;
      }
      html[data-oracle-theme="dark"] body,
      html[data-oracle-theme="dark"] body>div.max-w-7xl{
        background:#0b1220!important;color:#e5edf7!important;
      }
      html[data-oracle-theme="dark"] body>div.max-w-7xl .card,
      html[data-oracle-theme="dark"] body>div.max-w-7xl .panel{
        background:#111827!important;color:#e5edf7!important;border-color:#334155!important;
      }
      @media(max-width:700px){
        #oracle158Toolbar{max-width:100vw}
        #oracle158Toolbar button{min-height:38px}
      }
    `;
    document.head.appendChild(s);
  }

  function addToolbar(){
    if(document.getElementById('oracle158Toolbar')) return;
    const bar=document.createElement('div');bar.id='oracle158Toolbar';bar.className='no-print';
    bar.innerHTML='<button id="oracleCopyNote" class="primary" title="Copy the current clinical inputs and visible Oracle output">📋 Copy OPD Note</button>'+
      '<button id="oracleClearPatient" class="danger" title="Clear transient clinical inputs and visible decision output">🧹 Clear Patient</button>'+
      '<button id="oracleThemeToggle" title="Toggle high-readability light/dark mode">☀ Light</button>';
    document.body.appendChild(bar);
    document.getElementById('oracleCopyNote').onclick=copyOpdNote;
    document.getElementById('oracleClearPatient').onclick=clearPatientData;
    document.getElementById('oracleThemeToggle').onclick=toggleTheme;
  }

  function addInputHygiene(){
    document.querySelectorAll('input,select,textarea').forEach(el=>{
      if(EXCLUDE_IDS.has(el.id)) return;
      if(el.type==='hidden' || el.type==='button' || el.type==='submit' || el.type==='reset') return;
      if(el.getAttribute('autocomplete')==null) el.setAttribute('autocomplete','off');
      if(el.getAttribute('spellcheck')==null) el.setAttribute('spellcheck','false');
    });
  }

  function addKeyboard(){
    if(document.body.dataset.oracle158Keys==='1') return;
    document.body.dataset.oracle158Keys='1';
    document.addEventListener('keydown',e=>{
      const target=e.target;
      const typing=target && (target.matches?.('input,textarea,select,[contenteditable="true"]'));
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){
        e.preventDefault();document.getElementById('globalSearch')?.focus();document.getElementById('globalSearch')?.select();return;
      }
      if(e.key==='/' && !typing && !e.ctrlKey && !e.altKey && !e.metaKey){
        e.preventDefault();const s=document.getElementById('globalSearch');if(s){s.focus();s.select();}return;
      }
      if(e.altKey && e.key.toLowerCase()==='c'){e.preventDefault();copyOpdNote();return;}
      if(e.altKey && e.key.toLowerCase()==='r'){e.preventDefault();clearPatientData();return;}
      if(e.key==='Escape'){
        const modal=document.getElementById('v141ToolkitModal');if(modal){modal.remove();return;}
        document.querySelectorAll('.oracle-modal,[role="dialog"]').forEach(el=>{if(visible(el))el.remove();});
      }
    });
  }

  function apply(){
    if(!document.body) return;
    addStyles();
    addToolbar();
    addInputHygiene();
    addKeyboard();
    const saved=localStorage.getItem('uroOracleTheme');
    if(saved==='light'||saved==='dark') setTheme(saved);
  }

  window.UROLOGY_OPD_WORKFLOW={version:VERSION,copyOpdNote:copyOpdNote,clearPatientData:clearPatientData,setTheme:setTheme};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  [800,1800,3500].forEach(ms=>setTimeout(apply,ms));
})();