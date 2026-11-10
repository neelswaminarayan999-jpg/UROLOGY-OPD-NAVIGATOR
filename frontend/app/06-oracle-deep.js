
/* ================================================================
   UROLOGY ORACLE V13.3 — DEEP CLINICAL REASONING / EVIDENCE LAYER
   Base: V12 corrected/expanded. Existing engines remain the source
   of truth for the primary treatment plan; this layer adds:
   - live decision-integrity checks
   - deeper branch analysis
   - 2026 evidence/trial updates
   - regimen reference cards where the entered branch supports them
   - explicit "why / what could change / do not miss" reasoning
   - jurisdiction/source labeling for fast-moving approvals
   ================================================================ */
(function(){
'use strict';

const V13 = {
  version:'13.3',
  updated:'27 Sep 2026',
  sources:{
    EAU_NMIBC:'https://uroweb.org/guidelines/non-muscle-invasive-bladder-cancer',
    EAU_MIBC:'https://uroweb.org/guidelines/muscle-invasive-and-metastatic-bladder-cancer',
    EAU_PROSTATE:'https://uroweb.org/guidelines/prostate-cancer',
    EAU_RCC:'https://uroweb.org/guidelines/renal-cell-carcinoma',
    EAU_UTUC:'https://uroweb.org/guidelines/upper-urinary-tract-urothelial-cell-carcinoma',
    EAU_PENILE:'https://uroweb.org/guidelines/penile-cancer',
    EAU_TESTIS:'https://uroweb.org/guidelines/testicular-cancer',
    EAU_STRICTURE:'https://uroweb.org/guidelines/urethral-strictures',
    EAU_STONES:'https://uroweb.org/guidelines/urolithiasis',
    EAU_MALE_LUTS:'https://uroweb.org/guidelines/management-of-non-neurogenic-male-luts',
    FDA_MIBC_EV_P:'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-pembrolizumab-or-pembrolizumab-and-berahyaluronidase-alfa-pmph-each-with-enfortumab-vedotin',
    KEYNOTE_B15:'https://uroonco.uroweb.org/publication/enfortumab-vedotin-and-pembrolizumab-in-cisplatin-eligible-bladder-cancer/',
    NIAGARA:'https://www.annalsofoncology.org/article/S0923-7534%2824%2903907-3/fulltext',
    Galsky:'https://pubmed.ncbi.nlm.nih.gov/21555688/'
  }
};

function v13q(id){return document.getElementById(id)}
function v13e(x){return typeof esc==='function'?esc(String(x??'')):String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function v13htmlLink(label,url){return `<a class="v13-source" target="_blank" rel="noopener noreferrer" href="${v13e(url)}">${v13e(label)} ↗</a>`}
function v13Chip(txt,kind='') {return `<span class="v13-chip ${kind}">${v13e(txt)}</span>`}
function v13Section(title,body,cls='') {return `<section class="v13-section ${cls}"><h4>${v13e(title)}</h4>${body}</section>`}
function v13Bullets(arr){return '<ul class="v13-list">'+arr.map(x=>`<li>${x}</li>`).join('')+'</ul>'}
function v13Cards(arr){return '<div class="v13-cards">'+arr.map(x=>`<div class="v13-card"><div class="v13-card-title">${v13e(x.title)}</div><div class="v13-card-body">${x.body||''}</div></div>`).join('')+'</div>'}

const STYLE=`
<style id="v13DeepStyle">
#v13DeepPanel{margin-top:14px;border:1px solid #cbd8e2;border-radius:16px;background:#f8fbfd;overflow:hidden}
#v13DeepPanel .v13-head{padding:14px 16px;background:linear-gradient(135deg,#08263a,#0d445a);color:#fff}
#v13DeepPanel .v13-head h3{margin:0;font-size:16px;font-weight:900}
#v13DeepPanel .v13-head p{margin:5px 0 0;color:#d8e8f0;font-size:11px;line-height:1.55}
.v13-meta{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}.v13-chip{display:inline-flex;align-items:center;padding:4px 8px;border-radius:999px;background:#e9f1f6;color:#18394d;font-size:10px;font-weight:800}.v13-chip.good{background:#e8f7ef;color:#17623c}.v13-chip.warn{background:#fff5dc;color:#7a5512}.v13-chip.red{background:#fee9ea;color:#8c2530}.v13-chip.blue{background:#e4f1ff;color:#175689}
.v13-body{padding:12px 14px}.v13-section{padding:10px 0;border-bottom:1px solid #dbe5ec}.v13-section:last-child{border-bottom:0}.v13-section h4{margin:0 0 7px;font-size:12px;font-weight:900;color:#153246}.v13-list{margin:0;padding-left:19px;font-size:11px;line-height:1.62;color:#294456}.v13-list li{margin:4px 0}.v13-kv{display:grid;grid-template-columns:170px 1fr;gap:5px 12px;font-size:11px;line-height:1.55}.v13-kv b{color:#4a6476}.v13-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.v13-card{border:1px solid #d4e0e8;background:#fff;border-radius:12px;padding:10px}.v13-card-title{font-size:11px;font-weight:900;color:#16394e}.v13-card-body{font-size:10.5px;color:#355468;line-height:1.55;margin-top:5px}.v13-note{border-left:4px solid #1b7896;background:#eef7fb;padding:9px 10px;border-radius:8px;font-size:10.5px;line-height:1.55;color:#28495a}.v13-alert{border-left:4px solid #c07a17;background:#fff8e8;padding:9px 10px;border-radius:8px;font-size:10.5px;line-height:1.55;color:#65470b}.v13-danger{border-left:4px solid #ae3b48;background:#fff0f1;padding:9px 10px;border-radius:8px;font-size:10.5px;line-height:1.55;color:#6e2530}.v13-source{font-size:10px;font-weight:800;color:#1a6481;text-decoration:none}.v13-source:hover{text-decoration:underline}.v13-table{width:100%;border-collapse:collapse;font-size:10px}.v13-table th,.v13-table td{padding:7px 8px;border:1px solid #d9e4eb;vertical-align:top;text-align:left}.v13-table th{background:#edf4f7;color:#17364a;font-weight:900}.v13-integrity{display:flex;gap:6px;flex-wrap:wrap}.v13-mini{font-size:10px;color:#627687;line-height:1.5}.v13-why{font-size:10.5px;color:#334f60;line-height:1.58}.v13-regimen{border:1px solid #bed5e2;background:#fff;border-radius:12px;padding:10px;margin-top:7px}.v13-regimen .rtitle{font-size:11px;font-weight:900;color:#103d54}.v13-regimen .rline{font-size:10px;line-height:1.55;margin-top:4px;color:#29495b}.v13-regimen .jur{font-size:9px;color:#6b7d89;margin-top:6px}
#v13RiskIntegrity{margin-top:10px}.v13-live{font-size:10.5px;line-height:1.55;color:#304d5f}.v13-live b{color:#163b50}
@media(max-width:850px){.v13-cards{grid-template-columns:1fr}.v13-kv{grid-template-columns:1fr}.v13-kv b{margin-top:5px}}
</style>`;

document.head.insertAdjacentHTML('beforeend',STYLE);

/* ------------------ INPUT / STAGE INTEGRITY ------------------ */
function integrity(name,v){
  const flags=[],good=[],unknown=[];
  const need=(key,label)=>{if(v[key]==null||v[key]==='')unknown.push(label||key)};
  if(name==='Ca Bladder'){
    const t=v.t||'', m=v.m||'';
    if(['T2','T3','T4a'].includes(t)&&m==='M1') flags.push('T2–T4a + M1: treat as metastatic; do not route through the curative perioperative MIBC-only branch.');
    if(t==='T4b'&&m==='M0') flags.push('T4b is locally advanced/unresectable phenotype; it should not inherit the routine T2–T4a perioperative pathway.');
    if(t==='T1'&&v.grade==='HG'&&v.muscle==='Absent') flags.push('High-grade T1 + absent detrusor muscle: final depth remains insecure; re-resection/restaging is a key gate.');
    if(['Ta','T1','Tis'].includes(t)){
      need('grade','grade');need('resect','adequacy/maximal TURBT');need('num','number');need('size','size');need('rec','recurrence context');need('variant','variant histology/LVI');
      if(v.bcg==='Yes') need('bcgtime','post-BCG timing/phenotype');
    }
    if(['T2','T3','T4a','T4b'].includes(t)){
      need('rct','radical cystectomy fitness'); need('immuno','immunotherapy suitability'); need('evfit','EV suitability');
      if(t!=='T4b') need('g_ecog','ECOG');
    }
    if(v.immuno==='No') flags.push('Immunotherapy marked unsuitable: immunotherapy-containing perioperative/systemic branches must be excluded.');
    if(v.evfit==='No') flags.push('EV marked unsuitable: do not present EV-containing regimens as ready-to-use options.');
    if(v.g_ecog==='>2') flags.push('Poor performance status substantially changes feasibility of curative-intent multimodality therapy; MDT/supportive goals must be explicit.');
    if(v.g_hearing==='Grade ≥2' || v.g_neuro==='Grade ≥2' || v.g_nyha==='NYHA III–IV') flags.push('A classic cisplatin-unfitness criterion is positive; retain the exact criterion rather than reducing it to age or a generic “frail” label.');
    if(v.resect==='Yes') good.push('TURBT adequacy entered');
    if(v.nodes==='cN+') good.push('Clinical nodal status entered');
    if(v.fgfr==='Susceptible alteration') good.push('FGFR3 actionable branch entered');
    if(['2+','3+'].includes(v.her2)) good.push('HER2 expression entered');
  }
  if(name==='Ca Prostate'){
    need('state','disease state');
    if(v.state==='Localized'){
      need('gg','Grade Group');need('psa','PSA');need('ct','cT');need('cn','cN');need('cm','cM');
      if(+v.psa>20||['4','5'].includes(v.gg)||['T3a','T3b','T4'].includes(v.ct)) good.push('High-risk variables captured');
      if(v.cn==='N1') flags.push('N1 disease: do not allow the localized organ-confined pathway to dominate the plan.');
    }
    if(v.state==='mHSPC'){need('volume','M1 volume');good.push('mHSPC volume phenotype drives intensification discussion');}
    if(v.state==='nmCRPC') need('psadt','PSA doubling time');
    if(v.state==='mCRPC'){need('priorARPI','prior ARPI');need('priorDoc','prior docetaxel');need('hrr','HRR status');}
  }
  if(name==='UTUC'){
    need('risk','risk class');need('location','location');need('t','T');need('grade','grade');need('met','M status');
    if(v.risk==='High-risk phenotype' && v.t==='') flags.push('High-risk label without formal local stage: keep surgical planning tied to imaging/staging.');
  }
  if(name==='Ca Kidney'){
    need('hist','histology');need('t','T');need('nodes','N');need('met','M');
    if(v.met==='M1') need('imdc','IMDC group');
    if(v.recur==='Yes') good.push('Adjuvant recurrence-risk field entered');
  }
  if(name==='Ca Testis'){
    need('hist','histology');need('stage','clinical stage');need('markers','post-orchiectomy markers');
    if(v.hist==='NSGCT'&&v.stage==='I') need('lvi','LVI');
    if(v.stage==='IIC/III') need('igcccg','IGCCCG group');
  }
  if(name==='Ca Penis'){
    need('primary','primary T');need('cngroin','groin status');
    if(['cN1','cN2','cN3'].includes(v.cngroin)) {need('fna','node cytology/FNA');need('bulky','bulky node');need('bilateral','bilateral/mobile');}
  }
  if(name==='Urethral Cancer'){need('site','site');need('hist','histology');need('t','T');need('nodes','nodes');need('met','M');need('resect','resectability');}
  if(name==='Urethral Stricture'){
    need('sex','sex');need('site','site');need('length','length');need('obliterative','lumen status');need('primary','prior treatment');need('recurrent','recurrence phenotype');
    if(v.recurrent && v.recurrent!=='None' && v.primary==='Prior DVIU/dilatation') flags.push('Recurrent after endoluminal treatment: repeated blind repetition should not become the default; reconstruction planning should be considered.');
    if(v.length==='>2 cm' && v.site==='Bulbar') good.push('Length suggests reconstruction-first planning rather than routine repeat incision.');
  }
  if(name==='BPH / Male LUTS'){
    need('bother','bother');need('complication','complication driver');need('size','prostate size');
    if(v.complication && v.complication!=='None') flags.push('A surgical complication/absolute indication is present; medical therapy should not be allowed to delay definitive obstruction management without a specific reason.');
  }
  if(name==='Stone Disease'){
    need('site','site');need('size','size');need('infection','infection/sepsis');
    if(v.infection==='Yes') flags.push('Obstructed infected system: drainage + antibiotics/source control precede definitive stone clearance.');
    if(v.staghorn==='Yes'||v.size==='>20 mm') good.push('PCNL-centred stone burden');
  }
  return {flags,good,unknown};
}

function renderIntegrity(name,v){
  const panel=v13q('v13RiskIntegrity'); if(!panel)return;
  const x=integrity(name,v);
  let html='';
  if(x.unknown.length) html+=`<div class="v13-alert"><b>Still needed for higher-confidence reasoning:</b> ${v13e(x.unknown.join(' • '))}</div>`;
  if(x.flags.length) html+=`<div class="v13-danger" style="margin-top:8px"><b>Safety / logic gates:</b>${v13Bullets(x.flags)}</div>`;
  if(x.good.length) html+=`<div class="v13-meta" style="margin-top:8px">${x.good.map(z=>v13Chip(z,'good')).join('')}</div>`;
  if(!html)html='<div class="v13-live">Enter more structured data and the Oracle will surface contradictions, missing gates and branch-sensitive variables here.</div>';
  panel.innerHTML=html;
}

/* ------------------ DEEP CLINICAL SYNTHESIS ------------------ */
function deepBladder(v){
  const stage=typeof deriveBladder==='function'?deriveBladder(v):'';
  const cards=[]; const bullets=[]; const doNot=[]; const source=[];
  if(stage==='NMIBC'){
    const high=(v.grade==='HG' && (v.t==='T1'||v.cis==='Yes'))||v.variant==='Yes';
    const low=(v.t==='Ta'&&v.grade==='LG'&&v.cis==='No'&&v.num==='Single'&&v.size==='<3 cm'&&v.rec==='Primary'&&v.variant==='No');
    cards.push({title:'Risk architecture',body:`${v13e(high?'High / very-high-risk signals are present.':'Risk group is not fully encoded by stage alone.')} Risk should integrate stage, grade, CIS, recurrence pattern, multiplicity/size and adverse pathology.`});
    cards.push({title:'Re-TURBT gate',body:v.t==='T1'?'Document detrusor muscle, completeness and pathology carefully; high-grade T1—especially with absent muscle or concern for residual disease—needs formal restaging before definitive risk assignment.':'Repeat resection is driven by stage, quality/completeness and pathology rather than by a universal rule for every Ta lesion.'});
    cards.push({title:'BCG logic',body:v.bcg==='Yes'?`The entered post-BCG phenotype is ${v.bcgtime||'not specified'}; do not call a recurrence “BCG-unresponsive” without documented adequate BCG exposure and the correct timing definition.`:'No adequate BCG exposure is entered; preserve the BCG-naïve risk pathway.'});
    if(low) doNot.push('Do not escalate a truly low-risk primary Ta LG lesion into prolonged BCG treatment simply because recurrence anxiety is high; re-stratify each recurrence.');
    if(v.bcgtime==='Within 12 months of adequate BCG'||v.bcgtime==='Later recurrence after adequate BCG') doNot.push('For BCG-unresponsive high-grade disease, radical cystectomy remains a key oncologic option; bladder-preserving alternatives depend on exact phenotype, jurisdiction and access.');
    source.push(['EAU NMIBC 2026',V13.sources.EAU_NMIBC]);
    source.push(['EAU NMIBC 2026 summary of changes',V13.sources.EAU_NMIBC]);
  } else if(stage==='MIBC'){
    const eligible=(v.g_crcl!=='' && v.g_crcl!=null && Number(v.g_crcl)>=60 && v.g_hearing!=='≥2'&&v.g_neuro!=='≥2'&&v.g_nyha!=='III–IV'&&v.g_ecog!=='≥3');
    cards.push({title:'Curative-intent gate',body:`MIBC branch: ${v.t} ${v.nodes||'node status not entered'} ${v.m||''}. Confirm CT/MRI staging, TURBT pathology, renal function, hearing, neuropathy, cardiac status, PS, cystectomy fitness and trimodality eligibility before locking sequence.`});
    cards.push({title:'Cisplatin assessment',body:v.g_crcl!=null&&v.g_crcl!==''?`Entered CrCl: ${v13e(v.g_crcl)} mL/min. The app keeps the classic Galsky domains separate so that renal, hearing, neuropathy, PS and heart-failure signals are visible.`:'CrCl is not entered. Do not infer cisplatin fitness from age alone.'});
    cards.push({title:'2026 perioperative evidence',body:'Two important 2026-era perioperative pathways are now visible in the evidence layer: durvalumab + gemcitabine/cisplatin (NIAGARA; EAU 2026) and EV + pembrolizumab (KEYNOTE-B15/EV-304; 2026 results/FDA update). Exact availability and label differ by jurisdiction.'});
    if(eligible&&v.immuno==='Yes'&&v.rct==='Yes') doNot.push('Do not show cisplatin-based chemotherapy as the only modern perioperative pathway; the current evidence layer should display both guideline/label-relevant chemo-immunotherapy options and explain the selection factors.');
    if(v.rct==='No') doNot.push('Do not present radical cystectomy as a ready-to-proceed step without reconciling surgical candidacy and alternative intent.');
    source.push(['EAU MIBC 2026',V13.sources.EAU_MIBC]);
    source.push(['KEYNOTE-B15/EV-304 (NEJM July 2026)',V13.sources.KEYNOTE_B15]);
    source.push(['FDA MIBC EV + pembrolizumab, 10 Jul 2026',V13.sources.FDA_MIBC_EV_P]);
    source.push(['NIAGARA',V13.sources.NIAGARA]);
    return {title:'Deep MIBC analysis',chips:[stage, eligible?'Galsky/renal screen appears compatible with cisplatin review':'Cisplatin fitness not established'],cards,bullets,doNot,source,regimens:v13MIBCDoseCards(v)};
  } else if(stage==='METASTATIC'){
    cards.push({title:'First-line branch',body:'Advanced/metastatic disease requires a prior-exposure map: platinum exposure, EV exposure, checkpoint inhibitor exposure and biomarker status. Do not recycle a first-line algorithm after progression.'});
    cards.push({title:'Biomarker gates',body:`FGFR3: ${v13e(v.fgfr||'not entered')} • HER2: ${v13e(v.her2||'not entered')}. The 2026 EAU MIBC update specifically added HER2 testing to identify patients for HER2-directed ADC therapy.`});
    cards.push({title:'Sequence logic',body:v.priorEV==='Yes'?`Prior EV is recorded. Later-line planning should be exposure-directed rather than automatically restarting EV.`:'No prior EV is recorded. Preserve the untreated advanced-disease pathway until the exposure history is complete.'});
    doNot.push('Do not use sacituzumab govitecan as though its former accelerated FDA indication remains active; the 2026 EAU update notes withdrawal of that indication.');
    source.push(['EAU MIBC 2026',V13.sources.EAU_MIBC]);
  }
  return {title:'Deep bladder analysis',chips:[stage||'stage incomplete'],cards,bullets,doNot,source,regimens:stage==='MIBC'?v13MIBCDoseCards(v):[]};
}
function v13MIBCDoseCards(v){
  const r=[];
  if(v.rct==='Yes'&&v.immuno==='Yes'){
    r.push({title:'Durvalumab + GC (NIAGARA / EAU 2026)',lines:['Durvalumab 1500 mg IV Day 1 + gemcitabine/cisplatin every 21 days for 4 neoadjuvant cycles, followed by radical cystectomy + PLND, then durvalumab 1500 mg IV every 4 weeks for up to 8 adjuvant cycles.','For NIAGARA, cisplatin-eligible patients with CrCl ≥40 mL/min were included; split-dose cisplatin was used in the lower renal-function cohort.'],jur:'Trial / EAU pathway; confirm local label and institutional order set.'});
    r.push({title:'EV + pembrolizumab (KEYNOTE-B15/EV-304)',lines:['Neoadjuvant: enfortumab vedotin 1.25 mg/kg IV Days 1 and 8 + pembrolizumab 200 mg IV Day 1 every 3 weeks ×4 cycles, followed by radical cystectomy + PLND.','Adjuvant in the trial: 5 additional EV cycles + 13 pembrolizumab cycles. FDA labeling in the US was expanded on 10 Jul 2026 to cystectomy candidates with MIBC, subject to the labeled criteria.'],jur:'US FDA / KEYNOTE-B15 evidence; jurisdiction-specific.'});
  }
  return r;
}

function deepProstate(v){
  const cards=[],doNot=[],source=[["EAU Prostate Cancer 2026",V13.sources.EAU_PROSTATE]],chips=[];
  if(v.state==='Localized'){
    const psa=Number(v.psa||0), gg=String(v.gg||'');
    const high=psa>20||['4','5'].includes(gg)||['T3a','T3b','T4'].includes(v.ct)||v.cn==='N1';
    chips.push(high?'High/very-high risk signals present':'Localized risk needs full synthesis');
    cards.push({title:'Risk synthesis',body:`PSA ${psa||'—'} ng/mL • GG ${gg||'—'} • ${v.ct||'cT—'} • ${v.cn||'cN—'} • ${v.cm||'cM—'}. Risk should be integrated rather than derived from one variable.`});
    cards.push({title:'Pathology modifiers',body:'Cribriform architecture, intraductal carcinoma, tertiary pattern 5, pattern-4 burden, EPE/SVI and nodal burden can alter the practical pathway even when a simple risk label looks reassuring.'});
    doNot.push('Do not treat PSA alone as the indication for surgery or radiation; life expectancy, stage, grade, MRI/biopsy extent and patient goals remain part of the branch.');
  } else if(v.state==='mHSPC'){
    chips.push(v.volume||'volume not entered');
    cards.push({title:'Systemic intensification',body:'For most fit men with mHSPC, ADT alone is no longer the complete decision tree. The modern pathway includes an AR-pathway inhibitor and/or docetaxel, with triplet approaches in selected fit/high-burden contexts; disease volume, de novo status, comorbidity and toxicity priorities matter.'});
    cards.push({title:'Local therapy question',body:'De novo low-volume metastatic disease can raise a separate prostate-directed local-treatment question; metastatic disease should therefore trigger a two-layer plan: systemic control + selected local/metastasis-directed strategies.'});
    cards.push({title:'Bone / CV / metabolic layer',body:'Record baseline bone health, fracture risk, cardiovascular/metabolic risk, testosterone suppression plan and symptom burden; add bone-protective therapy when indicated rather than treating the cancer pathway in isolation.'});
  } else if(v.state==='nmCRPC'){
    const psadt=Number(v.psadt||999); chips.push(`PSADT ${psadt<999?psadt:'not entered'} months`);
    cards.push({title:'High-risk nmCRPC gate',body:'Confirm castrate testosterone, rising PSA pattern, and absence of metastases on the chosen imaging strategy. Short PSA doubling time identifies the patients for whom an ARPI intensification pathway is most relevant.'});
    doNot.push('Do not call a patient nmCRPC without confirming castrate testosterone and the imaging context.');
  } else if(v.state==='mCRPC'){
    chips.push(v.priorARPI==='Yes'?'post-ARPI':'ARPI-naïve'); chips.push(v.priorDoc==='Yes'?'post-docetaxel':'docetaxel-naïve');
    cards.push({title:'Exposure map',body:`ARPI: ${v.priorARPI||'—'} • docetaxel: ${v.priorDoc||'—'} • HRR: ${v.hrr||'—'}. Treatment sequencing should follow what has already failed, not simply the disease name.`});
    cards.push({title:'Biomarker branch',body:'BRCA1/2 is the clearest HRR subgroup for PARP-directed treatment; other HRR alterations are not interchangeable with BRCA1/2 for every indication. Preserve the exact molecular report.'});
    cards.push({title:'PSMA/radioligand branch',body:'When disease is PSMA-positive and regulatory/clinical criteria are met, radioligand therapy becomes part of the treatment map. It should be integrated with prior ARPI/taxane exposure and marrow/renal considerations.'});
  } else {
    chips.push('state incomplete');
  }
  return {title:'Deep prostate analysis',chips,cards,bullets:[],doNot,source,regimens:[]};
}

function deepStricture(v){
  const cards=[],doNot=[],source=[["EAU Urethral Strictures 2026",V13.sources.EAU_STRICTURE]],chips=[];
  chips.push(v.site||'site —'); if(v.length)chips.push(`length ${v.length}`); if(v.recurrent)chips.push(v.recurrent);
  if(v.sex==='Male'&&v.site==='Bulbar'){
    const short=v.length==='≤2 cm';
    cards.push({title:'Index bulbar strategy',body:short?'A short, primary bulbar stricture may be considered for dilation/DVIU when the anatomy and clinical context are appropriate; this is not the same as a recurrent/long/obliterative stricture.':'Longer bulbar disease generally shifts the discussion toward urethroplasty rather than repeated incision.'});
    if(v.recurrent==='Recurrent'||v.primary==='Prior DVIU/dilatation') doNot.push('Do not automatically repeat DVIU/dilatation for recurrent disease without reassessing reconstruction candidacy.');
  } else if(v.sex==='Male'&&v.site==='Penile'){
    cards.push({title:'Penile stricture',body:'Penile urethral strictures are less suitable for repeated endoluminal treatment because recurrence and tissue-quality issues often demand reconstructive planning.'});
  } else if(v.sex==='Female'){
    cards.push({title:'Female stricture',body:'Female urethral stricture is a distinct reconstructive problem; confirm objective obstruction and anatomy before choosing dilation versus urethroplasty.'});
  }
  cards.push({title:'Aetiology + tissue quality',body:`Lichen sclerosus: ${v.ls||'not entered'} • obliteration: ${v.obliterative||'not entered'} • bladder-neck/sphincter context: ${v.bns||'not entered'}. Tissue quality and prior interventions matter as much as measured length.`});
  return {title:'Deep stricture analysis',chips,cards,bullets:[],doNot,source,regimens:[]};
}

function deepStone(v){
  const cards=[],doNot=[],source=[["EAU Urolithiasis 2026",V13.sources.EAU_STONES]],chips=[];
  chips.push(v.site||'site —'); if(v.size)chips.push(v.size);
  if(v.infection==='Yes'){
    cards.push({title:'Emergency source-control pathway',body:'Obstructed infected system → cultures as appropriate, broad-spectrum antibiotics adjusted to microbiology, urgent decompression by ureteral stent or nephrostomy, physiologic stabilization, then delayed definitive stone clearance.'});
    doNot.push('Do not perform definitive lithotripsy as the initial source-control procedure in septic obstruction.');
  } else if(v.staghorn==='Yes'||v.size==='>20 mm'){
    cards.push({title:'Large/complex stone strategy',body:'PCNL is the principal stone-clearing route for >20 mm renal burden and complex/staghorn stones; staged or combined procedures are chosen according to anatomy and residual burden.'});
    cards.push({title:'Infection layer',body:'Pre-operative urine culture, antimicrobial planning and selective stone/renal pelvic culture improve the safety framework; residual fragments should be assessed deliberately rather than assumed clinically insignificant.'});
  } else {
    cards.push({title:'Size + location first',body:'For non-infected ureteric/renal stones, the decision is built from location, size, obstruction, renal function, anatomy, prior procedures and patient preference rather than a single operation rule.'});
  }
  return {title:'Deep stone analysis',chips,cards,bullets:[],doNot,source,regimens:[]};
}

function deepGeneric(name,v){
  const cards=[],doNot=[],source=[];
  if(name==='Ca Kidney'){
    source.push(['EAU RCC 2026',V13.sources.EAU_RCC]);
    cards.push({title:'RCC architecture',body:`Histology ${v13e(v.hist||'—')} • ${v13e(v.t||'T—')} • nodes ${v13e(v.nodes||'—')} • metastasis ${v13e(v.met||'—')}. Histology and stage determine whether the kidney-sparing, radical local, adjuvant or systemic pathway is relevant.`});
    if(v.met==='M1') cards.push({title:'Systemic risk',body:`IMDC group entered: ${v13e(v.imdc||'not entered')}. Modern metastatic RCC selection depends on histology, IMDC risk, symptoms, burden, organ function and prior immune/VEGF exposure.`});
    if(v.recur==='Yes') cards.push({title:'Adjuvant checkpoint gate',body:'Use the exact pathologic recurrence-risk criteria rather than a generic “high risk” label; document stage, grade, nodal status and resection status before applying the adjuvant evidence branch.'});
  } else if(name==='UTUC'){
    source.push(['EAU UTUC 2026',V13.sources.EAU_UTUC]);
    cards.push({title:'Risk classification',body:`Entered risk: ${v13e(v.risk||'—')}. The kidney-sparing vs radical nephroureterectomy decision should be driven by risk, renal function, tumour location, multifocality, hydronephrosis, grade/cytology and the technical feasibility of complete treatment/surveillance.`});
    if(v.risk==='High-risk phenotype') doNot.push('Do not call a high-risk upper-tract tumour “RIRS-suitable” simply because it is technically accessible; oncologic control and subsequent salvage options must be explicit.');
  } else if(name==='Ca Testis'){
    source.push(['EAU Testicular Cancer 2026',V13.sources.EAU_TESTIS]);
    cards.push({title:'Marker/stage integrity',body:`Histology ${v13e(v.hist||'—')} • stage ${v13e(v.stage||'—')} • post-orchiectomy markers ${v13e(v.markers||'—')}. Marker kinetics after orchiectomy are a treatment decision variable, not merely a follow-up value.`});
    cards.push({title:'IGCCCG',body:`Entered risk group: ${v13e(v.igcccg||'not entered')}. For metastatic disease, preserve the exact serum marker values and timing relative to orchiectomy/chemotherapy so the risk class can be reproduced.`});
    if(v.residual && v.residual!=='None') cards.push({title:'Post-chemotherapy residual mass',body:'Residual-mass management is histology- and size-dependent; do not collapse seminoma and NSGCT residual disease into one rule.'});
  } else if(name==='Ca Penis'){
    source.push(['EAU Penile Cancer 2026',V13.sources.EAU_PENILE]);
    cards.push({title:'Primary + groin are separate decisions',body:`Primary T ${v13e(v.primary||'—')} • groin ${v13e(v.cngroin||'—')} • bulky ${v13e(v.bulky||'—')}. Penile cancer management becomes substantially stage-sensitive once occult or clinical nodal disease enters the pathway.`});
    if(['cN1','cN2','cN3'].includes(v.cngroin)) cards.push({title:'Nodal escalation',body:'Confirm metastatic involvement of the groin nodes and define mobility/bulk/bilateral disease before selecting ILND/PLND or systemic chemotherapy pathways.'});
    if(v.ene==='Yes') doNot.push('Extranodal extension is a major pathological risk modifier and should trigger the full postoperative nodal pathway rather than a simple surveillance-only branch.');
  } else if(name==='Urethral Cancer'){
    source.push(['EAU Primary Urethral Cancer 2026','https://uroweb.org/guidelines/primary-urethral-carcinoma']);
    cards.push({title:'Anatomic-site dependency',body:`Site ${v13e(v.site||'—')} • histology ${v13e(v.hist||'—')} • T ${v13e(v.t||'—')} • nodes ${v13e(v.nodes||'—')} • M ${v13e(v.met||'—')}. The operative field and nodal drainage differ substantially by sex and urethral segment.`});
    cards.push({title:'Multimodal planning',body:'Advanced urethral carcinoma can require combinations of surgery, chemotherapy and radiotherapy selected by anatomy, stage, histology and resectability.'});
  } else if(name==='BPH / Male LUTS'){
    source.push(['EAU Male LUTS 2026',V13.sources.EAU_MALE_LUTS]);
    cards.push({title:'Phenotype first',body:`Bother: ${v13e(v.bother||'—')} • size ${v13e(v.size||'—')} • storage phenotype ${v13e(v.storage||'—')} • ejaculation priority ${v13e(v.ed||'—')}. Volume informs therapy selection but does not itself diagnose obstruction.`});
    if(v.complication && v.complication!=='None') doNot.push('A recurrent/absolute surgical complication should not be left in a medication-only loop without a documented reason.');
  } else if(name==='Adrenal / Neuroendocrine'){
    cards.push({title:'Safety sequence',body:`Context ${v13e(v.lesion||'—')} • pheochromocytoma excluded ${v13e(v.pheo||'—')} • hormonal work-up ${v13e(v.hormone||'—')} • imaging phenotype ${v13e(v.imaging||'—')}. Functional adrenal disease and suspected PPGL require biochemical control before biopsy or major intervention.`});
    doNot.push('Do not perform adrenal biopsy before pheochromocytoma has been excluded when biopsy is otherwise being considered.');
  }
  return {title:`Deep ${name} analysis`,chips:[v13e(name)],cards,bullets:[],doNot,source,regimens:[]};
}

function deepAnalysis(name,v){
  if(name==='Ca Bladder')return deepBladder(v);
  if(name==='Ca Prostate')return deepProstate(v);
  if(name==='Urethral Stricture')return deepStricture(v);
  if(name==='Stone Disease')return deepStone(v);
  return deepGeneric(name,v);
}

function renderDeep(name,v){
  const out=v13q('oracleOutput'); if(!out)return;
  v13q('v13DeepPanel')?.remove();
  const d=deepAnalysis(name,v);
  const x=integrity(name,v);
  let body='';
  body += `<div class="v13-integrity">${(d.chips||[]).map(z=>v13Chip(z,'blue')).join('')}${x.flags.length? v13Chip('Logic gate requires attention','red'):''}${x.unknown.length? v13Chip('Data incomplete','warn'):v13Chip('Structured inputs adequate for current branch','good')}</div>`;
  body += (d.cards&&d.cards.length)?v13Section('Clinical reasoning',v13Cards(d.cards)):'';
  if(d.regimens&&d.regimens.length){
    body += v13Section('Reference regimens / 2026 evidence layer',d.regimens.map(r=>`<div class="v13-regimen"><div class="rtitle">${v13e(r.title)}</div>${r.lines.map(z=>`<div class="rline">${v13e(z)}</div>`).join('')}<div class="jur">${v13e(r.jur)}</div></div>`).join(''));
  }
  if(d.bullets&&d.bullets.length)body+=v13Section('Additional branch notes',v13Bullets(d.bullets));
  if(d.doNot&&d.doNot.length)body+=v13Section('Do not miss / avoid',`<div class="v13-danger">${v13Bullets(d.doNot)}</div>`);
  if(d.source&&d.source.length)body+=v13Section('Evidence / source links',`<div style="display:flex;gap:8px;flex-wrap:wrap">${d.source.map(a=>v13htmlLink(a[0],a[1])).join('')}</div><div class="v13-mini" style="margin-top:7px">This layer deliberately paraphrases current guideline/trial information rather than reproducing guideline text. Drug doses are reference regimens and must be reconciled with current local labels and institutional protocols.</div>`);
  out.insertAdjacentHTML('beforeend',`<div id="v13DeepPanel"><div class="v13-head"><h3>${v13e(d.title)}</h3><p>V13.3 evidence-and-reasoning layer • updated 27 Sep 2026 • supplements the primary treatment engine; it does not silently overwrite a missing or contradictory clinical input.</p></div><div class="v13-body">${body}</div></div>`);
}

/* ------------------ WRAP EXISTING LIVE PANELS ------------------ */
const OLD_RISK=window.renderOracleRisk;
if(typeof OLD_RISK==='function'){
  window.renderOracleRisk=function(name,v){
    try{OLD_RISK(name,v)}catch(e){}
    let p=v13q('v13RiskIntegrity');
    const host=v13q('riskPanelContent');
    if(!host)return;
    if(!p){p=document.createElement('div');p.id='v13RiskIntegrity';host.appendChild(p)}
    renderIntegrity(name,v||{});
  };
}

const OLD_RUN=window.runOracle;
if(typeof OLD_RUN==='function'){
  window.runOracle=function(name){
    const v={...(window.oracleState||{})};
    OLD_RUN(name);
    try{
      const missing=typeof oracleIncomplete==='function'?oracleIncomplete(name,v):[];
      if(!missing.length)setTimeout(()=>renderDeep(name,v),0);
    }catch(e){}
  };
}

/* ------------------ HOME / ORACLE VERSION MARKER ------------------ */
function v13Banner(){return;}

function sanity13(){
  try{
    window.URO_ORACLE_V13={version:V13.version,updated:V13.updated,base:'V12-CORRECTED-EXPANDED',deepClinicalLayer:true,onlineAI:true,offlineAI:false};
    v13Banner();
  }catch(e){}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sanity13);else sanity13();
window.V13DeepAnalysis={version:V13.version,integrity,deepAnalysis,renderDeep};
})();
