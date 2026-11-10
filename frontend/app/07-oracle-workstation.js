
/* ================================================================
   UROLOGY ORACLE V14 — FINAL CLINICAL WORKSTATION LAYER
   Base: V13.3 DEEP CLINICAL. Non-destructive: adds a workstation
   around the existing Oracle rather than replacing its source engines.
   ================================================================ */
(function(){
'use strict';
const V14={version:'14.0',updated:'27 Sep 2026',mode:'FINAL CLINICAL WORKSTATION',base:'V13.3',offlineAI:false};
const esc14=window.esc||function(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));};
const q14=id=>document.getElementById(id);

const SOURCES14={
  'EAU Prostate Cancer 2026':'https://uroweb.org/guidelines/prostate-cancer',
  'EAU NMIBC 2026':'https://uroweb.org/guidelines/non-muscle-invasive-bladder-cancer',
  'EAU MIBC 2026':'https://uroweb.org/guidelines/muscle-invasive-and-metastatic-bladder-cancer',
  'EAU RCC 2026':'https://uroweb.org/guidelines/renal-cell-carcinoma',
  'EAU UTUC 2026':'https://uroweb.org/guidelines/upper-urinary-tract-urothelial-cell-carcinoma',
  'EAU Penile Cancer 2026':'https://uroweb.org/guidelines/penile-cancer',
  'EAU Testicular Cancer 2026':'https://uroweb.org/guidelines/testicular-cancer',
  'EAU Primary Urethral Carcinoma 2026':'https://uroweb.org/guidelines/primary-urethral-carcinoma',
  'EAU Urethral Strictures 2026':'https://uroweb.org/guidelines/urethral-strictures',
  'EAU Urolithiasis 2026':'https://uroweb.org/guidelines/urolithiasis',
  'EAU Male LUTS 2026':'https://uroweb.org/guidelines/management-of-non-neurogenic-male-luts',
  'EAU Urological Infections':'https://uroweb.org/guidelines/urological-infections',
  'FDA MIBC EV+pembrolizumab — 10 Jul 2026':'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-pembrolizumab-or-pembrolizumab-and-berahyaluronidase-alfa-pmph-each-enfortumab-vedotin',
  'KEYNOTE-B15 / EV-304 — NEJM 2026':'https://uroonco.uroweb.org/publication/enfortumab-vedotin-and-pembrolizumab-in-cisplatin-eligible-bladder-cancer/',
  'EAU MIBC 2026 educational update':'https://bladder.uroonco.uroweb.org/report/summer-reads-2026/',
  'FDA durvalumab + BCG — 28 May 2026':'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-durvalumab-combination-bacillus-calmette-guerin-high-risk-non-muscle-invasive-bladder',
  'FDA RCC adjuvant belzutifan + pembrolizumab — 12 Jun 2026':'https://www.fda.gov/drugs/resources-information-approved-drugs/oncology-cancerhematologic-malignancies-approval-notifications' 
};
const REGIMENS14=[
 {id:'mibc_ev_pembro',name:'Enfortumab vedotin + pembrolizumab (perioperative MIBC)',disease:'Ca Bladder',use:'Cystectomy candidates with MIBC; 2026 evidence/US FDA label expanded to cisplatin-eligible candidates',dose:'EV 1.25 mg/kg IV Days 1 and 8 + pembrolizumab 200 mg IV Day 1 every 3 weeks ×4 neoadjuvant cycles; trial adjuvant phase included additional EV and pembrolizumab exposure after cystectomy.',gate:'Confirm cystectomy candidacy, neuropathy/skin/diabetes/other EV risks, immune-toxicity suitability and current local label.',sources:['FDA MIBC EV+pembrolizumab — 10 Jul 2026','KEYNOTE-B15 / EV-304 — NEJM 2026']},
 {id:'mibc_durva_gc',name:'Durvalumab + gemcitabine/cisplatin (NIAGARA / EAU 2026)',disease:'Ca Bladder',use:'Perioperative MIBC in an appropriate cisplatin-capable, immunotherapy-suitable patient',dose:'Reference regimen: durvalumab 1500 mg IV Day 1 + gemcitabine/cisplatin q21 days ×4 neoadjuvant cycles, followed by radical cystectomy/PLND and adjuvant durvalumab; confirm exact current protocol/order set.',gate:'Do not reduce eligibility to a single CrCl cut-off; assess renal function, ECOG, hearing, neuropathy, cardiac status and local protocol.',sources:['EAU MIBC 2026']},
 {id:'nmibc_durva_bcg',name:'Durvalumab + BCG (POTOMAC / 2026 FDA)',disease:'Ca Bladder',use:'BCG-naïve high-risk NMIBC in jurisdictions where approved and where the patient is appropriate for systemic immunotherapy',dose:'Durvalumab 1,500 mg IV every 4 weeks for 13 cycles in adults ≥30 kg, combined with BCG induction and maintenance; verify current local label and BCG order set.',gate:'Confirm BCG-naïve high-risk NMIBC after adequate TURBT, suitability for BCG and immune-checkpoint therapy, and current jurisdictional approval.',sources:['EAU NMIBC 2026','FDA durvalumab + BCG — 28 May 2026']},
 {id:'rcc_adjuvant_belu_pembro',name:'Belzutifan + pembrolizumab — adjuvant ccRCC',disease:'Ca RCC',use:'Selected adults with RCC with a clear-cell component at intermediate-high/high recurrence risk after nephrectomy ± resection of metastatic lesions, where the current jurisdictional label applies',dose:'Use the current jurisdictional prescribing information for exact belzutifan and pembrolizumab dose, schedule, duration and monitoring; do not substitute metastatic RCC dosing tables.',gate:'Confirm pathology, recurrence-risk category, postoperative setting and current local regulatory indication before selecting this branch.',sources:['FDA RCC adjuvant belzutifan + pembrolizumab — 12 Jun 2026']},
 {id:'bcg_nmist',name:'BCG induction / maintenance reference',disease:'Ca Bladder',use:'Appropriate intermediate/high-risk NMIBC after adequate TURBT and according to risk/phenotype',dose:'Common reference: induction once weekly ×6; maintenance schedule depends on risk and regimen. Do not instill with active symptomatic/systemic infection or unsafe post-TURBT conditions.',gate:'Check stage, grade, CIS, adequacy of resection, perforation/trauma risk, infection and BCG-unresponsive status before use.',sources:['EAU NMIBC 2026']},
 {id:'gc',name:'Gemcitabine + cisplatin (GC)',disease:'Ca Bladder / UTUC',use:'Cisplatin-based urothelial carcinoma pathway where indication and fitness are appropriate',dose:'Regimen choice, split-dose strategy and cycle count are indication-specific; use the institutional chemotherapy order set rather than a generic one-size-fits-all schedule.',gate:'Explicit cisplatin fitness screen + renal function + ECOG + hearing + neuropathy + heart-failure context.',sources:['EAU MIBC 2026','EAU UTUC 2026']},
 {id:'bep_ep',name:'BEP / EP reference',disease:'Ca Testis',use:'Germ-cell tumour systemic treatment according to stage/risk and contraindication profile',dose:'Exact cycle count and regimen depend on seminoma/NSGCT, IGCCCG group and bleomycin suitability.',gate:'Document pulmonary risk/bleomycin suitability, renal function, fertility counselling, markers and IGCCCG risk.',sources:['EAU Testicular Cancer 2026']},
 {id:'adt_arpi',name:'ADT + androgen-receptor pathway inhibitor',disease:'Ca Prostate',use:'Metastatic hormone-sensitive prostate cancer in appropriate patients',dose:'Specific ARPI and dosing depends on selected agent, indication, prior therapy, interactions and jurisdictional label.',gate:'Record metastatic volume, symptoms, comorbidities, drug interactions, CV/metabolic risk and patient priorities.',sources:['EAU Prostate Cancer 2026']}
];

const contentStatus=[
 ['Prostate cancer','EAU 2026 reviewed','Risk/staging/BCR/mHSPC/nmCRPC/mCRPC'],
 ['Bladder cancer','EAU 2026 + 2026 regulatory/trial refresh','NMIBC/MIBC/metastatic/biomarker branches; durvalumab+BCG and perioperative EV+pembro/durvalumab+GC'],
 ['RCC','EAU 2026 + 2026 adjuvant regulatory refresh','Surgery/active surveillance/systemic/adjuvant framework; belzutifan+pembrolizumab registry'],
 ['UTUC','EAU 2026 baseline','Risk-adapted kidney-sparing vs RNU/systemic framework'],
 ['Penile cancer','EAU 2026 baseline','Primary + cN0 + cN1–3 + systemic framework'],
 ['Testicular cancer','EAU 2026 baseline','Stage I/I-II/metastatic/post-chemotherapy framework'],
 ['Primary urethral cancer','EAU 2026','TNM 9 + advanced multimodal framework'],
 ['Urethral stricture','EAU 2026','Site/length/recurrence/reconstruction framework'],
 ['Stone disease','EAU 2026 baseline','Emergency + ureteric/renal/complex stone framework'],
 ['Male LUTS/BPH','EAU 2026','Symptom/complication/size/procedure framework'],
 ['Urological infections','EAU current reference','Emergency + stewardship framework']
];

function style(){
 const css=`<style id="v14Style">
#v14Root{margin:14px 0;font-family:inherit;color:#183446}.v14-card{border:1px solid #cad9e3;border-radius:16px;background:#fff;overflow:hidden}.v14-head{padding:14px 16px;background:linear-gradient(135deg,#072638,#0d5268);color:white}.v14-head h3{margin:0;font-size:16px;font-weight:900}.v14-head p{margin:5px 0 0;color:#d9edf4;font-size:11px;line-height:1.5}.v14-body{padding:12px 14px}.v14-toolbar{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px}.v14-btn{border:1px solid #bdd0dc;border-radius:10px;background:#f7fbfd;color:#12384e;padding:8px 11px;font-size:10px;font-weight:900;cursor:pointer}.v14-btn.active,.v14-btn:hover{background:#eaf4f8;border-color:#8fb4c6}.v14-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.v14-stat{border:1px solid #d8e4eb;border-radius:12px;padding:10px;background:#f9fbfc}.v14-stat b{display:block;font-size:16px;color:#0b4d64}.v14-stat span{font-size:9px;color:#667c8a}.v14-table{width:100%;border-collapse:collapse;font-size:10px}.v14-table th,.v14-table td{border:1px solid #d9e4eb;padding:7px;vertical-align:top;text-align:left}.v14-table th{background:#edf4f8;font-weight:900}.v14-tag{display:inline-flex;padding:4px 7px;border-radius:999px;background:#edf5f8;font-size:9px;font-weight:900;margin:2px}.v14-tag.good{background:#eaf7ef;color:#17633c}.v14-tag.warn{background:#fff6df;color:#775514}.v14-tag.red{background:#fdecef;color:#8c2635}.v14-list{margin:6px 0 0;padding-left:18px;font-size:10.5px;line-height:1.6}.v14-mini{font-size:9.5px;color:#657b89;line-height:1.5}.v14-source{font-size:9px;color:#166480;text-decoration:none;font-weight:900}.v14-source:hover{text-decoration:underline}.v14-note{padding:9px 10px;border-radius:10px;background:#eef7fb;border-left:4px solid #1d7995;font-size:10px;line-height:1.55}.v14-warn{padding:9px 10px;border-radius:10px;background:#fff7e8;border-left:4px solid #bf7b16;font-size:10px;line-height:1.55}.v14-danger{padding:9px 10px;border-radius:10px;background:#fff0f1;border-left:4px solid #ab3e4b;font-size:10px;line-height:1.55}.v14-section{margin-top:12px;padding-top:12px;border-top:1px solid #dde6ec}.v14-section h4{margin:0 0 7px;font-size:12px;font-weight:900}.v14-reg{border:1px solid #d4e0e8;border-radius:12px;padding:10px;margin-top:8px;background:#fff}.v14-reg h5{margin:0;font-size:11px;font-weight:900;color:#143a4e}.v14-reg p{margin:4px 0 0;font-size:10px;line-height:1.55;color:#355565}.v14-case-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.v14-case-grid textarea{width:100%;min-height:72px;border:1px solid #c8d7e0;border-radius:10px;padding:9px;font-size:10px}.v14-case-grid input,.v14-case-grid select{width:100%;border:1px solid #c8d7e0;border-radius:10px;padding:9px;font-size:10px}.v14-pill{display:inline-block;padding:4px 8px;border-radius:999px;font-size:9px;font-weight:900;background:#edf4f8;margin:2px}.v14-progress{height:8px;border-radius:99px;background:#e6edf1;overflow:hidden}.v14-progress>span{display:block;height:100%;background:#27819b}.v14-hidden{display:none!important}@media(max-width:900px){.v14-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.v14-case-grid{grid-template-columns:1fr}}@media(max-width:600px){.v14-grid{grid-template-columns:1fr}}
</style>`;
 document.head.insertAdjacentHTML('beforeend',css);
}
style();

function sourceLinks(keys){return keys.map(k=>SOURCES14[k]?`<a class="v14-source" target="_blank" rel="noopener noreferrer" href="${esc14(SOURCES14[k])}">${esc14(k)} ↗</a>`:'').join(' • ')}
function visibleText(v){return Object.entries(v||{}).filter(([k,x])=>x!==''&&x!=null).map(([k,x])=>`${k}: ${x}`).join(' | ')}
function diseaseMeta(name){
 const v=window.oracleState||{};
 const missing=typeof window.oracleIncomplete==='function'?window.oracleIncomplete(name,v):[];
 let warnings=[],plan=[],what=[];
 if(name==='Ca Bladder'){
   const s=typeof window.deriveBladder==='function'?window.deriveBladder(v):'';
   if(s==='MIBC'){
     plan=['Confirm complete staging and cystectomy/trimodality fitness','Complete explicit cisplatin-eligibility variables rather than a yes/no assumption','Compare guideline/label-relevant perioperative systemic options','Document nodal/M1 status and pathology modifiers'];
     what=['T4b','M1','variant histology/LVI','ineligible for one regimen','treatment toxicity','patient preference'];
   } else if(s==='NMIBC'){
     plan=['Verify TURBT quality and detrusor muscle status','Assign risk using stage/grade/CIS/size/number/recurrence context','Determine whether this is BCG-naïve, BCG-exposed, or BCG-unresponsive','Select intravesical/systemic/surgical branch and surveillance'];
     what=['high-grade T1 with inadequate muscle','CIS','variant histology/LVI','BCG-unresponsive phenotype','early/frequent recurrence'];
   } else if(s==='METASTATIC'){
     plan=['Map prior platinum/ICI/EV exposure','Record FGFR3 and HER2 status where relevant','Assess performance status and organ function','Select current-line systemic pathway'];
     what=['prior EV','prior ICI','prior platinum','FGFR3 alteration','HER2 expression','rapid clinical deterioration'];
   } else warnings.push('T/M staging is incomplete.');
 }
 if(name==='Ca Prostate'){
   if(v.state==='Localized') plan=['Confirm PSA, Grade Group, cT/cN/cM and MRI/biopsy extent','Assign formal risk group','Integrate life expectancy/comorbidity and urinary/sexual baseline','Compare surveillance, surgery and radiotherapy branches'];
   if(v.state==='mHSPC') plan=['Confirm castration-sensitive state and metastatic extent','Record disease volume/de novo vs recurrent context','Choose systemic intensification branch','Add bone/CV/metabolic risk management'];
   if(v.state==='mCRPC') plan=['Map prior ARPI and docetaxel exposure','Obtain exact HRR report where indicated','Assess PSMA status when radioligand therapy may be relevant','Choose sequence based on prior exposure and molecular phenotype'];
   what=['change in metastatic burden','new HRR result','PSMA positivity/eligibility','prior drug exposure','toxicity/organ-function change'];
 }
 if(name==='Ca Kidney'){plan=['Confirm histology and TNM','Assess nephron-sparing feasibility and renal function','For metastatic disease, document IMDC and prior systemic exposure','Consider adjuvant recurrence-risk pathway where applicable'];what=['solitary kidney','bilateral disease','venous invasion','IMDC change','new metastases'];}
 if(name==='UTUC'){plan=['Establish low/high-risk phenotype','Document location, grade and invasion markers','Assess kidney-sparing feasibility vs radical surgery','Evaluate perioperative systemic therapy eligibility and metastatic biomarkers'];what=['high-grade cytology','hydronephrosis','multifocality','infiltrative disease','renal function'];}
 if(name==='Ca Penis'){plan=['Assess primary lesion depth/grade/LVI','Stage both groins properly','Route cN0 separately from cN1–3','Add pelvic-node/systemic branch when criteria are met'];what=['positive FNA','bulky nodes','bilateral/mobile disease','ENE','new pelvic/metastatic disease'];}
 if(name==='Ca Testis'){plan=['Histology + pre/post-orchiectomy markers','Assign stage and IGCCCG where metastatic','Route stage I separately from metastatic disease','Handle post-chemotherapy residual masses explicitly'];what=['marker persistence','marker kinetics','LVI','residual mass size','new metastases'];}
 if(name==='Urethral Cancer'){plan=['Use TNM 9-compatible staging framework','Integrate site + histology + nodes + resectability','For advanced disease consider multimodal management'];what=['positive nodes','T3/T4 extension','histologic subtype','M1'];}
 if(name==='Urethral Stricture'){plan=['Confirm anatomy with appropriate imaging/endoscopy','Use site + length + recurrence + obliteration + aetiology','Avoid generic repeat endoluminal therapy in complex/recurrent disease','Select reconstructive pathway when indicated'];what=['lichen sclerosus','radiation','obliteration','previous urethroplasty','complex recurrence'];}
 if(name==='BPH / Male LUTS'){plan=['Phenotype symptoms and bother','Look for absolute surgical indications','Integrate prostate volume and storage symptoms','Discuss procedure choice with ejaculation/sexual priorities'];what=['retention','recurrent UTI','stones','upper tract compromise','refractory haematuria'];}
 if(name==='Stone Disease'){plan=['Exclude infected obstruction first','Define site, size, burden and anatomy','For staghorn/complex stones use a PCNL-centred strategy','Plan definitive treatment only after acute sepsis is controlled'];what=['sepsis','solitary kidney','obstruction','complex anatomy','large branching burden'];}
 return {missing,warnings,plan,what};
}

function makePanel(){
 if(q14('v14Root'))return q14('v14Root');
 const oracle=document.getElementById('oracleView'); if(!oracle)return null;
 const root=document.createElement('div');root.id='v14Root';
 oracle.appendChild(root);
 return root;
}
function renderWorkstation(){
 const root=makePanel();if(!root)return;
 root.innerHTML=`<div class="v14-card"><div class="v14-head"><h3>V14 FINAL CLINICAL WORKSTATION</h3><p>Decision gates • case completeness • regimen references • evidence provenance • update registry • MDT-ready summary</p></div><div class="v14-body">
 <div class="v14-toolbar">
  <button class="v14-btn active" id="v14TabReason">Reasoning</button><button class="v14-btn" id="v14TabCase">Case Workspace</button><button class="v14-btn" id="v14TabReg">Regimen Library</button><button class="v14-btn" id="v14TabEvidence">Evidence / Updates</button><button class="v14-btn" id="v14TabQA">QA</button>
 </div>
 <div id="v14PaneReason"></div><div id="v14PaneCase" class="v14-hidden"></div><div id="v14PaneReg" class="v14-hidden"></div><div id="v14PaneEvidence" class="v14-hidden"></div><div id="v14PaneQA" class="v14-hidden"></div>
 </div></div>`;
 const tabs=[['Reason','v14PaneReason'],['Case','v14PaneCase'],['Reg','v14PaneReg'],['Evidence','v14PaneEvidence'],['QA','v14PaneQA']];
 tabs.forEach(([key,p])=>{q14('v14Tab'+key).onclick=()=>{tabs.forEach(([k,pp])=>{q14('v14Pane'+k).classList.add('v14-hidden');q14('v14Tab'+k).classList.remove('active')});q14(p).classList.remove('v14-hidden');q14('v14Tab'+key).classList.add('active'); if(key==='Reason')renderReason(); if(key==='Case')renderCase(); if(key==='Reg')renderRegimens(); if(key==='Evidence')renderEvidence(); if(key==='QA')renderQA();};});
 renderReason();
}
function renderReason(){
 const p=q14('v14PaneReason');if(!p)return;
 const name=q14('oracleDisease')?.value||'';const v=window.oracleState||{};const m=diseaseMeta(name);
 const entered=Object.values(v).filter(x=>x!==''&&x!=null).length;
 const required=typeof window.oracleRequired==='function'?window.oracleRequired(name,v):[];
 const pct=required.length?Math.round((required.filter(k=>v[k]!==''&&v[k]!=null).length/required.length)*100):Math.min(100,entered*12);
 const branch=name?((typeof window.deriveBladder==='function'&&name==='Ca Bladder')?window.deriveBladder(v):name):'Select a disease';
 p.innerHTML=`<div class="v14-grid"><div class="v14-stat"><b>${esc14(branch)}</b><span>Current derived branch</span></div><div class="v14-stat"><b>${pct}%</b><span>Decision-input completeness</span></div><div class="v14-stat"><b>${m.missing.length}</b><span>Required inputs still missing</span></div></div>
 <div class="v14-section"><h4>Decision gate</h4><div class="v14-progress"><span style="width:${Math.max(0,Math.min(100,pct))}%"></span></div><div class="v14-mini mt-1">${pct===100?'All currently required fields are populated.':'Do not silently infer missing clinical facts.'}</div></div>
 <div class="v14-section"><h4>Recommended reasoning sequence</h4>${m.plan.length?'<ol class="v14-list">'+m.plan.map(x=>`<li>${esc14(x)}</li>`).join('')+'</ol>':'<div class="v14-note">Choose a clinical condition above. The workstation will then expose the disease-specific reasoning sequence.</div>'}</div>
 <div class="v14-section"><h4>What would change this pathway?</h4>${m.what.length?'<div>'+m.what.map(x=>`<span class="v14-pill">${esc14(x)}</span>`).join('')+'</div>':'<div class="v14-mini">No disease-specific branch is selected.</div>'}</div>
 ${m.missing.length?`<div class="v14-section"><h4>Still required</h4><div>${m.missing.map(x=>`<span class="v14-tag warn">${esc14(x)}</span>`).join('')}</div></div>`:''}
 ${m.warnings.length?`<div class="v14-section"><div class="v14-warn"><b>Warnings</b><ul class="v14-list">${m.warnings.map(x=>`<li>${esc14(x)}</li>`).join('')}</ul></div></div>`:''}
 <div class="v14-section"><h4>Clinical rule</h4><div class="v14-note">The existing Oracle treatment engine remains the primary output. V14 does not replace it; this layer exposes data completeness, branch sensitivity and evidence provenance around it.</div></div>`;
}
function renderCase(){
 const p=q14('v14PaneCase');if(!p)return;
 p.innerHTML=`<div class="v14-case-grid"><label>Case label<input id="v14CaseLabel" placeholder="e.g. MIBC — 68M"></label><label>Decision question<input id="v14CaseQuestion" placeholder="What needs to be decided today?"></label><label>Key clinical facts<textarea id="v14CaseFacts" placeholder="Symptoms, stage, pathology, imaging, prior treatment..."></textarea></label><label>Investigations / reports<textarea id="v14CaseInvestigations" placeholder="CT, MRI, pathology, labs, UDS, uroflow..."></textarea></label><label>Current diagnosis / stage<input id="v14CaseStage" placeholder="e.g. cT2N0M0 high-grade urothelial carcinoma"></label><label>Patient priorities<textarea id="v14CasePriorities" placeholder="Renal preservation, continence, ejaculation, fertility, treatment tolerance..."></textarea></label></div><div class="v14-toolbar mt-3"><button class="v14-btn active" id="v14CaseGenerate">Generate case brief</button><button class="v14-btn" id="v14CaseClear">Clear</button></div><div id="v14CaseOutput"></div>`;
 q14('v14CaseGenerate').onclick=()=>{
   const data=['v14CaseLabel','v14CaseQuestion','v14CaseFacts','v14CaseInvestigations','v14CaseStage','v14CasePriorities'].reduce((a,id)=>{a[id]=q14(id).value.trim();return a},{});
   const missing=['Case label','Decision question','Current diagnosis / stage'].filter((_,i)=>![data.v14CaseLabel,data.v14CaseQuestion,data.v14CaseStage][i]);
   q14('v14CaseOutput').innerHTML=`<div class="v14-section"><h4>MDT-ready case brief</h4><table class="v14-table"><tr><th>Field</th><th>Entered information</th></tr>${[['Case',data.v14CaseLabel],['Decision question',data.v14CaseQuestion],['Stage/diagnosis',data.v14CaseStage],['Clinical facts',data.v14CaseFacts],['Investigations',data.v14CaseInvestigations],['Priorities',data.v14CasePriorities]].map(([a,b])=>`<tr><td><b>${esc14(a)}</b></td><td>${esc14(b||'—')}</td></tr>`).join('')}</table></div>${missing.length?`<div class="v14-warn mt-3"><b>Before MDT use:</b> ${esc14(missing.join(', '))} should be completed.</div>`:'<div class="v14-note mt-3">This case brief is a structured presentation aid. It does not independently generate a treatment order.</div>'}`;
 };
 q14('v14CaseClear').onclick=()=>{['v14CaseLabel','v14CaseQuestion','v14CaseFacts','v14CaseInvestigations','v14CaseStage','v14CasePriorities'].forEach(id=>q14(id).value='');q14('v14CaseOutput').innerHTML='';};
}
function renderRegimens(){
 const p=q14('v14PaneReg');if(!p)return;
 const rows=REGIMENS14.map(r=>`<div class="v14-reg"><h5>${esc14(r.name)}</h5><p><b>Disease:</b> ${esc14(r.disease)}</p><p><b>Use:</b> ${esc14(r.use)}</p><p><b>Reference regimen:</b> ${esc14(r.dose)}</p><p><b>Safety gate:</b> ${esc14(r.gate)}</p><p>${sourceLinks(r.sources)}</p></div>`).join('');
 p.innerHTML=`<div class="v14-note"><b>Reference only:</b> regimen cards summarize guideline/trial/label information; final prescribing requires current jurisdictional label, organ function, interactions, institutional order set and MDT/oncology verification.</div>${rows}`;
}
function renderEvidence(){
 const p=q14('v14PaneEvidence');if(!p)return;
 p.innerHTML=`<div class="v14-note"><b>Content architecture:</b> Oracle content is intentionally modular. New guideline/trial/drug entries can be added to the evidence registry without replacing the treatment engine.</div><div class="v14-section"><h4>2026 content registry</h4><table class="v14-table"><tr><th>Module</th><th>Status</th><th>Coverage</th></tr>${contentStatus.map(x=>`<tr><td><b>${esc14(x[0])}</b></td><td><span class="v14-tag good">${esc14(x[1])}</span></td><td>${esc14(x[2])}</td></tr>`).join('')}</table></div><div class="v14-section"><h4>High-priority 2026 changes embedded</h4><ul class="v14-list"><li>MIBC now explicitly separates perioperative durvalumab + GC evidence from EV + pembrolizumab evidence and keeps jurisdiction/label caveats visible.</li><li>NMIBC now includes the 2026 durvalumab + BCG high-risk, BCG-naïve pathway and retains BCG-unresponsive branching as a separate decision state.</li><li>RCC evidence registry now includes the June 2026 FDA adjuvant belzutifan + pembrolizumab approval for selected RCC with a clear-cell component.</li><li>Primary urethral carcinoma is aligned to the 2025 TNM 9th-edition framework and the 2026 multimodal update.</li><li>Male LUTS, penile cancer, testis cancer, RCC and other core modules retain 2026-version registry points rather than pretending the content is timeless.</li><li>Fast-moving recommendations are presented as summaries with a source link instead of copied guideline text.</li></ul></div><div class="v14-section"><h4>Primary sources</h4><div>${Object.entries(SOURCES14).map(([k,u])=>`<div style="margin:3px 0"><a class="v14-source" target="_blank" rel="noopener noreferrer" href="${esc14(u)}">${esc14(k)} ↗</a></div>`).join('')}</div></div>`;
}
function runBasicQA(){
 const checks=[];
 const diseaseNames=typeof ORACLE_FIELDS==='object'?Object.keys(ORACLE_FIELDS):[];
 checks.push(['Oracle field registry present',diseaseNames.length>0,`${diseaseNames.length} conditions`]);
 checks.push(['Core Oracle selector present',!!q14('oracleDisease'),'#oracleDisease']);
 checks.push(['Treatment output present',!!q14('oracleOutput'),'#oracleOutput']);
 checks.push(['Risk panel present',!!q14('riskPanelContent'),'#riskPanelContent']);
 checks.push(['Online AI present',!!q14('onlineAiRoot'),'#onlineAiRoot']);
 checks.push(['Procedure atlas hook',typeof window.openProcedureAtlas==='function','openProcedureAtlas']);
 checks.push(['MDT hook',typeof window.showOracleMDT==='function','showOracleMDT']);
 checks.push(['V13 deep layer',!!window.V13DeepAnalysis,'window.V13DeepAnalysis']);
 checks.push(['V14 layer',V14.version==='14.0','V14.0']);
 return checks;
}
function renderQA(){
 const p=q14('v14PaneQA');if(!p)return;
 const checks=runBasicQA();const pass=checks.filter(x=>x[1]).length;const fail=checks.length-pass;
 p.innerHTML=`<div class="v14-grid"><div class="v14-stat"><b>${pass}/${checks.length}</b><span>Core structural checks passed</span></div><div class="v14-stat"><b>${fail}</b><span>Checks requiring attention</span></div><div class="v14-stat"><b>V14.0</b><span>Current workstation layer</span></div></div><div class="v14-section"><table class="v14-table"><tr><th>Check</th><th>Status</th><th>Detail</th></tr>${checks.map(([a,b,c])=>`<tr><td>${esc14(a)}</td><td><span class="v14-tag ${b?'good':'red'}">${b?'PASS':'CHECK'}</span></td><td>${esc14(c)}</td></tr>`).join('')}</table></div><div class="v14-section"><div class="v14-warn"><b>QA scope:</b> these are structural/runtime-presence checks only. They do not substitute for clinical peer review or a full browser regression pass across every disease branch.</div></div>`;
}


function sanitizeOnlineAI(){
  try{
    const mode=q14('aiMode');
    if(mode){mode.innerHTML='<option value="proxy">Server-side Gemini proxy</option>';mode.value='proxy';mode.disabled=true;}
    const model=q14('aiModel');
    if(model){model.innerHTML='<option value="server-configured">Gemini model configured on server</option>';model.value='server-configured';model.disabled=true;}
    const key=q14('aiKeyWrap'); if(key)key.style.display='none';
    const note=q14('aiStatus');
    if(note && !q14('v14AiPolicyNote')){
      const x=document.createElement('div');x.id='v14AiPolicyNote';x.className='v14-note';x.innerHTML='<b>Online AI:</b> server-side Gemini only. No API key is stored in this browser. Configure the model and key on the governed backend.';note.parentElement?.insertBefore(x,note);
    }
  }catch(e){}
}

function addHomeTile(){return;}
function attach(){
 addHomeTile();
 sanitizeOnlineAI();
 [200,700,1500,3000].forEach(ms=>setTimeout(sanitizeOnlineAI,ms));
 const oldOpen=window.openOracle;
 if(typeof oldOpen==='function'&&!oldOpen.__v14){
   function wrappedOpen(){oldOpen.apply(this,arguments);setTimeout(renderWorkstation,0)}
   wrappedOpen.__v14=true;window.openOracle=wrappedOpen;
 }
 const oldRun=window.runOracle;
 if(typeof oldRun==='function'&&!oldRun.__v14){
   function wrappedRun(){const out=oldRun.apply(this,arguments);setTimeout(renderReason,20);return out}
   wrappedRun.__v14=true;window.runOracle=wrappedRun;
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach);else attach();
window.URO_ORACLE_V14=V14;
window.V14Workstation={render:renderWorkstation,qa:runBasicQA,regimens:REGIMENS14,sources:SOURCES14};
})();
