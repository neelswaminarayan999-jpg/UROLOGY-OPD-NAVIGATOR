(() => {
  'use strict';

  const VERSION = '15.8.0';
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

  function clinicalInputs(){
    return [...document.querySelectorAll('input,select,textarea')]
      .filter(el=>visible(el) && !EXCLUDE_IDS.has(el.id) && !el.disabled &&
        !['button','submit','reset','file','hidden'].includes(String(el.type).toLowerCase()));
  }

  function collectTextOutputs(){
    const selectors=[
      '#oracleView .result','#oracleView .v141-result','#oracleView .result-card',
      '#oracleView .treatment-plan','#oracleView .pathway-result',
      '#oracleView .decision-output','#oracleView .oracle-result',
      '#v141ToolkitPanel .v141-result','#v141ToolkitPanel .row'
    ];
    const seen=new Set(), out=[];
    for(const sel of selectors){
      document.querySelectorAll(sel).forEach(el=>{
        if(!visible(el)||seen.has(el)) return;
        const t=el.innerText?.trim();
        if(t){seen.add(el);out.push(t);}
      });
    }
    return out;
  }

  function buildOpdNote(){
    const lines=[];
    lines.push('UROLOGY OPD DECISION SUMMARY');
    lines.push('Generated locally by Urology Oracle '+VERSION+'.');
    lines.push('Clinical decision support only — clinician verification and local/institutional protocol remain controlling.');
    lines.push('');
    const disease=document.getElementById('oracleDisease');
    if(disease?.value) lines.push('Module: '+disease.value);
    const inputs=clinicalInputs();
    const rows=[];
    for(const el of inputs){
      const v=valueOf(el);
      if(!v) continue;
      const label=fieldLabel(el).replace(/\s+/g,' ').trim();
      if(!rows.some(x=>x.label===label && x.value===v)) rows.push({label,value:v});
    }
    if(rows.length){
      lines.push('Clinical inputs:');
      rows.slice(0,100).forEach(x=>lines.push('- '+x.label+': '+x.value));
    }
    const outputs=collectTextOutputs();
    if(outputs.length){
      lines.push('');
      lines.push('Oracle output / decision context:');
      outputs.join('\n').split('\n').map(x=>x.trim()).filter(Boolean).slice(0,120)
        .forEach(x=>lines.push('- '+x));
    }
    if(lines.length<=4) lines.push('No populated clinical fields or visible decision output were found.');
    return lines.join('\n').slice(0,14000);
  }

  async function copyOpdNote(){
    const note=buildOpdNote();
    try{
      await navigator.clipboard.writeText(note);
      toast('OPD note copied to clipboard.');
    }catch{
      const ta=document.createElement('textarea');
      ta.value=note; ta.setAttribute('readonly',''); ta.style.position='fixed'; ta.style.left='-9999px';
      document.body.appendChild(ta); ta.select();
      let ok=false; try{ok=document.execCommand('copy');}catch{}
      ta.remove();
      toast(ok?'OPD note copied to clipboard.':'Clipboard access was blocked. The note remains available through the console-free fallback selection.', ok);
      if(!ok){
        const w=window.open('','_blank','noopener,noreferrer,width=720,height=640');
        if(w){w.document.title='Urology Oracle OPD Note';w.document.body.innerHTML='<pre style="white-space:pre-wrap;font:14px system-ui;padding:20px">'+esc(note)+'</pre>';}
      }
    }
  }

  function clearPatientData(){
    const keepActiveSearch=document.activeElement;
    let count=0;
    document.querySelectorAll('input,select,textarea').forEach(el=>{
      if(!el.isConnected || EXCLUDE_IDS.has(el.id) || el.disabled) return;
      const type=String(el.type||'').toLowerCase();
      if(['button','submit','reset','hidden'].includes(type)) return;
      if(type==='file'){ try{el.value='';count++;}catch{}; return; }
      if(type==='checkbox' || type==='radio'){ if(el.checked){el.checked=false;count++;} return; }
      if(el.tagName==='SELECT'){
        if(el.selectedIndex!==0){el.selectedIndex=0;count++;}
        el.dispatchEvent(new Event('change',{bubbles:true}));
        return;
      }
      if(el.value){el.value='';count++;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}
    });
    const disease=document.getElementById('oracleDisease');
    if(disease && !EXCLUDE_IDS.has(disease.id)){disease.selectedIndex=0;disease.dispatchEvent(new Event('change',{bubbles:true}));}
    document.querySelectorAll('#oracleView .result,#oracleView .v141-result,#oracleView .result-card,#oracleView .treatment-plan,#oracleView .pathway-result,#oracleView .decision-output,#oracleView .oracle-result')
      .forEach(el=>{if(visible(el)) el.innerHTML='';});
    if(keepActiveSearch?.isConnected) keepActiveSearch.focus();
    toast(count ? 'Current clinical inputs cleared.' : 'No populated clinical inputs found.');
  }

  function toast(msg,success=true){
    let t=document.getElementById('oracle158Toast');
    if(!t){t=document.createElement('div');t.id='oracle158Toast';t.className='oracle158-toast';document.body.appendChild(t);}
    t.textContent=msg;t.dataset.error=success?'0':'1';t.classList.add('show');
    clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),2200);
  }

  function setTheme(theme){
    document.body.dataset.oracleTheme=theme;
    localStorage.setItem('uroOracleTheme',theme);
    const b=document.getElementById('oracleThemeToggle');
    if(b)b.textContent=theme==='light'?'🌙 Dark':'☀ Light';
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
      body[data-oracle-theme="light"] input,body[data-oracle-theme="light"] select,body[data-oracle-theme="light"] textarea{background:#fff!important;color:#172033!important;border-color:#94a3b8!important}
      body[data-oracle-theme="light"] .card,body[data-oracle-theme="light"] .panel{background:#fff!important;color:#172033!important}
      body[data-oracle-theme="light"] .sub,body[data-oracle-theme="light"] .muted,body[data-oracle-theme="light"] small{color:#475569!important}
      @media(max-width:700px){#oracle158Toolbar{left:8px;right:8px;bottom:8px;justify-content:center}#oracle158Toolbar button{font-size:11px;padding:7px 9px}}
      @media print{#oracle158Toolbar,#oracle158Toast{display:none!important}}
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