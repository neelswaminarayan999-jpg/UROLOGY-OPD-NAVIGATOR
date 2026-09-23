/* Urology Oracle V13.9 — expanded protocol/content + visual atlas.
   This is additive: it does not replace the existing V12/V13 corpus or Oracle rules.
   Content is a structured paraphrase of current guideline pathways; verify live guidance,
   drug labels and local protocols before patient care.
*/
(function(){
'use strict';
const PACK_VERSION='13.9.0';
const SOURCES={
  EAU_UROL:'https://uroweb.org/guidelines/urolithiasis',
  EAU_US:'https://uroweb.org/guidelines/urethral-strictures',
  EAU_RCC:'https://uroweb.org/guidelines/renal-cell-carcinoma',
  EAU_NMIBC:'https://uroweb.org/guidelines/non-muscle-invasive-bladder-cancer',
  EAU_MIBC:'https://uroweb.org/guidelines/muscle-invasive-and-metastatic-bladder-cancer',
  EAU_UTUC:'https://uroweb.org/guidelines/upper-urinary-tract-urothelial-cell-carcinoma',
  EAU_PC:'https://uroweb.org/guidelines/prostate-cancer',
  EAU_TESTIS:'https://uroweb.org/guidelines/testicular-cancer',
  EAU_PENIS:'https://uroweb.org/guidelines/penile-cancer',
  EAU_MALE_LUTS:'https://uroweb.org/guidelines/management-of-non-neurogenic-male-luts',
  EAU_URETHRAL_CA:'https://uroweb.org/guidelines/primary-urethral-carcinoma'
};
const ADD={
'Ca Prostate':[
 {title:'V13.9 — treatment protocol checkpoints',items:[
  ['Before definitive treatment','Confirm PSA trend, biopsy histology/ISUP GG, clinical T/N/M, life expectancy, urinary/sexual baseline and patient priorities. Use MRI/PSMA PET or other staging only when it changes management.'],
  ['Active surveillance protocol','Confirm eligibility using current risk criteria; establish PSA/DRE/MRI/biopsy surveillance schedule according to the chosen guideline protocol; progression should be defined by pathology/risk reassessment rather than PSA rise alone.'],
  ['Localized surgery protocol','Confirm oncologic suitability → choose open/robotic RP → document nerve-sparing decision → apex/bladder-neck/seminal-vesicle dissection → appropriate pelvic nodal staging when indicated → specimen orientation and pathology checklist → PSA surveillance.'],
  ['Radiotherapy protocol','Risk-stratify first → select EBRT/brachytherapy approach → add ADT only when indicated by risk/staging → document dose/fractionation from the treating RT protocol → monitor GU/GI toxicity and PSA response.'],
  ['Advanced disease protocol','Confirm castration status and disease state → molecular testing when indicated → choose ARPI/chemotherapy/PSMA-directed or PARP strategy according to prior exposure, biomarkers and regulatory eligibility → reassess response/toxicity at defined intervals.']
 ]}
],
'Ca Bladder':[
 {title:'V13.9 — treatment protocol checkpoints',items:[
  ['NMIBC first-line sequence','Adequate TURBT with muscle in specimen when relevant → pathology risk classification → immediate intravesical chemotherapy when appropriate and safe → repeat TURBT for defined high-risk/incomplete/T1 situations → intravesical BCG or early radical cystectomy according to risk/BCG status.'],
  ['BCG-unresponsive gate','Do not label a recurrence “BCG-unresponsive” from the word recurrence alone. Verify adequate BCG exposure, timing, pathology, CIS/high-grade phenotype and whether the patient actually meets the current definition before selecting bladder-sparing salvage versus radical cystectomy.'],
  ['MIBC curative pathway','Complete staging → MDT review → assess cisplatin fitness using explicit criteria rather than a single creatinine → choose an evidence-based perioperative systemic strategy and/or neoadjuvant pathway → radical cystectomy + bilateral pelvic lymph-node dissection when indicated, or guideline-supported bladder-preserving trimodality therapy in selected patients.'],
  ['Cisplatin fitness data entry','Record CrCl/eGFR, performance status, hearing loss, neuropathy and heart failure explicitly; the classic Galsky framework uses CrCl <60 mL/min, ECOG PS ≥2, grade ≥2 hearing loss, grade ≥2 neuropathy or NYHA III/IV heart failure as unfitness criteria.'],
  ['Metastatic disease protocol','Confirm histology and metastatic sites → record prior platinum/ICI/EV exposure and actionable biomarkers → select current first-line or subsequent-line systemic therapy according to current guideline/label → reassess response and toxicity → consider local treatment only in selected MDT scenarios.']
 ]}
],
'UTUC':[
 {title:'V13.9 — treatment protocol checkpoints',items:[
  ['Risk assignment','Integrate grade, cytology, local invasion, hydronephrosis, tumour size, multifocality and imaging rather than relying on a single feature. Document low-risk versus high-risk phenotype explicitly.'],
  ['Low-risk kidney-sparing protocol','Complete endoscopic assessment → complete endoscopic ablation where feasible → second-look ureteroscopy/biopsy according to the current protocol → intensive ureteroscopic/cytologic/imaging surveillance.'],
  ['High-risk localized protocol','MDT staging → radical nephroureterectomy with bladder cuff for surgically appropriate high-risk disease → regional lymph-node dissection according to location/template → consider perioperative systemic therapy based on renal function, stage and current evidence.'],
  ['Distal ureter option','Selected distal ureter tumours may be treated with distal ureterectomy and ureteric reimplantation when oncologically appropriate; selection depends on location, grade, invasion and ability to obtain adequate margins.'],
  ['Adjuvant checkpoint','For patients receiving RNU, decide perioperative systemic therapy before surgery when possible because postoperative renal function may limit platinum eligibility.']
 ]}
],
'Ca Kidney':[
 {title:'V13.9 — treatment protocol checkpoints',items:[
  ['Localized T1 protocol','Assess renal function, tumour anatomy/nephrometry, solitary kidney/hereditary risk and surgical feasibility → partial nephrectomy when oncologically and technically appropriate → radical nephrectomy when nephron-sparing is not reasonable.'],
  ['Active surveillance / ablation','For selected small renal masses, especially patients with competing risks, consider active surveillance or thermal ablation after documenting tumour size, growth pattern, renal function and patient preference.'],
  ['Radical nephrectomy safety gate','Do not infer radical nephrectomy solely from tumour size. Review venous involvement, adjacent-organ invasion, contralateral kidney, baseline renal function and whether partial nephrectomy remains feasible.'],
  ['Metastatic ccRCC','Document IMDC risk, histology, prior therapy and contraindications → select an IO-containing or other guideline-supported systemic regimen → reassess response/toxicity → use deferred/selective cytoreductive nephrectomy only in appropriate MDT-selected patients.'],
  ['Adjuvant pathway','After complete resection of eligible high-risk clear-cell RCC, verify the exact current adjuvant-risk criteria and timing before offering pembrolizumab; do not treat all pT1 disease as an adjuvant candidate.']
 ]}
],
'Ca Testis':[
 {title:'V13.9 — treatment protocol checkpoints',items:[
  ['Initial sequence','Scrotal US + serum AFP/β-hCG/LDH → inguinal radical orchiectomy without trans-scrotal violation → prosthesis discussion when appropriate → stage with cross-sectional imaging and post-orchiectomy markers.'],
  ['Stage I seminoma','Risk-stratify and discuss surveillance as the preferred default for many patients; adjuvant carboplatin or radiotherapy is reserved for selected circumstances and local protocols, with overtreatment avoided.'],
  ['Stage I NSGCT','Use pathology risk, especially LVI, and patient preference to choose surveillance, adjuvant BEP or selected RPLND pathways according to current guideline criteria and expertise.'],
  ['Metastatic GCT','Classify by IGCCCG → cisplatin-based chemotherapy according to risk → reassess markers and residual masses → manage post-chemotherapy residual disease according to histology and size, with RPLND in appropriate NSGCT scenarios.'],
  ['Marker safety','AFP should not be normalised away in a non-seminomatous tumour; persistent/rising markers after orchiectomy change stage and treatment planning.']
 ]}
],
'Ca Penis':[
 {title:'V13.9 — treatment protocol checkpoints',items:[
  ['Primary lesion','Biopsy/adequate histology → document exact site, T category, grade, LVI and corporal/urethral involvement → select organ-preserving excision/laser/radiation versus partial/total penectomy according to stage and margins.'],
  ['cN0 gate','Do not equate a clinically negative groin with zero metastatic risk. Use tumour stage/grade/LVI and current risk criteria to decide surveillance versus invasive nodal staging.'],
  ['cN+ pathway','Confirm nodal disease with appropriate imaging/FNA when indicated → perform therapeutic inguinal/pelvic nodal management in appropriate patients → use neoadjuvant/adjuvant chemotherapy selectively for bulky/high-volume disease according to current guideline criteria.'],
  ['Follow-up','Inspect primary site and groins, assess recurrence and functional outcome, and intensify surveillance according to nodal risk and treatment.']
 ]}
],
'Urethral Cancer':[
 {title:'V13.9 — treatment protocol checkpoints',items:[
  ['Diagnostic protocol','Document site + histology + depth/T category + nodal basin → urethroscopy/biopsy → MRI pelvis and systemic staging when clinically indicated → MDT review.'],
  ['Anterior localized disease','Select urethra-preserving excision/urethrectomy or combined surgery according to tumour extent and margin requirements; nodal staging depends on site, stage and histology.'],
  ['Posterior/prostatic disease','Expect different local anatomy and pelvic drainage; treatment commonly requires multimodal planning rather than a generic urethrectomy algorithm.'],
  ['Advanced disease','Use histology-directed systemic therapy and/or chemoradiation. Urothelial, SCC and adenocarcinoma pathways should not be conflated.']
 ]}
],
'Adrenal / Neuroendocrine':[
 {title:'V13.9 — treatment protocol checkpoints',items:[
  ['Incidentaloma protocol','Characterise imaging phenotype + hormonal activity + symptoms → exclude clinically important pheochromocytoma before invasive procedures → determine whether surveillance, endocrine treatment or adrenalectomy is indicated.'],
  ['Pheochromocytoma protocol','Biochemical confirmation → genetic assessment when indicated → alpha blockade + volume optimisation → perioperative anaesthetic planning → adrenalectomy when indicated. Do not biopsy before pheochromocytoma is excluded.'],
  ['Suspected ACC','Expert adrenal MDT → staging and hormonal assessment → plan oncologic en-bloc resection when resectable, avoiding tumour violation → consider mitotane and/or systemic therapy for advanced/high-risk disease according to specialist protocol.'],
  ['Neuroendocrine differential','Do not label an adrenal lesion “neuroendocrine” from imaging alone; distinguish pheochromocytoma/PPGL, cortical lesions, metastasis and other entities using biochemical and pathological evidence.']
 ]}
],
'Urethral Stricture':[
 {title:'V13.9 — explicit phenotype-based treatment protocol',items:[
  ['Diagnostic sequence','Symptoms/uroflow/PVR → urine testing → RUG ± VCUG → cystoscopy when needed → document exact location, length, lumen calibre/obliteration, spongiofibrosis, LS, prior procedures and urethral rest.'],
  ['Short primary bulbar','A single short (<2 cm), non-obliterative primary bulbar stricture is the principal phenotype where DVIU/dilatation may be offered. Counsel recurrence risk and avoid serial endoluminal treatment when recurrence becomes clinically important.'],
  ['Long or recurrent anterior','For long (>2 cm), recurrent or complex anterior strictures, plan urethroplasty rather than repeated DVIU/dilatation. Select EPA versus graft reconstruction according to length, location, spongiofibrosis and tissue quality.'],
  ['Penile / LS','Do not use routine DVIU as definitive treatment for penile strictures. Assess LS and tissue quality; selected disease may require single-stage graft reconstruction, while complex penile disease may require staged reconstruction.'],
  ['Posterior / VUAS / BMS','Use an anatomy-specific endoluminal pathway for suitable non-obliterative VUAS/BMS/radiation stenosis; counsel about recurrent stenosis and urinary incontinence. Complete obliteration needs reconstructive planning.']
 ]}
],
'BPH / Male LUTS':[
 {title:'V13.9 — treatment protocol checkpoints',items:[
  ['Initial assessment','History + symptom score/bother + medication review → DRE when appropriate → urinalysis → PVR/uroflow when useful → PSA when it changes management → assess complications and alternative diagnoses.'],
  ['Medical therapy','Use alpha-blocker for rapid symptom relief when appropriate; add 5-alpha-reductase inhibitor for men with prostatic enlargement/appropriate progression risk; consider combination therapy when both symptom and progression benefits are needed.'],
  ['Storage symptoms','Treat obstruction and storage symptoms as related but distinct problems; reassess residual urine and infection/other causes before escalating antimuscarinic or beta-3 therapy.'],
  ['Surgical indications','Refractory/recurrent retention, recurrent UTI, bladder stones, recurrent haematuria attributable to BPO, upper-tract dilatation/renal impairment or persistent bothersome symptoms despite appropriate medical therapy support procedural treatment.'],
  ['Procedure selection','Choose TURP, HoLEP/enucleation, simple prostatectomy or other minimally invasive options according to prostate size, anatomy, expertise, anticoagulation and ejaculation priorities; do not use a single size threshold as the only determinant.']
 ]}
],
'Stone Disease':[
 {title:'V13.9 — explicit treatment protocol',items:[
  ['Septic obstructed system — emergency','Recognise obstruction + infection/sepsis → cultures and immediate antibiotics → urgent decompression with ureteric stent or nephrostomy → delay definitive stone clearance until sepsis has resolved and the patient is stabilised.'],
  ['Ureteric stone','Assess size, location, obstruction, infection, renal function and symptoms → observation/medical therapy only in an appropriate uncomplicated phenotype → URS or SWL when intervention is indicated; use current EAU selection criteria rather than size alone.'],
  ['Renal stone','Map stone burden/location/anatomy → SWL, RIRS or PCNL according to burden and anatomy. PCNL is generally the preferred first-line approach for large renal stone burdens >2 cm and complex/staghorn stones.'],
  ['Staghorn / complex stone','Plan CT-based anatomy and infection control → choose PCNL-based clearance strategy, including staged or multi-tract approaches when necessary → aim for complete clearance while minimising tract morbidity → confirm residual fragments with appropriate imaging.'],
  ['Prevention','Analyse the stone → serum/metabolic evaluation where indicated → 24-hour urine in recurrent/high-risk stone formers → increase fluid intake and target guideline-appropriate urine volume → correct specific metabolic abnormalities and address dietary drivers.'],
  ['Bladder stone','Investigate and treat the underlying cause (BPO, stricture, neurogenic bladder, foreign body, augmentation, infection) as well as the stone; transurethral cystolithotripsy is generally preferred when feasible, with percutaneous/open alternatives in selected cases.']
 ]}
]};

function appendPack(){
  if(!window.DISEASES || window.__V139_CONTENT_PACK__) return;
  Object.entries(ADD).forEach(([d,secs])=>{ if(window.DISEASES[d]) window.DISEASES[d].sections.push(...secs); });
  window.__V139_CONTENT_PACK__=true;
  window.UROLOGY_ORACLE_V139_CONTENT={version:PACK_VERSION,sources:SOURCES,protocols:ADD};
}
function svgShell(title,body){return `<div class="card p-3 mb-4 no-print" style="overflow:auto"><div class="text-xs font-black mb-2">${title}</div><svg viewBox="0 0 900 230" role="img" aria-label="${title}" style="width:100%;min-width:620px;height:auto;border-radius:12px;background:#f8fafc">${body}</svg></div>`;}
function visuals(name){
  if(name==='Stone Disease') return svgShell('Stone emergency → definitive treatment pathway',`<g font-family="system-ui" font-size="16" text-anchor="middle"><rect x="20" y="75" width="170" height="70" rx="14" fill="#fff" stroke="#0f172a"/><text x="105" y="103">Obstruction?</text><text x="105" y="126">+ infection/sepsis</text><path d="M190 110h90" stroke="#0f172a" stroke-width="3" marker-end="url(#a)"/><rect x="280" y="55" width="170" height="110" rx="14" fill="#fff" stroke="#991b1b"/><text x="365" y="87">YES → emergency</text><text x="365" y="112">Antibiotics +</text><text x="365" y="135">stent / nephrostomy</text><path d="M450 110h90" stroke="#0f172a" stroke-width="3" marker-end="url(#a)"/><rect x="540" y="75" width="160" height="70" rx="14" fill="#fff" stroke="#0f172a"/><text x="620" y="103">Stabilise</text><text x="620" y="126">then clear stone</text><path d="M700 110h70" stroke="#0f172a" stroke-width="3" marker-end="url(#a)"/><rect x="770" y="65" width="110" height="90" rx="14" fill="#fff" stroke="#0369a1"/><text x="825" y="94">URS /</text><text x="825" y="116">SWL / PCNL</text><defs><marker id="a" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#0f172a"/></marker></defs></g>`);
  if(name==='Urethral Stricture') return svgShell('Urethral stricture phenotype map',`<g font-family="system-ui" font-size="15" text-anchor="middle"><rect x="20" y="75" width="145" height="75" rx="14" fill="#fff" stroke="#0f172a"/><text x="92" y="104">Location + length</text><text x="92" y="128">+ recurrence</text><path d="M165 112h75" stroke="#0f172a" stroke-width="3" marker-end="url(#b)"/><rect x="240" y="25" width="185" height="70" rx="14" fill="#fff" stroke="#15803d"/><text x="332" y="53">Primary short bulbar</text><text x="332" y="75">non-obliterative</text><path d="M425 60h75" stroke="#0f172a" stroke-width="3" marker-end="url(#b)"/><rect x="500" y="25" width="165" height="70" rx="14" fill="#fff" stroke="#15803d"/><text x="582" y="53">DVIU / dilatation</text><text x="582" y="75">selected phenotype</text><rect x="240" y="140" width="185" height="70" rx="14" fill="#fff" stroke="#991b1b"/><text x="332" y="168">Penile / long / recurrent</text><text x="332" y="190">complex disease</text><path d="M425 175h75" stroke="#0f172a" stroke-width="3" marker-end="url(#b)"/><rect x="500" y="140" width="165" height="70" rx="14" fill="#fff" stroke="#991b1b"/><text x="582" y="168">Urethroplasty</text><text x="582" y="190">EPA / graft / staged</text><defs><marker id="b" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#0f172a"/></marker></defs></g>`);
  if(name==='Ca Bladder') return svgShell('Bladder cancer decision layers',`<g font-family="system-ui" font-size="15" text-anchor="middle"><rect x="20" y="80" width="150" height="65" rx="14" fill="#fff" stroke="#0f172a"/><text x="95" y="108">TURBT + pathology</text><text x="95" y="130">T / grade / CIS / LVI</text><path d="M170 112h75" stroke="#0f172a" stroke-width="3" marker-end="url(#c)"/><rect x="245" y="30" width="180" height="70" rx="14" fill="#fff" stroke="#0369a1"/><text x="335" y="58">NMIBC</text><text x="335" y="81">risk + BCG status</text><path d="M425 65h65" stroke="#0f172a" stroke-width="3" marker-end="url(#c)"/><rect x="490" y="30" width="185" height="70" rx="14" fill="#fff" stroke="#0369a1"/><text x="582" y="58">Intravesical therapy</text><text x="582" y="81">or cystectomy</text><rect x="245" y="140" width="180" height="70" rx="14" fill="#fff" stroke="#991b1b"/><text x="335" y="168">MIBC / M1</text><text x="335" y="191">stage + fitness</text><path d="M425 175h65" stroke="#0f172a" stroke-width="3" marker-end="url(#c)"/><rect x="490" y="140" width="185" height="70" rx="14" fill="#fff" stroke="#991b1b"/><text x="582" y="168">Perioperative /</text><text x="582" y="191">systemic pathway</text><defs><marker id="c" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#0f172a"/></marker></defs></g>`);
  if(name==='Ca Kidney') return svgShell('Renal mass management map',`<g font-family="system-ui" font-size="15" text-anchor="middle"><rect x="20" y="78" width="160" height="70" rx="14" fill="#fff" stroke="#0f172a"/><text x="100" y="106">Renal mass</text><text x="100" y="128">stage + anatomy + patient</text><path d="M180 113h65" stroke="#0f172a" stroke-width="3" marker-end="url(#d)"/><rect x="245" y="25" width="180" height="70" rx="14" fill="#fff" stroke="#15803d"/><text x="335" y="53">Small / selected</text><text x="335" y="76">AS / ablation / PN</text><path d="M425 60h65" stroke="#0f172a" stroke-width="3" marker-end="url(#d)"/><rect x="490" y="25" width="170" height="70" rx="14" fill="#fff" stroke="#15803d"/><text x="575" y="53">Nephron-sparing</text><text x="575" y="76">when feasible</text><rect x="245" y="145" width="180" height="70" rx="14" fill="#fff" stroke="#991b1b"/><text x="335" y="173">Complex / locally</text><text x="335" y="196">advanced</text><path d="M425 180h65" stroke="#0f172a" stroke-width="3" marker-end="url(#d)"/><rect x="490" y="145" width="170" height="70" rx="14" fill="#fff" stroke="#991b1b"/><text x="575" y="173">Radical / systemic</text><text x="575" y="196">MDT pathway</text><defs><marker id="d" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#0f172a"/></marker></defs></g>`);
  return '';
}
function installVisualHook(){
  if(typeof window.openDisease!=='function' || window.__V139_VISUAL_HOOK__) return;
  const old=window.openDisease;
  window.openDisease=function(name){old.apply(this,arguments);const v=visuals(name);const target=document.getElementById('diseaseContent');if(v&&target&&!document.getElementById('v139VisualAtlas')){target.insertAdjacentHTML('afterbegin','<div id="v139VisualAtlas">'+v+'</div>');}};
  window.__V139_VISUAL_HOOK__=true;
}
appendPack();installVisualHook();
})();
