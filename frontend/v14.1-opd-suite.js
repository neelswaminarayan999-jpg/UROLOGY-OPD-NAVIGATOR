/* Urology Oracle V14.1 — OPD hardening and high-use toolkit.
   Additive layer: scores, medication safety, follow-up, urgent triage,
   perioperative anticoagulation planning, andrology, paediatrics, stent registry,
   consent checklists, keyboard search, and legacy-label cleanup.
*/
(function(){
'use strict';

function escV14(s){
  return String(s ?? '').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}
function styleV14(){
  if(document.getElementById('v141ToolkitStyle')) return;
  const s=document.createElement('style'); s.id='v141ToolkitStyle';
  s.textContent=`
    #v141QuickTools{margin:0 0 16px}
    #v141QuickTools .v141-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
    .v141-tool{border:1px solid #cbd5e1;background:#fff;border-radius:12px;padding:12px;text-align:left;cursor:pointer;box-shadow:0 4px 16px rgba(15,23,42,.04)}
    .v141-tool:hover{border-color:#7aa8bd;transform:translateY(-1px)}
    .v141-tool b{display:block;color:#17364d;font-size:12px}
    .v141-tool span{display:block;color:#64748b;font-size:10px;line-height:1.4;margin-top:4px}
    #v141ToolkitModal{position:fixed;inset:0;background:rgba(2,6,23,.66);z-index:100000;display:flex;align-items:flex-start;justify-content:center;padding:22px 12px;overflow:auto}
    #v141ToolkitPanel{width:min(1050px,100%);max-height:94vh;overflow:auto;background:#fff;border-radius:16px;box-shadow:0 25px 80px rgba(2,6,23,.38);padding:20px}
    #v141ToolkitPanel h2{margin:0;color:#0f172a;font-size:21px}
    #v141ToolkitPanel .sub{color:#64748b;font-size:11px;line-height:1.5;margin-top:5px}
    #v141ToolkitPanel .row{padding:10px 0;border-top:1px solid #edf2f7}
    #v141ToolkitPanel .label{font-size:11px;font-weight:900;color:#163247}
    #v141ToolkitPanel .body{font-size:12px;line-height:1.6;color:#334155;margin-top:3px}
    #v141ToolkitPanel .warn{margin-top:10px}
    #v141ToolkitPanel .inputs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
    #v141ToolkitPanel input,#v141ToolkitPanel select,#v141ToolkitPanel textarea{width:100%;border:1px solid #cbd5e1;border-radius:9px;padding:9px;background:#fff;color:#173044}
    #v141ToolkitPanel button{border:0;border-radius:9px;padding:9px 12px;font-weight:800;cursor:pointer}
    .v141-primary{background:#0f172a!important;color:#fff!important}
    .v141-secondary{background:#e2e8f0!important;color:#0f172a!important}
    .v141-alert{border-left:5px solid #b91c1c;background:#fef2f2;padding:12px;border-radius:10px;color:#5b2a27;font-size:12px;line-height:1.6}
    .v141-note{border:1px solid #cbd5e1;background:#f8fafc;padding:11px;border-radius:10px;color:#475569;font-size:11px;line-height:1.6}
    .v141-result{margin-top:10px;padding:11px;border:1px solid #cbd5e1;border-radius:10px;background:#fbfdff;font-size:12px;line-height:1.6}
    .v141-home-group{margin-top:14px}.v141-home-label{font-size:11px;font-weight:900;color:#163247;margin:0 0 7px}.v141-home-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.v141-home-grid .v141-tool{min-height:72px}.v141-note{border:1px solid #cbd5e1;background:#f8fafc;padding:11px;border-radius:10px;color:#475569;font-size:11px;line-height:1.6}.v141-alert{border-left:5px solid #b91c1c;background:#fef2f2;padding:12px;border-radius:10px;color:#5b2a27;font-size:12px;line-height:1.6}.v141-result{margin-top:10px;padding:11px;border:1px solid #cbd5e1;border-radius:10px;background:#fbfdff;font-size:12px;line-height:1.6}
    @media(max-width:900px){#v141QuickTools .v141-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#v141ToolkitPanel .inputs{grid-template-columns:1fr}}
    @media(max-width:560px){#v141QuickTools .v141-grid{grid-template-columns:1fr}#v141ToolkitPanel{padding:15px}}
  `;
  document.head.appendChild(s);
}
function openToolkit(title,html,subtitle='V14.1 OPD toolkit · clinician verification required'){
  let back=document.getElementById('v141ToolkitModal');
  if(back) back.remove();
  back=document.createElement('div'); back.id='v141ToolkitModal'; back.className='no-print';
  const panel=document.createElement('div'); panel.id='v141ToolkitPanel';
  const head=document.createElement('div'); head.style.cssText='display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:14px';
  const h=document.createElement('div'); h.innerHTML='<h2>'+escV14(title)+'</h2><div class="sub">'+escV14(subtitle)+'</div>';
  const close=document.createElement('button'); close.className='v141-secondary'; close.textContent='Close'; close.onclick=()=>back.remove();
  head.append(h,close); panel.appendChild(head);
  const body=document.createElement('div'); body.innerHTML=String(html||''); panel.appendChild(body); back.appendChild(panel); document.body.appendChild(back);
  back.addEventListener('click',e=>{if(e.target===back)back.remove();});
  const onKey=e=>{if(e.key==='Escape'){back.remove();document.removeEventListener('keydown',onKey);}};
  document.addEventListener('keydown',onKey);
}
function openDiseaseFromHome(disease){
  const sel=document.getElementById('oracleDisease');
  if(sel){
    sel.value=disease;
    sel.dispatchEvent(new Event('input',{bubbles:true}));
    sel.dispatchEvent(new Event('change',{bubbles:true}));
  }
  setTimeout(()=>document.getElementById('oracleView')?.scrollIntoView({behavior:'smooth',block:'start'}),80);
}
function addClinicalHomeNavigation(){
  if(document.getElementById('v141ClinicalNav')) return;
  const home=document.getElementById('homeView'); if(!home) return;
  [...home.querySelectorAll('.card')].forEach(card=>{
    const t=(card.innerText||'').replace(/\s+/g,' ').trim();
    if(/BOOK-INTEGRATED CLINICAL ENGINE|CONTENT BASELINE|FINAL CLINICAL WORKSTATION|Urology Oracle V14\.0|NCCN 2026 version registry|Rule-based Oracle/i.test(t)) card.remove();
  });
  const box=document.createElement('div'); box.id='v141ClinicalNav';
  box.innerHTML='<div class="card p-4"><div class="section-title mb-1">Clinical Oracle</div><div style="font-size:13px;color:#64748b;line-height:1.5;margin-bottom:12px">Choose the problem you are managing. The Oracle will take you through classification, required inputs, treatment and follow-up.</div>'+
    '<div class="v141-home-group"><div class="v141-home-label">Uro-oncology</div><div class="v141-home-grid">'+
    '<button class="v141-tool" data-disease="Ca Prostate"><b>Prostate cancer</b><span>TNM · ISUP · risk · treatment</span></button>'+
    '<button class="v141-tool" data-disease="Ca Bladder"><b>Bladder cancer</b><span>NMIBC · MIBC · metastatic</span></button>'+
    '<button class="v141-tool" data-disease="UTUC"><b>Upper tract urothelial cancer</b><span>Risk · kidney-sparing · radical treatment</span></button>'+
    '<button class="v141-tool" data-disease="Ca Kidney"><b>Kidney cancer</b><span>Stage · histology · systemic pathway</span></button>'+
    '<button class="v141-tool" data-disease="Ca Testis"><b>Testicular cancer</b><span>Markers · stage · risk · treatment</span></button>'+
    '<button class="v141-tool" data-disease="Ca Penis"><b>Penile cancer</b><span>Local stage · nodes · treatment</span></button>'+
    '</div></div>'+
    '<div class="v141-home-group"><div class="v141-home-label">High-use urology</div><div class="v141-home-grid">'+
    '<button class="v141-tool" data-disease="Urethral Stricture"><b>Urethral stricture</b><span>Site · length · phenotype · reconstruction</span></button>'+
    '<button class="v141-tool" data-disease="BPH / Male LUTS"><b>BPH / male LUTS</b><span>Phenotype · medication · procedure selection</span></button>'+
    '<button class="v141-tool" data-disease="Stone Disease"><b>Stone disease</b><span>Stone factors · infection · procedure pathway</span></button>'+
    '</div></div>'+
    '<div class="v141-home-group"><div class="v141-home-label">Focused tools</div><div class="v141-home-grid">'+
    '<button class="v141-tool" id="v141BladderPath"><b>Bladder cancer pathway</b><span>Explicit NMIBC / MIBC decision algorithm</span></button>'+
    '<button class="v141-tool" id="v141ScoresHome"><b>Scores & calculators</b><span>IPSS · IIEF-5 · TWIST and more</span></button>'+
    '<button class="v141-tool" id="v141UrgentHome"><b>Urgent urology</b><span>Torsion · priapism · Fournier red flags</span></button>'+
    '</div></div></div>';
  const first=home.querySelector('.card');
  (first?.parentElement||home).insertBefore(box,first||null);
  box.querySelectorAll('[data-disease]').forEach(b=>b.onclick=()=>openDiseaseFromHome(b.dataset.disease));
  box.querySelector('#v141BladderPath').onclick=()=>openBladderPathway();
  box.querySelector('#v141ScoresHome').onclick=()=>openScores();
  box.querySelector('#v141UrgentHome').onclick=()=>openUrgent();
}
function addQuickTools(){
  if(document.getElementById('v141QuickTools')) return;
  const home=document.getElementById('homeView'); if(!home) return;
  const box=document.createElement('div'); box.id='v141QuickTools';
  box.innerHTML='<div class="card p-4"><div class="section-title mb-2">More clinical tools</div><div class="v141-grid" id="v141QuickGrid"></div></div>';
  const anchor=document.getElementById('v141ClinicalNav')?.nextElementSibling;
  (anchor?.parentElement||home).insertBefore(box,anchor||null);
  const tools=[
    ['Medication safety','PSA/5-ARI · renal limits · IFIS · PDE5/nitrates','drugs'],
    ['Follow-up','NMIBC risk-adapted surveillance + stone prevention','follow'],
    ['Perioperative anticoagulation','DOAC/warfarin/P2Y12 planning aid','anticoag'],
    ['Andrology','WHO semen limits · azoospermia pathway','andrology'],
    ['Paediatric urology','cryptorchidism · VUR · antenatal hydronephrosis','paeds'],
    ['DJ stent registry','removal-date tracker + patient reminder','stent'],
    ['Consent checklist','rapid TURP/PCNL complication counselling','consent']
  ];
  const grid=box.querySelector('#v141QuickGrid');
  tools.forEach(([a,b,k])=>{
    const btn=document.createElement('button'); btn.type='button'; btn.className='v141-tool'; btn.innerHTML='<b>'+escV14(a)+'</b><span>'+escV14(b)+'</span>';
    btn.onclick=()=>openTool(k); grid.appendChild(btn);
  });
}
><b>Bladder cancer</b><span>NMIBC · MIBC · metastatic</span></button>'+
    '<button class="v141-tool" data-disease="UTUC"><b>Upper tract urothelial cancer</b><span>Risk · kidney-sparing · radical treatment</span></button>'+
    '<button class="v141-tool" data-disease="Ca Kidney"><b>Kidney cancer</b><span>Stage · histology · systemic pathway</span></button>'+
    '<button class="v141-tool" data-disease="Ca Testis"><b>Testicular cancer</b><span>Markers · stage · risk · treatment</span></button>'+
    '<button class="v141-tool" data-disease="Ca Penis"><b>Penile cancer</b><span>Local stage · nodes · treatment</span></button>'+
    '</div></div>'+
    '<div class="v141-home-group"><div class="v141-home-label">High-use urology</div><div class="v141-home-grid">'+
    '<button class="v141-tool" data-disease="Urethral Stricture"><b>Urethral stricture</b><span>Site · length · phenotype · reconstruction</span></button>'+
    '<button class="v141-tool" data-disease="BPH / Male LUTS"><b>BPH / male LUTS</b><span>Phenotype · medication · procedure selection</span></button>'+
    '<button class="v141-tool" data-disease="Stone Disease"><b>Stone disease</b><span>Stone factors · infection · procedure pathway</span></button>'+
    '</div></div>'+
    '<div class="v141-home-group"><div class="v141-home-label">Focused tools</div><div class="v141-home-grid">'+
    '<button class="v141-tool" id="v141BladderPath"><b>Bladder cancer pathway</b><span>Explicit NMIBC / MIBC decision algorithm</span></button>'+
    '<button class="v141-tool" id="v141ScoresHome"><b>Scores & calculators</b><span>IPSS · IIEF-5 · TWIST and more</span></button>'+
    '<button class="v141-tool" id="v141UrgentHome"><b>Urgent urology</b><span>Torsion · priapism · Fournier red flags</span></button>'+
    '</div></div></div>';
  const first=home.querySelector('.card');
  (first?.parentElement||home).insertBefore(box,first||null);
  box.querySelectorAll('[data-disease]').forEach(b=>b.onclick=()=>openDiseaseFromHome(b.dataset.disease));
  box.querySelector('#v141BladderPath').onclick=()=>openBladderPathway();
  box.querySelector('#v141ScoresHome').onclick=()=>openScores();
  box.querySelector('#v141UrgentHome').onclick=()=>openUrgent();
}
function addQuickTools(){
  if(document.getElementById('v141QuickTools')) return;
  const home=document.getElementById('homeView'); if(!home) return;
  const box=document.createElement('div'); box.id='v141QuickTools';
  box.innerHTML='<div class="card p-4"><div class="section-title mb-2">More clinical tools</div><div class="v141-grid" id="v141QuickGrid"></div></div>';
  const anchor=document.getElementById('v141ClinicalNav')?.nextElementSibling;
  (anchor?.parentElement||home).insertBefore(box,anchor||null);
  const tools=[
    ['Medication safety','PSA/5-ARI · renal limits · IFIS · PDE5/nitrates','drugs'],
    ['Follow-up','NMIBC risk-adapted surveillance + stone prevention','follow'],
    ['Perioperative anticoagulation','DOAC/warfarin/P2Y12 planning aid','anticoag'],
    ['Andrology','WHO semen limits · azoospermia pathway','andrology'],
    ['Paediatric urology','cryptorchidism · VUR · antenatal hydronephrosis','paeds'],
    ['DJ stent registry','removal-date tracker + patient reminder','stent'],
    ['Consent checklist','rapid TURP/PCNL complication counselling','consent']
  ];
  const grid=box.querySelector('#v141QuickGrid');
  tools.forEach(([a,b,k])=>{
    const btn=document.createElement('button'); btn.type='button'; btn.className='v141-tool'; btn.innerHTML='<b>'+escV14(a)+'</b><span>'+escV14(b)+'</span>';
    btn.onclick=()=>openTool(k); grid.appendChild(btn);
  });
}

function openBladderPathway(){
  openToolkit('Bladder cancer pathway','<div class="v141-note">Decision framework: establish pathology and stage first, then branch to NMIBC, MIBC, locally advanced/unresectable or metastatic disease. Verify jurisdictional approvals, product information and MDT/local protocol before treatment.</div>'+
    '<div class="row"><div class="label">1. Disease state</div><div class="inputs"><select id="bcStage"><option value="">Select stage</option><option value="Ta">Ta</option><option value="Tis">Tis / CIS</option><option value="T1">T1</option><option value="T2">T2</option><option value="T3">T3</option><option value="T4a">T4a</option><option value="T4b">T4b / unresectable</option><option value="M1">M1 metastatic</option></select><select id="bcGrade"><option value="">Grade</option><option>Low grade</option><option>High grade</option></select></div></div>'+
    '<div class="row"><div class="label">2. NMIBC quality checks</div><div class="inputs"><select id="bcComplete"><option value="">Initial TURBT complete?</option><option value="yes">Yes</option><option value="no">No / doubtful</option></select><select id="bcMuscle"><option value="">Detrusor muscle present?</option><option value="yes">Yes</option><option value="no">No</option><option value="na">Not applicable / CIS</option></select><select id="bcCis"><option value="">CIS present?</option><option value="yes">Yes</option><option value="no">No</option></select><select id="bcBCG"><option value="">BCG status</option><option value="na">Not indicated / not started</option><option value="naive">BCG-naive</option><option value="adequate">Adequate BCG without unresponsive recurrence</option><option value="unresponsive">BCG-unresponsive / high-risk recurrence despite adequate BCG</option></select></div></div>'+
    '<div class="row"><div class="label">3. MIBC cisplatin-fitness inputs</div><div class="inputs"><select id="bcEcog"><option value="">ECOG PS</option><option value="0">0</option><option value="1">1</option><option value="2">2+</option></select><input id="bcCrcl" type="number" min="0" placeholder="CrCl / GFR (mL/min)"><select id="bcHear"><option value="">Hearing loss ≥ grade 2?</option><option value="no">No</option><option value="yes">Yes</option></select><select id="bcNeuro"><option value="">Neuropathy ≥ grade 2?</option><option value="no">No</option><option value="yes">Yes</option></select><select id="bcNyha"><option value="">NYHA III–IV?</option><option value="no">No</option><option value="yes">Yes</option></select></div></div>'+
    '<button class="v141-primary" id="bcGenerate">Generate pathway</button><div class="v141-result" id="bcResult">Complete the clinically relevant fields above.</div>',
    'EAU 2026-aligned clinical decision framework · verify jurisdictional approvals and MDT/local protocol before treatment');
  setTimeout(()=>{
    const b=document.getElementById('bcGenerate'); if(!b || b.dataset.bound==='1') return; b.dataset.bound='1';
    b.onclick=()=>{
      const g=id=>document.getElementById(id)?.value||'';
      const stage=g('bcStage'), grade=g('bcGrade'), complete=g('bcComplete'), muscle=g('bcMuscle'), cis=g('bcCis'), bcg=g('bcBCG');
      const ecog=g('bcEcog'), crcl=Number(g('bcCrcl')), hear=g('bcHear')==='yes', neuro=g('bcNeuro')==='yes', nyha=g('bcNyha')==='yes';
      let html='';
      if(!stage) html='<div class="v141-alert"><b>Stage required.</b> Select the disease state before choosing treatment.</div>';
      else if(['Ta','Tis','T1'].includes(stage)){
        const reTUR=(complete==='no') || (muscle==='no' && !(stage==='Ta' && /low/i.test(grade))) || stage==='T1';
        html='<b>NMIBC pathway</b><div class="v141-note"><b>Pathology checkpoint:</b> confirm stage, grade, CIS, detrusor muscle and completeness of TURBT.</div>';
        if(reTUR) html+='<div class="v141-alert"><b>Second TURBT indicated:</b> incomplete/doubtful initial TURBT; absent detrusor muscle except Ta low-grade/G1 and primary CIS; or any T1 tumour. When indicated, perform within 2–6 weeks and resect the original tumour site.</div>';
        else html+='<div class="v141-note"><b>Second TURBT checkpoint:</b> no automatic indication from the fields entered; reconcile the complete pathology report and operative record.</div>';
        html+='<div class="v141-note"><b>Risk-directed treatment:</b> low-risk disease generally receives a single immediate postoperative intravesical chemotherapy instillation when safe; intermediate-risk disease generally uses intravesical chemotherapy or a one-year BCG strategy according to recurrence/progression risk; high/very-high-risk disease requires full-dose BCG with maintenance and discussion of early radical cystectomy in appropriate very-high-risk patients.</div>';
        if(bcg==='unresponsive') html+='<div class="v141-alert"><b>BCG-unresponsive:</b> do not simply repeat ineffective BCG. Radical cystectomy is the key oncologic option; bladder-preserving options depend on tumour phenotype, approved/available therapies and jurisdiction and should be reviewed in an MDT.</div>';
        else if(bcg==='naive' && (/high/i.test(grade)||stage==='T1'||cis==='yes')) html+='<div class="v141-note"><b>High-risk BCG pathway:</b> verify formal EAU risk group and eligibility, then plan full-dose BCG induction and maintenance. The 2026 EAU guideline also includes selected BCG-plus-systemic approaches for selected high/very-high-risk BCG-naive patients where approved/available.</div>';
      } else if(['T2','T3','T4a'].includes(stage)){
        const classicUnfit=ecog==='2'||(Number.isFinite(crcl)&&crcl>0&&crcl<60)||hear||neuro||nyha;
        html='<b>Muscle-invasive bladder cancer pathway</b><div class="v141-note"><b>Confirm:</b> T2–T4a stage, cN/M stage, pathology and curative-treatment fitness; discuss in MDT.</div>';
        if(classicUnfit) html+='<div class="v141-alert"><b>Cisplatin-unfit screen positive or incomplete.</b> Do not substitute neoadjuvant carboplatin for cisplatin. The 2026 EAU MIBC pathway recommends perioperative enfortumab vedotin + pembrolizumab for cisplatin-ineligible patients, subject to indication, availability and MDT review.</div>';
        else html+='<div class="v141-note"><b>Cisplatin pathway:</b> in cisplatin-eligible T2–T4a cN0–1 M0 disease, offer neoadjuvant cisplatin-based combination chemotherapy. The 2026 EAU guideline also recommends perioperative cisplatin/gemcitabine + durvalumab for eligible patients who are candidates for immunotherapy, followed by radical cystectomy + pelvic lymph-node dissection.</div>';
        html+='<div class="v141-note"><b>Local treatment:</b> radical cystectomy + pelvic lymph-node dissection is a core curative pathway. Trimodality bladder-preserving treatment is reserved for carefully selected patients with appropriate tumour/anatomy, complete TURBT and capacity for close surveillance.</div>';
      } else if(stage==='T4b') {
        html='<b>Locally advanced / unresectable pathway</b><div class="v141-note">Confirm unresectability and metastatic staging. Use systemic and/or palliative treatment according to disease extent, symptoms, fitness, molecular profile, treatment availability and MDT assessment.</div>';
      } else if(stage==='M1') {
        html='<b>Metastatic urothelial carcinoma pathway</b><div class="v141-note"><b>First-line:</b> for patients fit for combination therapy, enfortumab vedotin + pembrolizumab is the 2026 EAU standard pathway. If EV is contraindicated/unavailable, platinum-containing combination chemotherapy with avelumab maintenance after at least stable disease is a key alternative; cisplatin/gemcitabine + nivolumab is an option in appropriate cisplatin-eligible patients when EV cannot be used.</div><div class="v141-note"><b>Fitness and sequencing:</b> distinguish cisplatin-, carboplatin- and platinum-ineligible status; assess renal function, PS and organ-specific contraindications, and confirm FGFR/HER2-directed options and jurisdictional indications.</div>';
      }
      document.getElementById('bcResult').innerHTML=html||'<div class="v141-note">Enter the required disease-state information.</div>';
    };
  },40);
}

function openTool(key){
  if(key==='scores') return openScores();
  if(key==='drugs') return openDrugSafety();
  if(key==='follow') return openFollowUp();
  if(key==='urgent') return openUrgent();
  if(key==='anticoag') return openAnticoag();
  if(key==='andrology') return openAndrology();
  if(key==='paeds') return openPaeds();
  if(key==='stent') return openStentRegistry();
  if(key==='consent') return openConsent();
}

function openScores(){
  openToolkit('Scores & risk calculators',`
  <div class="row">
    <div class="label">IPSS — symptom score</div>
    <div class="body">Enter the seven symptom items separately from the Quality-of-Life/Bother item. The symptom score is 0–35; QoL is recorded separately.</div>
    <div class="inputs" style="margin-top:8px">${Array.from({length:7},(_,i)=>'<input id="ipss'+(i+1)+'" type="number" min="0" max="5" placeholder="Q'+(i+1)+' (0–5)">').join('')}<select id="ipssQ"><option value="">QoL / Bother (0–6)</option>${[0,1,2,3,4,5,6].map(x=>'<option>'+x+'</option>').join('')}</select></div>
    <button class="v141-primary" id="ipssCalc" style="margin-top:8px">Calculate IPSS</button><div class="v141-result" id="ipssOut">Symptom severity: not calculated.</div>
  </div>
  <div class="row">
    <div class="label">IIEF-5 / SHIM</div>
    <div class="body">Five items scored 1–5. Total 5–25. Established categories: no ED 22–25; mild 17–21; mild-to-moderate 12–16; moderate 8–11; severe 5–7.</div>
    <div class="inputs" style="margin-top:8px">${Array.from({length:5},(_,i)=>'<input id="iief'+(i+1)+'" type="number" min="1" max="5" placeholder="Q'+(i+1)+' (1–5)">').join('')}</div>
    <button class="v141-primary" id="iiefCalc" style="margin-top:8px">Calculate IIEF-5</button><div class="v141-result" id="iiefOut">Severity: not calculated.</div>
  </div>
  <div class="row">
    <div class="label">TWIST — acute scrotum</div>
    <div class="body">Swelling 2 points; hard testis 2; absent cremasteric reflex 1; nausea/vomiting 1; high-riding testis 1.</div>
    <div class="inputs" style="margin-top:8px"><select id="twS"><option value="0">Swelling: No</option><option value="2">Swelling: Yes</option></select><select id="twH"><option value="0">Hard testis: No</option><option value="2">Hard testis: Yes</option></select><select id="twC"><option value="0">Cremasteric reflex: Present</option><option value="1">Cremasteric reflex: Absent</option></select><select id="twN"><option value="0">Nausea/vomiting: No</option><option value="1">Nausea/vomiting: Yes</option></select><select id="twR"><option value="0">High-riding testis: No</option><option value="1">High-riding testis: Yes</option></select></div>
    <button class="v141-primary" id="twCalc" style="margin-top:8px">Calculate TWIST</button><div class="v141-result" id="twOut">Risk group: not calculated.</div>
  </div>`);
  setTimeout(()=>{
    document.getElementById('ipssCalc').onclick=()=>{
      const vals=[1,2,3,4,5,6,7].map(i=>Number(document.getElementById('ipss'+i).value));
      if(vals.some(x=>!Number.isInteger(x)||x<0||x>5)){document.getElementById('ipssOut').innerHTML='<span class="v141-alert">Enter all seven symptom items from 0 to 5. QoL is not included in the 0–35 symptom score.</span>';return;}
      const q=Number(document.getElementById('ipssQ').value||0),sum=vals.reduce((a,b)=>a+b,0);
      const cat=sum===0?'Asymptomatic':sum<=7?'Mild':sum<=19?'Moderate':'Severe';
      document.getElementById('ipssOut').innerHTML='<b>IPSS '+sum+'/35</b> — '+cat+' · QoL/Bother '+q+'/6 (separate).';
    };
    document.getElementById('iiefCalc').onclick=()=>{
      const vals=[1,2,3,4,5].map(i=>Number(document.getElementById('iief'+i).value));
      if(vals.some(x=>!Number.isInteger(x)||x<1||x>5)){document.getElementById('iiefOut').innerHTML='<span class="v141-alert">Enter all five items from 1 to 5.</span>';return;}
      const sum=vals.reduce((a,b)=>a+b,0); const cat=sum>=22?'No erectile dysfunction':sum>=17?'Mild erectile dysfunction':sum>=12?'Mild to moderate erectile dysfunction':sum>=8?'Moderate erectile dysfunction':'Severe erectile dysfunction';
      document.getElementById('iiefOut').innerHTML='<b>IIEF-5 '+sum+'/25</b> — '+cat+'.';
    };
    document.getElementById('twCalc').onclick=()=>{
      const sum=['twS','twH','twC','twN','twR'].reduce((a,id)=>a+Number(document.getElementById(id).value),0);
      const cat=sum<=2?'Low risk (0–2)':sum<=4?'Intermediate risk (3–4)':'High risk (5–7)';
      document.getElementById('twOut').innerHTML='<b>TWIST '+sum+'/7</b> — '+cat+'. <div class="v141-note" style="margin-top:8px"><b>Clinical override:</b> TWIST is a triage aid. A high clinical suspicion of torsion warrants urgent urological/surgical assessment; do not let a low score falsely reassure.</div>';
    };
  },0);
}

function openDrugSafety(){
  openToolkit('Medication safety — high-use urology checks',`
  <div class="row"><div class="label">5-alpha-reductase inhibitors (finasteride/dutasteride)</div><div class="body">After approximately 6–12 months of therapy, PSA is typically reduced by about 50%. Interpret PSA in the context of 5-ARI therapy and the patient’s established baseline/nadir rather than reading the measured value as though no 5-ARI were being used.</div></div>
  <div class="row"><div class="label">Nitrofurantoin</div><div class="body">For lower UTI only; it does not treat pyelonephritis/parenchymal infection. Current product information varies by formulation: some allow selected short-course use at eGFR 30–44 mL/min for resistant uncomplicated lower UTI, while lower eGFR ranges require avoidance. Verify the local product label before prescribing.</div></div>
  <div class="row"><div class="label">Mirabegron</div><div class="body"><b>Do not use in severe uncontrolled hypertension (SBP ≥180 mmHg and/or DBP ≥110 mmHg).</b> Check blood pressure before and during treatment; severe uncontrolled hypertension is a safety contraindication in current product information.</div></div>
  <div class="row"><div class="label">Tamsulosin / silodosin</div><div class="body">Alpha-blockers have been associated with intraoperative floppy iris syndrome. Patients undergoing cataract surgery should disclose current or previous alpha-blocker exposure to their ophthalmologist.</div></div>
  <div class="row"><div class="label">PDE5 inhibitors</div><div class="body"><b>Absolute contraindication with organic nitrates / nitric-oxide donors.</b> Nicorandil is also contraindicated with PDE5 inhibitors because of additive blood-pressure lowering.</div></div>
  <div class="v141-note">This panel is a safety checklist, not a substitute for the current product label, renal/hepatic assessment, drug interactions or local antimicrobial policy.</div>`);
}

function openFollowUp(){
  openToolkit('Follow-up & surveillance',`
  <div class="row"><div class="label">NMIBC — current EAU 2026 risk-adapted follow-up</div>
    <div class="body">
      <table class="xs-table" style="margin-top:8px"><thead><tr><th>Risk</th><th>Cystoscopy</th><th>Cytology</th><th>Imaging</th><th>Duration</th></tr></thead>
      <tbody>
        <tr><td>Low</td><td>3 and 12 months, then annually</td><td>No</td><td>Not systematic</td><td>5 years</td></tr>
        <tr><td>Intermediate (excluding HG/G3 subgroup)</td><td>3 months, then every 6 months for 2 years, then annually</td><td>No</td><td>Not systematic</td><td>10 years</td></tr>
        <tr><td>High / Very high</td><td>Every 3 months for 2 years, then every 6 months to 5 years, then annually</td><td>Yes, same intervals</td><td>CT annually to 5 years, then every 2 years to 10 years</td><td>Lifelong</td></tr>
      </tbody></table>
      <div class="v141-note" style="margin-top:8px">EAU notes that the intermediate-risk HG/G3 subgroup should be followed like high-risk disease.</div>
    </div>
  </div>
  <div class="row"><div class="label">Stone prevention</div><div class="body">For recurrent/high-risk stone formers, document stone composition and a guideline-appropriate metabolic evaluation/24-hour urine assessment; link each abnormality to a specific preventive plan and follow-up rather than a generic “drink more water” message.</div></div>`);
}

function openUrgent(){
  openToolkit('Urgent urology triage',`
  <div class="row"><div class="label">Acute scrotum / suspected testicular torsion</div><div class="v141-alert" style="margin-top:8px"><b>Time-critical.</b> Clinical suspicion should trigger urgent urology/surgical review. Doppler ultrasound is useful when the diagnosis is uncertain, but imaging should not create avoidable delay when torsion is strongly suspected.</div></div>
  <div class="row"><div class="label">Ischaemic priapism</div><div class="body"><b>Emergency.</b> Confirm/assume ischaemic physiology from the clinical picture when appropriate. Cavernosal aspiration/irrigation plus intracavernosal phenylephrine is recommended in the acute pathway. Current EAU dosing: phenylephrine 100–500 micrograms/mL, typically 200 micrograms per dose every 3–5 minutes, with cardiovascular monitoring; total dose limit 1 mg in one hour in the cited EAU pathway. Escalate to surgical shunting when conservative measures fail.</div></div>
  <div class="row"><div class="label">Fournier gangrene</div><div class="v141-alert" style="margin-top:8px"><b>Do not wait for imaging if the clinical picture is convincing.</b> Immediate broad-spectrum antibiotics, resuscitation and urgent operative debridement/source control are the priorities. LRINEC can be an adjunct but must not delay surgery.</div></div>`);
}

function openAnticoag(){
  openToolkit('Perioperative anticoagulation & antiplatelet planning',`
  <div class="v141-note">This is a planning aid only. Procedure bleeding risk, renal function, neuraxial anaesthesia, thrombotic indication, recent coronary intervention and the operating/anesthesia team's protocol override this generic table.</div>
  <div class="row"><div class="label">DOACs — general elective planning</div><div class="body">
    <table class="xs-table" style="margin-top:8px"><thead><tr><th>Drug class</th><th>Low/moderate bleeding risk</th><th>High bleeding risk</th><th>Restart</th></tr></thead>
    <tbody>
      <tr><td>Apixaban / rivaroxaban / edoxaban</td><td>Usually omit 1 day before</td><td>Usually omit 2 days before</td><td>Usually ≥24 h; often 48–72 h after high-risk surgery when haemostasis secure</td></tr>
      <tr><td>Dabigatran</td><td>Hold duration depends on renal function</td><td>Commonly 2–4+ days depending on renal function</td><td>Usually ≥24 h; delay longer after high-risk surgery</td></tr>
    </tbody></table>
    <div class="v141-note" style="margin-top:8px">Neuraxial/deep plexus procedures require a separate, stricter anaesthesia schedule. Routine heparin bridging is not recommended for most DOAC interruptions.</div>
  </div></div>
  <div class="row"><div class="label">Warfarin</div><div class="body">Typical elective interruption is about 5 days with a pre-procedure INR target set by the procedure/team (often ≤1.5). Do not auto-bridge: bridging decisions depend on the individual thrombotic risk and should be specialist-led, especially with mechanical valves.</div></div>
  <div class="row"><div class="label">P2Y12 inhibitors</div><div class="body">Common elective washout planning is clopidogrel 5 days and ticagrelor 3–5 days, but recent coronary intervention/high ischemic risk can make cessation unsafe. Coordinate with cardiology/anesthesia rather than using an automatic stop rule. Aspirin continuation is indication- and procedure-dependent.</div></div>`);
}

function openAndrology(){
  openToolkit('Andrology & infertility',`
  <div class="row"><div class="label">WHO 6th edition — semen reference limits</div><div class="body">
    <table class="xs-table" style="margin-top:8px"><tbody>
      <tr><th>Parameter</th><th>Lower reference limit</th></tr>
      <tr><td>Volume</td><td>1.4 mL</td></tr>
      <tr><td>Sperm concentration</td><td>16 × 10⁶/mL</td></tr>
      <tr><td>Progressive motility</td><td>30%</td></tr>
      <tr><td>Total motility</td><td>42%</td></tr>
      <tr><td>Normal morphology</td><td>4%</td></tr>
    </tbody></table>
    <div class="v141-note" style="margin-top:8px">These are reference limits from the WHO 6th manual; semen results do not, by themselves, define whether a couple is fertile or infertile.</div>
  </div></div>
  <div class="row"><div class="label">Azoospermia — structured work-up</div><div class="body">
    <ol>
      <li>Confirm azoospermia on properly processed semen; document volume, pH and fructose when relevant.</li>
      <li>History/examination: testicular volume, epididymis/vas, prior infection/surgery, puberty, medications and family history.</li>
      <li>Hormonal pattern: FSH/LH/testosterone. High FSH + small testes supports impaired spermatogenesis (NOA), whereas normal gonadotropins + preserved testicular volume may support obstruction, but mixed phenotypes occur.</li>
      <li>When NOA or severe spermatogenic failure is suspected, evaluate for genetic causes with karyotype and Y-chromosome microdeletion testing according to the clinical phenotype.</li>
      <li>Obstructive patterns should trigger an anatomy-directed reconstructive or sperm-retrieval pathway; ejaculatory-duct obstruction is a specific differential when semen volume/pH/fructose and the anatomy support it.</li>
    </ol>
  </div></div>`);
}

function openPaeds(){
  openToolkit('Paediatric urology milestones',`
  <div class="row"><div class="label">Undescended testis</div><div class="body">If an undescended testis has not descended by about 6 months of age, spontaneous descent becomes unlikely and referral should not be delayed. Current EAU paediatric guidance recommends completing orchidopexy by 12 months and by 18 months at the latest.</div></div>
  <div class="row"><div class="label">Prenatally diagnosed hydronephrosis</div><div class="body">Renal/bladder ultrasound is the first standard postnatal evaluation. Routine ultrasound is generally delayed until after the early neonatal oliguria period unless there are severe/high-risk findings. VCUG is selective: consider it with ureteric dilatation, abnormal bladder, bilateral high-grade hydronephrosis, duplex systems with hydronephrosis, or symptomatic UTI.</div></div>
  <div class="row"><div class="label">VUR</div><div class="body">VCUG remains the reference diagnostic test when reflux needs to be demonstrated/graded, but modern paediatric pathways use risk-adapted imaging rather than exposing every child to routine VCUG. Breakthrough febrile UTI on prophylaxis is a reason to reassess the pathway.</div></div>`);
}

function openStentRegistry(){
  const rows=JSON.parse(localStorage.getItem('uroV141Stents')||'[]');
  const today=new Date(); today.setHours(0,0,0,0);
  openToolkit('DJ stent registry',`
    <div class="v141-note">Store only a local patient reference rather than unnecessary identifiers. The removal interval must follow the actual stent type, operative plan and local protocol; the preset intervals below are reminders, not universal dwell-time recommendations.</div>
    <div class="inputs" style="margin-top:10px"><input id="stRef" placeholder="Local patient reference / initials"><input id="stDate" type="date"><select id="stPreset"><option value="42">Example reminder: 6 weeks</option><option value="90">Example reminder: 3 months</option><option value="0">Custom interval</option></select><input id="stDays" type="number" min="1" placeholder="Custom days"></div>
    <button class="v141-primary" id="stAdd" style="margin-top:8px">Add reminder</button>
    <div id="stList" class="v141-result"></div>`);
  const render=()=>{
    const now=new Date(); now.setHours(0,0,0,0);
    const active=JSON.parse(localStorage.getItem('uroV141Stents')||'[]').sort((a,b)=>String(a.due).localeCompare(String(b.due)));
    document.getElementById('stList').innerHTML=active.length?active.map((x,i)=>{
      const due=new Date(x.due); const diff=Math.round((due-now)/86400000); const state=diff<0?'OVERDUE':diff===0?'DUE TODAY':diff<=14?'DUE SOON':'Scheduled';
      return '<div class="row"><div class="label">'+escV14(x.ref||'Local reference')+' — '+x.due+' <span class="badge '+(state==='OVERDUE'?'badge-red':'badge-slate')+'">'+state+'</span></div><div class="body">Placed '+x.placed+' · '+diff+' day(s) from today <button class="v141-secondary" data-del="'+i+'" style="float:right">Remove</button></div></div>';
    }).join(''):'No stents in the local registry.';
    document.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const a=JSON.parse(localStorage.getItem('uroV141Stents')||'[]').filter((_,j)=>j!==Number(b.dataset.del));localStorage.setItem('uroV141Stents',JSON.stringify(a));render();});
  };
  setTimeout(()=>{
    const d=document.getElementById('stDate'); d.value=new Date().toISOString().slice(0,10);
    document.getElementById('stAdd').onclick=()=>{
      const ref=document.getElementById('stRef').value.trim(); const placed=d.value; const preset=Number(document.getElementById('stPreset').value); const days=preset||Number(document.getElementById('stDays').value);
      if(!placed||!days){document.getElementById('stList').innerHTML='<span class="v141-alert">Enter a placement date and a reminder interval.</span>';return;}
      const due=new Date(placed+'T00:00:00'); due.setDate(due.getDate()+days);
      const a=JSON.parse(localStorage.getItem('uroV141Stents')||'[]'); a.push({ref,placed,due:due.toISOString().slice(0,10)}); localStorage.setItem('uroV141Stents',JSON.stringify(a)); render();
    };
    render();
  },0);
}

function openConsent(){
  openToolkit('Procedure-specific consent quick checklist',`
  <div class="row"><div class="label">TURP — major counselling points</div><div class="body">Bleeding/transfusion; clot retention; infection/sepsis; TUR syndrome/fluid-electrolyte disturbance where relevant; urethral stricture/bladder-neck contracture; temporary or persistent irritative symptoms; urinary incontinence; erectile dysfunction; retrograde ejaculation; need for re-intervention; anaesthetic/cardiovascular complications.</div></div>
  <div class="row"><div class="label">PCNL — major counselling points</div><div class="body">Bleeding/transfusion/embolisation; fever/sepsis; residual stones/staged procedures; collecting-system injury; pleural/chest complications depending on access; adjacent-organ injury including colon in relevant anatomy; urine leak; renal injury; need for additional endourology; anaesthetic/thromboembolic complications.</div></div>
  <div class="row"><div class="label">Documentation minimum</div><div class="body">Diagnosis, proposed procedure and alternatives; patient-specific major risks; possibility of conversion/additional procedure; blood products when relevant; stent/drain possibility; postoperative catheter/stent plan; opportunity for questions; patient/doctor signatures according to local consent policy.</div></div>`);
}

function addKeyboardSearch(){
  if(document.body.dataset.v141Keys==='1') return;
  document.body.dataset.v141Keys='1';
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){
      e.preventDefault();
      const s=document.getElementById('globalSearch');
      if(s){s.focus();s.select();}
    }
  });
}
function cleanupLegacyLabels(){
  const pairs=[
    ['V13.9 — treatment protocol checkpoints','V14.0 — treatment protocol checkpoints'],
    ['V13.9 — treatment protocol checkpoints','V14.0 — treatment protocol checkpoints'],
    ['EAU NMIBC 2021 risk-group engine','EAU NMIBC 4-group risk model (legacy calculator)']
  ];
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); const nodes=[]; let n;
  while(n=walker.nextNode()) nodes.push(n);
  nodes.forEach(node=>{
    let v=node.nodeValue||'';
    pairs.forEach(([a,b])=>{if(v.includes(a))v=v.split(a).join(b);});
    if(v!==node.nodeValue)node.nodeValue=v;
  });
}
function apply(){
  styleV14(); addClinicalHomeNavigation(); addQuickTools(); addKeyboardSearch(); cleanupLegacyLabels();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true}); else apply();
setTimeout(apply,1200); setTimeout(apply,3000);
})();
