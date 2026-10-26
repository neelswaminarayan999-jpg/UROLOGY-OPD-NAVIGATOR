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
    '<div class="v142-note">2026 EAU-aligned bladder-cancer decision aid. Confirm pathology, clinical staging and MDT plan. Therapy availability/approval is jurisdiction-specific; do not treat this tool as a prescription.</div>'+
    '<div class="v142-row"><div class="v142-label2">Disease state and clinical stage</div><div class="v142-inputs">'+
      '<select id="v142Stage"><option value="">Select stage</option><option value="Ta">Ta</option><option value="Tis">Tis / CIS</option><option value="T1">T1</option><option value="T2">T2</option><option value="T3">T3</option><option value="T4a">T4a</option><option value="T4b">T4b / unresectable</option><option value="M1">M1 / metastatic disease</option></select>'+
      '<select id="v142Grade"><option value="">Grade</option><option value="low">Low grade</option><option value="high">High grade</option><option value="variant">Variant histology / LVI concern</option></select>'+
      '<select id="v142N"><option value="">Clinical N stage</option><option value="N0">cN0</option><option value="N1">cN1</option><option value="N23">cN2–3 / bulky nodes</option><option value="unknown">Unknown / incomplete staging</option></select>'+
      '<select id="v142M"><option value="">Clinical M stage</option><option value="M0">cM0</option><option value="M1">cM1</option><option value="unknown">Unknown / incomplete staging</option></select>'+
    '</div></div>'+
    '<div class="v142-row"><div class="v142-label2">NMIBC pathology and risk inputs</div><div class="v142-inputs">'+
      '<select id="v142Complete"><option value="">Initial TURBT complete?</option><option value="yes">Yes</option><option value="no">No / doubtful</option></select>'+
      '<select id="v142Muscle"><option value="">Detrusor muscle present?</option><option value="yes">Yes</option><option value="no">No</option><option value="na">Not applicable / primary CIS</option></select>'+
      '<select id="v142Cis"><option value="">Concomitant CIS?</option><option value="yes">Yes</option><option value="no">No</option></select>'+
      '<select id="v142Risk"><option value="">Formal EAU risk group</option><option value="low">Low</option><option value="intermediate">Intermediate</option><option value="high">High</option><option value="veryhigh">Very high</option><option value="unknown">Not yet assigned</option></select>'+
      '<select id="v142Bcg"><option value="">BCG status</option><option value="notstarted">Not started / not indicated</option><option value="naive">BCG-naive</option><option value="exposed">BCG-exposed / relapse not meeting BCG-unresponsive definition</option><option value="adequate">Adequate BCG, no BCG-unresponsive recurrence</option><option value="unresponsive">BCG-unresponsive (strict definition confirmed)</option></select>'+
      '<select id="v142BcgPhenotype"><option value="">BCG-unresponsive phenotype</option><option value="cis">CIS ± papillary tumour</option><option value="papillary">Papillary Ta/T1 only</option><option value="unknown">Not documented / not applicable</option></select>'+
      '<select id="v142Cystectomy"><option value="">Radical cystectomy suitability</option><option value="fit">Suitable / willing</option><option value="unfit">Medically unfit</option><option value="declines">Declines after counselling</option><option value="unknown">Not assessed</option></select>'+
    '</div></div>'+
    '<div class="v142-row"><div class="v142-label2">Systemic therapy eligibility (MIBC / advanced disease)</div><div class="v142-inputs">'+
      '<select id="v142Ici"><option value="">Immune-checkpoint inhibitor suitability</option><option value="eligible">Eligible after contraindication review</option><option value="contraindicated">Contraindicated / unsuitable</option><option value="unknown">Not assessed</option></select>'+
      '<select id="v142Ev"><option value="">Enfortumab vedotin suitability</option><option value="eligible">Suitable after toxicity/contraindication review</option><option value="contraindicated">Contraindicated / unsuitable</option><option value="unknown">Not assessed</option></select>'+
      '<select id="v142Access"><option value="unverified">Local approval / supply not yet verified</option><option value="available">Confirmed approved and available locally</option><option value="unavailable">Not approved / unavailable locally</option></select>'+
    '</div></div>'+
    '<div class="v142-row"><div class="v142-label2">Cisplatin fitness screen</div><div class="v142-inputs">'+
      '<select id="v142Ecog"><option value="">ECOG PS</option><option value="0">0</option><option value="1">1</option><option value="2">2 or higher</option></select>'+
      '<input id="v142Crcl" type="number" min="0" placeholder="Measured GFR / CrCl (mL/min)">'+
      '<select id="v142Hear"><option value="">Grade ≥2 hearing loss?</option><option value="no">No</option><option value="yes">Yes</option></select>'+
      '<select id="v142Neuro"><option value="">Grade ≥2 neuropathy?</option><option value="no">No</option><option value="yes">Yes</option></select>'+
      '<select id="v142Nyha"><option value="">NYHA III–IV heart failure?</option><option value="no">No</option><option value="yes">Yes</option></select>'+
    '</div></div>'+
    '<button class="v142-primary" id="v142Generate">Generate pathway</button>'+
    '<div id="v142Result" class="v142-note">Complete the fields relevant to the disease state. Missing inputs will be flagged.</div>';

  modal('Bladder cancer pathway','EAU 2026-aligned decision framework · clinician/MDT verification required',body);
  setTimeout(function(){
    var b=document.getElementById('v142Generate');
    if(b) b.onclick=renderBladderPathway;
  },20);
}

function val(id){var e=document.getElementById(id);return e?e.value:'';}

function renderBladderPathway(){
  var stage=val('v142Stage'), grade=val('v142Grade'), complete=val('v142Complete'), muscle=val('v142Muscle'),
      cis=val('v142Cis'), risk=val('v142Risk'), bcg=val('v142Bcg'), phenotype=val('v142BcgPhenotype'),
      cystectomy=val('v142Cystectomy'), node=val('v142N'), met=val('v142M'), ici=val('v142Ici'),
      ev=val('v142Ev'), access=val('v142Access'), ecog=val('v142Ecog'), crcl=Number(val('v142Crcl')),
      hear=val('v142Hear')==='yes', neuro=val('v142Neuro')==='yes', nyha=val('v142Nyha')==='yes';
  var html='', isNMIBC=(stage==='Ta'||stage==='Tis'||stage==='T1'),
      hasGfr=val('v142Crcl')!==''&&Number.isFinite(crcl)&&crcl>0,
      cisFit=!!ecog&&(ecog==='0'||ecog==='1')&&hasGfr&&crcl>=60&&!!val('v142Hear')&&val('v142Hear')==='no'&&!!val('v142Neuro')&&val('v142Neuro')==='no'&&!!val('v142Nyha')&&val('v142Nyha')==='no',
      classicUnfit=ecog==='2'||(hasGfr&&crcl<60)||hear||neuro||nyha,
      periopCisplatinFit=!!ecog&&(ecog==='0'||ecog==='1')&&hasGfr&&crcl>=40&&!!val('v142Hear')&&val('v142Hear')==='no'&&!!val('v142Neuro')&&val('v142Neuro')==='no'&&!!val('v142Nyha')&&val('v142Nyha')==='no';

  if(!stage){
    html='<div class="v142-alert"><b>Stage required.</b> Select the disease state before treatment planning.</div>';
  }else if(isNMIBC){
    var muscleException=(stage==='Tis')||(stage==='Ta'&&grade==='low'),
        reTUR=(complete==='no')||stage==='T1'||(muscle==='no'&&!muscleException),
        considerReTUR=(stage==='Ta'&&grade==='high'),
        missingPathology=!grade||!complete||!muscle||!cis||!risk||!bcg;

    html='<b>Non–muscle-invasive bladder cancer (NMIBC)</b>'+
      '<div class="v142-note"><b>First gate:</b> pathology review, complete TURBT assessment, detrusor muscle where indicated, CIS/variant-histology status and a formally assigned risk group. Do not infer a full EAU risk group from stage and grade alone.</div>';

    if(missingPathology){
      html+='<div class="v142-alert"><b>Pathway incomplete.</b> Complete the missing TURBT/pathology, CIS, formal EAU risk-group and BCG-status fields. A blank field is not evidence that repeat TURBT or additional therapy is unnecessary.</div>';
    }
    if(reTUR){
      html+='<div class="v142-alert"><b>Repeat TURBT indicated by entered data.</b> Incomplete/doubtful resection; any T1 tumour; or absent detrusor muscle except in appropriate low-grade Ta/primary CIS situations. Plan re-resection in the guideline window (commonly within 2–6 weeks) and include the original tumour site, with the final decision based on pathology and local guideline.</div>';
    }else if(considerReTUR){
      html+='<div class="v142-note"><b>High-grade Ta:</b> consider repeat TURBT according to tumour size/multifocality, resection completeness, muscle sampling and the applicable current guideline; do not dismiss it solely because muscle is reported.</div>';
    }else if(complete&&muscle){
      html+='<div class="v142-note"><b>Repeat TURBT:</b> no automatic trigger is established by the entered fields alone; confirm the operative and pathology report before excluding a second resection.</div>';
    }

    if(risk==='low'){
      html+='<div class="v142-note"><b>Low risk:</b> after adequate TURBT, offer a single immediate postoperative intravesical chemotherapy instillation when safe and not contraindicated. Do not default to maintenance BCG for low-risk disease.</div>';
    }else if(risk==='intermediate'){
      html+='<div class="v142-note"><b>Intermediate risk:</b> select further intravesical chemotherapy (generally up to one year) or a BCG induction/maintenance strategy (often one year) according to recurrence/progression risk, prior recurrence, comorbidity, patient priorities and current guidance.</div>';
    }else if(risk==='high'){
      html+='<div class="v142-note"><b>High risk:</b> discuss full-dose BCG induction with maintenance (typically 1–3 years) and early radical cystectomy where clinicopathological features warrant it.</div>';
    }else if(risk==='veryhigh'){
      html+='<div class="v142-alert"><b>Very-high risk:</b> discuss immediate radical cystectomy as a key oncological option. Full-dose BCG induction/maintenance remains an option for selected patients who decline or are unsuitable for cystectomy, with informed discussion of progression risk.</div>';
    }else if(risk==='unknown'){
      html+='<div class="v142-alert"><b>Risk group not assigned.</b> Complete the formal EAU risk classification using all required clinical/pathological factors before choosing the intravesical/adjuvant pathway.</div>';
    }

    if(bcg==='naive'&&(risk==='high'||risk==='veryhigh')){
      if(ici==='eligible'&&access!=='unavailable'){
        html+='<div class="v142-note"><b>2026 EAU add-on discussion:</b> in selected, well-informed BCG-naïve high-/very-high-risk patients, discuss the benefits and harms of adding sasanlimab or durvalumab to BCG with maintenance. Confirm patient-specific immunotherapy suitability, country-specific authorization, actual supply, protocol and toxicity monitoring before selection.</div>';
      }else if(ici==='contraindicated'){
        html+='<div class="v142-alert"><b>Checkpoint inhibitor unsuitable:</b> do not select the BCG + sasanlimab/durvalumab add-on pathway. Discuss standard BCG/cystectomy options according to risk and suitability.</div>';
      }else{
        html+='<div class="v142-alert"><b>Immunotherapy review required before add-on selection.</b> Assess contraindications first; the 2026 EAU update recommends shared discussion of BCG plus sasanlimab or durvalumab in selected high-/very-high-risk BCG-naïve patients, not automatic use in everyone.</div>';
      }
      if(access==='unavailable') html+='<div class="v142-note"><b>Access:</b> newer BCG-plus-immunotherapy options are marked unavailable locally. Use established risk-directed treatment or consider an appropriate clinical trial; do not prescribe on the basis of the evidence listing alone.</div>';
    }

    if(bcg==='unresponsive'){
      html+='<div class="v142-alert"><b>BCG-unresponsive gate:</b> verify adequate BCG exposure, timing of recurrence/persistence, histology and the formal definition. Do not simply repeat BCG in confirmed BCG-unresponsive high-grade disease.</div>';
      if(cystectomy==='fit'){
        html+='<div class="v142-alert"><b>Radical cystectomy:</b> if the patient is a surgical candidate and accepts surgery, discuss prompt radical cystectomy with appropriate lymph-node dissection as the preferred oncological option. Bladder-sparing treatment options are considered oncologically inferior and must not delay definitive treatment without a reasoned MDT decision.</div>';
      }else if(cystectomy==='unfit'||cystectomy==='declines'){
        html+='<div class="v142-note"><b>Bladder-preserving pathway for unfit/refusing patients:</b> multidisciplinary review and clinical-trial consideration are appropriate. Match options to whether recurrence is CIS-containing or papillary-only, prior treatments, current product label, local authorization/availability and patient goals.</div>';
        if(phenotype==='cis'){
          html+='<div class="v142-note"><b>CIS ± papillary options to review:</b> phenotype- and jurisdiction-dependent bladder-sparing options listed in the 2026 EAU evidence table include nadofaragene firadenovec, nogapendekin alfa inbakicept + BCG, TAR-200, and systemic pembrolizumab; valrubicin and other intravesical strategies may be relevant in selected settings. Verify the current local label and eligibility for each option.</div>';
        }else if(phenotype==='papillary'){
          html+='<div class="v142-note"><b>Papillary Ta/T1-only options to review:</b> use the current EAU Table 7.3 and local protocol for phenotype-specific intravesical/device-assisted options and clinical trials; do not automatically transfer CIS-only evidence or indications to papillary-only disease.</div>';
        }else{
          html+='<div class="v142-alert"><b>BCG-unresponsive phenotype missing.</b> Specify CIS ± papillary versus papillary Ta/T1-only disease before considering a bladder-sparing regimen.</div>';
        }
      }else{
        html+='<div class="v142-alert"><b>Cystectomy suitability not documented.</b> Record whether radical cystectomy is feasible/acceptable before selecting salvage therapy. If unfit or declined, the bladder-sparing route requires phenotype-specific MDT review.</div>';
      }
    }else if(bcg==='exposed'){
      html+='<div class="v142-note"><b>BCG-exposed/relapsing but not BCG-unresponsive:</b> do not automatically route to a salvage-only pathway or repeat the same treatment without checking relapse timing, grade, CIS and adequacy of prior BCG. Further BCG can remain appropriate in selected patients outside the strict BCG-unresponsive definition.</div>';
    }else if(bcg==='adequate'){
      html+='<div class="v142-note"><b>BCG response/follow-up:</b> document response, maintenance received, surveillance findings and recurrence date. Reclassify any high-grade recurrence using the strict BCG-failure definitions before selecting salvage therapy.</div>';
    }
  }else if(stage==='T2'||stage==='T3'||stage==='T4a'){
    if(met==='M1'){
      html+='<b>Metastatic urothelial carcinoma pathway</b><div class="v142-note">M1 disease supersedes the localized perioperative pathway. Use a dedicated advanced-disease pathway with histology, metastatic sites, performance status, renal function, prior systemic treatment, molecular testing and patient goals documented.</div>';
    }else if(!node||node==='unknown'||!met||met==='unknown'||!ecog||!hasGfr||!val('v142Hear')||!val('v142Neuro')||!val('v142Nyha')||!ici||ici==='unknown'){
      html='<b>Muscle-invasive bladder cancer pathway</b><div class="v142-alert"><b>Required staging/fitness data missing.</b> Complete cN and cM staging, ECOG, measured GFR/CrCl, hearing, neuropathy, cardiac and immunotherapy eligibility fields before selecting a perioperative regimen.</div>';
    }else if(node==='N23'){
      html='<b>Clinically node-advanced MIBC</b><div class="v142-alert">cN2–3 disease does not fit the standard cN0–1 localized perioperative branch. Confirm resectability and full staging in MDT; choose systemic/local treatment from the advanced-disease pathway.</div>';
    }else if(met==='M0'&&(node==='N0'||node==='N1')){
      var gcDurvaFit=periopCisplatinFit&&ici==='eligible';
      var evPFit=!periopCisplatinFit&&ici==='eligible'&&ev==='eligible'&&access!=='unavailable';
      html='<b>Localized muscle-invasive bladder cancer (MIBC)</b><div class="v142-note"><b>Shared decision:</b> MDT review before treatment; discuss radical cystectomy + pelvic lymph-node dissection and carefully selected trimodality bladder-preserving treatment. The perioperative regimen must match the staging and fitness data entered.</div>';
      if(gcDurvaFit){
        if(access==='available'){
          html+='<div class="v142-ok"><b>Perioperative cisplatin/gemcitabine + durvalumab:</b> EAU 2026 recommends this for eligible T2–T4a cN0–1 M0 patients who can receive both cisplatin-based chemotherapy and immunotherapy. GFR ≥40 mL/min was allowed in NIAGARA; split-dose cisplatin was used for GFR 40–60 in that trial. Confirm the approved local schedule and cisplatin suitability.</div>';
        }else{
          html+='<div class="v142-note"><b>Perioperative cisplatin/gemcitabine + durvalumab is a guideline-supported candidate:</b> renal function and entered screens meet the simplified pathway gate, but local approval/supply is not confirmed. Verify eligibility and access. If unavailable, discuss standard cisplatin-based neoadjuvant chemotherapy (e.g., GC or dd-MVAC per MDT) followed by definitive local treatment.</div>';
        }
      }else if(periopCisplatinFit&&ici==='contraindicated'){
        html+='<div class="v142-note"><b>Cisplatin-eligible but immunotherapy unsuitable:</b> do not recommend perioperative durvalumab or EV + pembrolizumab. Discuss cisplatin-based neoadjuvant chemotherapy (e.g., GC or dd-MVAC per local protocol) followed by radical cystectomy/PLND, or selected trimodality treatment in MDT.</div>';
      }else if(evPFit){
        html+='<div class="v142-alert"><b>Cisplatin-ineligible MIBC:</b> the 2026 EAU guideline recommends perioperative enfortumab vedotin + pembrolizumab for cisplatin-ineligible MIBC, subject to drug-specific eligibility, toxicity risk, local authorization/supply and MDT review. Do not substitute neoadjuvant carboplatin for cisplatin.</div>';
      }else if(!periopCisplatinFit&&ici==='eligible'&&ev==='eligible'&&access==='unavailable'){
        html+='<div class="v142-alert"><b>Guideline-supported perioperative EV + pembrolizumab is not locally available according to the entered setting.</b> Do not substitute neoadjuvant carboplatin. Discuss upfront radical cystectomy/PLND, selected trimodality therapy or clinical trial in MDT; verify local standards and access.';
      }else if(!periopCisplatinFit&&ici==='eligible'&&ev!=='eligible'){
        html+='<div class="v142-alert"><b>Cisplatin-ineligible and EV suitability not confirmed.</b> Do not generate an EV + pembrolizumab recommendation until contraindications and toxicity risks are reviewed. Do not substitute neoadjuvant carboplatin; discuss definitive local treatment, selected trimodality therapy or clinical trial with MDT.';
      }else{
        html+='<div class="v142-alert"><b>No immune-containing standard perioperative regimen selected.</b> Either immunotherapy is unsuitable or key drug-specific eligibility is unresolved. Do not recommend GC + durvalumab or EV + pembrolizumab; discuss definitive local treatment, selected trimodality therapy and clinical trials in MDT. Do not substitute neoadjuvant carboplatin for cisplatin.</div>';
      }
      if(crcl>=40&&crcl<60&&periopCisplatinFit){
        html+='<div class="v142-note"><b>Renal threshold note:</b> the classic Galsky renal threshold (<60 mL/min) and the NIAGARA perioperative eligibility threshold (GFR ≥40 mL/min, with split-dose cisplatin in the 40–60 range) are not interchangeable. Confirm the actual renal measurement, local protocol and patient-specific fitness rather than automatically excluding or automatically clearing cisplatin.</div>';
      }
      if(ici==='contraindicated'&&ev==='eligible'){
        html+='<div class="v142-note"><b>Drug-class caution:</b> pembrolizumab and durvalumab are immune-checkpoint inhibitors. A documented contraindication to immunotherapy must be reviewed before any immune-containing combination is considered; do not assume that EV + pembrolizumab resolves an ICI contraindication.</div>';
      }
    }else{
      html='<b>Stage / node / metastasis discordance</b><div class="v142-alert">The entered data do not fit the localized cT2–T4a cN0–1 M0 branch. Reconcile clinical stage and imaging before selecting treatment.</div>';
    }
  }else if(stage==='T4b'){
    html='<b>Locally advanced / unresectable bladder cancer</b><div class="v142-alert">Confirm extent, cN/cM stage, resectability, symptoms, organ function, histology and immunotherapy/EV suitability. This case does not automatically enter the curative localized perioperative branch; discuss systemic/local options and goals of care in MDT.</div>';
  }else if(stage==='M1'||met==='M1'){
    if(ici==='unknown'||!ici||ev==='unknown'||!ev||!ecog||!hasGfr||!val('v142Hear')||!val('v142Neuro')||!val('v142Nyha')){
      html='<b>Metastatic urothelial carcinoma</b><div class="v142-alert">Complete performance status, renal function, hearing, neuropathy, heart-failure, ICI and EV eligibility assessments before selecting first-line systemic therapy.</div>';
    }else if(ici==='eligible'&&ev==='eligible'&&access!=='unavailable'){
      html='<b>Metastatic urothelial carcinoma</b><div class="v142-ok"><b>First-line EV + pembrolizumab:</b> the 2026 EAU pathway uses enfortumab vedotin + pembrolizumab as the preferred first-line combination for eligible patients with advanced/unresectable or metastatic urothelial carcinoma. Confirm drug-specific risk factors, dosing, product information, access and local MDT plan.</div>';
      if(access==='unverified') html+='<div class="v142-note"><b>Access warning:</b> the named regimen is a guideline-supported candidate, but local approval and supply have not been verified.</div>';
    }else if(ici==='eligible'){
      html='<b>Metastatic urothelial carcinoma</b><div class="v142-note"><b>EV + pembrolizumab not selected:</b> if EV is contraindicated or unavailable, assess platinum fitness. In suitable cisplatin-eligible patients, cisplatin/gemcitabine + nivolumab or platinum chemotherapy followed by avelumab maintenance after response/stable disease may be options where approved and appropriate. For carboplatin-eligible patients, gemcitabine/carboplatin followed by avelumab maintenance may be considered. Confirm current sequencing, eligibility and local access.</div>';
    }else{
      html='<b>Metastatic urothelial carcinoma</b><div class="v142-alert"><b>Immune-checkpoint inhibitor unsuitable:</b> do not recommend EV + pembrolizumab, cisplatin/gemcitabine + nivolumab or avelumab maintenance. Select chemotherapy or other treatment according to cisplatin/carboplatin fitness, histology, biomarkers, prior therapy and current local guidance in MDT.</div>';
    }
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