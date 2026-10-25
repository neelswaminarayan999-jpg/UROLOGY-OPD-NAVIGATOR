/* Campbell-Walsh-Wein Urology 13e source integration for Urology Oracle.
 * This is an original, chapter-linked learning layer, not a reproduction of textbook prose.
 * Treatment decisions remain on separately versioned current-guideline pathways.
 */
(() => {
'use strict';
const source={title:'Campbell-Walsh-Wein Urology',edition:'13th edition',isbn:'978-0-323-88405-1',copyright:'2026',scope:'Three-volume edition; the publisher preface states all chapters were revised.',role:'Clinical foundation and source index. Current EAU/AUA/NCCN guidance, applicable product information and local protocols govern live treatment decisions.'};
const chapters=[
[2,'Evaluation of the Urologic Patient: History and Physical Examination',8,'Clinical evaluation'],
[3,'Indications and Interpretation of Laboratory Testing',24,'Clinical evaluation'],
[4,'Urinary Tract Imaging: Basic Principles of Urologic Ultrasonography',40,'Imaging'],
[5,'Principles of CT and Radiographic Imaging',66,'Imaging'],
[6,'Magnetic Resonance Imaging',92,'Imaging'],
[7,'Genitourinary Tract Imaging: Basic Principles of Nuclear Medicine',109,'Imaging'],
[8,'Evaluation and Management of Hematuria',120,'Hematuria'],
[11,'Perioperative Care in Urologic Surgery',150,'Perioperative care'],
[12,'Fundamentals of Intraoperative Patient Safety',167,'Perioperative care'],
[15,'Lower Urinary Tract Catheterization',191,'Procedural fundamentals'],
[16,'Fundamentals of Upper Urinary Tract Drainage',199,'Procedural fundamentals'],
[17,'Principles of Urologic Endoscopy',215,'Endourology'],
[18,'Fundamentals of Laparoscopic and Robotic Urologic Surgery',229,'Surgery'],
[19,'Energy Modalities in Urology',262,'Surgery'],
[20,'Complications of Urologic Surgery',283,'Perioperative care'],
[23,'Assessment of Urologic and Surgical Outcomes',331,'Evidence and outcomes'],
[24,'Basic Principles of Immunology and Immunotherapy in Urologic Oncology',346,'Oncology principles'],
[25,'Molecular Genetics and Cancer Biology',360,'Oncology principles'],
[26,'Infections of the Urinary Tract',388,'Infection'],
[27,'Inflammatory and Pain Conditions of the Lower Genitourinary Tract',459,'Infection'],
[28,'Interstitial Cystitis/Bladder Pain Syndrome and Related Disorders',480,'Functional urology'],
[29,'Sexually Transmitted Diseases',511,'Infection'],
[31,'Tuberculosis and Parasitic Infections of the Genitourinary Tract',558,'Infection'],
[32,'Embryology of the Human Genitourinary Tract',584,'Pediatric urology'],
[35,'Urologic Evaluation of the Child',658,'Pediatric urology'],
[36,'Pediatric Urogenital Imaging',672,'Pediatric urology'],
[37,'Infection and Inflammation of the Pediatric Genitourinary Tract',696,'Pediatric urology'],
[40,'Clinical and Urodynamic Evaluation of Lower Urinary Tract Dysfunction in Children',744,'Pediatric urology'],
[41,'Management Strategies for Vesicoureteral Reflux',760,'Pediatric urology'],
[45,'Posterior Urethral Valves',877,'Pediatric urology'],
[46,'Neuromuscular Dysfunction of the Lower Urinary Tract in Children',900,'Pediatric urology'],
[49,'Anomalies of the Kidney and Collecting System',974,'Pediatric urology'],
[51,'Pathophysiology of Urinary Tract Obstruction',1027,'Pediatric urology'],
[52,'Ectopic Ureter, Ureterocele, and Ureteral Anomalies',1038,'Pediatric urology'],
[53,'Surgery of the Ureter in Children: UPJ, Megaureter, and Reflux',1064,'Pediatric urology'],
[54,'Management of Pediatric Kidney Stone Disease',1091,'Pediatric urology'],
[56,'Hypospadias',1141,'Pediatric urology'],
[57,'Undescended Testis: Etiology, Diagnosis, and Management',1186,'Pediatric urology'],
[63,'Pediatric Urologic Oncology: Renal and Adrenal',1311,'Pediatric oncology'],
[64,'Pediatric Urologic Oncology: Pelvis, Bladder, Testis, and Genitalia',1333,'Pediatric oncology'],
[67,'Male Reproductive Physiology',1388,'Andrology'],
[68,'Integrated Men’s Health: Androgen Deficiency, Cardiovascular Risk, and Metabolic Syndrome',1409,'Andrology'],
[69,'Male Infertility',1418,'Andrology'],
[70,'Surgical Management of Male Infertility',1437,'Andrology'],
[71,'Physiology of Penile Erection and Pathophysiology of Erectile Dysfunction',1470,'Andrology'],
[72,'Evaluation and Management of Erectile Dysfunction',1497,'Andrology'],
[73,'Priapism',1523,'Andrology'],
[74,'Disorders of Male Orgasm and Ejaculation',1541,'Andrology'],
[75,'Surgery for Erectile Dysfunction',1561,'Andrology'],
[76,'Diagnosis and Management of Peyronie Disease',1579,'Andrology'],
[79,'Neoplasms of the Testis',1658,'Testicular cancer'],
[80,'Surgery of Testicular Tumors',1683,'Testicular cancer'],
[81,'Minimally Invasive Retroperitoneal Lymph Node Dissection',1706,'Testicular cancer'],
[82,'Tumors of the Penis',1715,'Penile cancer'],
[83,'Tumors of the Urethra',1749,'Urethral cancer'],
[84,'Inguinal Node Dissection',1764,'Penile and urethral cancer'],
[85,'Benign Disorders of the Penis and Urethra',1774,'Andrology / urethra'],
[86,'Urethral Stricture Disease',1794,'Urethral stricture'],
[88,'Anatomy of the Kidney and Ureter',1838,'Upper urinary tract'],
[90,'Fundamentals of Nephrology',1854,'Renal function'],
[91,'Renal Transplantation',1883,'Transplantation'],
[92,'Urologic Complications of Renal Transplantation',1896,'Transplantation'],
[93,'Management of Upper Urinary Tract Obstruction',1903,'Upper urinary tract'],
[94,'Upper Urinary Tract Trauma',1942,'Urologic trauma'],
[95,'Urinary Lithiasis: Etiology, Epidemiology, and Pathogenesis',1972,'Stone disease'],
[96,'Acute Care of Urinary Lithiasis',2004,'Stone disease'],
[97,'Surgical Management of Ureteral Calculi',2011,'Stone disease'],
[98,'Surgical Management of Upper Urinary Tract Calculi',2027,'Stone disease'],
[99,'Prevention of Urinary Stone Disease',2049,'Stone disease'],
[100,'Lower Urinary Tract Calculi',2059,'Stone disease'],
[103,'Physiology and Pharmacology of the Bladder and Urethra',2104,'Functional urology'],
[104,'Pathophysiology and Classification of Lower Urinary Tract Dysfunction',2157,'Functional urology'],
[107,'Urodynamic and Videourodynamic Evaluation of the Lower Urinary Tract',2192,'Urodynamics'],
[109,'Neuromuscular Dysfunction of the Lower Urinary Tract',2238,'Functional urology'],
[110,'Overactive Bladder',2276,'Functional urology'],
[111,'Underactive Detrusor',2290,'Functional urology'],
[112,'Nocturia',2304,'Functional urology'],
[113,'Pharmacologic Management of Lower Urinary Tract Storage and Emptying Failure',2337,'Functional urology'],
[124,'Bladder Surgery for Benign Disease',2601,'Bladder'],
[125,'Genital and Lower Urinary Tract Trauma',2642,'Urologic trauma'],
[129,'Tumors of the Urinary Bladder',2687,'Bladder cancer'],
[130,'Management of Non–Muscle-Invasive Bladder Cancer (Ta, T1, CIS)',2707,'Bladder cancer'],
[131,'Management of Muscle-Invasive and Metastatic Bladder Cancer',2730,'Bladder cancer'],
[132,'Surgical Management of Bladder Cancer: Transurethral, Open, and Robotic',2756,'Bladder cancer'],
[133,'Use of Intestinal Segments in Urinary Diversion',2784,'Urinary diversion'],
[134,'Continent Urinary Diversion',2812,'Urinary diversion'],
[135,'Minimally Invasive Urinary Diversion',2843,'Urinary diversion'],
[136,'Benign Renal Tumors',2860,'Renal tumors'],
[137,'Malignant Renal Tumors',2872,'Renal cancer'],
[138,'Urothelial Tumors of the Upper Urinary Tract and Ureter',2924,'UTUC'],
[139,'Surgical Management of Upper Urinary Tract Urothelial Tumors',2940,'UTUC'],
[140,'Retroperitoneal Tumors',2968,'Retroperitoneum'],
[141,'Contemporary Open Surgery of the Kidney',2990,'Renal surgery'],
[142,'Laparoscopic and Robotic Surgery of the Kidney',3027,'Renal surgery'],
[143,'Focal Therapy for Renal Tumors',3059,'Renal cancer'],
[144,'Treatment of Advanced Renal Cell Carcinoma',3078,'Renal cancer'],
[145,'Surgical and Radiographic Anatomy of the Adrenals',3102,'Adrenal'],
[146,'Evaluation and Medical Management of Adrenal Disorders',3111,'Adrenal'],
[147,'Surgery of the Adrenal Glands',3161,'Adrenal'],
[148,'Anatomy and Development of the Prostate',3172,'Prostate'],
[149,'BPH: Etiology, Pathophysiology, Epidemiology, and Natural History',3180,'BPH / male LUTS'],
[150,'Evaluation and Nonsurgical Management of BPH',3221,'BPH / male LUTS'],
[151,'Minimally Invasive and Endoscopic Management of BPH',3283,'BPH / male LUTS'],
[152,'Simple Prostatectomy: Open, Laparoscopic, and Robotic Approaches',3318,'BPH / male LUTS'],
[153,'Epidemiology, Etiology, and Prevention of Prostate Cancer',3334,'Prostate cancer'],
[154,'Prostate Cancer Biomarkers',3353,'Prostate cancer'],
[155,'Prostate Biopsy: Techniques and Imaging',3364,'Prostate cancer'],
[156,'Pathology of Prostatic Neoplasia',3382,'Prostate cancer'],
[157,'Diagnosis and Staging of Prostate Cancer',3390,'Prostate cancer'],
[158,'Active Management Strategies for Localized Prostate Cancer',3398,'Prostate cancer'],
[159,'Active Surveillance of Prostate Cancer',3417,'Prostate cancer'],
[160,'Open Radical Prostatectomy',3431,'Prostate cancer'],
[161,'Laparoscopic and Robotic Radical Prostatectomy and Pelvic Lymphadenectomy',3449,'Prostate cancer'],
[162,'Radiation Therapy for Prostate Cancer',3474,'Prostate cancer'],
[163,'Focal Therapy of Prostate Cancer',3505,'Prostate cancer'],
[164,'Treatment of Locally Advanced Prostate Cancer',3543,'Prostate cancer'],
[165,'Management of Recurrent and Newly Metastatic Prostate Cancer',3562,'Prostate cancer'],
[166,'Management of Castration-Resistant Prostate Cancer',3588,'Prostate cancer']
].map(([chapter,title,page,domain])=>({chapter,title,page,domain}));

const modules=[
{id:'Stone Disease',title:'Stone disease and endourology',chapterIds:[95,96,97,98,99,100,16,17],summary:'Treat the clinical presentation and underlying risk—not stone diameter alone. Integrate burden, location, density, anatomy, obstruction, infection, renal reserve, patient factors and local expertise.',checkpoints:['Acute decision gate: assess sepsis, obstruction, renal function, analgesia and the contralateral kidney. Infected obstruction requires urgent drainage and infection control before definitive stone clearance.','Planning: review the complete imaging dataset for total burden, anatomy, access route, expected clearance, staging and procedure-specific morbidity.','Prevention: review stone analysis, recurrence, urine/metabolic risks and modifiable factors; removal alone is not recurrence prevention.'],references:'Chapters 95–100, printed pages 1972–2059; Chapters 16–17 cover drainage and endoscopy.',caution:'Procedure selection, antimicrobials and metabolic prescriptions must follow current guidance and patient-specific assessment.'},
{id:'BPH / Male LUTS',title:'BPH and male lower urinary tract symptoms',chapterIds:[103,104,107,110,111,112,113,149,150,151,152],summary:'Separate symptom phenotype from presumed mechanism. Prostate size, outlet anatomy, bladder function and comorbidity all contribute; symptoms alone do not prove prostatic obstruction.',checkpoints:['Characterize storage, voiding and post-micturition symptoms, complications and relevant examination; use flow/PVR or advanced testing when results can change management.','Match medical options to symptom pattern, enlargement/progression context, adverse effects, comorbidity and patient priorities.','For procedures, document gland size/morphology, retention or complications, anticoagulation/anaesthesia factors, durability and priorities regarding ejaculation and recovery.'],references:'Chapters 149–152, printed pages 3180–3318; physiology and functional testing in Chapters 103–113.',caution:'Do not infer a procedure or drug dose from gland size alone; use current EAU/AUA guidance and local availability.'},
{id:'Ca Bladder',title:'Bladder cancer: NMIBC, MIBC and advanced disease',chapterIds:[8,129,130,131,132,133,134,135],summary:'Link pathology, risk classification and treatment, but preserve explicit branches between non–muscle-invasive and muscle-invasive disease.',checkpoints:['NMIBC: ensure TURBT/pathology quality supports risk assignment; consider re-resection when indicated and structure intravesical treatment and surveillance around risk.','MIBC/advanced disease: combine clinical stage, nodal/metastatic assessment, fitness, renal function and systemic-treatment eligibility with definitive local planning.','Diversion is part of the oncologic operation: discuss conduit/continent options against renal and intestinal function, dexterity, anatomy, patient goals and self-care capacity.'],references:'Chapters 129–135, printed pages 2687–2843; hematuria evaluation in Chapter 8.',caution:'Regimens, cisplatin criteria, perioperative immunotherapy/ADC pathways, doses and approval status change over time; the current guideline module remains authoritative.'},
{id:'Ca Kidney',title:'Renal masses and renal cell carcinoma',chapterIds:[90,136,137,141,142,143,144],summary:'Management depends on imaging phenotype, stage, tumour complexity, renal function, patient risk and goals. Preserve renal function when oncologically appropriate.',checkpoints:['Review cross-sectional imaging, contralateral kidney, baseline renal function, hereditary/multifocal context and whether a mass is indeterminate or likely malignant.','Choose surveillance, biopsy, ablation or surgery based on size/stage, anatomy, fitness and whether tissue will change management.','Document rationale for partial versus radical nephrectomy and expected functional impact; advanced disease needs its own systemic pathway.'],references:'Chapters 136–144, printed pages 2860–3078; renal physiology in Chapter 90.',caution:'Biopsy/surveillance/ablation thresholds and systemic therapy must align with current guidance.'},
{id:'UTUC',title:'Upper tract urothelial carcinoma',chapterIds:[5,6,88,90,138,139],summary:'Risk stratification and renal preservation are central because staging confidence and the consequences of nephroureterectomy affect later choices.',checkpoints:['Combine upper-tract imaging, cystoscopy, cytology and ureteroscopic findings/biopsy when appropriate; document sampling and staging limitations.','Distinguish kidney-sparing candidates from high-risk disease needing definitive oncologic surgery using grade, multifocality, obstruction, invasion suspicion and tumour features.','Plan lymph-node assessment, bladder-cuff management, renal-function consequences and perioperative systemic-treatment discussion as appropriate.'],references:'Chapters 138–139, printed pages 2924–2940; imaging foundations in Chapters 5–6.',caution:'Risk definitions and perioperative treatment recommendations should be refreshed from current EAU/AUA/NCCN guidance.'},
{id:'Ca Prostate',title:'Prostate cancer: diagnosis through advanced disease',chapterIds:[148,153,154,155,156,157,158,159,160,161,162,163,164,165,166],summary:'Connect PSA context, imaging, biopsy quality, Grade Group, clinical stage, life expectancy and patient preferences in a risk-adapted pathway.',checkpoints:['Diagnosis: interpret PSA in context; integrate MRI and biopsy strategy, pathology/Grade Group and stage rather than relying on one test alone.','Localized disease: make active surveillance, surgery and radiotherapy options explicit by risk, suitability, competing risks and preferences.','Advanced disease: distinguish hormone-sensitive, recurrent/metastatic and castration-resistant states; capture previous treatments, symptoms, disease burden and molecular testing where indicated.'],references:'Chapters 153–166, printed pages 3334–3588; anatomy in Chapter 148.',caution:'Risk groups, PSMA imaging, biomarkers, systemic sequences and doses need current guideline/version checks.'},
{id:'Ca Testis',title:'Testicular cancer',chapterIds:[79,80,81],summary:'Correct initial staging and marker assessment, appropriate oncologic surgery and preservation of future fertility/reproductive options matter from the first encounter.',checkpoints:['Record pre-orchiectomy serum tumour markers and staging investigations; use an inguinal oncologic approach rather than routine scrotal violation.','After histology and stage, distinguish seminomatous from nonseminomatous disease and discuss post-orchiectomy choices and fertility preservation when relevant.','Use RPLND only for appropriately selected cases and experienced teams.'],references:'Chapters 79–81, printed pages 1658–1706.',caution:'Surveillance and adjuvant/chemotherapy choices depend on stage, histology, risk and current guidance.'},
{id:'Ca Penis',title:'Penile cancer and inguinal nodal assessment',chapterIds:[82,84,85],summary:'Balance oncologic control with organ preservation where safe. Primary lesion management and groin-node risk are separate decisions.',checkpoints:['Document lesion site/extent, histology, local stage and urethral involvement; preserve pretreatment details for multidisciplinary review.','A clinically negative groin does not automatically mean negligible occult-node risk; select surveillance or invasive staging using validated risk features and follow-up reliability.','Choose organ-sparing excision/reconstruction or more extensive resection according to tumour characteristics and achievable control; discuss function and body image.'],references:'Chapter 82, printed page 1715; Chapter 84, inguinal node dissection, page 1764.',caution:'Nodal algorithms and adjuvant treatment should be checked against current penile-cancer guidance.'},
{id:'Urethral Cancer',title:'Urethral malignancy',chapterIds:[83,84,85,86],summary:'Keep rare urethral malignancy separate from benign stricture management; localization, histology, stage and nodal assessment drive specialist planning.',checkpoints:['Define involved segment, histology, local extent, regional nodes and associated malignancy history.','Use a dedicated staging/MDT pathway; reconstructive planning follows oncologic control rather than substituting for it.'],references:'Chapter 83, printed page 1749; Chapter 84 covers inguinal nodal surgery.',caution:'Use current specialist guidance and multidisciplinary review for rare disease.'},
{id:'Urethral Stricture',title:'Urethral stricture and reconstruction',chapterIds:[2,3,5,15,16,86],summary:'Match reconstruction to location, length, etiology, prior treatment, tissue quality and patient goals; do not collapse anterior strictures and pelvic-fracture posterior urethral injury into one pathway.',checkpoints:['Record site/length, etiology, symptoms, previous dilation/DVIU/urethroplasty, infection, lichen sclerosus, radiation and trauma history.','Use appropriate imaging/endoscopy to map anatomy and proximal urethra; interpret findings in the context of catheterization and instrumentation.','Make reconstructive referral/timing explicit for complex, recurrent or traumatic disease.'],references:'Chapter 86, printed page 1794; diagnostic and drainage principles in Chapters 2, 15 and 16.',caution:'Endoscopic treatment indications, urethroplasty choice and follow-up should follow current reconstructive-urology guidance.'},
{id:'Adrenal / Neuroendocrine',title:'Adrenal masses and functional assessment',chapterIds:[145,146,147],summary:'Assess hormonal function and imaging/malignancy risk before choosing observation, further endocrine investigation or surgery.',checkpoints:['Review symptoms, endocrine history, imaging phenotype, growth, size and cancer history.','Exclude catecholamine-secreting disease before invasive intervention when indicated; test other hormonal excess according to presentation and current recommendations.','Suspected invasion or malignancy changes operative planning and warrants an experienced multidisciplinary team.'],references:'Chapters 145–147, printed pages 3102–3161.',caution:'Biochemical thresholds and surveillance/resection criteria must be checked against current endocrine guidance.'},
{id:'UTI',title:'Urinary infection and inflammatory disorders',chapterIds:[26,27,28,29,31],summary:'Establish whether infection is symptomatic, its likely site, severity and whether an obstructed or uncontrolled source needs intervention.',checkpoints:['Interpret urine testing/culture with symptoms, collection quality, prior antimicrobials, host risk and possible contamination/asymptomatic bacteriuria.','Look for obstruction, stones, retention, instrumentation or abscess when illness is severe, atypical or not improving.','Use severity, local resistance, allergy, renal function and culture to guide therapy and de-escalate when appropriate.'],references:'Chapter 26, printed page 388; related conditions in Chapters 27–31.',caution:'Antibiotic choice, dose and duration are not hard-coded; use current local antimicrobial policy and patient-specific prescribing.'},
{id:'Hematuria',title:'Hematuria evaluation',chapterIds:[2,3,5,6,7,8],summary:'Hematuria is a finding requiring risk-appropriate evaluation, not a diagnosis. Do not automatically attribute it to infection, anticoagulation or stones.',checkpoints:['Confirm the finding and assess severity, symptoms, renal function, infection, proteinuria and red flags; separate visible from microscopic hematuria.','Choose bladder and upper-tract assessment based on patient age, risk factors, presentation and current guidance.','Match imaging to the diagnostic question, renal function, pregnancy status and contrast risk.'],references:'Chapter 8, printed page 120; imaging foundations in Chapters 4–7.',caution:'Risk stratification and work-up schedules should use the current hematuria pathway.'},
{id:'Urodynamics',title:'Urodynamics and lower urinary tract function',chapterIds:[103,104,107,109,110,111,112,113],summary:'Interpret pressure-flow and storage studies in context, with attention to technical quality and whether a finding changes management.',checkpoints:['Review study quality, filling conditions, artifacts, symptoms and representativeness before assigning a physiological diagnosis.','Separate storage findings, emptying/pressure-flow pattern, compliance and residual urine; no isolated value should override the entire study.','Use invasive testing when the clinical question and potential management consequence justify it.'],references:'Chapter 107, printed page 2192, and Chapters 103–113.',caution:'Thresholds and indications must be applied to the actual tracing and current guidance, not from a summary alone.'},
{id:'Urologic Trauma',title:'Upper tract, bladder and urethral trauma',chapterIds:[15,16,94,125],summary:'Prioritize physiology and mechanism, then follow the organ-specific injury pathway. An incomplete study or absent symptom does not dismiss a high-risk mechanism.',checkpoints:['Document haemodynamics, mechanism, associated injuries, haematuria, renal function and the imaging protocol/phase.','Use separate pathways for kidney, ureter, bladder and urethra; specify observation, drainage, endoscopic management or repair.','Avoid blind urethral instrumentation when urethral injury is suspected until evaluated.'],references:'Chapter 94, printed page 1942, and Chapter 125, page 2642.',caution:'Injury grading and intervention thresholds should follow current trauma guidance and local resources.'},
{id:'Andrology',title:'Andrology, erectile dysfunction and male infertility',chapterIds:[67,68,69,70,71,72,73,74,75,76],summary:'Use a structured history, examination and targeted tests, recognizing cardiometabolic, endocrine, medication and psychosocial contributors.',checkpoints:['For ED, assess cardiovascular/metabolic risk and medications; investigate endocrine contributors when clinically indicated.','For infertility, evaluate the couple systematically and use semen parameters, history, examination and targeted tests according to phenotype.','Priapism and acute genital presentations require time-sensitive triage; routine chronic-dysfunction pathways are not an emergency protocol.'],references:'Chapters 67–76, printed pages 1388–1579.',caution:'Medication choice, contraindications and doses require current prescribing guidance and patient-specific screening.'},
{id:'Pediatric Urology',title:'Pediatric and transitional urology',chapterIds:[32,35,36,37,40,41,45,46,49,51,52,53,54,56,57,63,64],summary:'Account for age, renal growth/function, congenital anatomy, infection history, bladder dynamics and transition to adult care; adult thresholds do not automatically apply.',checkpoints:['Document antenatal findings, infections, renal function, growth, anatomy and symptoms with age-appropriate investigations.','For congenital obstruction/reflux and paediatric stones, weigh function and natural history alongside symptoms and anatomy.','Use age-specific perioperative, antimicrobial and follow-up protocols; involve paediatric specialists for complex disease.'],references:'Selected chapters across Chapters 32–65, printed pages 584–1348.',caution:'Paediatric doses and thresholds require independent verification against current age- and weight-specific guidance.'}
];

const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function addStyles(){
 if(document.getElementById('c13-style'))return;
 const st=document.createElement('style');st.id='c13-style';
 st.textContent=[
 '#campbell13-panel{margin:18px 0;padding:18px;border:1px solid #cbd5e1;border-radius:16px;background:#fff;color:#0f172a;box-shadow:0 4px 18px rgba(15,23,42,.05)}',
 '#campbell13-panel *{box-sizing:border-box}#campbell13-panel .c13-head{display:flex;gap:14px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap}',
 '#campbell13-panel .c13-kicker{font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#0f766e}#campbell13-panel h2{font-size:21px;line-height:1.25;margin:5px 0 7px;color:#0f172a}',
 '#campbell13-panel p{font-size:13px;line-height:1.55;margin:5px 0;color:#475569}#campbell13-panel .c13-meta{font-size:11px;color:#64748b}',
 '#campbell13-panel .c13-tools{display:grid;grid-template-columns:minmax(220px,2fr) minmax(180px,1fr);gap:9px;margin:14px 0}',
 '#campbell13-panel input,#campbell13-panel select{width:100%;min-width:0;border:1px solid #cbd5e1;border-radius:9px;background:#fff;padding:10px 11px;color:#0f172a;font-size:13px}',
 '#campbell13-panel .c13-status{font-size:12px;color:#475569;margin:5px 0 12px}#campbell13-panel .c13-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,330px),1fr));gap:10px}',
 '#campbell13-panel .c13-card{border:1px solid #e2e8f0;border-radius:12px;padding:13px;background:#fff;min-width:0}#campbell13-panel .c13-card h3{font-size:15px;line-height:1.35;margin:0 0 5px}',
 '#campbell13-panel .c13-tags{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 9px}#campbell13-panel .c13-tag{font-size:10px;border-radius:999px;padding:3px 7px;background:#f1f5f9;color:#334155}',
 '#campbell13-panel .c13-card details{margin-top:8px;border-top:1px solid #e2e8f0;padding-top:8px}#campbell13-panel summary{cursor:pointer;font-weight:700;font-size:12px;color:#0f766e}',
 '#campbell13-panel ul{margin:7px 0 9px;padding-left:18px}#campbell13-panel li{font-size:12px;line-height:1.5;margin:5px 0;color:#334155}',
 '#campbell13-panel .c13-caution{margin-top:8px;padding:8px 10px;border-left:3px solid #d97706;background:#fffbeb;color:#78350f;font-size:11px;line-height:1.5}',
 '#campbell13-panel .c13-footer{border-top:1px solid #e2e8f0;margin-top:13px;padding-top:11px;font-size:11px;color:#64748b;line-height:1.5}',
 '@media(max-width:600px){#campbell13-panel{padding:13px}#campbell13-panel .c13-tools{grid-template-columns:1fr}#campbell13-panel h2{font-size:18px}}'
 ].join('');document.head.appendChild(st);
}
function moduleCard(m){
 const refs=m.chapterIds.map(id=>chapters.find(c=>c.chapter===id)).filter(Boolean);
 const tags=refs.map(c=>'<span class="c13-tag">Ch '+c.chapter+' · p '+c.page+'</span>').join('');
 const pts=m.checkpoints.map(t=>'<li>'+esc(t)+'</li>').join('');
 const chapterList=refs.map(c=>'<li>Chapter '+c.chapter+': '+esc(c.title)+' (printed p. '+c.page+')</li>').join('');
 const searchable=(m.title+' '+m.id+' '+m.summary+' '+m.references+' '+refs.map(c=>c.title).join(' ')).toLowerCase();
 return '<article class="c13-card" data-module="'+esc(m.id)+'" data-search="'+esc(searchable)+'"><h3>'+esc(m.title)+'</h3><p>'+esc(m.summary)+'</p><div class="c13-tags">'+tags+'</div><details><summary>Clinical synthesis and decision checkpoints</summary><ul>'+pts+'</ul><p><b>Relevant 13e chapters</b></p><ul>'+chapterList+'</ul><p><b>13e source:</b> '+esc(m.references)+'</p><div class="c13-caution"><b>Boundary:</b> '+esc(m.caution)+'</div></details></article>';
}
function render(panel){
 const term=panel.querySelector('#c13-search').value.trim().toLowerCase(),filter=panel.querySelector('#c13-filter').value;let shown=0;
 panel.querySelectorAll('.c13-card').forEach(card=>{const ok=(!term||card.dataset.search.includes(term))&&(filter==='all'||card.dataset.module===filter);card.hidden=!ok;if(ok)shown++;});
 panel.querySelector('#c13-status').textContent=shown+' of '+modules.length+' clinical modules shown · '+chapters.length+' chapter references indexed';
}
function mount(){
 if(document.getElementById('campbell13-panel'))return;
 addStyles();
 document.querySelectorAll('.v10-bookcard b').forEach(el=>{if(/Campbell-Walsh-Wein Urology\s+12e/i.test(el.textContent||'')){el.textContent='Campbell-Walsh-Wein Urology 13e';const span=el.closest('.v10-bookcard')?.querySelector('span');if(span)span.textContent='13th edition chapter references and original clinical syntheses; current guideline pathways remain the authority for live treatment decisions.';}});
 if(window.URO_ORACLE_V10&&Array.isArray(window.URO_ORACLE_V10.sources)){window.URO_ORACLE_V10.sources=window.URO_ORACLE_V10.sources.map(s=>/Campbell-Walsh-Wein Urology 12e/i.test(s)?'Campbell-Walsh-Wein Urology 13e':s);window.URO_ORACLE_V10.version='V10 + Campbell 13e source layer';}
 const p=document.createElement('section');p.id='campbell13-panel';p.setAttribute('aria-labelledby','c13-title');
 const options=modules.map(m=>'<option value="'+esc(m.id)+'">'+esc(m.title)+'</option>').join('');
 p.innerHTML='<div class="c13-head"><div><div class="c13-kicker">Source migration · 13th edition</div><h2 id="c13-title">Campbell-Walsh-Wein Urology — 13e clinical reference</h2><p>Search by chapter, disease or Oracle module. These are source-linked original clinical syntheses for rapid navigation—not copied textbook passages or a substitute for reading the chapter.</p><div class="c13-meta">'+esc(source.isbn)+' · Copyright '+esc(source.copyright)+' · '+esc(source.scope)+'</div></div></div><div class="c13-tools"><input id="c13-search" type="search" placeholder="Search chapter, disease, finding or topic…" aria-label="Search Campbell 13th edition topics"><select id="c13-filter" aria-label="Filter by Oracle clinical module"><option value="all">All Oracle modules</option>'+options+'</select></div><div id="c13-status" class="c13-status" role="status" aria-live="polite"></div><div class="c13-list">'+modules.map(moduleCard).join('')+'</div><div class="c13-footer"><b>Clinical-source rule:</b> Campbell supplies foundational reasoning and chapter references. Time-sensitive choices, diagnostic thresholds, drug doses, eligibility criteria and approvals must be checked against current EAU/AUA/NCCN or other applicable guidance, product information and local protocols. This panel is not a patient-specific order.</div>';
 const home=document.getElementById('homeView'),lab=document.getElementById('bookLabView');
 if(home)home.insertBefore(p,home.firstChild);else if(lab&&lab.parentNode)lab.parentNode.insertBefore(p,lab);else document.body.insertBefore(p,document.body.firstChild);
 p.querySelector('#c13-search').addEventListener('input',()=>render(p));p.querySelector('#c13-filter').addEventListener('change',()=>render(p));render(p);
}
function init(){mount();window.CAMPBELL_WEIN_13E={source,chapters,modules:modules.map(({id,title,chapterIds,references})=>({id,title,chapterIds,references})),moduleCount:modules.length,chapterReferenceCount:chapters.length};}
if(document.readyState==='complete')init();else document.addEventListener('DOMContentLoaded',init,{once:true});
})();