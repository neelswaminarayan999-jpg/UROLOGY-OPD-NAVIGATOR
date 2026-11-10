/* Clinical content (V16). Plain data: diseases, addenda, drugs, trials, procedures, protocols. */


/* V16: source registry. Every disease section names its sources (keys below) and the date it was last reviewed. */
const SOURCES = {
 "EAU-PCa":{name:"EAU Prostate Cancer guideline 2026",url:"https://uroweb.org/guidelines/prostate-cancer"},
 "EAU-NMIBC":{name:"EAU NMIBC guideline 2026",url:"https://uroweb.org/guidelines/non-muscle-invasive-bladder-cancer"},
 "EAU-MIBC":{name:"EAU Muscle-invasive & metastatic bladder cancer guideline 2026",url:"https://uroweb.org/guidelines/muscle-invasive-and-metastatic-bladder-cancer"},
 "EAU-UTUC":{name:"EAU Upper tract urothelial carcinoma guideline 2026",url:"https://uroweb.org/guidelines/upper-urinary-tract-urothelial-cell-carcinoma"},
 "EAU-RCC":{name:"EAU Renal cell carcinoma guideline 2026",url:"https://uroweb.org/guidelines/renal-cell-carcinoma"},
 "EAU-Penile":{name:"EAU-ASCO Penile cancer guideline 2026",url:"https://uroweb.org/guidelines/penile-cancer"},
 "EAU-Testis":{name:"EAU Testicular cancer guideline 2026",url:"https://uroweb.org/guidelines/testicular-cancer"},
 "EAU-Urethral":{name:"EAU Primary urethral carcinoma guideline 2026",url:"https://uroweb.org/guidelines/primary-urethral-carcinoma"},
 "ESE-Adrenal":{name:"ESE/ENSAT adrenal incidentaloma guideline 2023",url:"https://doi.org/10.1530/EJE-23-0264"},
 "ESE-ACC":{name:"ESE/ENSAT adrenocortical carcinoma guideline 2018",url:"https://doi.org/10.1530/EJE-18-0608"},
 "NCCN":{name:"NCCN Guidelines (verify current version)",url:"https://www.nccn.org/guidelines/category_1"},
 "TNM9":{name:"UICC TNM Classification, 9th edition (2025) / AJCC 8th",url:"https://www.uicc.org/resources/tnm"},
 "WHO2022":{name:"WHO Classification of Urinary and Male Genital Tumours, 5th ed. (2022)",url:"https://tumourclassification.iarc.who.int/"},
 "ISUP":{name:"ISUP 2019 / GUPS consensus on prostate cancer grading",url:"https://doi.org/10.1097/PAS.0000000000001497"},
 "Bosniak2019":{name:"Bosniak classification v2019 (Silverman et al., Radiology)",url:"https://doi.org/10.1148/radiol.2019182646"},
 "IGCCCG2021":{name:"IGCCCG update 2021 (J Clin Oncol)",url:"https://doi.org/10.1200/JCO.20.03292"},
 "Labels":{name:"FDA / EMA product labels and approvals",url:"https://www.accessdata.fda.gov/scripts/cder/daf/"}
};

const META = {
  lastVerified: "2026-11-10",
  guidelineBaseline: {
    EAU: {
      prostate:"2026", bladderNMIBC:"2026", bladderMIBC:"2026", UTUC:"2026", RCC:"2026", penis:"2026", testis:"2026"
    },
    NCCN: {
      prostate:"6.2026 (verify live)", bladder:"2026 (verify live)", kidney:"1.2026 (verify live)", penile:"2.2026", testicular:"2.2026"
    }
  },
  sources: [
    {name:"EAU Prostate Cancer 2026",url:"https://uroweb.org/guidelines/prostate-cancer"},
    {name:"EAU NMIBC 2026",url:"https://uroweb.org/guidelines/non-muscle-invasive-bladder-cancer"},
    {name:"EAU MIBC 2026",url:"https://uroweb.org/guidelines/muscle-invasive-and-metastatic-bladder-cancer"},
    {name:"FDA MIBC EV + pembrolizumab — 10 Jul 2026",url:"https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-pembrolizumab-or-pembrolizumab-and-berahyaluronidase-alfa-pmph-each-with-enfortumab-vedotin"},
    {name:"EAU UTUC 2026",url:"https://uroweb.org/guidelines/upper-urinary-tract-urothelial-cell-carcinoma"},
    {name:"EAU RCC 2026",url:"https://uroweb.org/guidelines/renal-cell-carcinoma"},
    {name:"EAU Penile Cancer 2026",url:"https://uroweb.org/guidelines/penile-cancer"},
    {name:"EAU Testicular Cancer 2026",url:"https://uroweb.org/guidelines/testicular-cancer"},
    {name:"NCCN",url:"https://www.nccn.org/guidelines/guidelines-detail"},
    {name:"NCCN prostate guideline PDF",url:"https://www.nccn.org/professionals/physician_gls/pdf/prostate.pdf"},
    {name:"NCCN bladder guideline PDF",url:"https://www.nccn.org/professionals/physician_gls/pdf/bladder.pdf"},
    {name:"NCCN kidney guideline PDF",url:"https://www.nccn.org/professionals/physician_gls/pdf/kidney.pdf"},
    {name:"NCCN penile guideline PDF",url:"https://www.nccn.org/professionals/physician_gls/pdf/penile.pdf"},
    {name:"NCCN testicular guideline PDF",url:"https://www.nccn.org/professionals/physician_gls/pdf/testicular.pdf"}
  ]
};

const DISEASES = {
"Ca Prostate":{sources:["EAU-PCa", "NCCN"],
  emoji:"🧬", color:"sky", tagline:"Localized • regional • BCR • mHSPC • nmCRPC • mCRPC",
  sections:[
   {title:"1. Diagnostic pathway",src:["EAU-PCa", "NCCN"],verified:"2026-11-10",items:[
    ["Core work-up","PSA → repeat PSA when appropriate → DRE → mpMRI before biopsy in suspected organ-confined disease → MRI-targeted biopsy (plus perilesional sampling for PI-RADS ≥4) with systematic cores according to pathway; stage higher-risk disease with appropriate cross-sectional/bone/PSMA-PET imaging when it changes management."],
    ["MRI performance","EAU 2026 reports pooled mpMRI sensitivity 0.91 and specificity 0.37 for ISUP GG≥2 in biopsy-naïve/prior-negative settings; for ISUP GG≥3 sensitivity 0.95 and specificity 0.35. PI-RADS v2.1 patient-level detection of GG≥2 was approximately 6%, 6%, 20%, 55%, 83% for PI-RADS 1–5 in a cited meta-analysis."],
    ["PI-RADS × PSA density","EAU 2026 risk-adapted table: PI-RADS 1–2 with PSA-D <0.20 can often avoid biopsy when clinical suspicion is low; PI-RADS 4–5 → biopsy. For PI-RADS 3, PSA-D <0.10 is a very-low-risk setting for considering surveillance rather than biopsy; higher PSA-D increases csPCa risk."],
    ["Genetics / tissue","For clinically significant/high-risk disease, assess hereditary risk. Germline testing is particularly relevant with multiple affected relatives, early deaths, high-risk germline family history or somatic BRCA mutation; somatic HRR testing becomes important in advanced disease. Always document family history and the exact tissue tested."]
   ]},
   {title:"2. Histology • ISUP • pathology",src:["EAU-PCa", "NCCN", "WHO2022", "ISUP"],verified:"2026-11-10",items:[
    ["Common subtype","Acinar adenocarcinoma is the dominant phenotype. Ductal adenocarcinoma, mucinous/colloid, and rare neuroendocrine, small-cell, large-cell, amphicrine, adenosquamous/squamous, sarcomatoid, pleomorphic giant-cell and basal-cell/adenoid-cystic carcinomas require variant-specific interpretation."],
    ["ISUP Grade Group","GG1 = Gleason 3+3; GG2 = 3+4; GG3 = 4+3; GG4 = 4+4 or 3+5 or 5+3; GG5 = 4+5, 5+4 or 5+5."],
    ["Biopsy Gleason rules","Primary pattern = most extensive pattern; secondary = second most common. If only one pattern is present, double it. When 3 patterns are present on biopsy, score the most common + highest grade regardless of extent. Cribriform/intraductal carcinoma intermixed with invasive cancer is incorporated according to underlying architecture."],
    ["Radical prostatectomy reporting","Record overall GS/GG, pattern 4 percentage, cribriform/IDC, tertiary pattern 5, pT stage, EPE, SVI, margins, LVI/PNI, nodes, nodal burden and extranodal extension. A tertiary pattern 5 can materially alter grade interpretation and risk; do not reduce it to a simple arithmetic calculator."],
    ["Rare aggressive histology","Neuroendocrine transformation may be small-cell, large-cell or amphicrine and is often seen in CRPC. These subtypes have limited sensitivity to conventional ADT and should prompt expert pathology review and lineage-appropriate therapy." ]
   ]},
   {title:"3. TNM staging & risk",src:["EAU-PCa", "NCCN", "TNM9"],verified:"2026-11-10",items:[
    ["T category (UICC TNM 9 = AJCC 8)","cT1a incidental in ≤5% of resected tissue; cT1b incidental in >5%; cT1c found on needle biopsy (e.g. raised PSA); cT2a ≤ half of one lobe; cT2b > half of one lobe; cT2c both lobes; cT3a extraprostatic extension (uni/bilateral) incl. microscopic bladder-neck invasion; cT3b seminal-vesicle invasion; cT4 fixed or invading adjacent structures other than seminal vesicles (external sphincter, rectum, bladder, levator muscles, pelvic wall). Pathological pT2 is not sub-divided. Clinical T is based on DRE; record MRI-derived EPE/SVI separately. TNM 9 notes stage migration when MRI or PSMA PET replaces palpation/conventional imaging, so record miTNM (PSMA-based) separately."],
    ["N / M","N1 = regional (true pelvic) node metastasis. M1a = non-regional lymph nodes; M1b = bone(s); M1c = other sites ± bone (e.g. visceral)."],
    ["NCCN localized risk","2026 NCCN moved away from a separate very-low-risk group. Risk assessment uses PSA, Grade Group, T category and tumor burden/cores; clinically meaningful categories include low, favorable-intermediate, unfavorable-intermediate, high and very-high risk. Use the current NCCN table rather than a legacy 3-tier shortcut."],
    ["EAU 2026 risk groups","Low: ISUP GG1 + PSA <10 + cT1–2. Favourable intermediate: GG2 + PSA <10, or GG1 + PSA 10–20 (cT1–2). Unfavourable intermediate: GG2 + PSA 10–20, or GG3 (cT1–2). High: GG4–5 or PSA >20. Locally advanced: cT3–4 and/or cN+, any GG, any PSA. The 2026 table no longer separates cT2b/cT2c; the EAU treatment algorithm still lists cT2c under high-risk localised disease, so review cT2c at MDT."],
    ["Pathologic prognostic factors","Cribriform/IDC, percentage pattern 4, EPE, SVI, positive margins, nodal burden, genomic alterations and treatment context can change management even when the headline GG is unchanged."]
   ]},
   {title:"4. Localized / locally advanced treatment",src:["EAU-PCa", "NCCN", "Labels"],verified:"2026-11-10",items:[
    ["Low risk (NCCN 2026 merged very-low into low)","Use shared decision-making with life expectancy. Active surveillance is a curative-intent strategy for appropriately selected low-risk and selected favorable-intermediate disease; watchful waiting is palliative/conservative management for limited life expectancy."],
    ["Favorable intermediate","Options can include AS in selected men, radical prostatectomy, external-beam RT, or brachytherapy-based approaches depending on burden, anatomy and life expectancy. Avoid making focal therapy the default standard."],
    ["Unfavorable intermediate","Definitive local therapy with RP ± ePLND or RT plus short-course ADT is typical. RT approaches may combine EBRT and/or brachytherapy in selected men."],
    ["High / very-high risk","Multimodality treatment: RP with appropriate nodal staging in selected fit men, or definitive RT with long-course ADT. Intensification with an AR-pathway agent is increasingly incorporated in selected high-risk/locally advanced pathways; use the current guideline criteria, not a generic 'ADT for everyone' rule."],
    ["Surgery","Robot/open RP should document nerve-sparing decision, bladder neck, apical dissection, margins and lymph-node template. ePLND is used when nodal risk crosses the guideline threshold; it is primarily staging and should not be performed indiscriminately."],
    ["Radiotherapy","Modern EBRT generally uses image-guided, intensity-modulated techniques; dose/fractionation should come from the RT protocol. Brachytherapy boost is a selected high-risk option rather than a universal requirement."]
   ]},
   {title:"5. Biochemical recurrence / salvage",src:["EAU-PCa", "NCCN"],verified:"2026-11-10",items:[
    ["After RP","EAU notes that detectable PSA after RP must be differentiated from clinically meaningful relapse; treat based on PSA kinetics, pathology, prior local therapy and imaging. Salvage RT is most useful while PSA is low rather than waiting for bulky disease."],
    ["After RT","Phoenix definition = PSA nadir + 2 ng/mL. Restage with PSMA PET/CT when results will change treatment."],
    ["Salvage intensification","Selected patients with adverse pathology/high PSA kinetics may need ADT with salvage RT; nodal or oligometastatic recurrence can require targeted local therapy plus systemic treatment in an MDT setting."]
   ]},
   {title:"6. mHSPC • doublet • triplet • emerging biomarker-driven therapy",src:["EAU-PCa", "NCCN", "Labels"],verified:"2026-11-10",items:[
    ["Backbone","Continuous ADT remains the backbone of metastatic hormone-sensitive disease. For impending spinal cord compression/ureteral obstruction or severe symptomatic disease, a rapid castration strategy is preferred; avoid LHRH agonist flare where clinically dangerous."],
    ["ARPI doublets","Abiraterone + ADT (LATITUDE/STAMPEDE), enzalutamide + ADT (ENZAMET/ARCHES), apalutamide + ADT (TITAN), darolutamide + ADT and other approved ARPI strategies are guideline-based options selected according to patient/disease factors."],
    ["Docetaxel","Docetaxel 75 mg/m² IV every 3 weeks for 6 cycles can be combined with ADT, with current guidelines generally preferring ARPI + docetaxel triplet regimens for patients fit for chemotherapy where criteria are met."],
    ["Triplet therapy","ARASENS = ADT + docetaxel + darolutamide. PEACE-1 = ADT + docetaxel + abiraterone/prednisone, with prostate RT studied in defined low-volume disease. The decision is not simply 'high-volume = triplet': disease volume, timing, fitness and prior therapy matter."],
    ["Biomarker-directed mHSPC (2025–26)","Test HRR genes (germline + somatic), PTEN and PSMA PET where they change treatment. FDA-approved: talazoparib + enzalutamide for HRR-mutated disease (TALAPRO-3, Oct 2026); niraparib + abiraterone for BRCA2-mutated disease (AMPLITUDE, Dec 2025; also in EAU 2026); capivasertib + abiraterone for PTEN-deficient disease (CAPItello-281, Jun 2026); Lu-177 PSMA-617 + ARPI for PSMA-positive disease (PSMAddition, Jul 2026). Check EAU recommendation strength and local approval before use."],
    ["Prostate RT in M1","For men presenting with low-volume metastatic disease, prostate-directed RT remains a guideline-supported option in combination with systemic therapy."]
   ]},
   {title:"7. nmCRPC • mCRPC",src:["EAU-PCa", "NCCN", "Labels"],verified:"2026-11-10",items:[
    ["nmCRPC","Continue ADT. For M0 CRPC at high risk of metastasis (classically PSA-DT <10 months), ARPI options include darolutamide, apalutamide or enzalutamide."],
    ["mCRPC principle","Maintain castrate testosterone and select therapy according to prior ARPI/taxane exposure, visceral disease, symptoms, PSMA expression and molecular profile."],
    ["PARP inhibitors","Biomarker- and prior-treatment-dependent. Olaparib after ARPI in HRR-mutated mCRPC (PROfound); first-line mCRPC combinations: olaparib + abiraterone (PROpel, BRCA-mutated per FDA), niraparib + abiraterone (MAGNITUDE, BRCA), talazoparib + enzalutamide (TALAPRO-2, HRR-mutated). Avoid repeating a PARP inhibitor already given in mHSPC."],
    ["Radioligand","Lu-177 PSMA-617 7.4 GBq IV every 6 weeks × 6 for PSMA-positive mCRPC after ARPI and taxane (VISION) or after one ARPI when delaying taxane is appropriate (PSMAfore, FDA Mar 2025); now also with an ARPI in mHSPC (PSMAddition)."],
    ["Taxane sequencing","CARD supports cabazitaxel after docetaxel + an ARPI when the clinical scenario fits. Docetaxel/cabazitaxel dosing must follow current label and prior-toxicity criteria."],
    ["Neuroendocrine transformation","If progression is discordant with PSA, rapid visceral progression or lineage shift is suspected, obtain biopsy of a progressing lesion when feasible and treat the emerging phenotype rather than continuing an ineffective AR pathway strategy."]
   ]},
   {title:"8. Trials you should recognize",src:["EAU-PCa", "NCCN"],verified:"2026-11-10",items:[
    ["Diagnostics / AS","PRECISION, PRECISION-PC, FUTURE, MRI-FIRST, MR PROPER, ProtecT, PROTECT/AS literature."],
    ["Localized intensification","ProtecT; modern RT/RP comparative datasets; focal-therapy studies remain distinct from guideline-standard whole-gland definitive therapy."],
    ["mHSPC","CHAARTED, STAMPEDE, LATITUDE, TITAN, ENZAMET, ARCHES, ARASENS, ARANOTE, PEACE-1 (incl. prostate RT), AMPLITUDE, CAPItello-281, TALAPRO-3, PSMAddition."],
    ["BCR / high-risk","EMBARK and contemporary salvage-RT trials/series."],
    ["mCRPC","PROfound, MAGNITUDE, TALAPRO-2, VISION, TheraP, CARD, PREVAIL, AFFIRM, COU-AA studies." ]
   ]},
   {title:"9. Follow-up / supportive care",src:["EAU-PCa", "NCCN"],verified:"2026-11-10",items:[
    ["After curative therapy","At minimum history + PSA; image at recurrence only when it affects treatment planning. Use modality-specific surveillance schedules rather than a one-size-fits-all calendar."],
    ["During ADT","Monitor response, testosterone when CRPC is considered, metabolic effects, bone health, cardiovascular risk and treatment-specific toxicities. EAU recommends attention to weight, diabetes/lipid screening and bone-protective measures where indicated."],
    ["ADT bone health","Assess fracture risk/BMD when appropriate, use calcium/vitamin D to meet recommended intake, and select denosumab/bisphosphonate according to indication and renal/dental considerations."]
   ]}
  ]
},
"Ca Bladder":{sources:["EAU-NMIBC", "EAU-MIBC", "NCCN"],
 emoji:"🫧",color:"indigo",tagline:"NMIBC • MIBC • nodal disease • metastatic urothelial carcinoma",
 sections:[
  {title:"1. Diagnostic pathway",src:["EAU-NMIBC", "EAU-MIBC"],verified:"2026-11-10",items:[
   ["Hematuria work-up","Cystoscopy remains central. Upper-tract imaging is selected according to risk/presentation; CT urography is preferred in many high-risk hematuria pathways. Record tumour number, site, size, morphology and completeness."],
   ["TURBT quality","Resect visible tumour and obtain detrusor muscle where required. Send tumour fractions/base separately when appropriate. Pathology should report stage, grade, CIS, LVI, variant histology and detrusor muscle."],
   ["Second TURBT","EAU 2026: after incomplete resection/doubt about completeness; if detrusor muscle is absent (except selected Ta LG/G1 or primary CIS situations); or for T1 tumours. When indicated, perform within 2–6 weeks."],
   ["Urine cytology","Most useful for high-grade disease/CIS. Cytology has high specificity for HGUC; a positive cytology with negative cystoscopy triggers evaluation of bladder CIS, upper tract and prostatic urethra."],
   ["Molecular / biomarker use","Do not let a urinary biomarker replace cystoscopy as the primary diagnostic test. Molecular testing has expanding roles in molecular residual disease and selected systemic/targeted therapy contexts."]
  ]},
  {title:"2. Histological subtypes & grading",src:["EAU-NMIBC", "EAU-MIBC", "WHO2022"],verified:"2026-11-10",items:[
   ["Urothelial carcinoma","Pure urothelial carcinoma is the canonical pathway. Report papillary architecture, CIS, grade, depth and variant differentiation."],
   ["Important variants","Micropapillary, plasmacytoid/signet-ring-like, sarcomatoid, nested, glandular, squamous, lymphoepithelioma-like, neuroendocrine/small-cell and trophoblastic differentiation can alter risk and treatment."],
   ["Non-urothelial carcinomas","Squamous carcinoma and adenocarcinoma require histology-specific management; urachal adenocarcinoma follows a separate urachal pathway. Small-cell/neuroendocrine disease generally requires systemic therapy and multimodality planning."],
   ["WHO grade","Modern pathology uses WHO 2004/2016/2022 low-grade vs high-grade frameworks; historic WHO 1973 G1–G3 remains relevant for older risk calculators such as EORTC/CUETO."]
  ]},
  {title:"3. NMIBC risk & treatment",src:["EAU-NMIBC"],verified:"2026-11-10",items:[
   ["EAU 2026 risk groups","Four-group EAU risk stratification: low, intermediate, high, very high. Very-high-risk features include selected high-grade/T1/CIS combinations, plus LVI, CIS in the prostatic urethra and selected aggressive variant histologies."],
   ["Low risk","Complete TURBT followed by a single immediate intravesical chemotherapy instillation when safe/indicated."],
   ["Intermediate risk","Repeat TURBT when indicated, then adjuvant chemotherapy and/or BCG according to recurrence/progression risk and patient factors."],
   ["High risk","Full-dose BCG induction + maintenance for 1–3 years is the standard bladder-preserving strategy. In BCG-naïve high-risk disease, adding durvalumab (POTOMAC; FDA May 2026: 1500 mg q4w × 13 with BCG induction + maintenance) or sasanlimab (CREST) can be discussed: both improved DFS, with more immune toxicity. Discuss early radical cystectomy in very-high-risk disease and selected variant histology."],
   ["BCG schedule","Induction = weekly × 6. Maintenance (SWOG) = weekly × 3 at months 3, 6, 12, 18, 24, 30 and 36: 1 year for intermediate risk, 1–3 years for high risk. During BCG shortage, prioritise high-risk patients and use the local reduced-dose/frequency protocol."],
   ["BCG-unresponsive","Further BCG is generally not appropriate. Radical cystectomy is the standard/preferred oncologic option; bladder-preserving options are selected according to guideline/approval/trial status and include intravesical gene therapy, N-803 + BCG, TAR-200 and systemic pembrolizumab in defined settings."]
  ]},
  {title:"4. NMIBC risk calculators",src:["EAU-NMIBC"],verified:"2026-11-10",items:[
   ["EORTC 2006","Uses number of tumours, tumour size, prior recurrence rate, T category, CIS and WHO 1973 grade to predict recurrence/progression in patients not treated with BCG."],
   ["CUETO","BCG-treated model using sex, age, recurrence status, tumour number, T category, CIS and WHO 1973 grade; separate recurrence and progression score structures."],
   ["EAU 2021 model","Uses age >70, primary/recurrent status, multiplicity, size ≥3 cm, Ta/T1, CIS and WHO 2004/2016 or 1973 grading. EAU online calculator remains the preferred implementation reference."]
  ]},
  {title:"5. MIBC staging & local therapy",src:["EAU-MIBC", "TNM9"],verified:"2026-11-10",items:[
   ["TNM","Ta non-invasive papillary; Tis CIS; T1 lamina propria; T2a/b inner/outer muscle; T3a microscopic perivesical tissue and T3b macroscopic; T4a invades prostatic stroma, seminal vesicles, uterus or vagina; T4b pelvic or abdominal wall. N1 single node in the true pelvis (hypogastric, obturator, external iliac or presacral); N2 multiple true-pelvic nodes; N3 common iliac node(s). M1a non-regional lymph nodes; M1b other distant metastases. UICC TNM 9 made no changes to bladder T, N, M or stage."],
   ["Standard curative route","Fit cT2–T4a N0M0 patients: radical cystectomy + pelvic lymph-node dissection with perioperative systemic therapy according to eligibility."],
   ["Neoadjuvant / perioperative systemic therapy","Cisplatin-based chemotherapy remains a major standard backbone. EAU 2026 incorporates perioperative gemcitabine/cisplatin + durvalumab for cisplatin-eligible MIBC (NIAGARA), and EV + pembrolizumab for cisplatin-ineligible MIBC (KEYNOTE-905/EV-303). In July 2026 the FDA extended perioperative EV + pembrolizumab to cisplatin-eligible patients after KEYNOTE-B15/EV-304 showed better EFS (HR 0.53) and OS than neoadjuvant gemcitabine/cisplatin."],
   ["Adjuvant","Adjuvant nivolumab (CheckMate 274) for high-risk pathology (ypT2–4 or ypN+ after NAC; pT3–4 or pN+ without NAC) when no perioperative immunotherapy was given. ctDNA-guided adjuvant atezolizumab (IMvigor011; FDA May 2026) for patients with molecular residual disease on serial ctDNA testing, 1680 mg q4w up to 1 year."],
   ["Bladder preservation","Selected patients with favourable tumour factors and the ability to undergo maximal TURBT can receive trimodality therapy (maximal TURBT + radiosensitizing systemic therapy + definitive RT) in an MDT."]
  ]},
  {title:"6. Metastatic urothelial carcinoma",src:["EAU-MIBC", "Labels"],verified:"2026-11-10",items:[
   ["First-line","EV + pembrolizumab is a major current first-line standard after EV-302/KEYNOTE-A39 for advanced urothelial carcinoma. Platinum chemotherapy remains relevant when EV + P is unsuitable/ineligible."],
   ["Maintenance","After response/stable disease following 4–6 cycles of platinum combination therapy, maintenance avelumab is established by JAVELIN Bladder 100."],
   ["FGFR","FGFR3 alterations can identify patients for erdafitinib in appropriate lines/settings; test molecular status before late-line therapy."],
   ["HER2","EAU 2026 adds HER2 IHC testing to select patients for trastuzumab deruxtecan; IHC 3+ supports use, while IHC 2+ may be considered in selected circumstances."],
   ["What changed","Sacituzumab govitecan is not a routine recommendation after the negative TROPiCS-04 result and regulatory withdrawal of the accelerated indication."]
  ]},
  {title:"7. Trials",src:["EAU-NMIBC", "EAU-MIBC"],verified:"2026-11-10",items:[
   ["NMIBC","SWOG 8507 (BCG maintenance), CUETO, POTOMAC, CREST, KEYNOTE-057, QUILT-3032, SunRISe-1, THOR-2, Nadofaragene phase III."],
   ["MIBC perioperative","SWOG 8710, VESPER, CheckMate 274, AMBASSADOR, NIAGARA, KEYNOTE-905/EV-303, KEYNOTE-B15/EV-304, IMvigor011."],
   ["Metastatic","EV-302/KEYNOTE-A39, JAVELIN Bladder 100, DANUBE, KEYNOTE-361, IMvigor130, THOR and HER2-directed studies."]
  ]},
  {title:"8. Follow-up",src:["EAU-NMIBC", "EAU-MIBC"],verified:"2026-11-10",items:[
   ["NMIBC","Cystoscopy schedule is risk-adapted. High-risk disease requires long-term intensive surveillance and upper-tract monitoring in defined scenarios."],
   ["MIBC after cystectomy","Surveillance includes history, renal function/metabolic care, imaging for recurrence risk and urinary-diversion assessment; follow the risk-adapted schedule in the current EAU/NCCN guideline."],
   ["Quality","Smoking cessation, urinary diversion education, renal preservation, sexual health, bowel function and survivorship are part of the treatment plan."]
  ]}
 ]},
"UTUC":{sources:["EAU-UTUC"],
 emoji:"↗️",color:"violet",tagline:"Upper tract urothelial carcinoma • kidney-sparing • RNU • systemic therapy",
 sections:[
  {title:"1. Diagnosis & staging",src:["EAU-UTUC", "TNM9"],verified:"2026-11-10",items:[
   ["Imaging","CT urography is the principal staging/diagnostic imaging test when renal function permits. MR urography is an alternative in selected patients."],
   ["Endoscopy","Ureteroscopy with biopsy and selective upper-tract cytology helps define tumour grade and eligibility for kidney-sparing treatment."],
   ["TNM","Tis/CIS; Ta non-invasive papillary; T1 lamina propria; T2 muscularis; T3 peripelvic/periureteric fat or renal parenchyma; T4 adjacent organs, or through the kidney into perinephric fat. N1 single node ≤2 cm; N2 single node >2 cm or multiple nodes. M1 distant metastasis. Unchanged in UICC TNM 9 (used in EAU 2026)."],
   ["Molecular","FGFR3 alterations are relevant to risk biology and systemic therapy selection in advanced disease; molecular testing should be integrated with the disease line."]
  ]},
  {title:"2. Histology / risk stratification",src:["EAU-UTUC", "WHO2022"],verified:"2026-11-10",items:[
   ["Histology","Most are urothelial carcinoma. Variants such as micropapillary, plasmacytoid, sarcomatoid and other aggressive differentiations increase concern for systemic spread and may favour radical management."],
   ["Low-risk features","EAU low-risk criteria are built from grade, cytology, imaging appearance, tumour size, focality and absence of invasive/aggressive features."],
   ["High-risk features","High-grade cytology/biopsy, invasive appearance on imaging, hydronephrosis, larger/multifocal disease and aggressive variant histology move the patient toward high-risk management."]
  ]},
  {title:"3. Local treatment",src:["EAU-UTUC"],verified:"2026-11-10",items:[
   ["Low-risk","Kidney-sparing treatment is preferred when technically feasible. Endoscopic ablation/resection, segmental/distal ureterectomy in selected ureteral tumours and appropriate adjuvant instillation strategies are considered."],
   ["High-risk","Radical nephroureterectomy with complete bladder cuff excision is standard for fit patients. Template lymph-node dissection is used according to location/stage."],
   ["Adjuvant bladder instillation","A single postoperative intravesical chemotherapy instillation after RNU reduces bladder recurrence risk when safely deliverable."],
   ["Perioperative chemotherapy","Adjuvant platinum-based chemotherapy after RNU is supported by the POUT trial in appropriate high-risk patients; timing relative to surgery matters because renal function may fall after nephroureterectomy."]
  ]},
  {title:"4. Metastatic / systemic",src:["EAU-UTUC", "Labels"],verified:"2026-11-10",items:[
   ["First line","EV + pembrolizumab is the preferred first-line regimen for advanced urothelial carcinoma including upper-tract primaries (EV-302; benefit regardless of cisplatin eligibility). If EV + pembrolizumab is unsuitable: cisplatin-eligible → gemcitabine/cisplatin + nivolumab (CheckMate 901) or GC/ddMVAC followed by avelumab maintenance; cisplatin-ineligible → gemcitabine/carboplatin then avelumab maintenance."],
   ["Maintenance","Avelumab maintenance after non-progressive platinum-treated metastatic disease is established."],
   ["Later line","Erdafitinib for susceptible FGFR alterations and checkpoint inhibitors according to prior therapy/biomarker status. Clinical trial participation is important."]
  ]},
  {title:"5. Trials",src:["EAU-UTUC"],verified:"2026-11-10",items:[
   ["POUT","Adjuvant gemcitabine-platinum after RNU in locally advanced/high-risk UTUC."],
   ["EV-302 / JAVELIN Bladder 100","Systemic principles largely inform advanced urothelial carcinoma including upper-tract primaries."],
   ["THOR","FGFR-directed erdafitinib trial underpinning FGFR-altered urothelial carcinoma treatment."]
  ]}
 ]},
"Ca Penis":{sources:["EAU-Penile"],
 emoji:"⚕️",color:"rose",tagline:"PeIN • invasive SCC • cN0 • cN1–3 • contralateral nodes • systemic disease",
 sections:[
  {title:"1. Histological subtypes (WHO 2022 / ISUP)",src:["EAU-Penile", "WHO2022"],verified:"2026-11-10",items:[
   ["HPV-independent SCC","Usual, pseudohyperplastic, pseudoglandular, verrucous, cuniculatum, papillary, sarcomatoid and mixed variants."],
   ["HPV-associated SCC","Basaloid, warty, clear-cell, lymphoepithelioma-like and mixed forms. p16 IHC is the practical surrogate marker for HPV-related pathway biology."],
   ["Other malignancies","Adenosquamous, mucoepidermoid, melanoma, mesenchymal tumours, lymphoma and metastatic lesions are far less common and need different pathways."],
   ["Pathology checklist","Site, histological subtype, grade, maximum depth, invasion pattern, LVI, PNI, urethral/corpus spongiosum/cavernosa invasion, margins, p16, nodal burden and ENE must be recorded. ISUP 2025 advises not routinely grading PeIN itself."],
   ["Prognostic pathology","Worst pattern of invasion, LVI/PNI, ENE, nodal burden and subtype can be more clinically useful than grade alone."]
  ]},
  {title:"2. TNM & stage groups",src:["EAU-Penile", "TNM9"],verified:"2026-11-10",items:[
   ["T (UICC/AJCC 9 = 8)","Tis carcinoma in situ (PeIN); Ta non-invasive verrucous carcinoma; T1 invades subepithelial connective tissue: T1a without lymphovascular or perineural invasion and not poorly differentiated; T1b with lymphovascular or perineural invasion, or poorly differentiated; T2 corpus spongiosum ± urethra; T3 corpus cavernosum ± urethra; T4 other adjacent structures (prepubic fat, scrotum, spermatic cord, pubic bone, prostate). Urethral invasion alone no longer upstages to T3."],
   ["cN","cN0 = no palpable or visibly enlarged inguinal nodes; cN1 = single palpable, mobile, unilateral inguinal node; cN2 = multiple or bilateral palpable, mobile inguinal nodes; cN3 = fixed inguinal nodal mass or pelvic lymphadenopathy (uni- or bilateral)."],
   ["pN","pN1 = metastasis in 1–2 inguinal nodes; pN2 = >2 unilateral inguinal nodes or bilateral inguinal nodes; pN3 = pelvic node(s) (uni/bilateral) or extranodal extension."],
   ["Stage groups","Stage 0 = Tis/Ta N0 M0; I = T1a N0; IIA = T1b or T2 N0; IIB = T3 N0; IIIA = T1–3 N1; IIIB = T1–3 N2; IV = T4 any N, any T N3, or M1."]
  ]},
  {title:"3. Primary tumour treatment",src:["EAU-Penile"],verified:"2026-11-10",items:[
   ["PeIN / Ta","Topical or organ-sparing therapy can be used in selected superficial lesions. NCCN 2.2026 lists imiquimod 5% 3 nights/week for 4–16 weeks and 5-FU cream 5% twice daily for 2–6 weeks; ensure histologic diagnosis and follow-up."],
   ["T1 organ preservation","Wide local excision, glansectomy and selected laser/Mohs approaches depend on site, depth, grade and margins."],
   ["T2+","Partial penectomy or total penectomy according to extent; reconstruction and functional stump goals matter, but oncologic margins remain primary."]
  ]},
  {title:"4. cN0 groins — do not miss occult disease",src:["EAU-Penile"],verified:"2026-11-10",items:[
   ["Low risk","EAU/NCCN pathways support surveillance for very low-risk primary disease (e.g. PeIN/Ta/T1a) when the complete risk profile is favourable."],
   ["Intermediate/high risk","For T1b or T2+ disease, invasive nodal staging is generally indicated with dynamic sentinel node biopsy or inguinal node dissection according to expertise and guideline pathway."],
   ["DSNB performance","Modern dynamic sentinel-node pathways have high sensitivity in experienced centres, but performance depends heavily on technique and centre expertise; ultrasound/FNA is used when nodes are suspicious."],
   ["Contralateral nodes","Penile lymphatic drainage is frequently bilateral/cross-over. Bilateral nodal staging is therefore important; the decision is based on primary risk, laterality and the opposite groin's clinical status rather than a simplistic 'one positive node = always bilateral dissection' rule."]
  ]},
  {title:"5. cN1 / cN2 / pN+ management",src:["EAU-Penile"],verified:"2026-11-10",items:[
   ["cN1","EAU 2026: ipsilateral fascial-sparing ILND or open radical ILND, with minimally invasive ILND only in a clinical trial."],
   ["cN2","EAU 2026: ipsilateral open radical ILND. Selected bulky mobile or bilateral cN2 disease may receive NAC as an alternative to immediate surgery if cisplatin/taxane fit."],
   ["Pelvic nodes","EAU 2026 recommends prophylactic ipsilateral PLND when ≥3 inguinal nodes are positive or ENE is present. Pelvic nodal disease is pN3 and requires multimodal therapy."],
   ["Timing","Complete inguinal/pelvic surgical nodal management within about 3 months of diagnosis unless NAC has been given; integrate MDT planning."]
  ]},
  {title:"6. cN3 / bulky disease — exact logic",src:["EAU-Penile"],verified:"2026-11-10",items:[
   ["Definition","cN3 = fixed inguinal mass or pelvic lymphadenopathy."],
   ["Why NAC","Upfront surgery is often poor-risk in fixed/bulky disease. EAU recommends a cisplatin- and taxane-based NAC approach in chemotherapy-fit cN3/pelvic-node disease; surgery follows in responders or selected non-progressors when resection remains feasible."],
   ["TIP","Paclitaxel/ifosfamide/cisplatin is the best-established prospective cisplatin/taxane NAC regimen; the phase II study used 4 cycles and reported ORR around 50% with 10% pCR in the selected cN2/cN3 population."],
   ["TPF","Docetaxel/cisplatin/5-FU has activity but more limited prospective evidence and substantial toxicity. EAU 2026 does not make it a universal replacement for TIP."],
   ["Expected response","Across pooled heterogeneous series, radiologic response is approximately 53–57%; pCR about 4–13%, with prospective TIP pCR around 10%. These percentages are population-level and do not predict an individual patient."],
   ["After NAC","If responding and resectable → radical ILND + PLND with management of the primary. If progressive → re-evaluate curative surgery and consider systemic/palliative pathways."]
  ]},
  {title:"7. Metastatic / palliative",src:["EAU-Penile", "Labels"],verified:"2026-11-10",items:[
   ["Preferred systemic class","EAU: platinum-based chemotherapy is preferred first-line palliative systemic therapy; options include PF, taxane-platinum combinations such as TIP/TPF, or selected doublets such as paclitaxel/carboplatin when extrapolation is appropriate."],
   ["Immunotherapy","NCCN 2.2026 supports pembrolizumab in selected biomarker-defined unresectable/metastatic disease (e.g. MSI-H/dMMR or TMB-H) after progression when criteria are met. Check local label/line-of-therapy."],
   ["New evidence","HERCULES (2025) studied pembrolizumab + platinum-based chemotherapy in advanced penile SCC; encouraging phase II activity does not automatically make it standard in all patients. Retifanlimab/ORPHEUS and other checkpoint studies remain part of the evolving trial landscape."],
   ["Palliation","Radiotherapy is appropriate for symptom control, including ulcerative/fixed nodes and painful lesions."]
  ]},
  {title:"8. Trials",src:["EAU-Penile"],verified:"2026-11-10",items:[
   ["EAU / nodal","TIP phase II cN2/cN3 study; InPACT (preoperative chemoradiotherapy; ongoing at last guideline review)."],
   ["Systemic","HERCULES (pembrolizumab + platinum chemotherapy), PERICLES (atezolizumab ± RT), ORPHEUS (retifanlimab), EPIC-B (cemiplimab)."],
   ["Guideline position","Because penile SCC is rare and many trials are small/non-randomized, trial enrollment is particularly valuable in cN3, metastatic and post-platinum disease."]
  ]}
 ]},
"Ca Testis":{sources:["EAU-Testis"],
 emoji:"🥚",color:"amber",tagline:"Seminoma • NSGCT • stage I • II • metastatic • post-chemo residual mass",
 sections:[
  {title:"1. Diagnostic pathway",src:["EAU-Testis"],verified:"2026-11-10",items:[
   ["Initial test","High-frequency scrotal US with Doppler. Measure both testes and describe intratesticular lesions and vascularity."],
   ["Markers before orchiectomy","AFP, β-hCG and LDH are mandatory before orchiectomy and repeated after orchiectomy because staging/prognosis depends on post-orchiectomy values."],
   ["No scrotal violation","Do not perform trans-scrotal biopsy; radical inguinal orchiectomy is the standard diagnostic/therapeutic operation."],
   ["Staging","CT/MRI abdomen/pelvis and chest imaging are selected according to histology/marker/stage. Brain MRI is reserved for selected high-risk presentations."]
  ]},
  {title:"2. Histology & marker rules",src:["EAU-Testis", "WHO2022"],verified:"2026-11-10",items:[
   ["Seminoma","Pure seminoma. AFP should not be elevated; if AFP is persistently elevated after orchiectomy, manage as nonseminoma regardless of the dominant histology."],
   ["NSGCT components","Embryonal carcinoma, yolk-sac tumour, choriocarcinoma and teratoma. Mixed germ-cell tumours are managed as NSGCT."],
   ["Teratoma","Mature teratoma is relatively chemoresistant and may require surgical resection of residual disease. Histology alone should never be used to ignore marker behaviour."],
   ["Somatic pathology","Lymphovascular invasion, rete testis invasion, tumour size and histologic composition drive stage I relapse risk and treatment choice."]
  ]},
  {title:"3. TNM / stage",src:["EAU-Testis", "TNM9"],verified:"2026-11-10",items:[
   ["Primary (UICC TNM 9 / AJCC 8)","pTis germ cell neoplasia in situ (GCNIS); pT1 limited to testis incl. rete testis, without lymphovascular invasion or epididymal invasion (may invade tunica albuginea, not vaginalis); AJCC sub-divides pure seminoma into pT1a <3 cm and pT1b ≥3 cm; pT2 lymphovascular invasion, OR invasion of hilar soft tissue, epididymis or tunica vaginalis; pT3 direct spermatic-cord invasion; pT4 scrotal invasion. Discontinuous spermatic-cord involvement is pM1 (AJCC). Epididymal invasion was pT1 in older editions and is now pT2."],
   ["Nodes","cN1 node mass ≤2 cm; cN2 >2 cm but ≤5 cm; cN3 >5 cm. pN1 ≤2 cm and ≤5 positive nodes; pN2 >2–5 cm, or >5 positive nodes, or extranodal extension; pN3 >5 cm."],
   ["M / markers","M1a non-regional nodes or lung; M1b other sites. Post-orchiectomy markers: S1 LDH <1.5× ULN and hCG <5,000 IU/L and AFP <1,000 ng/mL; S2 LDH 1.5–10× ULN or hCG 5,000–50,000 or AFP 1,000–10,000; S3 LDH >10× ULN or hCG >50,000 or AFP >10,000."],
    ["Stage groups","0 pTis S0; IA pT1 N0 M0 S0; IB pT2–4 N0 M0 S0; IS any pT N0 M0 S1–3; IIA N1 S0–1; IIB N2 S0–1; IIC N3 S0–1; IIIA M1a S0–1; IIIB N1–3 or M1a with S2; IIIC N1–3 or M1a with S3, or any M1b."]
  ]},
  {title:"4. IGCCCG metastatic risk",src:["EAU-Testis", "IGCCCG2021", "Labels"],verified:"2026-11-10",items:[
   ["Good risk","Seminoma: any site without non-pulmonary visceral metastasis. NSGCT: AFP <1,000 ng/mL, β-hCG <5,000 IU/L and LDH <1.5× ULN, with no mediastinal primary and no non-pulmonary visceral metastases."],
   ["Intermediate","Seminoma with non-pulmonary visceral metastasis; NSGCT with AFP 1,000–10,000, β-hCG 5,000–50,000 or LDH 1.5–10× ULN, absent poor-risk features."],
   ["Poor","NSGCT only: primary mediastinal germ-cell tumour, non-pulmonary visceral metastasis, AFP >10,000, β-hCG >50,000 or LDH >10× ULN."],
   ["Use case","IGCCCG drives chemotherapy intensity, cycle number and prognosis after orchiectomy in metastatic disease. IGCCCG 2021 update: within these groups, LDH >2.5× ULN (seminoma) and lung metastases, LDH and older age (NSGCT) identify worse outcomes; use the online IGCCCG calculator for refined prognosis."]
  ]},
  {title:"5. Stage I seminoma",src:["EAU-Testis", "TNM9"],verified:"2026-11-10",items:[
   ["Surveillance","Preferred for many compliant stage I patients; relapse risk is roughly 12–20% depending on risk features and surveillance strategy."],
   ["Adjuvant carboplatin","Single-dose carboplatin AUC 7 is an alternative in selected patients; it reduces relapse risk but requires counselling about late relapse and long-term follow-up."],
   ["RT","Routine adjuvant radiotherapy is generally avoided because of late toxicity/second-malignancy concerns, reserved for exceptional circumstances."]
  ]},
  {title:"6. Stage I NSGCT",src:["EAU-Testis", "TNM9"],verified:"2026-11-10",items:[
   ["Surveillance","Preferred for low-relapse-risk and compliant patients."],
   ["LVI-positive","Relapse risk is approximately 40–50%. One cycle of BEP or nerve-sparing RPLND are accepted risk-adapted alternatives depending on expertise, patient preference and exact stage."],
   ["Fertility","Discuss sperm banking before chemotherapy/RPLND. Avoid unnecessary retroperitoneal surgery that compromises ejaculation."]
  ]},
  {title:"7. Stage II / metastatic treatment",src:["EAU-Testis", "TNM9", "Labels"],verified:"2026-11-10",items:[
   ["Seminoma IIA/B","Options: RT (IIA 30 Gy, IIB 36 Gy), BEP × 3 / EP × 4, or, in expert centres, primary nerve-sparing RPLND for marker-negative IIA/small IIB disease (SEMS, PRIMETEST). Stage IIC+ receives chemotherapy according to IGCCCG."],
   ["Good-risk metastatic","BEP ×3 or EP ×4 are standard first-line patterns when bleomycin is contraindicated."],
   ["Intermediate/poor-risk","BEP ×4 is the standard backbone. VIP ×4 is a bleomycin-free alternative in patients at pulmonary risk."],
   ["Poor-risk marker decline","Re-check markers after cycle 1; an unfavourable decline prompts consideration of expert-center intensification strategies."]
  ]},
  {title:"8. Residual masses",src:["EAU-Testis"],verified:"2026-11-10",items:[
   ["NSGCT","With normalized/normalising markers, visible residual mass >1 cm generally requires post-chemotherapy RPLND. Histology may be necrosis/fibrosis, teratoma or viable cancer; do not rely on PET to rule out NSGCT residual disease."],
   ["Seminoma","For residual mass ≥3 cm, 18F-FDG PET/CT after chemotherapy can help. Perform no earlier than about 6–8 weeks after chemotherapy to reduce false positives."],
   ["Small residuals","EAU 2026 notes that selected post-chemo residuals <10 mm can be observed in complete-response settings, with recurrence risk in the 6–9% range in reported series; individualized MDT review is required."]
  ]},
  {title:"9. Follow-up / survivorship",src:["EAU-Testis"],verified:"2026-11-10",items:[
   ["Markers","Use AFP/β-hCG/LDH according to stage and relapse pathway; marker normalisation kinetics matter."],
   ["Imaging","Use guideline-specific chest/abdomen surveillance rather than routine indiscriminate CT forever; adapt to histology, stage and treatment."],
   ["Late effects","Monitor cardiovascular risk, secondary malignancy risk, hearing, neuropathy, renal function, hypogonadism and fertility/sexual function."]
  ]},
  {title:"10. Trials / named studies",src:["EAU-Testis"],verified:"2026-11-10",items:[
   ["Risk-adapted stage I","Seminoma adjuvant carboplatin studies; NSGCT surveillance/RPLND de-escalation programs."],
   ["Advanced disease","IGCCCG collaborative datasets underpin the risk system; contemporary salvage/HDCT studies should be handled in expert centres."],
   ["De-escalation","EAU 2026 includes updated evidence on de-escalating treatment approaches and expanded discussion of bone metastases."]
  ]}
 ]},
"Ca Kidney":{sources:["EAU-RCC"],
 emoji:"🫘",color:"emerald",tagline:"RCC histology • Bosniak • RENAL/PADUA • IMDC • surgery • systemic therapy",
 sections:[
  {title:"1. Diagnostic pathway",src:["EAU-RCC"],verified:"2026-11-10",items:[
   ["Imaging","Multiphasic contrast-enhanced CT is the main diagnostic/staging study. MRI is useful when iodinated contrast is unsuitable or venous extension requires clarification."],
   ["Renal mass biopsy","Biopsy is especially useful before active surveillance, thermal ablation, indeterminate lesions or systemic therapy decisions when histology will change treatment."],
   ["Contrast enhancement","For solid renal masses, enhancement must be interpreted relative to non-contrast images and technique; a single arbitrary HU threshold should not replace radiologic assessment."],
   ["Bone/brain","Routine bone or brain imaging is not required for every asymptomatic RCC patient; target imaging to symptoms/stage and systemic-treatment context."]
  ]},
  {title:"2. Histological subtypes & grading",src:["EAU-RCC", "WHO2022"],verified:"2026-11-10",items:[
   ["Clear-cell RCC","Commonest subtype; VHL pathway alterations are characteristic. ccRCC dominates evidence for modern IO/TKI combinations and adjuvant pembrolizumab."],
   ["Papillary RCC","Papillary type 1/2 terminology is increasingly supplemented by molecularly informed classification. MET-altered and FH-deficient entities are distinct biologic diseases."],
   ["Chromophobe RCC","Usually more indolent; may be associated with Birt-Hogg-Dubé in hereditary settings."],
   ["Other aggressive entities","Collecting duct, renal medullary, MiTF translocation and other rare RCCs require specialist pathology review and histology-specific systemic choices."],
   ["WHO/ISUP grade","ISUP grading is used in ccRCC/papillary RCC. Grade 1–4 reflects nucleolar prominence and/or sarcomatoid/rhabdoid features; grade 4 includes extreme pleomorphism/sarcomatoid/rhabdoid morphology."]
  ]},
  {title:"3. Bosniak 2019",src:["EAU-RCC", "Bosniak2019"],verified:"2026-11-10",items:[
   ["Bosniak I","Simple cyst; benign."],
   ["Bosniak II","Minimally complex cyst; generally benign/no routine follow-up when confidently classified."],
   ["Bosniak IIF","Probably benign but indeterminate complexity; surveillance imaging is recommended."],
   ["Bosniak III","Indeterminate cystic mass with enhancing thick/irregular septa or wall; malignancy risk substantial; management is individualized with surveillance or surgery depending on size, age and risk."],
   ["Bosniak IV","Enhancing nodular soft-tissue component; high likelihood of malignancy and usually treated as malignant when clinically appropriate."]
  ]},
  {title:"4. TNM & surgical treatment",src:["EAU-RCC", "TNM9"],verified:"2026-11-10",items:[
   ["T1","T1a ≤4 cm, T1b >4–7 cm, limited to the kidney. Partial nephrectomy is preferred when technically feasible and oncologically appropriate."],
   ["T2","T2a >7–10 cm, T2b >10 cm, limited to the kidney. Radical nephrectomy is common when partial nephrectomy is not reasonable."],
   ["T3/T4","T3a renal vein or segmental branches, pelvicalyceal system, or perirenal/renal-sinus fat (not beyond Gerota fascia); T3b IVC below the diaphragm; T3c IVC above the diaphragm or invading the IVC wall; T4 beyond Gerota fascia, incl. contiguous ipsilateral adrenal. N1 regional node metastasis. Unchanged in UICC TNM 9. Surgery remains possible in selected T3/T4 patients, often in expert centres."],
   ["PN details","RENAL/PADUA complexity guides operative planning but is not itself a treatment indication. Do not use score alone to deny nephron-sparing surgery."],
   ["Adrenal / LN","Routine adrenalectomy is not required unless involved/suspicious. Routine lymph-node dissection is not mandatory in clinically node-negative disease solely for staging."]
  ]},
  {title:"5. Active surveillance / ablation",src:["EAU-RCC"],verified:"2026-11-10",items:[
   ["Small renal masses","Active surveillance is a guideline-supported option in selected patients, particularly with frailty/comorbidity or limited life expectancy."],
   ["Thermal ablation","Cryoablation/RFA can be considered for selected small masses when nephron-sparing surgery is less suitable."],
   ["Frailty","EAU 2026 adds formal frailty/comprehensive geriatric assessment into decision-making."]
  ]},
  {title:"6. Adjuvant therapy",src:["EAU-RCC", "Labels"],verified:"2026-11-10",items:[
   ["KEYNOTE-564","Adjuvant pembrolizumab improves DFS and OS in selected high-risk operable clear-cell RCC. EAU 2026 recommends it for trial-defined intermediate-high/high-risk groups and M1 NED after resection of oligometastatic disease within 1 year."],
   ["Dose reference","Pembrolizumab 200 mg IV q3w or 400 mg q6w for approximately 1 year according to the approved regimen/order set."],
   ["Belzutifan add-on","Adding belzutifan 120 mg daily (up to 54 weeks) to adjuvant pembrolizumab improved DFS (LITESPARK-022, HR 0.72; FDA Jun 2026) at the cost of more grade ≥3 toxicity (anaemia, hypoxia)."],
   ["Do not extrapolate","Do not give adjuvant pembrolizumab to every T1 RCC or every non-clear-cell tumour; the evidence and approval are histology/risk-specific."]
  ]},
  {title:"7. IMDC & metastatic treatment",src:["EAU-RCC", "Labels"],verified:"2026-11-10",items:[
   ["IMDC factors","KPS <80%, diagnosis-to-treatment interval <1 year, low haemoglobin, high corrected calcium, neutrophilia and thrombocytosis. Favorable = 0; intermediate = 1–2; poor = 3–6."],
   ["First-line ccRCC","EAU 2026: nivolumab/ipilimumab, pembrolizumab/axitinib, lenvatinib/pembrolizumab or nivolumab/cabozantinib are standards, especially for IMDC intermediate/poor risk. VEGFR-TKI monotherapy remains an option when ICI is unsuitable."],
   ["Cytoreductive nephrectomy","CARMENA and SURTIME shifted practice toward deferred/selected CN. Upfront CN is for carefully selected patients, not an automatic step for metastatic RCC."],
   ["After ICI combinations","Belzutifan 120 mg + lenvatinib 20 mg daily improved PFS vs cabozantinib after PD-(L)1 therapy (LITESPARK-011; FDA Sep 2026). Cabozantinib or another unused VEGFR-TKI remains standard. Belzutifan alone after PD-(L)1 and VEGFR-TKI (LITESPARK-005). Do not re-challenge with an ICI (CONTACT-03 negative)."],
   ["Sarcomatoid","ICI-containing combinations are particularly relevant."]
  ]},
  {title:"8. Non-clear-cell pathways",src:["EAU-RCC"],verified:"2026-11-10",items:[
   ["Papillary","Cabozantinib is an important evidence-based option; molecularly selected therapy may be relevant in MET-driven disease. NCCN 2026-era pathways also include pembro/lenvatinib or nivolumab/cabozantinib as regimen options in selected non-clear-cell settings."],
   ["Chromophobe","Evidence is less robust; systemic therapy should be individualized and clinical trial participation is encouraged."],
   ["Hereditary RCC","Use syndrome-specific pathways (VHL, FH/HLRCC, BHD, TSC and others) and genetics referral."]
  ]},
  {title:"9. Trials",src:["EAU-RCC"],verified:"2026-11-10",items:[
   ["Adjuvant","KEYNOTE-564 (DFS + OS), LITESPARK-022 (belzutifan + pembrolizumab); IMmotion010, CheckMate 914 and PROSPER were negative."],
   ["Metastatic","KEYNOTE-426, CheckMate-214, CLEAR, CheckMate 9ER, CARMENA, SURTIME, CONTACT-03, LITESPARK-005, LITESPARK-011."],
   ["Papillary","SWOG 1500 (PAPMET) informed cabozantinib in papillary RCC."]
  ]},
  {title:"10. Follow-up",src:["EAU-RCC"],verified:"2026-11-10",items:[
   ["EAU 2026","Follow-up should be risk-adapted; 2026 updates emphasize recurrence risk, renal function and alternative-to-surgery surveillance."],
   ["Renal function","Monitor eGFR/proteinuria/BP after nephron-sparing or radical nephrectomy; coordinate nephrology when CKD risk is substantial."]
  ]}
 ]},
"Urethral Cancer":{sources:["EAU-Urethral"],
 emoji:"〰️",color:"slate",tagline:"Male/female urethral carcinoma • local • nodal • systemic",
 sections:[
  {title:"1. Histology",src:["EAU-Urethral", "WHO2022"],verified:"2026-11-10",items:[
   ["Histology depends on location","Distal/anterior urethral tumours are commonly squamous; prostatic urethral and periurethral tumours can be urothelial or glandular. Adenocarcinoma, SCC, urothelial carcinoma and rare neuroendocrine/sarcomatoid entities require distinct pathways."],
   ["Pathology essentials","Site, grade, depth, LVI, margins, nodal status and histologic subtype should be explicit."]
  ]},
  {title:"2. Staging",src:["EAU-Urethral", "TNM9"],verified:"2026-11-10",items:[
   ["T (male penile and female urethra)","Ta non-invasive papillary; Tis carcinoma in situ; T1 subepithelial connective tissue; T2 corpus spongiosum, prostate or periurethral muscle; T3 corpus cavernosum, beyond the prostatic capsule, anterior vagina or bladder neck; T4 other adjacent organs (e.g. bladder). Prostatic urethra is staged separately: Tis pu/pd (CIS of urethra/ducts), T1 subepithelial tissue, T2 prostatic stroma, T3 periprostatic tissue, T4 adjacent organs."],
   ["Nodes","N1 single regional node (inguinal or true pelvic: perivesical, obturator, internal/external iliac, presacral); N2 multiple regional nodes. Distal urethra drains to inguinal nodes, proximal to pelvic nodes."]
  ]},
  {title:"3. Local / nodal treatment",src:["EAU-Urethral"],verified:"2026-11-10",items:[
   ["Distal superficial disease","Selected lesions can undergo urethra-preserving excision with careful negative margins."],
   ["Invasive disease","Penectomy/urethrectomy or cystoprostatectomy-type surgery may be required according to location and extent; nodal staging is selective and anatomy-dependent."],
   ["RT / chemoradiation","Selected organ-preserving strategies may be considered for localized disease in experienced centres."]
  ]},
  {title:"4. Systemic treatment",src:["EAU-Urethral", "Labels"],verified:"2026-11-10",items:[
   ["Urothelial phenotype","Use cisplatin-based chemotherapy where appropriate and advanced urothelial regimens according to current bladder/urothelial pathways."],
   ["Squamous phenotype","Platinum-based chemotherapy and/or chemoradiation are used by analogy and tumour location; evidence is lower level because of rarity."],
   ["Metastatic","Systemic therapy is histology-specific; MDT and clinical trials are strongly encouraged."]
  ]}
 ]},
"Adrenal / Neuroendocrine":{sources:["ESE-Adrenal","ESE-ACC"],
 emoji:"🧪",color:"purple",tagline:"Adrenal incidentaloma • pheochromocytoma • ACC • neuroendocrine",
 sections:[
  {title:"1. Incidentaloma evaluation",src:["ESE-Adrenal", "ESE-ACC"],verified:"2026-11-10",items:[
   ["Hormone screen (ESE/ENSAT 2023)","1-mg overnight dexamethasone suppression test in every patient: cortisol ≤50 nmol/L (≤1.8 µg/dL) excludes autonomous secretion; >50 nmol/L without overt Cushing = mild autonomous cortisol secretion (MACS), so screen for hypertension, diabetes and bone disease. Plasma free or urinary fractionated metanephrines unless the mass is ≤10 HU on unenhanced CT (pheochromocytoma very unlikely). Aldosterone/renin ratio if hypertensive or hypokalaemic."],
   ["Imaging (ESE/ENSAT 2023)","Unenhanced CT first. Homogeneous and ≤10 HU = benign, no further imaging regardless of size (about 70% of incidentalomas). Homogeneous 11–20 HU and <4 cm: immediate further imaging (washout CT, chemical-shift MRI or FDG-PET) or repeat unenhanced CT in 12 months. ≥4 cm and heterogeneous, or >20 HU: MDT discussion, usually surgery. Washout data are weak; do not rely on them alone."],
   ["Biopsy","Never biopsy a potentially functional adrenal mass before pheochromocytoma is excluded." ]
  ]},
  {title:"2. Adrenocortical carcinoma / pheochromocytoma",src:["ESE-Adrenal", "ESE-ACC"],verified:"2026-11-10",items:[
   ["ACC","Suspicious invasive/functioning masses should be managed by an expert adrenal MDT; open en-bloc oncologic resection is standard for resectable ACC. Mitotane and platinum-based combinations are used in advanced disease according to stage."],
   ["Pheochromocytoma/paraganglioma","Pre-operative alpha blockade and volume preparation are essential before adrenalectomy in secretory tumours. Genetics is relevant in a large proportion of patients."],
   ["Neuroendocrine","For neuroendocrine adrenal disease, use histology- and stage-specific protocols and involve endocrine oncology." ]
  ]}
 ]},
};

const DRUGS = [
["ADT / LHRH agonist","Leuprolide / goserelin class","Schedule is product-specific (e.g. monthly/3-month/6-month depot). Confirm formulation and testosterone monitoring."],
["LHRH antagonist","Degarelix / relugolix","Useful when rapid testosterone suppression is desired or avoiding injection depot; follow product label."],
["Docetaxel – prostate","75 mg/m² IV q3w ×6 in common mHSPC protocols","Premedication, CBC/LFTs and neuropathy/febrile-neutropenia precautions per order set."],
["Darolutamide","600 mg PO twice daily with food","mHSPC with docetaxel (ARASENS) or as ADT doublet (ARANOTE); nmCRPC (ARAMIS). Check interactions and renal/hepatic restrictions."],
["Capivasertib + abiraterone","Capivasertib 400 mg PO twice daily, 4 days on / 3 days off; abiraterone 1000 mg daily + prednisone 5 mg daily; with continued ADT","PTEN-deficient mHSPC (mAPMN/S) on a validated PTEN IHC assay (CAPItello-281, FDA Jun 2026). Reductions: 320 mg, then 200 mg BID. Monitor glucose, rash and diarrhoea; reduce to 320 mg with strong/moderate CYP3A inhibitors."],
["Talazoparib + enzalutamide","Talazoparib 0.5 mg PO daily (0.35 mg in moderate renal impairment) + enzalutamide 160 mg daily, with ADT","HRR-mutated mCRPC (TALAPRO-2) and HRR-mutated mHSPC (TALAPRO-3, FDA Oct 2026). Anaemia is common (grade ≥3 in about half in TALAPRO-3); check CBC monthly and reduce dose for grade 3–4 anaemia."],
["Abiraterone + prednisone","Abiraterone 1000 mg PO daily on empty stomach + prednisone per regimen","Monitor K+, BP, fluid status, LFTs; steroid schedule can vary by indication."],
["Enzalutamide","160 mg PO daily","ARPI; seizure/drug-interaction risk assessment required."],
["Apalutamide","240 mg PO daily","ARPI; monitor rash, falls/fracture risk, thyroid and drug interactions."],
["Lu-177 PSMA-617","7.4 GBq (200 mCi) IV every 6 weeks × 6 doses; one permitted reduction to 5.9 GBq (160 mCi) for toxicity, no re-escalation","PSMA-positive disease on PSMA PET required. Indications: mCRPC after ARPI ± taxane (VISION, PSMAfore) and, with an ARPI, mHSPC/mAPMN/S (PSMAddition, FDA Jul 2026). Monitor CBC and renal function; stop for grade ≥3 renal toxicity."],
["Gem/Cis – bladder/UTUC","Gemcitabine 1000 mg/m² D1,D8 + cisplatin ~70 mg/m² D1 q21d (common schedule)","Hydration, renal function and hearing/neuropathy assessment are protocol-dependent."],
["ddMVAC","Methotrexate 30 mg/m² D1 + vinblastine 3 mg/m² D2 + doxorubicin 30 mg/m² D2 + cisplatin 70 mg/m² D2 q14d; VESPER trial used 6 cycles ddMVAC vs 4 cycles GC","G-CSF support is standard in dose-dense protocols; common contemporary order sets may use different cycle counts by setting, so select the regimen specified by the current guideline/label."],
["Durvalumab perioperative MIBC","1500 mg IV every 3 weeks with gemcitabine/cisplatin × 4 cycles before cystectomy, then 1500 mg every 4 weeks × 8 cycles after (NIAGARA)","Use exact current label/protocol; EAU 2026 incorporates NIAGARA evidence."],
["Durvalumab + BCG – NMIBC","1500 mg IV every 4 weeks for up to 13 cycles, with BCG induction and maintenance (weight ≥30 kg)","BCG-naïve high-risk NMIBC (T1, high grade, CIS, or multiple/recurrent/large tumours) after complete TURBT. POTOMAC: DFS HR 0.68 vs BCG alone; more grade 3–4 toxicity (21% vs 4%). FDA May 2026; EAU 2026 supports shared discussion."],
["Atezolizumab adjuvant – ctDNA-positive MIBC","1680 mg IV every 4 weeks (or 840 mg q2w / 1200 mg q3w; or 1875 mg SC q3w) for up to 1 year","Only for molecular residual disease on serial ctDNA testing with an FDA-authorized assay (Signatera CDx), starting ≥6 weeks after cystectomy. IMvigor011; FDA May 2026."],
["Enfortumab vedotin + pembrolizumab","Advanced disease: EV 1.25 mg/kg (max 125 mg) D1,D8 q21d + pembrolizumab 200 mg q3w (EV-302). Perioperative MIBC: same EV + pembrolizumab × 4 cycles before cystectomy, then EV × 5 cycles + pembrolizumab 200 mg q3w × 13 cycles (or 400 mg q6w × 7) after","Perioperative use: cisplatin-ineligible (EV-303/KEYNOTE-905, FDA Nov 2025) and all cystectomy candidates (EV-304/KEYNOTE-B15, FDA Jul 2026). Give pembrolizumab after EV on the same day. Boxed warning for serious skin reactions; monitor neuropathy, glucose, eyes and immune toxicity."],
["Avelumab maintenance","800 mg IV q2w","Use after non-progressive platinum-treated advanced urothelial carcinoma per JAVELIN Bladder 100 pathway."],
["Erdafitinib","8 mg PO once daily; check serum phosphate on days 14–21 and increase to 9 mg daily if phosphate <5.5 mg/dL (US label) and no ocular or grade ≥2 toxicity","Advanced urothelial carcinoma with susceptible FGFR3 alterations after prior systemic therapy (THOR); not for patients eligible for but not yet given PD-(L)1 therapy. Restrict dietary phosphate to 600–800 mg/day; baseline and monthly eye checks (Amsler grid); monitor phosphate monthly."],
["Pembrolizumab – RCC","200 mg IV q3w or 400 mg q6w for approved indications","Adjuvant KEYNOTE-564 for up to 1 year."],
["Belzutifan – RCC","120 mg PO once daily","Adjuvant with pembrolizumab for intermediate-high/high-risk ccRCC for up to 54 weeks (LITESPARK-022, FDA Jun 2026); with lenvatinib 20 mg daily after PD-(L)1 therapy (LITESPARK-011, FDA Sep 2026); alone after PD-(L)1 + VEGF-TKI (LITESPARK-005). Boxed warning: embryo-fetal toxicity. Monitor haemoglobin and oxygen saturation."],
["Nivolumab + ipilimumab – RCC","Nivolumab 3 mg/kg + ipilimumab 1 mg/kg q3w ×4 → nivolumab maintenance","Check current protocol and immune-toxicity algorithms."],
["Pembrolizumab + axitinib – RCC","Pembrolizumab 200 mg q3w + axitinib 5 mg BID (common start)","Axitinib may be titrated according to tolerance/label."],
["Lenvatinib + pembrolizumab – RCC","Lenvatinib 20 mg PO daily + pembrolizumab 200 mg q3w","BP, proteinuria, renal/hepatic function and immune toxicity monitoring."],
["Nivolumab + cabozantinib – RCC","Nivolumab 240 mg q2w/480 mg q4w + cabozantinib 40 mg daily","Dose modifications are common for toxicity."],
["BEP – testis","Bleomycin 30,000 IU D1,D8,D15 + etoposide 100 mg/m² D1–5 + cisplatin 20 mg/m² D1–5 q21d","Standard good-risk 3-cycle pattern; 4 cycles for intermediate/poor-risk in standard pathways."],
["EP – testis","Etoposide 100 mg/m² D1–5 + cisplatin 20 mg/m² D1–5 q21d ×4","Used instead of BEP when bleomycin is contraindicated in appropriate good-risk disease."],
["VIP – testis","Etoposide + ifosfamide + cisplatin q21d ×4, with mesna","Bleomycin-free option; exact doses follow institutional germ-cell order set."],
["TIP – penile","Paclitaxel 175 mg/m² D1 + ifosfamide 1200 mg/m² D1–3 + cisplatin 25 mg/m² D1–3 q21d ×4","Prospective cN2/cN3 data; use specialist penile cancer MDT."],
["5-FU/Imiquimod – penile precursor","Imiquimod 5% 3 nights/week 4–16 weeks; 5-FU 5% twice daily 2–6 weeks","NCCN 2.2026 reference for selected PeIN/Ta; confirm pathology and local formulary."],
["Mitomycin C / gemcitabine – NMIBC immediate","Single immediate instillation after appropriate TURBT when perforation/high-risk bleeding is excluded","Exact intravesical concentration/volume should follow pharmacy/institutional order set."],
["BCG – NMIBC","Full-dose weekly ×6 induction; maintenance courses use a 3-week mini-course pattern at guideline-defined intervals","Avoid in traumatic catheterisation, active UTI, gross haematuria or recent bladder perforation."],
];

const PROTOCOLS_2026 = [
 ["NMIBC — immediate intravesical chemotherapy","Gemcitabine 2 g in 100 mL intravesical, dwell approximately 1 hour, given promptly after TURB when safe (SWOG S0337-style evidence). Mitomycin C is also used with institution/label-specific concentration and dwell."],
 ["NMIBC — BCG induction","One strain-specific full-dose instillation weekly for 6 weeks. Do not translate BCG 'full dose' into a universal mg amount across strains/products."],
 ["NMIBC — BCG maintenance","SWOG 8507 pattern: 3 weekly instillations at months 3, 6, 12, 18, 24, 30 and 36; EAU allows risk-adapted maintenance up to 1–3 years. Use the current local BCG order set."],
 ["MIBC — Gem/Cis","Gemcitabine 1000 mg/m² days 1 and 8 + cisplatin 70 mg/m² day 1 every 21 days is a common backbone; perioperative duration depends on protocol/setting."],
 ["MIBC — ddMVAC","Methotrexate 30 mg/m² D1 + vinblastine 3 mg/m² D2 + doxorubicin 30 mg/m² D2 + cisplatin 70 mg/m² D2 q14d with G-CSF; VESPER trial used 6 cycles ddMVAC."],
 ["MIBC — NIAGARA","Perioperative durvalumab + gemcitabine/cisplatin followed by cystectomy/LND and adjuvant durvalumab. Use exact current label and trial protocol for dose and cycle scheduling."],
 ["MIBC — KEYNOTE-905/EV-303","Perioperative enfortumab vedotin + pembrolizumab for cisplatin-ineligible MIBC in appropriate candidates; exact neoadjuvant/adjuvant cycle schedule is protocol/label dependent."],
 ["Metastatic UC — EV+pembro","Enfortumab vedotin 1.25 mg/kg IV days 1 and 8 of each 21-day cycle + pembrolizumab 200 mg IV day 1 every 3 weeks (or approved alternative interval). EV-302 allowed treatment until progression per protocol; pembrolizumab maximum was 35 cycles."],
 ["Metastatic UC — GemCarbo","Gemcitabine + carboplatin for cisplatin-ineligible but carboplatin-fit patients; dose carboplatin by Calvert formula and institutional AUC target."],
 ["Metastatic UC — avelumab maintenance","Avelumab 800 mg IV every 2 weeks after 4–6 cycles of platinum-gemcitabine in patients with at least stable disease when using the JAVELIN Bladder 100 pathway."],
 ["Metastatic UC — GC+nivolumab","Nivolumab + gemcitabine/cisplatin for cisplatin-fit metastatic UC; CheckMate 901 used nivolumab with GC followed by nivolumab maintenance. Use current label/order set for exact cycle and maintenance dosing."],
 ["Penile SCC — TIP","Paclitaxel 175 mg/m² D1 + ifosfamide 1200 mg/m² D1–3 with mesna + cisplatin 25 mg/m² D1–3 q3–4 weeks; prospective TIP study commonly used 4 cycles."],
 ["Testis — BEP","Bleomycin 30,000 IU D1,8,15 + etoposide 100 mg/m² D1–5 + cisplatin 20 mg/m² D1–5 q21d; good-risk metastatic usually 3 cycles, intermediate/poor-risk 4 cycles."],
 ["Testis — EP","Etoposide 100 mg/m² D1–5 + cisplatin 20 mg/m² D1–5 q21d ×4 in good-risk metastatic disease when bleomycin is contraindicated."],
 ["Testis — VIP","Etoposide + ifosfamide + cisplatin q21d ×4 with mesna when bleomycin cannot be given; exact doses per germ-cell order set."],
 ["RCC — nivo/ipi","Nivolumab 3 mg/kg + ipilimumab 1 mg/kg q3w ×4, then nivolumab maintenance per label."],
 ["RCC — pembro/axi","Pembrolizumab 200 mg q3w (or 400 mg q6w where approved) + axitinib 5 mg BID, titrated/modified for tolerance."],
 ["RCC — lenva/pembro","Lenvatinib 20 mg PO daily + pembrolizumab 200 mg q3w (or approved interval)."],
 ["RCC — nivo/cabo","Nivolumab 240 mg q2w or 480 mg q4w + cabozantinib 40 mg PO daily; dose modifications are common."],
 ["Prostate — ADT","Continue castration continuously through mHSPC/nmCRPC/mCRPC. Agonist vs antagonist choice is clinical/label dependent."],
 ["Prostate — mHSPC docetaxel","Docetaxel 75 mg/m² IV q3w ×6 with ADT; triplet context may add darolutamide or abiraterone according to current eligibility."],
 ["Prostate — ARPIs","Darolutamide 600 mg BID with food; abiraterone 1000 mg daily fasting + prednisone; enzalutamide 160 mg daily; apalutamide 240 mg daily. Verify indication-specific steroid/regimen requirements."],
 ["Prostate — Lu-177 PSMA","VISION reference: 7.4 GBq IV every 6 weeks for up to 6 doses in eligible PSMA-positive mCRPC after appropriate prior therapy; check current radioligand label and dosimetry requirements."],
 ["Prostate — cabazitaxel","Cabazitaxel 20 mg/m² q3w is commonly preferred in current practice over 25 mg/m² to reduce toxicity, with prednisone and growth-factor support according to regimen."],
 ["Adrenal — pheochromocytoma preparation","Alpha blockade and volume expansion precede surgery in functioning tumours; beta blockade should not precede adequate alpha blockade." ]
];

const LN_TEMPLATES_2026 = {
 "Prostate":"Extended pelvic LN template: obturator + external iliac + internal iliac/hypogastric packets; cranial extent and presacral/common-iliac components depend on the current institutional extended template. Record laterality and node counts.",
 "Bladder":"Pelvic LND: bilateral obturator + external iliac + internal iliac/hypogastric nodes; extended approaches may include common iliac and presacral regions. Record packets separately when possible.",
 "Penis":"Inguinal template: superficial and deep inguinal packets; pelvic extension (external/internal iliac ± obturator) according to pathological nodal burden/ENE and current guideline criteria.",
 "Testis":"RPLND is side- and histology-specific. Right-sided template centres on paracaval/precaval and interaortocaval nodes; left-sided template centres on para-aortic and interaortocaval drainage, with nerve-sparing boundaries tailored to disease.",
 "UTUC":"LND is tumour-location specific: renal pelvis and proximal ureter drain mainly to retroperitoneal templates; distal ureter often requires pelvic templates. Use current EAU 2026 anatomical figures.",
 "Kidney":"Clinically node-negative RCC generally does not require routine LND. When clinically positive, remove accessible regional nodes for staging/local control according to tumour anatomy and surgical plan."
};

const ORACLE_GUARDRAILS = {
 "Bladder cisplatin": "A cisplatin-ineligible label must branch further into EV+pembro eligibility, carboplatin fitness and platinum-unfit status; carboplatin is not an equivalent neoadjuvant substitute for cisplatin in MIBC.",
 "Bladder EV": "Before EV, check neuropathy, diabetes/glucose control, skin disease and ocular risk; before pembrolizumab, review immune-related contraindications and prior immune toxicity.",
 "Prostate ISUP": "Never use the summed Gleason number alone to infer the treatment pathway. Specimen type, pattern selection, tertiary pattern 5, cribriform/IDC and tumour burden must be recorded separately.",
 "Penis cN3": "Fixed inguinal/pelvic disease needs a systemic-downstaging branch before potentially morbid consolidative surgery in chemotherapy-fit patients; contralateral management is not a universal two-node trigger.",
 "Testis markers": "Persistent post-orchiectomy marker elevation can redefine stage; do not treat a marker-positive patient as simple stage I purely because imaging is negative.",
 "RCC adjuvant": "Adjuvant pembrolizumab is for selected clear-cell/high-risk populations, not every localized RCC and not every non-clear-cell histology."
};

const TRIALS = [
["Prostate","ProtecT","RP vs RT vs active monitoring in localized prostate cancer.","Localized"],
["Prostate","CHAARTED","ADT + docetaxel in mHSPC; foundation for metastatic-volume stratification.","mHSPC"],
["Prostate","LATITUDE","ADT + abiraterone/prednisone in newly diagnosed high-risk mHSPC.","mHSPC"],
["Prostate","STAMPEDE","Platform testing multiple intensification strategies across advanced/high-risk prostate cancer.","mHSPC/high-risk"],
["Prostate","TITAN","Apalutamide + ADT in mHSPC.","mHSPC"],
["Prostate","ENZAMET / ARCHES","Enzalutamide + ADT in mHSPC.","mHSPC"],
["Prostate","ARASENS","ADT + docetaxel + darolutamide triplet.","mHSPC"],
["Prostate","PEACE-1","ADT + docetaxel + abiraterone in mHSPC; prostate RT question in low-volume cohort.","mHSPC"],
["Prostate","EMBARK","Enzalutamide-based intensification in high-risk biochemical recurrence.","BCR"],
["Prostate","ARANOTE","Darolutamide + ADT doublet (without docetaxel) in mHSPC.","mHSPC"],
["Prostate","CAPItello-281","Capivasertib + abiraterone in PTEN-deficient mHSPC; rPFS 33.2 vs 25.7 months (FDA Jun 2026).","mHSPC"],
["Prostate","PSMAddition","Lu-177 PSMA-617 + ARPI vs ARPI in PSMA-positive mHSPC; rPFS benefit (FDA Jul 2026).","mHSPC"],
["Prostate","TALAPRO-3","Talazoparib + enzalutamide in HRR-mutated mHSPC; rPFS HR 0.48 (FDA Oct 2026).","mHSPC"],
["Prostate","AMPLITUDE","Niraparib + abiraterone in HRR-altered mHSPC; FDA approval for BRCA2-mutated disease (Dec 2025).","mHSPC"],
["Prostate","PROfound","Olaparib in HRR-altered mCRPC after ARPI progression.","mCRPC"],
["Prostate","MAGNITUDE","Niraparib + abiraterone in HRR-selected mCRPC.","mCRPC"],
["Prostate","TALAPRO-2","Talazoparib + enzalutamide in molecularly selected/mCRPC populations.","mCRPC"],
["Prostate","VISION","Lu-177 PSMA-617 in PSMA-positive mCRPC.","mCRPC"],
["Prostate","PSMAfore","Lu-177 PSMA-617 vs ARPI switch in taxane-naïve PSMA-positive mCRPC after one ARPI (FDA Mar 2025).","mCRPC"],
["Prostate","CARD","Cabazitaxel vs alternative AR-targeted therapy after docetaxel + ARPI.","mCRPC"],
["Bladder","SWOG 8507","Maintenance BCG improves recurrence control compared with induction alone.","NMIBC"],
["Bladder","KEYNOTE-057","Pembrolizumab in BCG-unresponsive NMIBC.","NMIBC"],
["Bladder","POTOMAC","Durvalumab + BCG induction/maintenance vs BCG in BCG-naïve high-risk NMIBC; DFS HR 0.68 (FDA May 2026).","NMIBC"],
["Bladder","CREST","Sasanlimab + BCG in BCG-naïve high-risk NMIBC; EAU 2026 add-on discussion.","NMIBC"],
["Bladder","QUILT 3032","N-803 (nogapendekin alfa inbakicept) + BCG in BCG-unresponsive NMIBC; FDA CIS approval 2024, papillary-only extension Oct 2026.","NMIBC"],
["Bladder","SunRISe-1","TAR-200 bladder drug delivery system in BCG-unresponsive NMIBC.","NMIBC"],
["Bladder","THOR-2","Erdafitinib in FGFR-altered NMIBC/urothelial disease.","NMIBC"],
["Bladder","VESPER","ddMVAC vs gemcitabine/cisplatin in perioperative MIBC.","MIBC"],
["Bladder","CheckMate 274","Adjuvant nivolumab after radical surgery in high-risk urothelial carcinoma.","MIBC"],
["Bladder","NIAGARA","Perioperative durvalumab + gem/cis in MIBC.","MIBC"],
["Bladder","KEYNOTE-905/EV-303","Perioperative enfortumab vedotin + pembrolizumab in cisplatin-ineligible MIBC (FDA Nov 2025).","MIBC"],
["Bladder","KEYNOTE-B15/EV-304","Perioperative EV + pembrolizumab vs neoadjuvant gemcitabine/cisplatin in cisplatin-eligible MIBC; EFS HR 0.53 with OS benefit (FDA Jul 2026).","MIBC"],
["Bladder","IMvigor011","ctDNA-guided adjuvant atezolizumab after cystectomy; improved DFS and OS in ctDNA-positive patients (FDA May 2026).","MIBC"],
["Bladder","EV-302 / KEYNOTE-A39","Enfortumab vedotin + pembrolizumab vs chemotherapy in untreated advanced urothelial carcinoma.","Metastatic"],
["Bladder","JAVELIN Bladder 100","Avelumab maintenance after non-progressive platinum chemotherapy.","Metastatic"],
["UTUC","POUT","Adjuvant gemcitabine-platinum after radical nephroureterectomy.","UTUC"],
["RCC","KEYNOTE-564","Adjuvant pembrolizumab in high-risk operable ccRCC; DFS and OS benefit.","Adjuvant"],
["RCC","LITESPARK-022","Adjuvant belzutifan + pembrolizumab vs pembrolizumab; DFS HR 0.72 (FDA Jun 2026).","Adjuvant"],
["RCC","LITESPARK-011","Belzutifan + lenvatinib vs cabozantinib after PD-(L)1 therapy; PFS 14.6 vs 10.6 months (FDA Sep 2026).","Metastatic"],
["RCC","LITESPARK-005","Belzutifan vs everolimus after PD-(L)1 and VEGF-TKI therapy.","Metastatic"],
["RCC","KEYNOTE-426","Pembrolizumab + axitinib in advanced ccRCC.","Metastatic"],
["RCC","CheckMate-214","Nivolumab + ipilimumab in advanced RCC.","Metastatic"],
["RCC","CLEAR","Lenvatinib + pembrolizumab in advanced RCC.","Metastatic"],
["RCC","CheckMate 9ER","Nivolumab + cabozantinib in advanced RCC.","Metastatic"],
["RCC","CARMENA","Cytoreductive nephrectomy vs sunitinib in metastatic RCC.","Surgery/systemic"],
["RCC","SURTIME","Immediate vs deferred cytoreductive nephrectomy.","Surgery/systemic"],
["RCC","SWOG 1500 / PAPMET","Cabozantinib and other targeted therapies in papillary RCC.","Non-clear-cell"],
["Penis","TIP phase II","Neoadjuvant TIP in cN2/cN3 penile SCC.","Nodal"],
["Penis","InPACT","Preoperative chemoradiotherapy / multimodal strategies for advanced penile cancer.","Nodal"],
["Penis","HERCULES (LACOG 0218)","Pembrolizumab + platinum chemotherapy in advanced penile SCC.","Advanced"],
["Penis","PERICLES","Atezolizumab ± radiotherapy in advanced penile SCC.","Advanced"],
["Penis","ORPHEUS","Retifanlimab in advanced penile SCC.","Advanced"],
["Testis","IGCCCG cohorts","Prognostic classification underpinning BEP/EP/VIP intensity.","Metastatic"],
["Testis","De-escalation programmes","Stage I seminoma/NSGCT surveillance and reduced-treatment strategies; exact eligibility is guideline-specific.","Stage I"]
];

const ORACLE_SOURCES={
  "EAU Prostate Cancer 2026":"https://uroweb.org/guidelines/prostate-cancer",
  "EAU NMIBC 2026":"https://uroweb.org/guidelines/non-muscle-invasive-bladder-cancer",
  "EAU MIBC 2026":"https://uroweb.org/guidelines/muscle-invasive-and-metastatic-bladder-cancer",
  "EAU UTUC 2026":"https://uroweb.org/guidelines/upper-urinary-tract-urothelial-cell-carcinoma",
  "EAU RCC 2026":"https://uroweb.org/guidelines/renal-cell-carcinoma",
  "EAU Penile Cancer 2026":"https://uroweb.org/guidelines/penile-cancer",
  "EAU Testicular Cancer 2026":"https://uroweb.org/guidelines/testicular-cancer",
  "EAU Primary Urethral Cancer 2026":"https://uroweb.org/guidelines/primary-urethral-carcinoma",
  "EAU Urethral Strictures 2026":"https://uroweb.org/guidelines/urethral-strictures",
  "EAU Male LUTS 2026":"https://uroweb.org/guidelines/management-of-non-neurogenic-male-luts",
  "EAU Urolithiasis 2026":"https://uroweb.org/guidelines/urolithiasis",
  "Galsky cisplatin-unfitness definition":"https://pubmed.ncbi.nlm.nih.gov/21555688/",
  "FDA MIBC EV + pembrolizumab, 10 Jul 2026":"https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-pembrolizumab-or-pembrolizumab-and-berahyaluronidase-alfa-pmph-each-with-enfortumab-vedotin"
};

const PROCEDURES={
  'RIRS':{indications:'Renal/upper-tract stones suitable for retrograde intrarenal surgery.',setup:['Review CT/NCCT for stone size, location, infundibular anatomy and access issues.','Confirm urine culture/UTI status and treat infection before elective instrumentation.','General/spinal anaesthesia as appropriate; lithotomy; fluoroscopy/laser/scope availability checked.'],steps:['Cystoscopy and identify ureteric orifice.','Pass a safety guidewire into the collecting system under vision/fluoroscopy.','Consider ureteral access sheath according to anatomy and surgeon preference; never force advancement.','Advance flexible ureteroscope and systematically inspect upper, middle and lower calyces rather than treating only the obvious stone.','Laser fragment/dust with controlled settings; extract clinically relevant fragments with a basket when appropriate.','Inspect the entire collecting system at the end, confirm ureteral integrity and assess residual fragments.','Place a stent selectively according to oedema, ureteral trauma, residual burden, infection risk and anticipated second look.'],checkpoints:['Do not force the scope/access sheath.','Maintain low intrarenal pressure and continuous outflow where possible.','A septic system is a drainage problem first, not a lithotripsy problem.'],finish:['Document stone burden treated, residual fragments, ureteric injury grade, stent details and culture results.']},
  'PCNL':{indications:'Large renal stone burden, staghorn/branching stones and selected complex anatomy.',setup:['Review CT for calyceal anatomy, posterior calyx options, colon/pleura and adjacent organs.','Ensure sterile urine or appropriate infection-directed plan; antibiotics per local protocol.','Choose prone or supine position according to anatomy/team expertise; prepare fluoroscopy/ultrasound and nephroscope.'],steps:['Position and pad pressure points; obtain retrograde access/opacification if used by the chosen technique.','Choose the target calyx with image guidance; puncture a posterior calyx along the intended access trajectory.','Pass a guidewire and confirm intraluminal position.','Dilate the tract in a controlled fashion and secure the sheath.','Fragment and remove stone burden systematically; keep orientation within the collecting system.','Use flexible nephroscopy to inspect adjacent calyces and identify residual fragments.','Obtain renal pelvic urine and/or stone culture during PCNL when possible.','At the end, decide tubeless/totally tubeless versus nephrostomy drainage based on tract bleeding, perforation, residual burden and need for second look; JJ stent when indicated.'],checkpoints:['For staghorn disease, plan access before puncture rather than improvising after bleeding/visibility deteriorates.','Watch pleural/colonic/vascular risks based on puncture level and CT anatomy.','Control irrigation pressure and avoid obscuring the collecting system with bleeding.'],finish:['Record puncture calyx, tract number/size, stone clearance, residual burden, nephrostomy/stent details, complications and culture.']},
  'URSL':{indications:'Ureteric stones requiring endoscopic clearance.',setup:['Review CT for stone location, impaction and proximal dilation.','Treat UTI before definitive ureteroscopy.'],steps:['Cystoscopy and guidewire placement into the upper tract.','Advance semirigid or flexible ureteroscope atraumatically.','Identify the stone; fragment with laser or pneumatic lithotripsy as appropriate.','Retrieve fragments with a basket when useful; avoid excessive repeated passes through the ureter.','Inspect the ureter for mucosal injury/impaction.','Place a ureteral stent selectively according to trauma, oedema, residual stone and infection risk.'],checkpoints:['Never advance against resistance.','Impacted stones require careful management of embedded fragments and ureteral integrity.'],finish:['Document stone position/size, clearance, ureteral injury and stent plan.']},
  'DVIU':{indications:'Selected short non-obliterative bulbar strictures and selected short veil-like recurrence after urethroplasty.',setup:['Map stricture length and location (RUG/VCUG/cystoscopy).','Allow urethral rest when reconstruction is being planned after recent instrumentation.'],steps:['Introduce the urethrotome under direct vision to the distal stricture.','Identify the true lumen before incision; do not blindly cut into periurethral tissue.','Incise the fibrotic segment under direct vision until the lumen accommodates the chosen instrument/catheter without force.','Control bleeding and inspect proximal urethra/bladder when appropriate.','Place catheter/stent drainage according to the exact case and local protocol.'],checkpoints:['Do not use DVIU as solitary treatment for long >2 cm strictures.','Do not use DVIU for penile strictures.','For VUAS/radiation BMS avoid deep 6 and 12 o’clock incisions.'],finish:['Record stricture length, location, incision pattern, catheter/stent and follow-up plan.']},
  'EPA urethroplasty':{indications:'Selected short bulbar urethral strictures where excision with tension-free primary anastomosis is anatomically appropriate.',setup:['Confirm exact stricture length/location and urethral rest.','Perineal approach; flexible cystoscopy and calibrated instruments available.'],steps:['Position in lithotomy and make a midline perineal incision.','Develop the bulbar urethra circumferentially as needed while preserving vascularity.','Identify the fibrotic segment and divide/remove the diseased portion only to healthy urethral ends.','Spatulate the urethral ends appropriately.','Approximate urethral ends in a tension-free, watertight fashion with interrupted/continuous sutures according to technique.','Interpose healthy tissue/vascular support according to the operation.','Perform leak assessment per local protocol and place an appropriately sized urethral catheter.'],checkpoints:['Avoid over-resection that causes tension or chordee.','Do not sacrifice healthy urethral length unnecessarily.'],finish:['Document stricture length, excised length, anastomotic tension, catheter duration plan and follow-up.']},
  'BMG urethroplasty':{indications:'Anterior urethral strictures not suitable for excision and primary anastomosis.',setup:['Map the stricture; assess oral cavity and buccal donor site.','Choose dorsal/ventral/lateral graft approach based on anatomy and expertise.'],steps:['Expose the diseased urethra through the chosen approach.','Open the stricture across its full fibrotic length to healthy urethral mucosa.','Harvest buccal mucosa, defat and tailor the graft.','Quilt the graft to the recipient bed with meticulous haemostasis and broad contact.','Reconstruct the urethral tube/plate according to the chosen single-stage technique.','Ensure catheter lies freely without torsion or pressure points.'],checkpoints:['Do not place a graft onto a poorly vascularized bed without addressing the recipient bed.','Inspect the entire stricture rather than treating only the tightest point.'],finish:['Document graft site/size, stricture length, catheter plan and oral-site care.']},
  'TURP':{indications:'Bothersome moderate-to-severe BPO, especially in appropriate 30–80 mL glands when endoscopic resection is selected.',setup:['Review prostate anatomy, median lobe, ureteric orifices, anticoagulation and infection status.','Use bipolar or monopolar system according to equipment/expertise; ensure irrigation and diathermy safety.'],steps:['Cystoscopy and identify ureteric orifices, verumontanum and sphincter.','Create orientation incisions/grooves and establish the resection plane.','Resect adenomatous tissue systematically while maintaining orientation to the surgical capsule and verumontanum.','Maintain meticulous haemostasis throughout rather than leaving a large bleeding surface at the end.','Evacuate chips and inspect for residual obstructing tissue or bladder injury.','Insert a catheter and establish appropriate irrigation according to bleeding.'],checkpoints:['Protect the external sphincter and ureteric orifices.','Watch resection time, irrigation balance and bleeding.','Use the local protocol for TUR syndrome prevention/monitoring.'],finish:['Record prostate appearance/estimated volume, chips, haemostasis, catheter size and irrigation plan.']},
  'HoLEP':{indications:'Endoscopic anatomical enucleation for BPO including large glands.',setup:['Review prostate size/anatomy, anticoagulation plan and equipment.','Laser, morcellator, retrieval system and bladder integrity checked.'],steps:['Cystoscopy and identify ureteric orifices, verumontanum and sphincter.','Mark/define apical and bladder-neck landmarks.','Develop the correct enucleation plane between adenoma and surgical capsule.','Enucleate lobes systematically toward the bladder, maintaining orientation and haemostasis.','Place adenoma in the bladder and achieve meticulous haemostasis.','Morcellate in the bladder under direct vision only when the bladder is safely distended and no injury is evident.','Inspect the bladder and prostatic fossa; evacuate residual tissue and place catheter.'],checkpoints:['Never morcellate blindly or against the bladder wall.','Keep the apical dissection controlled to protect sphincter function.'],finish:['Document enucleated weight, morcellation, haemostasis, catheter and postoperative voiding plan.']},
  'Radical cystectomy + PLND':{indications:'Definitive local treatment for selected MIBC and selected high-risk recurrent NMIBC.',setup:['Complete staging, perioperative fitness and MDT review.','Discuss urinary diversion and document the selected conduit/neobladder strategy.'],steps:['Access abdomen and inspect for occult metastatic disease.','Perform pelvic dissection with identification/protection of ureters and major vessels.','Mobilize bladder and control vesical pedicles according to the planned open/laparoscopic/robotic approach.','Divide ureters and obtain distal ureteral margins according to oncologic plan.','Complete male/female organ en-bloc dissection as indicated by tumour and sex-specific anatomy.','Perform pelvic lymph-node dissection according to the planned template.','Create the selected urinary diversion with meticulous bowel handling and ureteroenteric anastomoses.','Establish drains/catheters and confirm haemostasis.'],checkpoints:['Maintain oncologic en-bloc planes; avoid tumour violation.','Ensure ureteral length and perfusion are sufficient for the diversion without tension.','Confirm bowel anastomosis and urinary anastomosis integrity.'],finish:['Document pT/pN specimen mapping, node packet(s), ureteric margins, diversion type and drains.']},
  'Radical prostatectomy':{indications:'Definitive local treatment for appropriate localized/high-risk prostate cancer in selected patients.',setup:['Review MRI anatomy, apical involvement, neurovascular bundle goals and nodal template.','Discuss continence/erection priorities and nerve-sparing plan before incision.'],steps:['Access the pelvis and expose the prostate/seminal vesicles according to the selected approach.','Control the dorsal venous complex and establish apical visibility.','Dissect the apex and urethra with careful sphincter preservation.','Develop the anterior/posterolateral planes and mobilize seminal vesicles.','Control the pedicles, preserving neurovascular tissue when oncologically safe.','Divide the urethra and remove prostate/seminal vesicles en bloc.','Perform vesicourethral anastomosis and test for watertight integrity.','Perform PLND when indicated by the preoperative risk/nomogram and local policy.'],checkpoints:['Never sacrifice oncologic margins for nerve sparing.','Protect ureteric orifices and rectal wall.','Ensure anastomosis is tension free.'],finish:['Document nerve-sparing grade/side, PLND template, margin orientation and catheter plan.']},
  'Partial nephrectomy':{indications:'Nephron-sparing treatment for suitable localized renal masses.',setup:['Review CT for tumour depth, hilar proximity, segmental vessels and collecting-system relationship.','Plan clamping strategy and renorrhaphy before incision.'],steps:['Expose kidney and mobilize only as much as necessary to obtain safe tumour access.','Identify renal artery/vein and planned selective/global clamping strategy.','Mark resection margin and control visible tumour-bearing renal segment.','Excise tumour with a rim of normal parenchyma as required by the planned technique.','Secure collecting-system entry when present.','Control segmental vessels and perform renorrhaphy/parenchymal reconstruction with selective sutures/hemostatic agents.','Release clamp and confirm haemostasis/perfusion.'],checkpoints:['Minimize unnecessary parenchymal loss while maintaining oncologic control.','Do not rely on haemostatic agents to compensate for an insecure collecting-system or vessel repair.'],finish:['Document warm ischaemia/clamp time, estimated blood loss, collecting-system entry and specimen margins.']},
  'Radical nephrectomy':{indications:'Renal tumours not suitable for nephron-sparing surgery.',setup:['Review venous thrombus, renal hilum, adjacent-organ involvement and adrenal findings.'],steps:['Mobilize colon and expose the kidney.','Control renal artery and vein with attention to accessory vessels and thrombus.','Mobilize kidney and perinephric tissues en bloc within the intended oncologic plane.','Address adrenal/adjacent organs only when indicated by tumour involvement or oncologic strategy.','Remove specimen without tumour violation and achieve haemostasis.'],checkpoints:['Map major vessel anatomy before hilar ligation.','Do not perform routine adrenalectomy simply because the tumour is large unless indicated.'],finish:['Document renal vessels, adjacent-organ procedures, nodes/adrenal decisions and specimen orientation.']},
  'Radical nephroureterectomy':{indications:'High-risk UTUC requiring radical extirpation.',setup:['Review kidney, ureter and distal ureter/bladder cuff on imaging.','Plan one-piece or multi-position approach without leaving the distal ureter untreated.'],steps:['Control the renal hilum and remove the kidney with perinephric tissue according to oncologic plane.','Mobilize the entire ureter down to the intramural segment.','Excise a complete bladder cuff around the ureteric orifice.','Close the bladder defect securely and inspect for leakage.','Perform lymph-node dissection when indicated.'],checkpoints:['The distal ureter and bladder cuff are integral to oncologic completeness.','Avoid tumour seeding from ureteral transection or manipulation.'],finish:['Document bladder cuff, margins, node template and urinary drainage.']},
  'RPLND':{indications:'Selected germ-cell tumour patients with stage IIA marker-negative NSGCT and post-chemotherapy residual disease according to the precise pathway.',setup:['Use a high-volume centre; review tumour markers, CT and prior chemotherapy.','Plan nerve-sparing template according to stage and side.'],steps:['Midline abdominal access and exposure of the retroperitoneum.','Identify great vessels, ureters and sympathetic chain.','Develop the planned template, controlling lymphatic channels and preserving nerves where oncologically safe.','Remove nodal tissue en bloc by the defined template.','For post-chemotherapy disease, address fibrosis and adherent masses carefully; involve vascular/adjacent-organ expertise when needed.'],checkpoints:['Template must be stage- and laterality-specific.','Do not convert an oncologically indicated dissection into an incomplete sampling procedure merely to preserve nerves.'],finish:['Document template, nerve-sparing intent/actuality, vascular/organ procedures and drains.']},
  'Pyeloplasty':{indications:'Symptomatic/obstructed UPJ obstruction in appropriately selected patients.',setup:['Review CT/functional imaging, crossing-vessel anatomy and renal function.'],steps:['Expose renal pelvis and proximal ureter through the chosen approach.','Identify and preserve any crossing vessel.','Transect the stenotic UPJ and spatulate the ureter.','Perform a tension-free, watertight dismembered anastomosis with the correct orientation around crossing anatomy.','Place a ureteral stent and confirm free drainage.'],checkpoints:['Avoid an anastomosis under tension or around an unrecognized crossing vessel.','Preserve ureteral vascularity during mobilization.'],finish:['Document crossing vessel, anastomotic configuration, stent and drain plan.']}
};
const GUIDELINE_ADDENDA = {
"Ca Prostate":[
 {title:"10. 2026 risk-definition side table",src:["EAU-PCa", "NCCN"],verified:"2026-11-10",items:[
  ["EAU low risk","ISUP GG1 + PSA <10 ng/mL + cT1–2 (clinical T from DRE)."],
  ["EAU favourable intermediate","GG2 + PSA <10 + cT1–2 OR GG1 + PSA 10–20 + cT1–2."],
  ["EAU unfavourable intermediate","GG2 + PSA 10–20 + cT1–2 OR GG3 cT1–2."],
  ["EAU high risk","GG4/5 OR PSA >20 ng/mL, localized; locally advanced = cT3–4 and/or cN+ regardless of GG/PSA."],
  ["NCCN 2026 note","The very-low-risk category was removed from recent NCCN prostate updates; do not use the older five-tier table without checking the current version."],
  ["Biopsy GG1 uncertainty","In a contemporary MRI-targeted-biopsy cohort, 72% of selected biopsy GG1 cases had GG≥2 at RP; 9% GG≥3, pT3a 25%, pT3b 4%. These are cohort estimates, not universal patient probabilities."],
  ["RP GG1 behaviour","In large RP-only series restricted to GG1, EPE was ~0.3%, BCR ~3.5%, with no SVI or LN metastasis in the cited series; biopsy GG1 is different because of sampling error."],
  ["Natural history","EAU cites approximately 1%/year progression from GG1 to higher grade in selected AS cohorts; this is not a treatment-trigger on its own." ]
 ]},
 {title:"11. ISUP / Gleason pathology — full working rules",src:["EAU-PCa", "NCCN", "ISUP"],verified:"2026-11-10",items:[
  ["Grade Group mapping","GG1=3+3=6; GG2=3+4=7; GG3=4+3=7; GG4=4+4=8, 3+5=8 or 5+3=8; GG5=4+5=9, 5+4=9 or 5+5=10."],
  ["Pattern selection","Primary pattern is the dominant architectural pattern; the secondary pattern is the highest grade present according to the specimen-specific ISUP reporting convention. Do not infer grade from the summed number alone."],
  ["Biopsy versus RP","Biopsy and radical-prostatectomy specimens have different rules for limited higher-grade/tertiary components. Record tertiary pattern explicitly rather than silently converting it to a different GG."],
  ["Pattern 4 quantity","% pattern 4 is reported as a prognostic descriptor in appropriate GG2/3 biopsies; it does not create a new Grade Group."],
  ["Cribriform / IDC","Invasive cribriform architecture and intraductal carcinoma are adverse features. EAU advises excluding cribriform/IDC on biopsy from routine active-surveillance pathways; document separately from GG."],
  ["Neuroendocrine/small-cell","Pure small-cell/neuroendocrine carcinoma is not graded with routine Gleason scoring; treat and stage as a distinct aggressive entity." ]
 ]},
 {title:"12. Diagnostic accuracy / staging",src:["EAU-PCa", "NCCN", "TNM9"],verified:"2026-11-10",items:[
  ["PSA screening test","EAU-cited meta-analysis in referred men: PSA ≥4 ng/mL sensitivity ~0.93 and specificity ~0.20; performance varies strongly with threshold and population."],
  ["DRE","Abnormal DRE has a higher biopsy positivity rate when PSA is elevated; DRE should not be used as a standalone rule-out test."],
  ["mpMRI","Use PI-RADS v2.1. Current EAU evidence supports MRI as a central triage test; sensitivity/specificity depend on threshold, population and biopsy strategy."],
  ["PSMA PET/CT","For high-risk nodal staging, prospective data show high specificity (~0.95) but only moderate sensitivity (~0.40 in one surgical-validation cohort); a negative scan does not exclude microscopic nodal disease."],
  ["Biopsy technique","For PI-RADS lesions, targeted biopsy plus appropriate perilesional/systematic sampling reduces clinically significant disease being missed by targeted cores alone." ]
 ]},
 {title:"13. Node management / ePLND template",src:["EAU-PCa", "NCCN"],verified:"2026-11-10",items:[
  ["Who needs ePLND","Use current nomogram/risk thresholds rather than stage alone; MRI/PSMA PET negative does not equal microscopic-node negative."],
  ["Common extended template","Obturator + external iliac + internal iliac nodal packets, extending cranially toward the common iliac bifurcation according to institutional template; document exactly what was removed."],
  ["Yield matters","A node dissection is therapeutic/staging surgery, not a substitute for proper systemic risk stratification. Report node count, positive count and extranodal extension." ]
 ]},
 {title:"14. Localized treatment — if/then matrix",src:["EAU-PCa", "NCCN"],verified:"2026-11-10",items:[
  ["Low risk / LE >10 y","Active surveillance is the usual disease-control strategy; RP or RT are alternatives after shared decision-making."],
  ["Low risk / LE ≤10 y","Watchful waiting is generally favoured over curative local therapy when competing mortality dominates."],
  ["Favourable intermediate","Selected AS patients may be considered; otherwise RP or definitive RT. Avoid treating every GG2 case identically."],
  ["Unfavourable intermediate","Definitive local therapy: RP with appropriate nodal staging or RT + short-course ADT; selected brachytherapy combinations follow guideline criteria."],
  ["High / locally advanced","Curative multimodality options include RP + appropriate nodal staging in selected fit patients or definitive RT + long-term ADT; selected high-risk RT pathways may include brachytherapy boost or systemic intensification depending current NCCN/EAU version."],
  ["Focal therapy","Not a routine substitute for standard curative treatment; use only in properly selected patients / trials or guideline-supported contexts." ]
 ]},
 {title:"15. Advanced disease — treatment map",src:["EAU-PCa", "NCCN", "Labels"],verified:"2026-11-10",items:[
  ["mHSPC foundation","Maintain continuous ADT. Add life-prolonging ARPI and/or docetaxel according to disease state, fitness, prior therapy and current guideline criteria."],
  ["Triplet therapy","ARASENS = ADT + docetaxel + darolutamide; PEACE-1 = ADT + docetaxel + abiraterone/prednisone. Triplet evidence is strongest in patients who are fit for docetaxel; disease-volume and guideline context matter."],
  ["Low-volume mHSPC","Add prostate-directed RT in appropriate newly diagnosed metastatic disease; metastatic-directed treatment can be considered selectively in oligometastatic settings."],
  ["nmCRPC","Continue ADT. When PSA-DT ≤10 months and M0 disease is confirmed, apalutamide, enzalutamide or darolutamide are established intensification options."],
  ["mCRPC after ARPI / taxane","Maintain castrate testosterone and select therapy according to prior ARPI, docetaxel, symptoms, visceral disease, HRR/MMR status and PSMA expression. Avoid simply cycling ARPIs when cross-resistance is likely."],
  ["mCRPC biomarker branches","BRCA/HRR alteration → PARP strategy where indicated; PSMA-positive disease after appropriate prior therapy → Lu-177-PSMA; selected symptomatic bone-predominant disease → bone-directed/radiopharmaceutical pathway; suspected aggressive-variant/neuroendocrine transformation → biopsy when clinically appropriate." ]
 ]},
 {title:"16. BCR / salvage",src:["EAU-PCa", "NCCN"],verified:"2026-11-10",items:[
  ["After RP","EAU BCR risk: low-risk if PSA-DT >1 year and pathological GG <4; high-risk if PSA-DT ≤1 year or pGG4–5. Early salvage RT is recommended rather than waiting for a high PSA in suitable patients."],
  ["After RT","Phoenix definition = PSA nadir +2 ng/mL. Restage when results will change treatment."],
  ["High-risk BCR","EMBARK-style high-risk BCR includes PSA-DT ≤9 months; exact entry criteria and local regulatory indication must be checked before systemic intensification."],
  ["Do not delay salvage","Serial PSA rise after RP should trigger early-salvage evaluation; PSMA PET can alter fields but should not become a reason to delay potentially curative salvage RT." ]
 ]},
 {title:"17. Follow-up / survivorship",src:["EAU-PCa", "NCCN"],verified:"2026-11-10",items:[
  ["AS","PSA-based monitoring, DRE when indicated, repeat MRI and confirmatory/surveillance biopsy according to protocol; a single PSA fluctuation is not an automatic progression event."],
  ["After curative treatment","Use PSA surveillance; imaging is driven by PSA kinetics, symptoms and whether a result will alter treatment."],
  ["Long-term effects","ADT: metabolic, bone, cardiovascular and sexual health; RT/RP: urinary, bowel and sexual outcomes; monitor and manage survivorship issues proactively." ]
 ]}
],
"Ca Bladder":[
 {title:"9. 2026 NMIBC classification / complete treatment branches",src:["EAU-NMIBC"],verified:"2026-11-10",items:[
  ["Initial TURB quality","Document tumour site/number/size, completeness of resection, detrusor muscle, CIS/variant suspicion and whether ureteric orifices/prostatic urethra are involved."],
  ["Re-TURB 2–6 weeks — indications","Do re-TURB for incomplete initial resection, any T1 tumour, and when detrusor muscle is absent from the initial specimen except selected situations where a second resection is not indicated by the current guideline. Re-resection is also used when pathology quality/staging is inadequate."],
  ["Immediate single instillation","Give as soon as possible after TURB, generally within 24 h, when there is no suspected perforation, significant bleeding, or other contraindication. Common evidence-based regimens include gemcitabine 2 g/100 mL intravesical with ~1-h dwell, or mitomycin C according to institutional concentration/order set."],
  ["Low-risk NMIBC","Single post-TURB instillation is sufficient treatment for most low-risk tumours; further intravesical therapy is usually unnecessary unless recurrence pattern changes the risk group."],
  ["Intermediate-risk","Use risk-adapted intravesical chemotherapy and/or BCG. Duration and maintenance intensity depend on recurrence risk and BCG tolerance."],
  ["High / very-high risk","Full-dose BCG induction + maintenance is a standard bladder-preserving pathway; immediate/early RC is an option and should be discussed in selected very-high-risk/BCG-unresponsive settings."],
  ["BCG-unresponsive","Do not simply repeat BCG. Consider radical cystectomy where fit; bladder-sparing systemic/intravesical options depend on papillary vs CIS phenotype, availability and current guideline/approval status." ]
 ]},
 {title:"10. BCG definitions / maintenance protocols",src:["EAU-NMIBC"],verified:"2026-11-10",items:[
  ["Adequate BCG","Use the guideline definition requiring an adequate induction course plus maintenance/re-induction exposure; document actual instillations, not merely 'BCG given'."],
  ["BCG-refractory / relapsing / unresponsive","Timing of recurrence after adequate BCG determines the category; use current EAU/NCCN tables rather than the older generic label 'BCG failure'."],
  ["EAU 2026 new evidence","2026 EAU added dedicated treatment tables for BCG-unresponsive papillary tumours and CIS ± papillary disease and updated BCG-failure recommendations."],
  ["Maintenance BCG","A common SWOG-style approach is 3 weekly instillations at months 3, 6, 12, 18, 24, 30 and 36 after induction; EAU allows risk-adapted maintenance up to 1–3 years. The exact schedule should be entered into the local BCG order set."],
  ["BCG safety","Do not instil with symptomatic UTI, traumatic catheterisation, visible significant haematuria or soon after bladder instrumentation/perforation. Evaluate persistent fever/systemic symptoms urgently." ]
 ]},
 {title:"11. MIBC — every cisplatin branch",src:["EAU-MIBC"],verified:"2026-11-10",items:[
  ["Cisplatin eligible","Typical criteria include PS 0–1, GFR generally >50–60 mL/min, no grade ≥2 hearing loss, no grade ≥2 neuropathy and no NYHA III heart failure; apply the complete institutional/EAU/NCCN definition."],
  ["Cisplatin-ineligible but fit for perioperative therapy","Do not stop at 'no cisplatin'. 2026 guidance/evidence includes perioperative enfortumab vedotin + pembrolizumab for cisplatin-ineligible MIBC in appropriate candidates (KEYNOTE-905/EV-303), as well as other guideline/approval-defined options."],
  ["Cisplatin-eligible perioperative immunotherapy","Two evidence-based options: (1) NIAGARA: durvalumab 1500 mg + gemcitabine/cisplatin q3w × 4, cystectomy + pelvic LND, then durvalumab q4w × 8; (2) KEYNOTE-B15/EV-304: EV + pembrolizumab × 4 cycles before and EV × 5 + pembrolizumab × 13 cycles after cystectomy (FDA Jul 2026; EFS HR 0.53 and OS benefit vs neoadjuvant GC). No head-to-head comparison exists; choose at MDT by neuropathy, diabetes, renal function and access."],
  ["Cisplatin-ineligible but carboplatin-eligible","Carboplatin is not an equivalent neoadjuvant substitute for cisplatin in MIBC. Discuss definitive local therapy, perioperative EV+pembro where indicated, clinical trial or bladder-preservation pathways rather than reflexively substituting GemCarbo as NAC."],
  ["Platinum-unfit","Use definitive local therapy when feasible, trimodality bladder preservation in selected candidates, or systemic therapy/clinical trial according to the current guideline and patient fitness."],
  ["CheckMate 901 branch","For advanced/metastatic cisplatin-fit urothelial carcinoma, GC + nivolumab is an evidence-based alternative when EV is unsuitable/unavailable, with nivolumab maintenance."],
  ["Bladder preservation","Best candidates generally have a solitary/unifocal cT2 tumour, no extensive CIS, no major hydronephrosis, good bladder function and a maximal-quality TURB. Typical RT schedules are 64–66 Gy conventional fractionation or guideline-supported hypofractionation with a concurrent radiosensitizer." ]
 ]},
 {title:"12. Metastatic UC — cisplatin/carbo/platinum-unfit algorithm",src:["EAU-MIBC", "Labels"],verified:"2026-11-10",items:[
  ["EV + pembrolizumab eligible","EAU 2026 describes EV+pembro as the new first-line standard for fit patients with advanced/metastatic UC; benefit was seen irrespective of cisplatin eligibility, PD-L1 expression or liver metastases in EV-302."],
  ["EV contraindication / unavailable","Use platinum chemotherapy + immunotherapy integration according to the current regimen/approval. EV can be problematic with grade ≥2 neuropathy, uncontrolled diabetes, significant skin disorders or other toxicity considerations."],
  ["Cisplatin fit","GC is the standard chemotherapy backbone; ddMVAC is another evidence-based regimen. If adding IO, current guideline/label and trial selection determine whether GC+nivolumab or other approved combinations are appropriate."],
  ["Carboplatin fit","GemCarbo is the classic platinum option for cisplatin-ineligible patients who remain carboplatin eligible. After non-progression on platinum-gemcitabine, switch-maintenance avelumab is an established pathway when no EV+pembro-first strategy has already been used."],
  ["Unfit for any platinum","Systemic immunotherapy may be appropriate for selected patients based on current PD-L1/approval criteria; otherwise best supportive care and symptom-directed therapy are appropriate."],
  ["After platinum / IO","Use prior-treatment-aware ADC/targeted pathways: enfortumab vedotin, erdafitinib for actionable FGFR alterations, HER2-directed therapy in eligible settings, or other approved later-line regimens/trials."],
  ["Oligometastatic disease","A limited metastatic burden may be considered for metastasis-directed therapy after systemic response in highly selected patients; evidence remains lower level than first-line systemic therapy." ]
 ]},
 {title:"13. LN templates / pathology templates",src:["EAU-NMIBC", "EAU-MIBC"],verified:"2026-11-10",items:[
  ["Radical cystectomy pelvic LND","Document at minimum the standard pelvic template used by the unit (external iliac, internal iliac/hypogastric and obturator packets); extended templates may include common iliac/presacral nodes. Report side, packet and node count."],
  ["TURB pathology checklist","Site, laterality, number/size, Ta/T1/T2, CIS, histologic subtype/variant, grade, detrusor muscle, LVI, prostatic urethral involvement, margins when applicable and completeness of resection."],
  ["Cystectomy pathology","pT/pN, number of nodes examined/positive, ENE, LVI, margins, variant histology, CIS, urethral margin and response to neoadjuvant therapy." ]
 ]},
 {title:"14. Follow-up / surveillance",src:["EAU-NMIBC", "EAU-MIBC"],verified:"2026-11-10",items:[
  ["NMIBC low/intermediate","First cystoscopy at 3 months. Subsequent frequency is risk-adapted; use urine cytology and upper-tract imaging where indicated by risk/presentation."],
  ["High/very-high NMIBC","Close cystoscopy + cytology, commonly every 3 months for the first 2 years, then every 6 months to 5 years and annually thereafter in guideline-based high-risk pathways; adapt to current EAU/NCCN schedule."],
  ["Post-cystectomy MIBC","Risk-adapted cross-sectional imaging of chest/abdomen/pelvis plus laboratory/renal surveillance; monitor upper tract, urethra and functional outcomes."],
  ["Systemic therapy follow-up","Include immune-related toxicity, neuropathy, skin toxicity, glycaemic control, renal function and nutritional/functional assessment according to treatment used." ]
 ]}
],
"Ca Penis":[
 {title:"9. Complete cN0 decision matrix",src:["EAU-Penile"],verified:"2026-11-10",items:[
  ["Low occult-node risk","PeIN/Ta/T1a low-grade without adverse features → surveillance of groins is acceptable if reliable follow-up."],
  ["Higher occult-node risk","T1b, higher grade, LVI or T2+ → bilateral invasive nodal staging, usually DSNB or ILND according to expertise/current guideline."],
  ["Ultrasound/FNA","Suspicious groin node → high-resolution US + FNA/core confirmation before committing to complex nodal therapy when feasible."],
  ["Negative DSNB does not mean forever negative","Follow-up remains mandatory because occult disease risk is time-dependent and drainage can evolve." ]
 ]},
 {title:"10. cN1–cN3 / contralateral / pelvic nodes",src:["EAU-Penile"],verified:"2026-11-10",items:[
  ["cN1","Confirm metastasis; treat inguinal disease with guideline-defined ILND approach. Cross-sectional staging is used according to burden/risk."],
  ["cN2","Bulky/multiple mobile nodes and/or bilateral disease require multimodal planning; neoadjuvant chemotherapy is considered in appropriate chemo-fit patients, particularly when nodal burden is high."],
  ["cN3","Fixed inguinal nodes, skin involvement and/or pelvic nodal disease are advanced regional disease. Upfront surgery alone rarely cures and carries substantial morbidity; use systemic downstaging first when chemotherapy-fit."],
  ["TIP / trial evidence","TIP = paclitaxel 175 mg/m² day 1 + ifosfamide 1,200 mg/m² days 1–3 + cisplatin 25 mg/m² days 1–3, generally q3–4 weeks for 4 cycles in published prospective protocols. Reassess response; responders may proceed to consolidative radical ILND ± PLND when resectable."],
  ["Contralateral groin","Do not hard-code an old '2 nodes = automatic contralateral dissection' rule. Base bilateral management on primary drainage, clinically involved sides, pathological burden/ENE and current EAU/NCCN pathway."],
  ["Pelvic nodes","Pelvic dissection is indicated in defined high-volume nodal disease/ENE settings; document ipsilateral vs contralateral pelvic involvement and exact template."],
  ["Response matters","In contemporary EAU discussion, about half of cN2–cN3 patients respond to combination chemotherapy, and selected responders undergoing consolidative surgery have reported ~50% 5-year OS; this is cohort evidence, not an individual prediction." ]
 ]},
 {title:"11. Primary tumour — histology-specific nuance",src:["EAU-Penile", "WHO2022"],verified:"2026-11-10",items:[
  ["Usual SCC","Most common penile malignancy; stage/grade/LVI determine groin strategy."],
  ["HPV-associated variants","Warty and basaloid variants have distinct biology; HPV/p16 status can be informative, but treatment is still driven primarily by stage and nodal risk."],
  ["Verrucous / Buschke–Löwenstein spectrum","Locally destructive with low metastatic potential in the pure form; ensure expert pathology distinguishes it from conventional SCC with invasion."],
  ["Sarcomatoid / mixed variants","Aggressive behaviour; treat according to invasive component and nodal risk in MDT."],
  ["Penile-sparing surgery","Use oncologically safe excision with margin assessment; glansectomy, wide local excision, laser and reconstruction are selected according to site/depth." ]
 ]},
 {title:"12. Follow-up / quality of life",src:["EAU-Penile"],verified:"2026-11-10",items:[
  ["Early follow-up","Frequent genital and groin examination in the first 2 years because most nodal recurrences occur early."],
  ["Later follow-up","Gradually extend visits but continue long-term surveillance, especially after invasive disease or nodal metastasis."],
  ["Psychosexual outcomes","Document urinary stream, penile length/function, erectile/sexual function, body image and psychosocial impact; centralised care is highlighted in EAU 2026." ]
 ]}
],
"Ca Testis":[
 {title:"11. Stage I — complete decision table",src:["EAU-Testis"],verified:"2026-11-10",items:[
  ["Seminoma IA","Surveillance is preferred in compliant patients; one-cycle carboplatin AUC 7 is an alternative in selected patients. Routine adjuvant radiotherapy is not standard."],
  ["NSGCT IA / pT1 without vascular invasion","Surveillance is preferred for many compliant patients; selected patients may choose nerve-sparing RPLND or one-cycle BEP based on relapse risk and expertise."],
  ["NSGCT IB / vascular invasion","Relapse risk is substantially higher (roughly 40–50% in commonly cited series); offer surveillance, one-cycle BEP or nerve-sparing RPLND according to guideline criteria and patient preference."],
  ["Marker persistence after orchiectomy","Do not label as stage I if markers fail to decline appropriately. Marker kinetics may indicate occult metastatic disease and change the treatment pathway." ]
 ]},
 {title:"12. IGCCCG — full metastatic rules",src:["EAU-Testis", "IGCCCG2021", "Labels"],verified:"2026-11-10",items:[
  ["Good-risk NSGCT","Testicular/retroperitoneal primary acceptable, no non-pulmonary visceral metastases; AFP <1,000 ng/mL, β-hCG <5,000 IU/L and LDH <1.5× ULN."],
  ["Intermediate-risk NSGCT","No poor-risk feature, but AFP 1,000–10,000, β-hCG 5,000–50,000 or LDH 1.5–10× ULN."],
  ["Poor-risk NSGCT","Primary mediastinal NSGCT, non-pulmonary visceral metastases, AFP >10,000, β-hCG >50,000 or LDH >10× ULN."],
  ["Seminoma","Good risk when no non-pulmonary visceral metastasis; intermediate risk when non-pulmonary visceral metastasis is present. There is no poor-risk seminoma group in IGCCCG."],
  ["Treatment intensity","Good-risk NSGCT: BEP ×3 or EP ×4; intermediate/poor NSGCT: usually BEP ×4. Bleomycin-ineligible patients may receive VIP ×4 in appropriate settings. Seminoma IIC/advanced disease uses risk-adapted BEP/EP schedules." ]
 ]},
 {title:"13. Stage II / residual disease",src:["EAU-Testis", "TNM9"],verified:"2026-11-10",items:[
  ["IIA NSGCT marker-negative","Confirm that nodes are truly metastatic versus reactive/indeterminate. Nerve-sparing RPLND is an important option in expert centres."],
  ["IIA/IIB marker-positive","Treat according to metastatic germ-cell tumour principles rather than as a surgical-only stage."],
  ["Post-chemo NSGCT residual <1 cm","With normalized markers, surveillance can be used in selected patients; verify current NCCN/EAU criteria."],
  ["Post-chemo NSGCT residual ≥1 cm","With normalized/normalising markers, post-chemotherapy RPLND is standard for resectable residual disease. If markers rise, treat persistent active systemic disease rather than proceeding blindly to surgery."],
  ["Seminoma residual ≥3 cm","FDG-PET/CT can help assess residual viable disease after an adequate interval (typically at least 6–8 weeks after chemotherapy). PET is not a routine tool for tiny residuals." ]
 ]},
 {title:"14. RPLND templates / fertility",src:["EAU-Testis"],verified:"2026-11-10",items:[
  ["Template","Use side- and histology-specific nerve-sparing RPLND templates; document para-aortic, interaortocaval, paracaval/precaval and iliac boundaries as applicable."],
  ["Fertility","Discuss sperm cryopreservation before orchiectomy/chemotherapy/RPLND when relevant; counsel regarding ejaculatory dysfunction after retroperitoneal surgery and organ-sparing nerve techniques."],
  ["Long-term follow-up","Monitor hypogonadism, metabolic/cardiovascular health, renal function, hearing/neuropathy and secondary malignancy risk." ]
 ]}
],
"Ca Kidney":[
 {title:"11. Histology / treatment nuances",src:["EAU-RCC", "WHO2022"],verified:"2026-11-10",items:[
  ["Clear-cell RCC","Primary evidence base for modern IO/TKI combinations and KEYNOTE-564 adjuvant pembrolizumab."],
  ["Papillary RCC","Cabozantinib has prospective evidence (SWOG 1500/PAPMET). Molecular profiling may identify MET-driven or hereditary disease."],
  ["Chromophobe RCC","Usually indolent; modern metastatic evidence is thinner and extrapolation from ccRCC should be explicit."],
  ["Collecting duct / medullary","Aggressive non-ccRCC entities; platinum-based systemic approaches may be used in selected patients rather than standard ccRCC IO/TKI algorithms."],
  ["Sarcomatoid differentiation","Treat as high-risk biology; ICI-containing regimens are particularly relevant in ccRCC." ]
 ]},
 {title:"12. Bosniak / small renal mass complete branch",src:["EAU-RCC", "Bosniak2019"],verified:"2026-11-10",items:[
  ["Bosniak I–II","Benign in typical imaging; no oncologic treatment."],
  ["Bosniak IIF","Imaging surveillance; interval growth or increasing complexity triggers reassessment."],
  ["Bosniak III","Individualize surgery, ablation or surveillance according to age, comorbidity, size and imaging phenotype; do not automatically equate with 'must operate'."],
  ["Bosniak IV","High likelihood of malignancy; treat according to surgical fitness/oncologic context."],
  ["SRM","For small renal masses, PN is preferred when technically feasible. Active surveillance and ablation are established alternatives in selected patients, especially with frailty/comorbidity." ]
 ]},
 {title:"13. Surgery / LN / adrenal template",src:["EAU-RCC"],verified:"2026-11-10",items:[
  ["Partial nephrectomy","Aim for nephron preservation with negative margins while minimizing ischemia/complications; RENAL/PADUA complexity supports planning but does not by itself dictate PN vs RN."],
  ["Radical nephrectomy","Remove kidney/perirenal tissues according to oncologic anatomy; routine adrenalectomy is not required without direct invasion or suspicious adrenal disease."],
  ["Clinically node-negative","Routine LND is not mandatory solely for staging. If nodes are clinically suspicious/positive, remove relevant regional nodes when useful for local control and staging."],
  ["Renal vein / IVC thrombus","Requires dedicated surgical staging and multidisciplinary planning; extent and level determine technique." ]
 ]},
 {title:"14. Adjuvant / metastatic risk",src:["EAU-RCC", "Labels"],verified:"2026-11-10",items:[
  ["KEYNOTE-564-defined adjuvant population","EAU 2026 supports pembrolizumab after complete resection for selected ccRCC: intermediate-high risk (e.g. pT2 grade 4/sarcomatoid or pT3), high-risk pT4 and/or N+, and selected M1 NED after complete metastasectomy in the defined time window."],
  ["IMDC","0 favourable; 1–2 intermediate; 3–6 poor, using KPS, diagnosis-to-treatment interval, Hb, calcium, neutrophils and platelets."],
  ["First-line ccRCC","Current EAU options include nivo/ipi, pembro/axi, lenva/pembro and nivo/cabo; regimen choice also depends on need for rapid response, contraindications and prior therapy."],
  ["Cytoreductive nephrectomy","Use selected/deferred CN principles from CARMENA/SURTIME: systemic therapy first in many patients, with CN reserved for carefully selected patients where benefit is plausible and disease is controlled."],
  ["Oligometastatic disease","EAU 2026 recognises selected metastasis-directed approaches, particularly after a complete response/stable systemic state; data remain heterogeneous." ]
 ]},
 {title:"15. RCC follow-up",src:["EAU-RCC"],verified:"2026-11-10",items:[
  ["After PN/RN","Risk-adapted chest/abdominal imaging, renal function/BP surveillance and recurrence assessment; tailor frequency to stage/grade."],
  ["CKD","Nephron preservation and long-term eGFR/proteinuria/BP monitoring are integral survivorship issues."],
  ["Imaging caveat","Do not perform indiscriminate brain/bone scans in asymptomatic low-risk patients; investigate symptoms/clinical triggers." ]
 ]}
],
"UTUC":[
 {title:"6. 2026 risk stratification / decision matrix",src:["EAU-UTUC"],verified:"2026-11-10",items:[
  ["Low-risk profile","Classically requires concordant favourable features such as low-grade cytology/biopsy, unifocal disease, small tumour burden and no convincing invasion on imaging. Use the current EAU composite criteria rather than one feature alone."],
  ["High-risk profile","High-grade cytology/biopsy, invasive aspect on imaging, larger/multifocal tumour, hydronephrosis, variant histology or other adverse features increase risk. Use the complete EAU table."],
  ["Kidney-sparing","Preferred for low-risk disease and used selectively for imperative indications in high-risk disease when radical surgery would threaten renal function."],
  ["Radical nephroureterectomy","High-risk localized disease → RNU with bladder cuff; lymphadenectomy is template/location dependent." ]
 ]},
 {title:"7. Perioperative systemic / local treatment",src:["EAU-UTUC", "Labels"],verified:"2026-11-10",items:[
  ["POUT","Adjuvant gemcitabine-platinum after RNU improves disease-free outcomes in appropriately staged high-risk UTUC."],
  ["Cisplatin timing","If postoperative renal function may preclude cisplatin, discuss perioperative strategy before RNU; preoperative systemic therapy is used selectively."],
  ["Endoscopic treatment","Requires complete/near-complete ablation and intensive second-look ureteroscopy/imaging; recurrence is common, so this is not 'one-and-done' therapy."],
  ["Intracavitary options","Mitomycin-containing gels/other topical therapy can be used in selected low-grade disease according to availability and current approvals; do not assume efficacy for high-grade invasive tumours." ]
 ]},
 {title:"8. LN / follow-up",src:["EAU-UTUC"],verified:"2026-11-10",items:[
  ["LN template","Template is side and tumour-location specific (renal pelvis vs upper/mid/lower ureter); document para-caval/para-aortic/interaortocaval and pelvic packets as relevant."],
  ["Follow-up after kidney-sparing","Early repeat ureteroscopy, cytology and cross-sectional imaging are mandatory components of surveillance; intensity is higher in high-risk kidney-sparing patients."],
  ["Post-RNU","Cystoscopy is needed because bladder recurrence is common; surveillance also includes imaging of the contralateral upper tract and systemic sites according to risk." ]
 ]}
],
"Urethral Cancer":[
 {title:"5. 2026 staging / histology-specific pathway",src:["EAU-Urethral", "TNM9", "WHO2022"],verified:"2026-11-10",items:[
  ["Histology","SCC, urothelial carcinoma and adenocarcinoma dominate; location (male anterior vs posterior/prostatic vs female urethral) changes drainage and surgery."],
  ["Work-up","MRI pelvis, endoscopic assessment and chest/abdomen imaging are selected according to invasive disease; biopsy should capture depth and histologic subtype."],
  ["Nodal disease","Use inguinal vs pelvic drainage according to tumour location. Node-positive disease generally needs multimodal therapy rather than surgery alone."],
  ["Advanced systemic therapy","Urothelial-type disease follows urothelial systemic pathways; SCC/adenocarcinoma uses site/histology-specific platinum and chemoradiation strategies with lower-level evidence due rarity." ]
 ]},
 {title:"6. Follow-up",src:["EAU-Urethral"],verified:"2026-11-10",items:[
  ["Local control","Examine urethra/pelvis and assess urinary function, recurrence and treatment morbidity."],
  ["High-risk disease","Cross-sectional imaging and endoscopic follow-up are individualized to stage, histology and treatment." ]
 ]}
],
"Adrenal / Neuroendocrine":[
 {title:"3. Functional and malignant adrenal pathway",src:["ESE-Adrenal", "ESE-ACC"],verified:"2026-11-10",items:[
  ["Pheochromocytoma before biopsy","Exclude biochemical catecholamine excess before attempting adrenal biopsy; biopsy a pheochromocytoma can precipitate a dangerous catecholamine crisis."],
  ["Cortisol autonomy","1-mg overnight dexamethasone suppression is a core screen; interpret with current endocrine criteria and medications/comorbidities."],
  ["Aldosterone","Use aldosterone/renin ratio in a hypertensive/hypokalaemic phenotype when primary aldosteronism is suspected."],
  ["ACC suspicion","Large/heterogeneous/irregular adrenal lesions, high unenhanced HU, delayed washout failure or hormone excess increase concern; refer to endocrine-oncology MDT."],
  ["Surgery","Functional/suspicious lesions are considered for adrenalectomy; minimally invasive surgery versus open en-bloc resection depends on size/invasion and oncologic expertise." ]
 ]}
]};

for (const [d, secs] of Object.entries(GUIDELINE_ADDENDA)) {
  if (DISEASES[d]) DISEASES[d].sections.push(...secs);
}

// Expanded trial library: trials are referenced contextually in disease cards and Oracle outputs.
TRIALS.push(
 ["Prostate","PREVAIL","Enzalutamide vs placebo in chemotherapy-naïve mCRPC.","mCRPC"],
 ["Prostate","AFFIRM","Enzalutamide in post-docetaxel mCRPC.","mCRPC"],
 ["Prostate","COU-AA-301 / 302","Abiraterone in post-docetaxel and chemotherapy-naïve mCRPC.","mCRPC"],
 ["Prostate","SPARTAN","Apalutamide + ADT in high-risk nmCRPC.","nmCRPC"],
 ["Prostate","PROSPER","Enzalutamide + ADT in high-risk nmCRPC.","nmCRPC"],
 ["Prostate","ARAMIS","Darolutamide + ADT in nmCRPC.","nmCRPC"],
 ["Prostate","ALSYMPCA","Radium-223 in symptomatic bone-predominant mCRPC without visceral disease.","mCRPC"],
 ["Prostate","TheraP","Lu-177 PSMA vs cabazitaxel in PSMA-positive mCRPC after docetaxel.","mCRPC"],
 ["Prostate","PSMAfore","Lu-177 PSMA in taxane-naïve PSMA-positive mCRPC after ARPI.","mCRPC"],
 ["Bladder","POTOMAC","Durvalumab + BCG in high-risk NMIBC; informs current EAU discussion of selected BCG-naïve intensification.","NMIBC"],
 ["Bladder","QED / THOR","Erdafitinib efficacy in FGFR-altered urothelial carcinoma.","Advanced"],
 ["Bladder","CheckMate 901","Nivolumab + GC in cisplatin-fit metastatic urothelial carcinoma.","Metastatic"],
 ["Bladder","EV-103 / KEYNOTE-869","Enfortumab vedotin + pembrolizumab in advanced urothelial carcinoma including cisplatin-ineligible cohorts.","Advanced"],
 ["Bladder","EV-301","Enfortumab vedotin after platinum + ICI in advanced urothelial carcinoma.","Later line"],
 ["Bladder","IMvigor130","Atezolizumab combinations in first-line advanced urothelial carcinoma; context for IO-era evolution.","Metastatic"],
 ["Bladder","KEYNOTE-361","Pembrolizumab + chemotherapy in advanced UC; historical phase III context.","Metastatic"],
 ["Penis","CheckMate-358","Nivolumab ± therapy exploration in advanced penile/genitourinary SCC cohorts.","Advanced"],
 ["Penis","AcSé pembrolizumab","Pembrolizumab basket experience including penile SCC.","Advanced"],
 ["Testis","SEMITEP","Response-adapted/de-escalation chemotherapy strategy in metastatic germ-cell tumour.","Metastatic"],
 ["Testis","MRC TE20 / carboplatin studies","Adjuvant carboplatin evidence base in stage I seminoma.","Stage I"],
 ["RCC","CONTACT-03","Atezolizumab after prior ICI + VEGF-directed therapy; negative confirmatory strategy, discouraging routine ICI rechallenge.","Later line"],
 ["RCC","LITESPARK","Belzutifan development programme in advanced RCC.","Later line"],
 ["UTUC","OLYMPUS","UGN-101/Jelmyto mitomycin gel for low-grade UTUC.","Low-risk"],
 ["UTUC","CheckMate 274 UTUC subgroup","Adjuvant nivolumab evidence includes upper-tract urothelial carcinoma subgroup analyses.","Adjuvant"]
);


