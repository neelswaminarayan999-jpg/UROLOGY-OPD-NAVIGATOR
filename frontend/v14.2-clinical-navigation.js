/* Urology Oracle clinician navigation layer.
   Targeted home cleanup + clinical-first navigation + explicit bladder pathway.
   No global DOM text rewriting. */
(function(){
'use strict';

function esc(s){
  return String(s==null?'':s).replace(/[&<>"]/g,function(m){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m];
  });
}

function style(){
  if(document.getElementById('v142ClinicalNavStyle')) return;
  var s=document.createElement('style');
  s.id='v142ClinicalNavStyle';
  s.textContent=
    '.v142-group{margin-top:14px}'+
    '.v142-label{font-size:11px;font-weight:900;color:#163247;margin-bottom:7px}'+
    '.v142-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}'+
    '.v142-btn{border:1px solid #cbd5e1;background:#fff;border-radius:12px;padding:12px;text-align:left;cursor:pointer;box-shadow:0 4px 16px rgba(15,23,42,.04)}'+
    '.v142-btn b{display:block;color:#17364d;font-size:12px}'+
    '.v142-btn span{display:block;color:#64748b;font-size:10px;line-height:1.4;margin-top:4px}'+
    '.v142-modal{position:fixed;inset:0;background:rgba(2,6,23,.66);z-index:100010;display:flex;align-items:flex-start;justify-content:center;padding:22px 12px;overflow:auto}'+
    '.v142-panel{width:min(1050px,100%);max-height:94vh;overflow:auto;background:#fff;border-radius:16px;box-shadow:0 25px 80px rgba(2,6,23,.38);padding:18px}'+
    '.v142-panel h2{margin:0;color:#0f172a;font-size:21px}.v142-sub{color:#64748b;font-size:11px;line-height:1.5;margin-top:5px}'+
    '.v142-row{padding:10px 0;border-top:1px solid #edf2f7}.v142-label2{font-size:11px;font-weight:900;color:#163247;margin-bottom:6px}'+
    '.v142-inputs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}'+
    '.v142-panel input,.v142-panel select{width:100%;border:1px solid #cbd5e1;border-radius:9px;padding:9px;background:#fff;color:#173044}'+
    '.v142-primary{border:0;border-radius:9px;padding:9px 12px;font-weight:800;cursor:pointer;background:#0f172a;color:#fff}'+
    '.v142-note{border:1px solid #cbd5e1;background:#f8fafc;padding:11px;border-radius:10px;color:#475569;font-size:11px;line-height:1.6;margin-top:9px}'+
    '.v142-alert{border-left:5px solid #b91c1c;background:#fef2f2;padding:11px;border-radius:10px;color:#5b2a27;font-size:12px;line-height:1.6;margin-top:9px}'+
    '@media(max-width:800px){.v142-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}'+
    '@media(max-width:560px){.v142-grid,.v142-inputs{grid-template-columns:1fr}.v142-panel{padding:14px}}';
  document.head.appendChild(s);
}

function closeModal(){
  var m=document.getElementById('v142ClinicalModal');
  if(m) m.remove();
}

function modal(title,subtitle,body){
  closeModal();
  var back=document.createElement('div'); back.id='v142ClinicalModal'; back.className='v142-modal no-print';
  var panel=document.createElement('div'); panel.className='v142-panel';
  var head=document.createElement('div');
  head.style.cssText='display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px';
  var left=document.createElement('div');
  left.innerHTML='<h2>'+esc(title)+'</h2><div class="v142-sub">'+esc(subtitle)+'</div>';
  var close=document.createElement('button'); close.className='v142-primary'; close.textContent='Close'; close.onclick=closeModal;
  head.append(left,close); panel.appendChild(head);
  var content=document.createElement('div'); content.innerHTML=body; panel.appendChild(content);
  back.appendChild(panel); document.body.appendChild(back);
  back.addEventListener('click',function(e){if(e.target===back)closeModal();});
}

function openDisease(disease){
  var sel=document.getElementById('oracleDisease');
  if(sel){
    sel.value=disease;
    sel.dispatchEvent(new Event('input',{bubbles:true}));
    sel.dispatchEvent(new Event('change',{bubbles:true}));
  }
  var view=document.getElementById('oracleView');
  if(view) setTimeout(function(){view.scrollIntoView({behavior:'smooth',block:'start'});},80);
}

function removeInternalHomeCards(){
  var home=document.getElementById('homeView');
  if(!home) return;
  Array.from(home.querySelectorAll('.card')).forEach(function(card){
    var t=(card.innerText||'').replace(/\s+/g,' ').trim();
    if(/BOOK-INTEGRATED CLINICAL ENGINE|CONTENT BASELINE|FINAL CLINICAL WORKSTATION|Urology Oracle V14\.0|NCCN 2026 version registry|Rule-based Oracle/i.test(t)){
      card.remove();
    }
  });
}

function addClinicalNavigation(){
  if(document.getElementById('v142ClinicalNav')) return;
  var home=document.getElementById('homeView');
  if(!home) return;
  removeInternalHomeCards();

  var box=document.createElement('div');
  box.id='v142ClinicalNav';
  box.className='card p-4';
  box.innerHTML=
    '<div class="section-title mb-1">Clinical Oracle</div>'+
    '<div style="font-size:13px;color:#64748b;line-height:1.5">Choose the problem you are managing. The Oracle will guide classification, required inputs, treatment and follow-up.</div>'+
    '<div class="v142-group"><div class="v142-label">Uro-oncology</div><div class="v142-grid">'+
      button('Ca Prostate','Prostate cancer','TNM · ISUP · risk · treatment')+
      button('Ca Bladder','Bladder cancer','NMIBC · MIBC · metastatic')+
      button('UTUC','Upper tract urothelial cancer','Risk · kidney-sparing · radical treatment')+
      button('Ca Kidney','Kidney cancer','Stage · histology · systemic pathway')+
      button('Ca Testis','Testicular cancer','Markers · stage · risk · treatment')+
      button('Ca Penis','Penile cancer','Local stage · nodes · treatment')+
    '</div></div>'+
    '<div class="v142-group"><div class="v142-label">High-use urology</div><div class="v142-grid">'+
      button('Urethral Stricture','Urethral stricture','Site · length · phenotype · reconstruction')+
      button('BPH / Male LUTS','BPH / male LUTS','Phenotype · medication · procedure selection')+
      button('Stone Disease','Stone disease','Stone factors · infection · procedure pathway')+
    '</div></div>'+
    '<div class="v142-group"><div class="v142-label">Focused tools</div><div class="v142-grid">'+
      '<button class="v142-btn" id="v142Bladder"><b>Bladder cancer pathway</b><span>Explicit NMIBC / MIBC decision algorithm</span></button>'+
      '<button class="v142-btn" id="v142Scores"><b>Scores & calculators</b><span>Open the existing validated score toolkit</span></button>'+
      '<button class="v142-btn" id="v142Urgent"><b>Urgent urology</b><span>Torsion · priapism · Fournier red flags</span></button>'+
    '</div></div>';

  var first=home.querySelector('.card');
  (first&&first.parentElement?first.parentElement:home).insertBefore(box,first||null);

  Array.from(box.querySelectorAll('[data-disease]')).forEach(function(b){
    b.onclick=function(){openDisease(b.getAttribute('data-disease'));};
  });
  document.getElementById('v142Bladder').onclick=openBladderPathway;
  document.getElementById('v142Scores').onclick=function(){
    var b=Array.from(document.querySelectorAll('button')).find(function(x){return /Scores & risk calculators/i.test(x.innerText||'');});
    if(b) b.click();
  };
  document.getElementById('v142Urgent').onclick=function(){
    var b=Array.from(document.querySelectorAll('button')).find(function(x){return /^Urgent urology/i.test((x.innerText||'').trim());});
    if(b) b.click();
  };
}

function button(disease,title,desc){
  return '<button class="v142-btn" data-disease="'+esc(disease)+'"><b>'+esc(title)+'</b><span>'+esc(desc)+'</span></button>';
}

function openBladderPathway(){
  var body=
    '<div class="v142-note">Decision framework: establish pathology and stage first, then branch to NMIBC, MIBC, locally advanced/unresectable or metastatic disease. Verify jurisdictional approvals, product information and MDT/local protocol before treatment.</div>'+
    '<div class="v142-row"><div class="v142-label2">Disease state</div><div class="v142-inputs">'+
      '<select id="v142Stage"><option value="">Select stage</option><option value="Ta">Ta</option><option value="Tis">Tis / CIS</option><option value="T1">T1</option><option value="T2">T2</option><option value="T3">T3</option><option value="T4a">T4a</option><option value="T4b">T4b / unresectable</option><option value="M1">M1 metastatic</option></select>'+
      '<select id="v142Grade"><option value="">Grade</option><option>Low grade</option><option>High grade</option></select>'+
    '</div></div>'+
    '<div class="v142-row"><div class="v142-label2">NMIBC quality checks</div><div class="v142-inputs">'+
      '<select id="v142Complete"><option value="">Initial TURBT complete?</option><option value="yes">Yes</option><option value="no">No / doubtful</option></select>'+
      '<select id="v142Muscle"><option value="">Detrusor muscle present?</option><option value="yes">Yes</option><option value="no">No</option><option value="na">Not applicable / CIS</option></select>'+
      '<select id="v142Cis"><option value="">CIS present?</option><option value="yes">Yes</option><option value="no">No</option></select>'+
      '<select id="v142Bcg"><option value="">BCG status</option><option value="na">Not indicated / not started</option><option value="naive">BCG-naive</option><option value="adequate">Adequate BCG without unresponsive recurrence</option><option value="unresponsive">BCG-unresponsive / high-risk recurrence despite adequate BCG</option></select>'+
    '</div></div>'+
    '<div class="v142-row"><div class="v142-label2">MIBC cisplatin-fitness screen</div><div class="v142-inputs">'+
      '<select id="v142Ecog"><option value="">ECOG PS</option><option value="0">0</option><option value="1">1</option><option value="2">2+</option></select>'+
      '<input id="v142Crcl" type="number" min="0" placeholder="CrCl / GFR (mL/min)">'+
      '<select id="v142Hear"><option value="">Hearing loss ≥ grade 2?</option><option value="no">No</option><option value="yes">Yes</option></select>'+
      '<select id="v142Neuro"><option value="">Neuropathy ≥ grade 2?</option><option value="no">No</option><option value="yes">Yes</option></select>'+
      '<select id="v142Nyha"><option value="">NYHA III–IV?</option><option value="no">No</option><option value="yes">Yes</option></select>'+
    '</div></div>'+
    '<button class="v142-primary" id="v142Generate">Generate pathway</button>'+
    '<div id="v142Result" class="v142-note">Complete the clinically relevant fields above.</div>';

  modal('Bladder cancer pathway','EAU 2026-aligned decision framework · clinician verification required',body);

  setTimeout(function(){
    var b=document.getElementById('v142Generate');
    if(!b) return;
    b.onclick=renderBladderPathway;
  },20);
}

function val(id){var e=document.getElementById(id);return e?e.value:'';}

function renderBladderPathway(){
  var stage=val('v142Stage'), grade=val('v142Grade'), complete=val('v142Complete'), muscle=val('v142Muscle'), cis=val('v142Cis'), bcg=val('v142Bcg');
  var ecog=val('v142Ecog'), crcl=Number(val('v142Crcl')), hear=val('v142Hear')==='yes', neuro=val('v142Neuro')==='yes', nyha=val('v142Nyha')==='yes';
  var html='';

  if(!stage){
    html='<div class="v142-alert"><b>Stage required.</b> Select the disease state before choosing treatment.</div>';
  } else if(stage==='Ta'||stage==='Tis'||stage==='T1'){
    var reTUR=(complete==='no')||(muscle==='no'&&!(stage==='Ta'&&/low/i.test(grade)))||stage==='T1';
    html='<b>NMIBC pathway</b>'+
      '<div class="v142-note"><b>Pathology checkpoint:</b> confirm stage, grade, CIS, detrusor muscle and completeness of TURBT.</div>';
    if(reTUR){
      html+='<div class="v142-alert"><b>Second TURBT indicated:</b> incomplete/doubtful initial TURBT; absent detrusor muscle except Ta low-grade/G1 and primary CIS; or any T1 tumour. When indicated, perform within 2–6 weeks and include the original tumour site.</div>';
    }else{
      html+='<div class="v142-note"><b>Second TURBT checkpoint:</b> no automatic indication from the fields entered; reconcile the complete pathology report and operative record.</div>';
    }
    html+='<div class="v142-note"><b>Risk-directed treatment:</b> low-risk disease generally receives a single immediate postoperative intravesical chemotherapy instillation when safe; intermediate-risk disease generally uses intravesical chemotherapy or a one-year BCG strategy according to recurrence/progression risk; high/very-high-risk disease requires full-dose BCG with maintenance and discussion of early radical cystectomy in appropriate very-high-risk patients.</div>';
    if(bcg==='unresponsive'){
      html+='<div class="v142-alert"><b>BCG-unresponsive:</b> do not simply repeat ineffective BCG. Radical cystectomy is the key oncologic option; bladder-preserving options depend on tumour phenotype, approved/available therapies and jurisdiction and should be reviewed in an MDT.</div>';
    }else if(bcg==='naive'&&(stage==='T1'||cis==='yes'||/high/i.test(grade))){
      html+='<div class="v142-note"><b>High-risk BCG pathway:</b> verify the formal risk group and eligibility, then plan full-dose BCG induction and maintenance. The 2026 EAU guideline includes selected BCG-plus-systemic approaches for selected high/very-high-risk BCG-naive patients where approved and available.</div>';
    }
  } else if(stage==='T2'||stage==='T3'||stage==='T4a'){
    var unfit=ecog==='2'||(Number.isFinite(crcl)&&crcl>0&&crcl<60)||hear||neuro||nyha;
    html='<b>Muscle-invasive bladder cancer pathway</b>'+
      '<div class="v142-note"><b>Confirm:</b> T2–T4a stage, cN/M stage, pathology and curative-treatment fitness; discuss in MDT.</div>';
    if(unfit){
      html+='<div class="v142-alert"><b>Cisplatin-unfit screen positive or incomplete.</b> Do not substitute neoadjuvant carboplatin for cisplatin. The 2026 EAU MIBC pathway recommends perioperative enfortumab vedotin + pembrolizumab for cisplatin-ineligible patients, subject to indication, availability and MDT review.</div>';
    }else{
      html+='<div class="v142-note"><b>Cisplatin pathway:</b> in cisplatin-eligible T2–T4a cN0–1 M0 disease, offer neoadjuvant cisplatin-based combination chemotherapy. The 2026 EAU guideline also recommends perioperative cisplatin/gemcitabine + durvalumab for eligible patients who are candidates for immunotherapy, followed by radical cystectomy + pelvic lymph-node dissection.</div>';
    }
    html+='<div class="v142-note"><b>Local treatment:</b> radical cystectomy + pelvic lymph-node dissection is a core curative pathway. Trimodality bladder-preserving treatment is reserved for carefully selected patients with appropriate tumour/anatomy, complete TURBT and capacity for close surveillance.</div>';
  } else if(stage==='T4b'){
    html='<b>Locally advanced / unresectable pathway</b><div class="v142-note">Confirm unresectability and metastatic staging. Use systemic and/or palliative treatment according to disease extent, symptoms, fitness, molecular profile, treatment availability and MDT assessment.</div>';
  } else if(stage==='M1'){
    html='<b>Metastatic urothelial carcinoma pathway</b>'+
      '<div class="v142-note"><b>First-line:</b> for patients fit for combination therapy, enfortumab vedotin + pembrolizumab is the 2026 EAU standard pathway. If EV is contraindicated/unavailable, platinum-containing combination chemotherapy with avelumab maintenance after at least stable disease is a key alternative; cisplatin/gemcitabine + nivolumab is an option in appropriate cisplatin-eligible patients when EV cannot be used.</div>'+
      '<div class="v142-note"><b>Fitness and sequencing:</b> distinguish cisplatin-, carboplatin- and platinum-ineligible status; assess renal function, performance status and organ-specific contraindications, and confirm FGFR/HER2-directed options and jurisdictional indications.</div>';
  }
  var out=document.getElementById('v142Result');
  if(out) out.innerHTML=html||'<div class="v142-note">Enter the required disease-state information.</div>';
}

function apply(){
  style();
  addClinicalNavigation();
  var h=document.querySelector('header .text-lg');
  if(h && /Urology Oracle V14\.0/i.test(h.textContent||'')) h.textContent='Urology Oracle';
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true}); else apply();
setTimeout(apply,1000);
setTimeout(apply,2500);
})();