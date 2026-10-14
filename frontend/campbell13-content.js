(function () {
  "use strict";
  if (window.__URO_CAMPBELL13_LOADED) return;
  window.__URO_CAMPBELL13_LOADED = true;

  var DATA = [
    {
      id:"foundations", category:"Clinical foundations", title:"Clinical evaluation, imaging and surgical principles",
      chapters:[
        [1,"Personal and Professional Development of the Urologist",1],
        [2,"Evaluation of the Urologic Patient: History and Physical Examination",8],
        [3,"Indications and Interpretation of Laboratory Testing",24],
        [4,"Urinary Tract Imaging: Basic Principles of Urologic Ultrasonography",40],
        [5,"Principles of CT and Radiographic Imaging",66],
        [6,"Magnetic Resonance Imaging",92],
        [7,"Genitourinary Tract Imaging: Basic Principles of Nuclear Medicine",109],
        [8,"Evaluation and Management of Hematuria",120],
        [11,"Perioperative Care in Urologic Surgery",150],
        [17,"Principles of Urologic Endoscopy",215],
        [18,"Fundamentals of Laparoscopic and Robotic Urologic Surgery",229],
        [20,"Complications of Urologic Surgery",283],
        [23,"Assessment of Urologic and Surgical Outcomes",331]
      ],
      summary:[
        "Use history, examination, laboratory data and imaging as complementary evidence; no single test should be interpreted outside the clinical question it is meant to answer.",
        "For imaging, connect the modality and protocol to the decision: detection, staging, anatomy, vascular involvement, function or procedural planning.",
        "Perioperative assessment, endoscopic principles, complication recognition and outcome measurement should be reflected in the app's safety checks and documentation."
      ],
      appUse:"Cross-check the investigation pathway, perioperative gates, report interpretation and follow-up fields. This is foundational context, not a substitute for patient-specific judgement."
    },
    {
      id:"infection", category:"Infection & inflammation", title:"Urinary infection, prostatitis and inflammatory conditions",
      chapters:[
        [26,"Infections of the Urinary Tract",388],
        [27,"Inflammatory and Pain Conditions of the Lower Genitourinary Tract",459],
        [28,"Interstitial Cystitis/Bladder Pain Syndrome and Related Disorders",480],
        [29,"Sexually Transmitted Diseases",511],
        [30,"Cutaneous Diseases of the External Genitalia",530],
        [31,"Tuberculosis and Parasitic Infections of the Genitourinary Tract",558]
      ],
      summary:[
        "Separate symptomatic infection from colonisation or contamination, and interpret urinalysis and culture alongside symptoms, risk factors and specimen quality.",
        "For obstructed infected systems, infection severity and timely source control are safety-critical; definitive stone treatment is a separate decision from emergency drainage.",
        "Prostatitis, chronic pelvic pain, bladder pain syndrome, sexually transmitted infection and genitourinary tuberculosis need different diagnostic frames rather than a single generic 'UTI' pathway."
      ],
      appUse:"Audit the infection screen, culture handling, emergency escalation triggers and diagnosis-specific follow-up. Antimicrobial choice/dose/duration must be checked against current local guidance, susceptibility data, renal function and allergy history."
    },
    {
      id:"testis-cancer", category:"Male genital oncology", title:"Testicular tumours and retroperitoneal nodes",
      chapters:[
        [79,"Neoplasms of the Testis",1658],
        [80,"Surgery of Testicular Tumors",1683],
        [81,"Minimally Invasive Retroperitoneal Lymph Node Dissection",1706]
      ],
      summary:[
        "Keep seminoma and nonseminomatous germ-cell tumour pathways distinct; histology, stage and serum-marker kinetics drive downstream decisions.",
        "Record AFP, beta-hCG and LDH before orchiectomy and follow the appropriate post-orchiectomy marker trajectory for staging and risk assessment.",
        "Residual retroperitoneal masses after systemic treatment and the role of RPLND require histology- and response-specific multidisciplinary planning."
      ],
      appUse:"Use the chapter map to review staging logic, marker interpretation, post-chemotherapy residual-mass decisions and the operative role of RPLND. Do not infer a regimen from a chapter title."
    },
    {
      id:"penis-cancer", category:"Male genital oncology", title:"Penile cancer and regional lymph-node management",
      chapters:[
        [82,"Tumors of the Penis",1715],
        [84,"Inguinal Node Dissection",1764],
        [85,"Benign Disorders of the Penis and Urethra",1774]
      ],
      summary:[
        "Document primary lesion site, size, clinical extent, histology, grade, depth/structures involved and the status of each inguinal groin separately.",
        "Primary-tumour management and regional-node staging are linked but distinct decision branches; nodal risk and the reliability of clinical examination should be explicit.",
        "Organ preservation, reconstructive consequences and regional control should be weighed against oncologic adequacy in a multidisciplinary pathway."
      ],
      appUse:"Cross-check the primary-lesion and groin-node branches separately. Confirm the current EAU/NCCN pathway for nodal staging, surgical indications and systemic therapy."
    },
    {
      id:"urethral-cancer", category:"Uro-oncology", title:"Primary urethral carcinoma",
      chapters:[
        [83,"Tumors of the Urethra",1749],
        [84,"Inguinal Node Dissection",1764]
      ],
      summary:[
        "Primary urethral carcinoma is uncommon; the clinical pathway depends on anatomic site, histology, local extent, nodal status and metastatic stage.",
        "Do not confuse urethral carcinoma with benign urethral disease or urethral stricture; diagnostic sampling and stage-appropriate imaging are separate steps.",
        "Regional node management depends on the primary site and risk profile and should be planned in a specialist multidisciplinary setting."
      ],
      appUse:"Keep the primary urethral cancer pathway separate from penile SCC and benign stricture reconstruction. Confirm staging, node management and systemic therapy against current specialist guidance."
    },
    {
      id:"stricture", category:"Reconstruction & urethra", title:"Benign urethral disease and urethral stricture",
      chapters:[
        [85,"Benign Disorders of the Penis and Urethra",1774],
        [86,"Urethral Stricture Disease",1794]
      ],
      summary:[
        "Characterise stricture location, length, calibre, aetiology, number of segments, previous endoscopic/open procedures, continence status and associated trauma or lichen sclerosus.",
        "Use retrograde urethrography with complementary voiding imaging/endoscopy when indicated to define anatomy; distinguish anatomic description from functional symptom severity.",
        "The choice between endoscopic treatment and reconstruction depends on phenotype, prior treatment, tissue quality, location, patient goals and likelihood of durable success."
      ],
      appUse:"The stricture pathway should explicitly capture anatomy and prior interventions before recommending a technique. Keep EPA, graft, staged reconstruction and PFUDD pathways distinct and evidence-linked."
    },
    {
      id:"stones", category:"Urinary lithiasis & endourology", title:"Stone disease and endourology",
      chapters:[
        [95,"Urinary Lithiasis: Etiology, Epidemiology, and Pathogenesis",1972],
        [96,"Acute Care of Urinary Lithiasis",2004],
        [97,"Surgical Management of Ureteral Calculi",2011],
        [98,"Surgical Management of Upper Urinary Tract Calculi",2027],
        [99,"Prevention of Urinary Stone Disease",2049],
        [100,"Lower Urinary Tract Calculi",2059]
      ],
      summary:[
        "Separate emergency triage from definitive clearance: assess sepsis, obstruction, renal function, pain control, solitary kidney and pregnancy where relevant.",
        "Plan treatment using total stone burden, size, location, density, anatomy, collecting-system configuration, infection status, comorbidity, access feasibility and patient factors.",
        "For complex/staghorn burden, access planning and the possibility of staged or combined treatment matter; CT should be used as a procedural roadmap, not only for diagnosis.",
        "Prevention requires stone analysis where possible, recurrence history, relevant metabolic assessment, fluid/diet review and targeted prevention based on stone phenotype."
      ],
      appUse:"Audit the NCCT planning checklist, infected-obstruction safety gate, SWL/URS/PCNL selection, stone-free outcome definition and metabolic prevention follow-up. Confirm procedural indications with current guidelines."
    },
    {
      id:"luts", category:"Functional urology", title:"Bladder physiology, LUT dysfunction and urodynamics",
      chapters:[
        [103,"Physiology and Pharmacology of the Bladder and Urethra",2104],
        [104,"Pathophysiology and Classification of Lower Urinary Tract Dysfunction",2157],
        [107,"Urodynamic and Videourodynamic Evaluation of the Lower Urinary Tract",2192],
        [110,"Overactive Bladder",2276],
        [111,"Underactive Detrusor",2290],
        [112,"Nocturia",2304],
        [113,"Pharmacologic Management of Lower Urinary Tract Dysfunction",2337]
      ],
      summary:[
        "LUTS is a symptom cluster, not a diagnosis. Distinguish storage, voiding and post-micturition symptoms and consider bladder, outlet, urethral, neurologic, medication and systemic contributors.",
        "Uroflow and PVR are screening components; low flow alone cannot reliably distinguish outlet obstruction from detrusor underactivity.",
        "Interpret urodynamics using trace quality, filling conditions, pressure-flow relationships, compliance, sensation, detrusor activity and the clinical question. Avoid treating a single numerical cut-off as the whole diagnosis."
      ],
      appUse:"Link uroflow, PVR, diary, UDS and symptom scores to the relevant differential. Make limitations, artifacts and what a test cannot prove visible alongside the interpretation."
    },
    {
      id:"bladder-cancer", category:"Uro-oncology", title:"Bladder cancer: NMIBC, MIBC, surgery and diversion",
      chapters:[
        [129,"Tumors of the Urinary Bladder",2687],
        [130,"Management Strategies for Non–Muscle-Invasive Bladder Cancer (Ta, T1, and CIS)",2707],
        [131,"Management of Muscle-Invasive and Metastatic Bladder Cancer",2730],
        [132,"Surgical Management of Bladder Cancer: Transurethral, Open, and Robotic",2756],
        [133,"Use of Intestinal Segments in Urinary Diversion",2784],
        [134,"Continent Urinary Diversion",2812],
        [135,"Minimally Invasive Urinary Diversion",2843]
      ],
      summary:[
        "The diagnostic/staging quality of TURBT and the presence of detrusor muscle when required are foundational to a reliable pathway; identify when repeat resection is indicated using the current risk-based guideline.",
        "Keep NMIBC risk stratification, intravesical treatment, BCG response/adequacy and cystectomy discussions separate from the MIBC/metastatic pathway.",
        "For MIBC, connect stage, cisplatin fitness, perioperative systemic-treatment eligibility, surgical candidacy and patient preference; evaluate diversion choice as a distinct reconstructive decision.",
        "Variant histology, lymphovascular invasion, CIS, resection quality and treatment response can change risk and should not be buried in free-text notes."
      ],
      appUse:"Use this chapter bundle to validate the separate NMIBC/MIBC branches, TURBT completeness/re-TURBT gates, systemic-treatment eligibility fields and urinary-diversion counselling. Current guideline versions and regulatory approvals—not textbook text alone—govern treatment choices."
    },
    {
      id:"renal-cancer", category:"Uro-oncology", title:"Renal masses and renal cell carcinoma",
      chapters:[
        [136,"Benign Renal Tumors",2860],
        [137,"Malignant Renal Tumors",2872],
        [141,"Contemporary Open Surgery of the Kidney",2990],
        [142,"Laparoscopic and Robotic Surgery of the Kidney",3027],
        [143,"Focal Therapy for Renal Tumors",3059],
        [144,"Treatment of Advanced Renal Cell Carcinoma",3078]
      ],
      summary:[
        "For renal masses, integrate multiphasic imaging, tumour size/location, anatomy/nephrometry, renal function, contralateral kidney, histology and patient comorbidity.",
        "Distinguish active surveillance, biopsy, ablation, partial nephrectomy and radical nephrectomy by oncologic risk and functional trade-offs rather than size alone.",
        "Surgical approach is not the same as oncologic indication; access choice should not obscure appropriate margins, lymph-node strategy when indicated or renal preservation.",
        "Advanced disease decisions require histology, risk stratification, disease burden, performance status, comorbidity and review of current systemic-treatment evidence."
      ],
      appUse:"Connect renal-mass work-up and nephrometry to treatment selection. Keep localised-mass decision tools separate from advanced RCC risk assessment and systemic treatment; current EAU/NCCN pathways remain the treatment authority."
    },
    {
      id:"utuc", category:"Uro-oncology", title:"Upper-tract urothelial carcinoma (UTUC)",
      chapters:[
        [138,"Urothelial Tumors of the Upper Urinary Tract and Ureter",2924],
        [139,"Surgical Management of Upper Urinary Tract Urothelial Tumors",2940]
      ],
      summary:[
        "Keep UTUC separate from renal cell carcinoma: they have different histology, staging logic, risk assessment and treatment pathways.",
        "Integrate tumour location, grade, cytology/biopsy limitations, invasive-risk features, multifocality, imaging, renal function and the status of the opposite kidney.",
        "Kidney-sparing management and radical nephroureterectomy are selected according to oncologic risk, anatomy, renal reserve and patient factors; a single feature should not decide the pathway.",
        "Coordinate diagnostic ureteroscopy, tissue sampling, lymph-node strategy and perioperative systemic-treatment discussion with the current guideline branch."
      ],
      appUse:"Use this chapter pairing for the UTUC pathway only. Verify current EAU/NCCN criteria, perioperative systemic therapy and kidney-sparing indications before any treatment recommendation."
    },
    {
      id:"bph", category:"Functional urology", title:"BPH / male LUTS: assessment, medication and procedures",
      chapters:[
        [148,"Anatomy and Development of the Prostate",3172],
        [149,"Benign Prostatic Hyperplasia: Etiology, Pathophysiology, Epidemiology, and Natural History",3180],
        [150,"Evaluation and Nonsurgical Management of Benign Prostatic Hyperplasia",3221],
        [151,"Minimally Invasive and Endoscopic Management of Benign Prostatic Hyperplasia",3283],
        [152,"Simple Prostatectomy—Open, Laparoscopic, and Robotic Approaches",3318]
      ],
      summary:[
        "BPH-related obstruction is not synonymous with every cause of male LUTS. Combine symptom burden, urinalysis, flow/PVR, gland anatomy, complications and patient priorities.",
        "Medical treatment, minimally invasive procedures, endoscopic enucleation/resection and simple prostatectomy differ in durability, retreatment, bleeding/ejaculatory effects, anaesthetic requirements and suitability across gland sizes.",
        "Before procedural selection, document gland volume and configuration, median lobe/IPP where relevant, anticoagulation/comorbidity, retention, renal/upper-tract consequences and the patient's goals."
      ],
      appUse:"Make the app's procedure-choice branch explicit about gland size/anatomy, retention/complications, sexual priorities and local expertise. Verify drug doses, contraindications and current procedural indications separately."
    },
    {
      id:"prostate-cancer", category:"Uro-oncology", title:"Prostate cancer: diagnosis through castration resistance",
      chapters:[
        [153,"Epidemiology, Etiology, and Prevention of Prostate Cancer",3334],
        [154,"Prostate Cancer Biomarkers",3353],
        [155,"Prostate Biopsy: Techniques and Imaging",3364],
        [156,"Pathology of Prostatic Neoplasia",3382],
        [157,"Diagnosis and Staging of Prostate Cancer",3390],
        [158,"Active Management Strategies for Localized Prostate Cancer",3398],
        [159,"Active Surveillance of Prostate Cancer",3417],
        [160,"Open Radical Prostatectomy",3431],
        [161,"Laparoscopic and Robotic-Assisted Radical Prostatectomy and Pelvic Lymphadenectomy",3449],
        [162,"Radiation Therapy for Prostate Cancer",3474],
        [163,"Focal Therapy of Prostate Cancer",3505],
        [164,"Treatment of Locally Advanced Prostate Cancer",3543],
        [165,"Management of Recurrent and Newly Metastatic Prostate Cancer",3562],
        [166,"Management of Castration-Resistant Prostate Cancer",3588]
      ],
      summary:[
        "Maintain a clear chain from PSA and risk assessment to MRI/biopsy, pathology and staging. Record ISUP Grade Group, pattern information, stage, PSA and relevant imaging consistently.",
        "Localized disease decisions require risk classification, life expectancy, comorbidity, patient preference and a balanced comparison of surveillance, surgery and radiation.",
        "Biochemical recurrence, hormone-sensitive metastatic disease, nonmetastatic CRPC and metastatic CRPC are distinct disease states; avoid collapsing them into one systemic-treatment branch.",
        "In advanced disease, prior androgen-receptor pathway inhibitor/taxane exposure, genomic findings, disease distribution, symptoms and treatment fitness influence sequencing."
      ],
      appUse:"Cross-check the ISUP calculator, risk grouping, staging fields, active-surveillance eligibility, RP/radiation options and separate recurrence/metastatic/CRPC pathways. Doses and sequencing must remain synced to current live guidelines and current drug approvals."
    },
    {
      id:"adrenal", category:"Adrenal & retroperitoneum", title:"Adrenal masses and adrenal surgery",
      chapters:[
        [140,"Retroperitoneal Tumors",2968],
        [145,"Surgical and Radiographic Anatomy of the Adrenals",3102],
        [146,"Pathophysiology, Evaluation, and Medical Management of Adrenal Disorders",3111],
        [147,"Surgery of the Adrenal Glands",3161]
      ],
      summary:[
        "Characterise adrenal lesions radiologically and assess hormone excess when clinically indicated before deciding on surveillance or intervention.",
        "Rule out pheochromocytoma before an invasive procedure when suspected; biochemical phenotype can materially change perioperative preparation and safety.",
        "The decision to operate and the operative approach depend on malignancy concern, hormonal status, size/imaging characteristics, patient fitness and appropriate specialist input."
      ],
      appUse:"Make biochemical work-up, preoperative optimisation and referral triggers explicit. Apply current endocrine/adrenal guidance because textbook chapter context alone does not define every work-up threshold."
    },
    {
      id:"trauma-drainage", category:"Emergency & perioperative urology", title:"Upper-tract obstruction, trauma and drainage",
      chapters:[
        [16,"Fundamentals of Upper Urinary Tract Drainage",199],
        [20,"Complications of Urologic Surgery",283],
        [93,"Management of Upper Urinary Tract Obstruction",1903],
        [94,"Upper Urinary Tract Trauma",1942],
        [125,"Genital and Lower Urinary Tract Trauma",2642]
      ],
      summary:[
        "Separate urgent decompression from definitive treatment and record the reason for urgency, infection status, renal impairment, anatomy and monitoring plan.",
        "In trauma, mechanism, haemodynamic status, imaging findings, associated injuries and urethral/bladder/renal injury pattern determine the immediate pathway.",
        "Drainage-device choice and timing should be linked to the clinical objective, anatomy, likely duration, infection risk and a documented removal/exchange plan."
      ],
      appUse:"Audit the emergency red flags, drainage route options, trauma grading fields, escalation notes and device tracking. Local protocols and current trauma guidance control urgent management."
    },
    {
      id:"pediatric", category:"Pediatric urology", title:"Selected pediatric urology foundations",
      chapters:[
        [32,"Embryology of the Human Genitourinary Tract",584],
        [35,"Urologic Evaluation of the Child",658],
        [36,"Pediatric Urogenital Imaging",672],
        [37,"Infection and Inflammation of the Pediatric Genitourinary Tract",696],
        [40,"Clinical and Urodynamic Evaluation of Lower Urinary Tract Dysfunction in Children",744],
        [54,"Management of Pediatric Kidney Stone Disease",1091],
        [56,"Hypospadias",1141],
        [57,"Etiology, Diagnosis, and Management of the Undescended Testis",1186]
      ],
      summary:[
        "Interpret investigations against age, growth, congenital anatomy, renal function and the consequences of radiation or anaesthesia; adult thresholds are not automatically transferable.",
        "For paediatric stones, infection, obstruction, stone burden, anatomy, metabolic risk and recurrence prevention all deserve explicit assessment.",
        "Hypospadias and undescended testis decisions are age- and anatomy-specific and should be made within paediatric urology expertise."
      ],
      appUse:"Keep pediatric pathways distinct from adult forms and calculators; use age-specific guideline thresholds and specialist referral criteria."
    }
  ];

  var ROUTE_TOPIC = {
    "Ca Prostate":"prostate-cancer",
    "Ca Bladder":"bladder-cancer",
    "UTUC":"utuc",
    "Ca Penis":"penis-cancer",
    "Ca Testis":"testis-cancer",
    "Ca Kidney":"renal-cancer",
    "Urethral Cancer":"urethral-cancer",
    "Adrenal / Neuroendocrine":"adrenal",
    "Urethral Stricture":"stricture",
    "BPH / Male LUTS":"bph",
    "Stone Disease":"stones"
  };
  var state = { query:"", category:"All topics", selected:"" };
  var view = null;
  var context = null;
  var CATEGORY_NAMES = ["All topics"].concat(Array.from(new Set(DATA.map(function(x){return x.category;}))));

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function(c) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }
  function getTopic(id) {
    return DATA.find(function(x){ return x.id === id; }) || DATA[0];
  }
  function chaptersHtml(topic) {
    return '<ol class="c13-chapters">' + topic.chapters.map(function(ch) {
      return '<li><span class="c13-ch-no">Ch ' + ch[0] + '</span><span class="c13-ch-name">' + esc(ch[1]) + '</span><span class="c13-page">p. ' + ch[2] + '</span></li>';
    }).join("") + "</ol>";
  }
  function topicHtml(topic) {
    return '<article class="c13-topic" id="c13-topic-' + esc(topic.id) + '">' +
      '<div class="c13-topic-head"><div><span class="c13-kicker">' + esc(topic.category) + '</span><h3>' + esc(topic.title) + '</h3><div class="c13-meta">' + topic.chapters.length + ' chapter references · printed page numbers</div></div>' +
      '<button class="c13-link" data-open-topic="' + esc(topic.id) + '" type="button">Open in focus</button></div>' +
      '<div class="c13-columns"><div><h4>13th-edition chapter map</h4>' + chaptersHtml(topic) + '</div><div><h4>Clinical synthesis for Oracle</h4><ul class="c13-bullets">' + topic.summary.map(function(s){return "<li>"+esc(s)+"</li>";}).join("") + '</ul><div class="c13-use"><b>Where this fits in Oracle</b><p>' + esc(topic.appUse) + '</p></div></div></div></article>';
  }
  function filteredTopics() {
    var q = state.query.trim().toLowerCase();
    return DATA.filter(function(topic) {
      if (state.category !== "All topics" && topic.category !== state.category) return false;
      if (!q) return true;
      var hay = [topic.title, topic.category, topic.summary.join(" "), topic.appUse,
        topic.chapters.map(function(ch){return ch[0]+" "+ch[1]+" "+ch[2];}).join(" ")].join(" ").toLowerCase();
      return hay.indexOf(q) !== -1;
    });
  }
  function renderIndex() {
    if (!view) return;
    var topics = filteredTopics();
    var content = '<div class="c13-header"><div><div class="c13-kicker">CAMPBELL-WALSH-WEIN · 13TH EDITION</div><h2>Clinical chapter reference</h2><p>Chapter-linked teaching summaries to support Oracle’s decision pathways. These are original clinical syntheses, not copied textbook passages.</p></div><div class="c13-head-actions"><button type="button" class="c13-button secondary" id="c13BackHome">Back to Oracle</button></div></div>' +
      '<div class="c13-safety"><b>Source hierarchy:</b> use Campbell 13e for clinical background and chapter context; use the current EAU/NCCN guidance, applicable drug labels, local protocols and MDT decision for treatment eligibility, dosing and sequencing. This module does not silently overwrite those pathways.</div>' +
      '<div class="c13-controls"><input id="c13Search" type="search" placeholder="Search disease, chapter title, number or concept…" value="' + esc(state.query) + '" aria-label="Search Campbell 13th edition chapters"><div class="c13-categories">' +
      CATEGORY_NAMES.map(function(cat){return '<button type="button" class="c13-chip '+(state.category===cat?'active':'')+'" data-category="'+esc(cat)+'">'+esc(cat)+'</button>';}).join("") +
      '</div></div><div class="c13-results"><div class="c13-result-count">Showing ' + topics.length + ' of ' + DATA.length + ' curated chapter groups</div>' +
      (topics.length ? topics.map(topicHtml).join("") : '<div class="c13-empty">No matching chapter group. Try a different search term.</div>') +
      '</div><div class="c13-footer">Bibliographic reference: Campbell-Walsh-Wein Urology, 13th edition, 3 volumes; Elsevier. Printed page numbers below follow the table of contents in the supplied PDF parts. Confirm exact passages in the source chapter before clinical implementation.</div>';
    view.innerHTML = content;
    var search = document.getElementById("c13Search");
    if (search) search.addEventListener("input", function(){ state.query = search.value; var pos = search.selectionStart; renderIndex(); var next = document.getElementById("c13Search"); if(next){next.focus();next.setSelectionRange(pos,pos);} });
    view.querySelectorAll("[data-category]").forEach(function(btn){
      btn.addEventListener("click", function(){ state.category = btn.getAttribute("data-category"); renderIndex(); });
    });
    view.querySelectorAll("[data-open-topic]").forEach(function(btn){
      btn.addEventListener("click", function(){ state.selected = btn.getAttribute("data-open-topic"); state.category = "All topics"; state.query = ""; openCampbell13(state.selected); });
    });
    var back = document.getElementById("c13BackHome");
    if (back) back.addEventListener("click", function(){ showHomeSafe(); });
  }
  function addStyles() {
    if (document.getElementById("c13-styles")) return;
    var style = document.createElement("style");
    style.id = "c13-styles";
    style.textContent = [
      "#campbell13View{max-width:1500px;margin:0 auto;padding:20px;color:#0f172a;}",
      ".c13-header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;padding:20px 22px;background:#0f2335;border-radius:18px;color:#f8fafc;}",
      ".c13-header h2{font-size:clamp(22px,3vw,32px);line-height:1.15;font-weight:900;margin:5px 0 8px;}",
      ".c13-header p{font-size:13px;line-height:1.6;color:#cbd5e1;margin:0;max-width:820px;}",
      ".c13-kicker{font-size:10px;letter-spacing:.12em;font-weight:900;color:#0f766e;text-transform:uppercase;}",
      ".c13-header .c13-kicker{color:#5eead4;}",
      ".c13-button,.c13-link{border:1px solid #cbd5e1;background:white;border-radius:9px;padding:9px 12px;font-weight:800;font-size:12px;cursor:pointer;color:#0f172a;}",
      ".c13-button.secondary{background:#173449;border-color:#476176;color:white;white-space:nowrap;}",
      ".c13-safety{margin:12px 0;border:1px solid #cbd5e1;background:#f8fafc;border-radius:12px;padding:12px 14px;font-size:12px;line-height:1.6;color:#334155;}",
      ".c13-controls{margin:12px 0 18px;padding:14px;background:white;border:1px solid #dbe4e8;border-radius:14px;}",
      ".c13-controls input{width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:10px;font-size:14px;background:#fff;color:#0f172a;}",
      ".c13-categories{display:flex;flex-wrap:wrap;gap:7px;margin-top:11px;}",
      ".c13-chip{border:1px solid #cbd5e1;background:#fff;color:#334155;padding:7px 10px;border-radius:999px;font-size:11px;font-weight:800;cursor:pointer;}",
      ".c13-chip.active{background:#0f766e;border-color:#0f766e;color:#fff;}",
      ".c13-result-count{font-size:11px;color:#64748b;margin:0 0 8px;font-weight:800;}",
      ".c13-topic{background:#fff;border:1px solid #dbe4e8;border-radius:15px;margin:0 0 12px;overflow:hidden;}",
      ".c13-topic-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;background:#f8fafc;border-bottom:1px solid #e2e8f0;}",
      ".c13-topic h3{margin:4px 0 4px;font-size:17px;font-weight:900;line-height:1.25;}",
      ".c13-meta{font-size:10px;color:#64748b;}",
      ".c13-link{color:#0f766e;border-color:#99f6e4;white-space:nowrap;}",
      ".c13-columns{display:grid;grid-template-columns:minmax(240px,.9fr) minmax(300px,1.4fr);gap:18px;padding:16px;}",
      ".c13-columns h4{font-size:11px;text-transform:uppercase;letter-spacing:.06em;font-weight:900;color:#0f766e;margin:0 0 8px;}",
      ".c13-chapters{margin:0;padding:0;list-style:none;}",
      ".c13-chapters li{display:grid;grid-template-columns:48px 1fr 45px;gap:8px;padding:7px 0;border-bottom:1px solid #edf2f7;font-size:11px;line-height:1.4;}",
      ".c13-ch-no{font-weight:900;color:#0f766e;}.c13-page{text-align:right;color:#64748b;white-space:nowrap;}",
      ".c13-bullets{padding-left:18px;margin:0;}.c13-bullets li{font-size:12px;line-height:1.58;color:#334155;margin:0 0 7px;}",
      ".c13-use{margin-top:12px;background:#f0fdfa;border-left:3px solid #0f766e;border-radius:7px;padding:10px 12px;font-size:11px;line-height:1.55;color:#334155;}.c13-use p{margin:4px 0 0;}",
      ".c13-empty{border:1px dashed #cbd5e1;padding:24px;text-align:center;border-radius:12px;color:#64748b;background:white;}",
      ".c13-footer{font-size:10px;line-height:1.5;color:#64748b;margin:18px 2px 5px;}",
      "#campbell13OracleContext{margin-top:14px;border:1px solid #99f6e4;background:#f0fdfa;border-radius:14px;padding:14px;}",
      "#campbell13OracleContext h3{font-weight:900;font-size:15px;margin:4px 0 6px;color:#134e4a;}",
      "#campbell13OracleContext p,#campbell13OracleContext li{font-size:11px;line-height:1.55;color:#334155;}",
      ".c13-context-chapters{display:flex;flex-wrap:wrap;gap:6px;margin:7px 0 9px;}",
      ".c13-context-chapters button{border:1px solid #99f6e4;background:white;color:#115e59;border-radius:8px;padding:5px 7px;font-size:10px;font-weight:800;cursor:pointer;}",
      "@media(max-width:760px){.c13-header{display:block}.c13-head-actions{margin-top:14px}.c13-columns{grid-template-columns:1fr}.c13-topic-head{align-items:flex-start}.c13-link{font-size:10px;padding:7px}.c13-chapters li{grid-template-columns:44px 1fr 38px;gap:6px}}"
    ].join("");
    document.head.appendChild(style);
  }
  function showHomeSafe() {
    if (typeof window.showHome === "function") window.showHome();
    document.querySelectorAll("section[id$='View']").forEach(function(el){el.classList.add("hidden");});
    var home = document.getElementById("homeView");
    if (home) home.classList.remove("hidden");
  }
  function openCampbell13(topicId) {
    addStyles();
    if (!view) buildView();
    if (topicId) {
      state.selected = topicId;
      var item = getTopic(topicId);
      state.category = item.category;
      state.query = "";
    }
    if (typeof window.showHome === "function") {
      // Keep the app's established view state, then open the source index.
      window.showHome();
    } else {
      document.querySelectorAll("section[id$='View']").forEach(function(el){el.classList.add("hidden");});
    }
    document.querySelectorAll("section[id$='View']").forEach(function(el){el.classList.add("hidden");});
    view.classList.remove("hidden");
    renderIndex();
    if (state.selected) {
      var target = document.getElementById("c13-topic-" + state.selected);
      if (target) target.scrollIntoView({behavior:"smooth",block:"start"});
    } else {
      view.scrollIntoView({behavior:"smooth",block:"start"});
    }
  }
  function buildView() {
    if (document.getElementById("campbell13View")) { view = document.getElementById("campbell13View"); return; }
    view = document.createElement("section");
    view.id = "campbell13View";
    view.className = "hidden";
    var parent = document.querySelector("main") || document.body;
    parent.appendChild(view);
  }
  function chapterButtons(topic) {
    return '<div class="c13-context-chapters">' + topic.chapters.map(function(ch){
      return '<button type="button" data-c13-jump="' + esc(topic.id) + '">Ch ' + ch[0] + ' · p. ' + ch[2] + '</button>';
    }).join("") + '</div>';
  }
  function updateOracleContext() {
    if (!context) return;
    var sel = document.getElementById("oracleDisease");
    var name = sel ? sel.value : "";
    var id = ROUTE_TOPIC[name];
    var topic = id ? getTopic(id) : getTopic("foundations");
    var heading = id ? topic.title : "Clinical foundations and investigation";
    context.innerHTML = '<div class="c13-kicker">Campbell-Walsh-Wein · 13th edition</div><h3>' + esc(heading) + '</h3><p>Relevant chapter context for <b>' + esc(name || "the current pathway") + '</b>. These references enrich the existing pathway; they do not replace the current EAU/NCCN treatment rules, drug-label checks or local protocol.</p>' +
      chapterButtons(topic) + '<button class="c13-link" type="button" id="c13OpenFromOracle">Open chapter synthesis</button>';
    context.querySelectorAll("[data-c13-jump]").forEach(function(btn){
      btn.addEventListener("click", function(){openCampbell13(btn.getAttribute("data-c13-jump"));});
    });
    var open = document.getElementById("c13OpenFromOracle");
    if (open) open.addEventListener("click", function(){openCampbell13(topic.id);});
  }
  function addHomeEntry() {
    var actions = document.querySelector("#v10BookHome .v10-actions");
    if (actions && !document.getElementById("c13HomeButton")) {
      var btn = document.createElement("button");
      btn.id = "c13HomeButton";
      btn.type = "button";
      btn.className = "v10-btn light";
      btn.textContent = "Campbell 13e chapter index";
      btn.addEventListener("click", function(){openCampbell13();});
      actions.appendChild(btn);
    }
    if (!actions) {
      var home = document.getElementById("homeView");
      if (home && !document.getElementById("c13HomeButton")) {
        var btn2 = document.createElement("button");
        btn2.id = "c13HomeButton";
        btn2.type = "button";
        btn2.className = "px-4 py-3 rounded-xl border bg-white text-sm font-bold";
        btn2.textContent = "Campbell 13e chapter index";
        btn2.addEventListener("click", function(){openCampbell13();});
        home.insertBefore(btn2, home.firstChild);
      }
    }
  }
  function init() {
    addStyles();
    buildView();
    var oracle = document.getElementById("oracleView");
    if (oracle && !document.getElementById("campbell13OracleContext")) {
      context = document.createElement("div");
      context.id = "campbell13OracleContext";
      var grid = oracle.querySelector(".oracle-grid");
      if (grid && grid.parentNode) grid.insertAdjacentElement("afterend", context);
      else oracle.appendChild(context);
    } else {
      context = document.getElementById("campbell13OracleContext");
    }
    var sel = document.getElementById("oracleDisease");
    if (sel) {
      sel.addEventListener("change", updateOracleContext);
      updateOracleContext();
    }
    var run = document.getElementById("oracleRunBtn");
    if (run) run.addEventListener("click", function(){setTimeout(updateOracleContext, 0);});
    addHomeEntry();
    // The home card is built by the existing app during DOMContentLoaded.
    document.addEventListener("DOMContentLoaded", addHomeEntry, {once:true});
    if (typeof MutationObserver !== "undefined") {
      var obsTarget = document.getElementById("homeView");
      if (obsTarget) new MutationObserver(function(){addHomeEntry();}).observe(obsTarget, {childList:true,subtree:true});
    }
    window.URO_CAMPBELL13 = {
      edition:"13th edition",
      chapterGroups:DATA.length,
      mappedClinicalRoutes:Object.keys(ROUTE_TOPIC),
      source:"Campbell-Walsh-Wein Urology, 13th edition",
      open:openCampbell13
    };
  }
  window.openCampbell13 = openCampbell13;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();