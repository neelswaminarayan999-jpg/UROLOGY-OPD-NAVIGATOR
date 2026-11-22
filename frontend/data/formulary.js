/* Urology Oracle © 2026 Dr Neel Swaminarayan. All rights reserved. */
/* V16.13 Urology drug formulary. Original summaries written for this app (not copied from any label, book or guideline),
   checked against EAU Male LUTS, AUA LUTS/BPH 2026, AUA/SUFU OAB 2024, EAU Sexual & Reproductive Health, EAU Urolithiasis,
   EAU Urological Infections 2026, product labels (FDA/EMA) and Campbell-Walsh-Wein 13e. Usual adult doses only:
   always confirm against the local formulary and current product label before prescribing.
   Each topic becomes a normal DISEASES page (so search, Viva, MCQs and the AI Lab use it) plus a "Compare drugs" table. */
Object.assign(SOURCES, {
  "EAU-MLUTS": { name: "EAU Management of Non-neurogenic Male LUTS (current edition)", url: "https://uroweb.org/guidelines/management-of-non-neurogenic-male-luts" },
  "AUA-BPH": { name: "AUA Management of LUTS attributed to BPH (2026)", url: "https://www.auanet.org/guidelines-and-quality/guidelines/benign-prostatic-hyperplasia-(bph)-guideline" },
  "EAU-SRH": { name: "EAU Sexual and Reproductive Health (current edition)", url: "https://uroweb.org/guidelines/sexual-and-reproductive-health" },
  "AUA-Men": { name: "AUA guidelines: Erectile Dysfunction, Testosterone Deficiency, Peyronie's Disease, Priapism, Kidney Stones (medical management)", url: "https://www.auanet.org/guidelines-and-quality/guidelines" },
  "EAU-Stones": { name: "EAU Urolithiasis (current edition)", url: "https://uroweb.org/guidelines/urolithiasis" },
  "EAU-UTI": { name: "EAU Urological Infections (2026)", url: "https://uroweb.org/guidelines/urological-infections" },
  "Campbell-Pharm": { name: "Campbell-Walsh-Wein Urology 13e — pharmacology and disease chapters (read for depth)", url: "https://shop.elsevier.com/search?query=campbell-walsh-wein%20urology" }
});

const FORMULARY = {
 "Drugs: BPH & Male LUTS": {
  emoji: "💊", color: "blue", sources: ["AUA-BPH", "EAU-MLUTS", "Labels", "Campbell-Pharm"],
  tagline: "Formulary • alpha-blockers (all) • 5-ARIs • tadalafil • add-on storage drugs • combinations • phytotherapy",
  badges: ["Drug formulary", "AUA LUTS/BPH 2026 • EAU Male LUTS"],
  classes: [
   { title: "Alpha-1 blockers", src: ["AUA-BPH", "EAU-MLUTS", "Labels"],
     about: [
      ["How they work", "Block α1-adrenoceptors in prostatic stroma, capsule and bladder neck smooth muscle (mainly α1A), lowering the dynamic part of obstruction. α1D receptors in bladder and spinal cord may help storage symptoms; α1B receptors in blood vessels cause the hypotensive side effects."],
      ["What to expect", "Effect within days. IPSS falls by roughly 30–40% and Qmax rises by about 20–25%. They do not shrink the prostate and do not reduce long-term risk of retention or surgery on their own. Efficacy is similar across agents; choose by side-effect profile, comorbidity and cost."],
      ["Guideline position", "AUA 2026: offer one of the uroselective agents — alfuzosin, silodosin or tamsulosin — for bothersome LUTS/BPH. EAU: offer α1-blockers to men with moderate-to-severe LUTS."],
      ["Floppy iris (IFIS)", "Intraoperative floppy iris syndrome during cataract surgery is most associated with tamsulosin, but can occur with any α1-blocker and persists after stopping. Ask about planned cataract surgery before starting; tell the eye surgeon. Stopping beforehand is of uncertain benefit."],
      ["Class interactions", "Additive hypotension with PDE5 inhibitors, antihypertensives, nitrates and alcohol. Start a PDE5 inhibitor only once the α-blocker dose is stable, at a low PDE5i dose. Strong CYP3A4 inhibitors raise levels of tamsulosin, silodosin and alfuzosin."]
     ],
     drugs: [
      { n: "Tamsulosin", dose: "0.4 mg once daily, 30 minutes after the same meal each day (0.2 mg is commonly used in Asia). Modified-release and OCAS forms.", adj: "No dose change in mild–moderate renal or hepatic impairment; not studied in CrCl < 10 mL/min or severe hepatic impairment.", ae: "Ejaculatory dysfunction (reduced or absent ejaculate), dizziness, rhinitis, orthostatic hypotension (less than non-selective agents). Highest IFIS association.", avoid: "History of orthostatic hypotension or syncope; caution with strong CYP3A4 or CYP2D6 inhibitors.", notes: "Also used off-label for medical expulsive therapy of distal ureteric stones and ureteric stent symptoms, and in women with voiding dysfunction." },
      { n: "Silodosin", dose: "8 mg once daily with food.", adj: "4 mg if CrCl 30–50 mL/min. Contraindicated if CrCl < 30 mL/min or severe hepatic impairment.", ae: "Most α1A-selective: very little hypotension, but retrograde ejaculation or anejaculation in up to about a quarter of men (reversible). Dizziness, nasal congestion, diarrhoea.", avoid: "Contraindicated with strong CYP3A4 inhibitors (for example ketoconazole, clarithromycin, ritonavir).", notes: "Good choice when blood pressure is low or labile; counsel about ejaculation. Evidence for medical expulsive therapy of distal stones." },
      { n: "Alfuzosin", dose: "10 mg extended-release once daily, straight after the same meal.", adj: "Avoid in moderate–severe hepatic impairment; caution if CrCl < 30 mL/min.", ae: "Dizziness, headache, fatigue; less ejaculatory dysfunction than tamsulosin or silodosin. Possible QT prolongation.", avoid: "Strong CYP3A4 inhibitors (contraindicated); caution with congenital long QT or other QT-prolonging drugs.", notes: "'Functionally uroselective' because of prostate tissue distribution. Started at catheterisation for acute retention, it improves the chance of a successful trial without catheter (ALFAUR)." },
      { n: "Doxazosin", dose: "Standard tablet 1 mg at night, titrated stepwise to 2, 4 and up to 8 mg; GITS (XL) 4 mg once daily, up to 8 mg.", adj: "Caution in hepatic impairment; no renal adjustment.", ae: "Non-selective: first-dose hypotension and syncope, dizziness, fatigue, oedema.", avoid: "Orthostatic hypotension; avoid in men with heart failure as sole antihypertensive (the ALLHAT doxazosin arm stopped early for excess heart failure).", notes: "Useful where hypertension and LUTS coexist, but should not be the only antihypertensive. MTOPS showed doxazosin plus finasteride reduced progression more than either alone. Not among the AUA 2026 'offer' agents." },
      { n: "Terazosin", dose: "1 mg at bedtime, titrated over weeks to 5–10 mg once daily.", adj: "No renal adjustment.", ae: "First-dose hypotension, dizziness, asthenia, nasal congestion.", avoid: "Orthostatic hypotension; give the first dose at bedtime.", notes: "Older non-selective agent; requires titration. Prazosin is not recommended for BPH (short action, more hypotension)." }
     ] },
   { title: "5-alpha reductase inhibitors (5-ARIs)", src: ["AUA-BPH", "EAU-MLUTS", "Labels"],
     about: [
      ["How they work", "Block conversion of testosterone to dihydrotestosterone (DHT). Finasteride inhibits type 2 (DHT falls about 70%); dutasteride inhibits types 1 and 2 (DHT falls over 90%). The prostate shrinks by about 18–28% over 6–12 months."],
      ["Who benefits", "Men with an enlarged prostate: AUA 2026 uses volume > 30 mL and/or PSA > 1.5 ng/mL. They relieve symptoms slowly (3–6 months) and reduce the risk of acute urinary retention and BPH surgery (MTOPS, CombAT). Also used for persistent prostatic haematuria."],
      ["PSA interpretation", "PSA roughly halves after 6–12 months. Measure a baseline PSA first, and double the on-treatment value when screening. Any rise from the on-treatment nadir deserves evaluation."],
      ["Prostate cancer", "PCPT (finasteride) and REDUCE (dutasteride) showed fewer cancers overall but more high-grade cancers detected; labels carry a warning. 5-ARIs are not approved for cancer prevention. AUA 2026: they are unlikely to increase progression in men on active surveillance."],
      ["Precautions", "Teratogenic to a male fetus: women who are or may become pregnant should not handle crushed or broken tablets or leaking capsules. Defer blood donation (about 1 month after finasteride, 6 months after dutasteride). Discuss sexual side effects and reports of persistent symptoms after stopping."]
     ],
     drugs: [
      { n: "Finasteride", dose: "5 mg once daily (1 mg is the alopecia dose, not for BPH).", adj: "No renal adjustment; caution in hepatic impairment.", ae: "Reduced libido, erectile dysfunction, reduced ejaculate volume, gynaecomastia or breast tenderness (about 1–2%); mood change and depression reported (label warning).", avoid: "Not for women or children.", notes: "Takes 3–6 months for symptom benefit and up to 12 months for full volume reduction." },
      { n: "Dutasteride", dose: "0.5 mg capsule once daily; swallow whole (the contents irritate the mouth and throat).", adj: "No renal adjustment; caution in hepatic impairment.", ae: "Similar sexual side effects and breast changes to finasteride.", avoid: "Not for women or children; very long half-life (about 5 weeks).", notes: "Fixed-dose combination with tamsulosin (0.5 mg/0.4 mg) available; CombAT showed the combination beat either drug alone for symptoms and progression in large prostates." }
     ] },
   { title: "PDE5 inhibitor for LUTS", src: ["AUA-BPH", "EAU-MLUTS", "Labels"],
     about: [
      ["Tadalafil 5 mg daily", "AUA 2026 recommends daily tadalafil 5 mg for LUTS/BPH with or without erectile dysfunction. It improves IPSS (smaller effect on Qmax) and treats coexisting ED. Combining with an α-blocker or 5-ARI carries a weaker (conditional) recommendation."]
     ],
     drugs: [
      { n: "Tadalafil (daily, for LUTS)", dose: "5 mg once daily at about the same time.", adj: "CrCl 30–50 mL/min: start 2.5 mg; daily dosing not recommended if CrCl < 30 mL/min. Avoid in severe hepatic impairment.", ae: "Headache, dyspepsia, back pain and myalgia, flushing, nasal congestion.", avoid: "Any nitrate (including amyl nitrite) or riociguat; recent MI or stroke, unstable angina, hypotension; NAION history.", ix: "α-blockers: additive hypotension — doxazosin and terazosin combinations need particular caution. Strong CYP3A4 inhibitors increase levels.", notes: "See 'Drugs: Sexual Medicine & Androgens' for on-demand use and full PDE5i safety." }
     ] },
   { title: "Storage symptoms in men, combinations & phytotherapy", src: ["AUA-BPH", "EAU-MLUTS"],
     about: [
      ["Add-on antimuscarinic or β3 agonist", "For moderate-to-severe storage-predominant LUTS, an antimuscarinic or β3 agonist can be used alone or with an α-blocker (AUA 2026 conditional). Check the PVR first; use caution if it is raised (EAU: caution above about 150 mL). The risk of retention on add-on therapy is low in men with a small residual."],
      ["Fixed-dose combinations", "Dutasteride + tamsulosin; tamsulosin OCAS + solifenacin (NEPTUNE studies). They simplify dosing but reduce flexibility to stop one component."],
      ["Nocturia in men", "If nocturnal polyuria dominates, consider low-dose desmopressin (see 'Drugs: OAB, Bladder & Nocturia') with sodium monitoring."],
      ["Phytotherapy", "Products vary greatly in composition. EAU allows hexanic extract of Serenoa repens (saw palmetto) as an option for short-term symptom relief in men who want to avoid adverse effects. Most other plant extracts lack consistent evidence; AUA does not recommend dietary supplements for LUTS/BPH."]
     ],
     drugs: [] }
  ]
 },

 "Drugs: OAB, Bladder & Nocturia": {
  emoji: "🫙", color: "amber", sources: ["AUA-OAB", "EAU-FLUTS", "Labels", "Campbell-Pharm"],
  tagline: "Formulary • antimuscarinics (all) • mirabegron • vibegron • botulinum toxin • desmopressin • duloxetine • vaginal oestrogen",
  badges: ["Drug formulary", "AUA/SUFU OAB 2024 • EAU Female LUTS"],
  classes: [
   { title: "Antimuscarinics", src: ["AUA-OAB", "EAU-FLUTS", "Labels"],
     about: [
      ["How they work", "Block muscarinic (mainly M2 and M3) receptors on the detrusor and urothelium, reducing urgency and involuntary contractions during storage. Efficacy is broadly similar across agents; tolerability differs."],
      ["Contraindications", "Urinary retention, gastric retention, uncontrolled narrow-angle glaucoma, myasthenia gravis, severe ulcerative colitis or toxic megacolon, and hypersensitivity."],
      ["Cognition", "Cumulative anticholinergic burden is linked with dementia risk; discuss this before prescribing (AUA). Prefer a β3 agonist in older or cognitively vulnerable patients, and review the total anticholinergic load. Oxybutynin has the most central effects; trospium, a quaternary amine, crosses the blood–brain barrier least."],
      ["Practical", "Dry mouth is the commonest reason to stop; persistence is often below 30% at a year. Review at 4–8 weeks; try another drug or dose before calling treatment a failure. Extended-release and transdermal forms cause less dry mouth."]
     ],
     drugs: [
      { n: "Oxybutynin", dose: "Immediate release 2.5–5 mg two or three times daily (max 20 mg/day); extended release 5–30 mg once daily; transdermal patch 3.9 mg/day changed twice weekly; 10% gel once daily.", adj: "Use cautiously in hepatic or renal impairment and in older people.", ae: "Dry mouth (common with immediate release), constipation, blurred vision, cognitive effects, heat intolerance; patch site reactions.", avoid: "Frail or cognitively impaired older adults where possible.", notes: "Inexpensive; transdermal route avoids first-pass metabolite and reduces dry mouth. Intravesical oxybutynin is used in neurogenic bladder." },
      { n: "Tolterodine", dose: "2 mg twice daily, or 4 mg extended release once daily.", adj: "1 mg twice daily or 2 mg ER if severe renal impairment (CrCl < 30) or hepatic impairment, or with strong CYP3A4 inhibitors.", ae: "Dry mouth, constipation, headache; possible QT prolongation in CYP2D6 poor metabolisers at high exposure.", avoid: "Class contraindications.", notes: "Fesoterodine is its prodrug-related successor." },
      { n: "Fesoterodine", dose: "4 mg once daily, increase to 8 mg if needed.", adj: "Max 4 mg with CrCl < 30 mL/min or with strong CYP3A4 inhibitors; avoid in severe hepatic impairment.", ae: "Dry mouth, constipation.", avoid: "Class contraindications.", notes: "Studied specifically in older adults (SOFIA)." },
      { n: "Solifenacin", dose: "5 mg once daily, up to 10 mg.", adj: "Max 5 mg with CrCl < 30 mL/min, moderate hepatic impairment or strong CYP3A4 inhibitors; avoid in severe hepatic impairment.", ae: "Dry mouth, constipation (dose-related), blurred vision; QT prolongation at high exposure.", avoid: "Class contraindications.", notes: "Long half-life; fixed combination with tamsulosin for men. Also used for ureteric stent discomfort." },
      { n: "Darifenacin", dose: "7.5 mg once daily, up to 15 mg.", adj: "Max 7.5 mg with strong CYP3A4 inhibitors or moderate hepatic impairment; avoid in severe hepatic impairment.", ae: "Constipation more than dry mouth.", avoid: "Class contraindications.", notes: "M3-selective, which may mean fewer cardiac and CNS effects." },
      { n: "Trospium", dose: "20 mg twice daily on an empty stomach, or 60 mg extended release once daily.", adj: "20 mg once daily at bedtime if CrCl < 30 mL/min; ER form not recommended in severe renal impairment.", ae: "Dry mouth, constipation; little CNS penetration.", avoid: "Class contraindications.", notes: "Quaternary amine, renally excreted unchanged, few CYP interactions — useful with polypharmacy or cognitive concerns." },
      { n: "Propiverine", dose: "15 mg two or three times daily, or 30 mg modified release once daily (available in Europe and parts of Asia).", adj: "Avoid in moderate–severe hepatic impairment.", ae: "Dry mouth, blurred vision.", avoid: "Class contraindications.", notes: "Mixed antimuscarinic and calcium-channel action; paediatric formulations exist." }
     ] },
   { title: "Beta-3 agonists", src: ["AUA-OAB", "EAU-FLUTS", "Labels"],
     about: [
      ["How they work", "Stimulate detrusor β3-adrenoceptors, relaxing the bladder during filling. Efficacy is similar to antimuscarinics, without anticholinergic side effects or cognitive burden, so they are often preferred in older patients. They can be combined with an antimuscarinic when one drug is not enough."]
     ],
     drugs: [
      { n: "Mirabegron", dose: "25 mg once daily (US start) or 50 mg (EU usual); max 50 mg.", adj: "Max 25 mg if eGFR 15–29 mL/min or moderate hepatic impairment; avoid in end-stage renal disease or severe hepatic impairment.", ae: "Blood pressure rise, tachycardia, UTI, headache, nasopharyngitis.", avoid: "Severe uncontrolled hypertension (≥ 180/110 mmHg).", ix: "Moderate CYP2D6 inhibitor: raises levels of metoprolol, desipramine, flecainide and others; monitor digoxin levels (start digoxin at the lowest dose).", notes: "Check blood pressure at baseline and during treatment." },
      { n: "Vibegron", dose: "75 mg once daily (where available).", adj: "No adjustment down to eGFR 15 mL/min; not studied in dialysis or severe hepatic impairment.", ae: "Headache, nasopharyngitis, diarrhoea, UTI; no meaningful blood pressure signal in trials.", avoid: "Urinary retention risk when combined with antimuscarinics or in BOO.", ix: "No clinically important CYP2D6 inhibition; monitor digoxin.", notes: "Can be crushed and mixed with applesauce." }
     ] },
   { title: "Intradetrusor botulinum toxin", src: ["AUA-OAB", "EAU-FLUTS", "Labels"],
     about: [
      ["Products are not interchangeable", "Units differ between onabotulinumtoxinA (Botox), abobotulinumtoxinA and other products. Doses below refer to onabotulinumtoxinA."]
     ],
     drugs: [
      { n: "OnabotulinumtoxinA (intradetrusor)", dose: "Idiopathic OAB: 100 U diluted and injected at about 20 detrusor sites (trigone often spared). Neurogenic detrusor overactivity (spinal cord injury, MS): 200 U at about 30 sites.", adj: "Repeat when the effect wears off (typically 6–9 months), at least 12 weeks apart.", ae: "UTI; raised PVR or retention needing intermittent self-catheterisation (about 5–10% at 100 U; more at 200 U and in neurogenic patients); haematuria; rarely generalised weakness.", avoid: "Active UTI; retention or high PVR in a patient unwilling or unable to self-catheterise; myasthenia gravis or Lambert–Eaton; caution with aminoglycosides.", notes: "Confirm sterile urine and give antibiotic prophylaxis per protocol. Teach CISC beforehand." }
     ] },
   { title: "Desmopressin & nocturia drugs", src: ["EAU-FLUTS", "EAU-MLUTS", "Labels"],
     about: [
      ["Hyponatraemia", "The main risk, rising with age (especially ≥ 65), heart failure, renal impairment, and drugs such as thiazides, SSRIs, NSAIDs and carbamazepine. Check sodium at baseline, within the first week (about day 4–8), at 1 month and after any dose change; stop if sodium falls below the normal range. Restrict fluids from 1 hour before until 8 hours after a dose."]
     ],
     drugs: [
      { n: "Desmopressin", dose: "Nocturnal polyuria: low-dose orally disintegrating or sublingual products (for example 25 µg in women, 50 µg in men, as licensed) about 1 hour before bedtime. Nocturnal enuresis: tablets 0.2–0.4 mg or melt 120–240 µg at bedtime.", adj: "Avoid if eGFR < 50 mL/min (low-dose nocturia products).", ae: "Hyponatraemia (headache, nausea, confusion, seizures), fluid retention.", avoid: "Hyponatraemia, habitual or psychogenic polydipsia, heart failure, SIADH, loop diuretic or systemic glucocorticoid use; caution over 65.", notes: "Only for confirmed nocturnal polyuria on a frequency-volume chart; treat other causes first." }
     ] },
   { title: "Other bladder & continence drugs", src: ["EAU-FLUTS", "NICE-NG123", "Labels"],
     about: [],
     drugs: [
      { n: "Duloxetine (SUI)", dose: "40 mg twice daily; start 20 mg twice daily for 2 weeks to reduce nausea.", adj: "Avoid if CrCl < 30 mL/min or hepatic impairment.", ae: "Nausea (common), dry mouth, fatigue, insomnia, dizziness; discontinuation symptoms if stopped abruptly.", avoid: "MAOIs, uncontrolled narrow-angle glaucoma; caution with other serotonergic drugs.", notes: "Modest benefit for SUI and frequent discontinuation; offer only with clear counselling, not as routine first-line." },
      { n: "Vaginal oestrogen", dose: "Estriol 0.1% cream or estradiol 10 µg vaginal tablet: daily for 2 weeks, then twice weekly; estradiol ring changed every 3 months.", adj: "Minimal systemic absorption.", ae: "Local irritation, discharge, spotting.", avoid: "Discuss with oncology if hormone-sensitive breast cancer; investigate unexplained postmenopausal bleeding first.", notes: "For genitourinary syndrome of menopause: improves urgency, recurrent UTI risk and tissue quality before prolapse or sling surgery. Systemic HRT does not treat incontinence." },
      { n: "Imipramine", dose: "25 mg at night (older option for enuresis or mixed incontinence).", adj: "Caution in older people.", ae: "Anticholinergic effects, sedation, orthostatic hypotension; cardiotoxic in overdose.", avoid: "Recent MI, arrhythmia, MAOIs.", notes: "Largely replaced by safer agents." },
      { n: "Bethanechol", dose: "10–50 mg three to four times daily.", adj: "—", ae: "Cholinergic effects: sweating, salivation, abdominal cramps, bradycardia, bronchospasm.", avoid: "Asthma, bradycardia, peptic ulcer, bladder outlet obstruction.", notes: "Not recommended for detrusor underactivity — little proven benefit. Prefer intermittent catheterisation." }
     ] }
  ]
 },

 "Drugs: Sexual Medicine & Androgens": {
  emoji: "🔷", color: "indigo", sources: ["EAU-SRH", "AUA-Men", "Labels", "Campbell-Pharm"],
  tagline: "Formulary • PDE5 inhibitors (all) • alprostadil & Trimix • priapism reversal • dapoxetine • testosterone • fertility-sparing options • Peyronie's",
  badges: ["Drug formulary", "EAU Sexual & Reproductive Health • AUA"],
  classes: [
   { title: "PDE5 inhibitors", src: ["EAU-SRH", "AUA-Men", "Labels"],
     about: [
      ["How they work", "Inhibit phosphodiesterase type 5, prolonging cGMP-mediated smooth muscle relaxation in the corpora. Sexual stimulation is still needed. Allow at least 6–8 attempts at an adequate dose before calling it a failure."],
      ["Absolute contraindications", "Any nitrate or nitric oxide donor (glyceryl trinitrate, isosorbide, nicorandil, recreational amyl nitrite 'poppers') and riociguat. If a nitrate is needed in an emergency: wait at least 24 hours after sildenafil or vardenafil and 48 hours after tadalafil."],
      ["Cardiac caution", "Assess cardiovascular risk (Princeton consensus). Avoid in unstable angina, recent MI or stroke, uncontrolled hypertension or hypotension (< 90/50 mmHg), and severe heart failure."],
      ["Class adverse effects", "Headache, flushing, dyspepsia, nasal congestion, dizziness; back pain and myalgia (tadalafil); blue-tinged or blurred vision (sildenafil, vardenafil — PDE6 cross-reactivity). Rare: NAION, sudden hearing loss, priapism. Stop and seek help for sudden vision or hearing loss or an erection lasting over 4 hours."],
      ["Interactions", "α-blockers: additive hypotension — start at the lowest PDE5i dose once the α-blocker dose is stable. Strong CYP3A4 inhibitors (ritonavir, ketoconazole, clarithromycin): use reduced doses (for example sildenafil 25 mg once in 48 hours; tadalafil 10 mg once in 72 hours) or avoid (vardenafil, avanafil). Grapefruit increases levels."]
     ],
     drugs: [
      { n: "Sildenafil", dose: "50 mg about 1 hour before sex (range 25–100 mg); max once daily.", adj: "Start 25 mg if over 65, severe renal impairment (CrCl < 30) or hepatic impairment.", ae: "Visual disturbance (blue tinge) more than tadalafil.", avoid: "Class contraindications.", notes: "A heavy fatty meal delays onset. Duration about 4–5 hours. Also used for pulmonary arterial hypertension at different doses." },
      { n: "Tadalafil", dose: "On demand 10 mg (up to 20 mg) at least 30 minutes before sex; or daily 2.5–5 mg.", adj: "CrCl 30–50: on demand max 10 mg in 48 hours; CrCl < 30: max 5 mg on demand and no daily dosing. Severe hepatic impairment: avoid.", ae: "Back pain and myalgia more frequent.", avoid: "Class contraindications.", notes: "Window of up to 36 hours; food does not affect absorption. Daily 5 mg also treats LUTS/BPH." },
      { n: "Vardenafil", dose: "10 mg about 1 hour before sex (range 5–20 mg); orodispersible 10 mg.", adj: "Start 5 mg if over 65 or moderate hepatic impairment; avoid in severe hepatic impairment and dialysis.", ae: "Similar to sildenafil.", avoid: "Congenital long QT or class IA/III antiarrhythmics; strong CYP3A4 inhibitors.", notes: "Orodispersible form is not interchangeable mg-for-mg with film-coated tablets." },
      { n: "Avanafil", dose: "100 mg about 15–30 minutes before sex (range 50–200 mg).", adj: "Not recommended in severe renal or hepatic impairment.", ae: "Headache, flushing.", avoid: "Strong CYP3A4 inhibitors.", notes: "Fastest onset; more PDE5-selective." }
     ] },
   { title: "Second-line ED drugs & priapism reversal", src: ["EAU-SRH", "AUA-Men", "Labels"],
     about: [
      ["Ischaemic priapism (over 4 hours)", "An emergency. Corporal aspiration with or without saline irrigation, then intracavernosal phenylephrine diluted to 100–500 µg/mL, giving 1 mL every 3–5 minutes for up to about 1 hour, with blood pressure and heart rate monitoring (lower concentrations in cardiovascular disease). Go to surgical shunting if this fails."]
     ],
     drugs: [
      { n: "Alprostadil (intracavernosal)", dose: "Start 1.25–2.5 µg under supervision in clinic; titrate to the lowest effective dose, usually 5–20 µg (max 60 µg); no more than once daily and 3 times a week.", adj: "—", ae: "Penile pain (common), haematoma, priapism, corporal fibrosis with long-term use.", avoid: "Conditions predisposing to priapism (sickle cell disease, myeloma, leukaemia), penile implant; caution with anticoagulants and poor manual dexterity.", notes: "Works regardless of nerve function — useful after radical prostatectomy and when PDE5 inhibitors fail. Teach the patient what to do for an erection lasting over 4 hours." },
      { n: "Alprostadil (intraurethral or topical)", dose: "Intraurethral pellet 250–1000 µg; topical cream 300 µg at the meatus (where available).", adj: "—", ae: "Urethral burning or pain, minor bleeding; partner vaginal irritation.", avoid: "Pregnant partner without a condom; urethral stricture or inflammation.", notes: "Less effective than injection but needle-free." },
      { n: "Trimix / Bimix (compounded)", dose: "Papaverine + phentolamine (+ alprostadil) in individually titrated doses, prepared by a compounding pharmacy.", adj: "—", ae: "Priapism (higher risk with papaverine), fibrosis, raised liver enzymes (papaverine).", avoid: "As for alprostadil.", notes: "Used when alprostadil alone is painful or insufficient. Aviptadil + phentolamine is a licensed alternative in some countries." }
     ] },
   { title: "Premature ejaculation", src: ["EAU-SRH", "Labels"],
     about: [
      ["Approach", "Combine behavioural strategies (stop–start, squeeze) with drug therapy. Treat coexisting ED first if present."]
     ],
     drugs: [
      { n: "Dapoxetine", dose: "30 mg 1–3 hours before sex; may increase to 60 mg; max once in 24 hours.", adj: "Avoid in moderate–severe hepatic impairment; caution in severe renal impairment.", ae: "Nausea, dizziness, headache, syncope (check for orthostatic hypotension before starting).", avoid: "Significant heart disease, other SSRIs/SNRIs, MAOIs, thioridazine, strong CYP3A4 inhibitors; alcohol increases syncope risk.", notes: "The only short-acting SSRI licensed (in many countries) for on-demand use in lifelong or acquired PE." },
      { n: "Daily SSRIs and clomipramine (off-label)", dose: "Paroxetine 10–40 mg daily, sertraline 50–200 mg daily or fluoxetine 20–40 mg daily; clomipramine 10–25 mg on demand or daily.", adj: "—", ae: "Reduced libido, fatigue, nausea, ejaculatory delay; discontinuation symptoms.", avoid: "Combination with other serotonergic drugs; caution in under-25s (suicidality warning).", notes: "Effect builds over 1–2 weeks." },
      { n: "Topical lidocaine/prilocaine spray", dose: "Lidocaine 150 mg/mL + prilocaine 50 mg/mL metered spray: 3 sprays to the glans about 5 minutes before sex.", adj: "—", ae: "Local hypoaesthesia or burning in patient or partner.", avoid: "Methaemoglobinaemia risk (G6PD deficiency); allergy to amide anaesthetics.", notes: "Wipe off excess or use a condom to limit partner numbness." }
     ] },
   { title: "Testosterone therapy & fertility-sparing alternatives", src: ["EAU-SRH", "AUA-Men", "Labels"],
     about: [
      ["Diagnosis first", "Symptoms plus two early-morning total testosterone measurements on separate days (AUA cut-off < 300 ng/dL ≈ 10.4 nmol/L; EAU uses about 12 nmol/L, with free testosterone when SHBG is abnormal). Measure LH/FSH and prolactin to classify primary vs secondary hypogonadism."],
      ["Do not start if", "Fertility is desired (exogenous testosterone suppresses spermatogenesis), haematocrit is above about 50–54%, there is breast cancer or untreated prostate cancer, untreated severe obstructive sleep apnoea, uncontrolled heart failure, or a recent MI or stroke. Treated low-risk prostate cancer is individualised with specialist input."],
      ["Monitoring", "Testosterone, haematocrit and PSA at 3–6 months, then yearly. Reduce or stop if haematocrit exceeds 54%. TRAVERSE (2023) found no excess major cardiovascular events in men at high risk, but more atrial fibrillation, acute kidney injury and pulmonary embolism."]
     ],
     drugs: [
      { n: "Testosterone gel", dose: "1–2% gel delivering about 50–100 mg/day applied to shoulders or upper arms; titrate to mid-normal levels.", adj: "—", ae: "Skin irritation; erythrocytosis; transfer to women and children through skin contact (wash hands, cover the site).", avoid: "As above.", notes: "Steady levels; measure 2–4 hours after application." },
      { n: "Testosterone undecanoate (long-acting IM)", dose: "1000 mg deep IM at 0 and 6 weeks, then every 10–14 weeks according to trough levels.", adj: "—", ae: "Pulmonary oil microembolism and anaphylaxis (observe for 30 minutes after injection); erythrocytosis.", avoid: "Bleeding disorders or anticoagulation (IM injection).", notes: "Few injections per year." },
      { n: "Testosterone enanthate / cypionate", dose: "100–200 mg IM every 2 weeks (or 50–100 mg weekly for smoother levels).", adj: "—", ae: "Peak-and-trough symptoms, erythrocytosis (higher than with gels).", avoid: "As above.", notes: "Inexpensive; weekly smaller doses reduce haematocrit rise." },
      { n: "Oral testosterone undecanoate", dose: "Product-specific (for example 40 mg capsules two to four times daily with food in older formulations; newer self-emulsifying capsules have their own schedules).", adj: "—", ae: "GI upset; newer US oral products carry a blood-pressure warning.", avoid: "As above.", notes: "Check blood pressure regularly." },
      { n: "Clomiphene citrate (off-label)", dose: "25 mg daily or 50 mg on alternate days.", adj: "—", ae: "Visual disturbance, mood change, gynaecomastia.", avoid: "Primary testicular failure (will not work).", notes: "Raises LH/FSH and endogenous testosterone while preserving spermatogenesis in secondary hypogonadism. Alternatives: hCG 1500–3000 IU two to three times weekly; anastrozole (off-label) when the testosterone-to-oestradiol ratio is low." }
     ] },
   { title: "Peyronie's disease", src: ["EAU-SRH", "AUA-Men", "Labels"],
     about: [
      ["Oral therapy", "Vitamin E, potassium para-aminobenzoate, tamoxifen and colchicine are not recommended (EAU/AUA) — insufficient evidence. Pentoxifylline has limited evidence. PDE5 inhibitors treat coexisting ED. Penile traction can help in the stable or active phase."]
     ],
     drugs: [
      { n: "Collagenase Clostridium histolyticum", dose: "0.58 mg intralesional; one cycle is 2 injections 1–3 days apart, followed by penile modelling; up to 4 cycles about 6 weeks apart.", adj: "—", ae: "Penile bruising, swelling and pain (very common); corporal rupture or penile fracture (rare) — avoid intercourse for 2–4 weeks after each cycle.", avoid: "Lesions involving the urethra; caution with anticoagulants.", notes: "For stable disease with dorsal or lateral curvature of 30–90° and intact erections. Availability varies by country." },
      { n: "Verapamil (intralesional, off-label)", dose: "Typically 10 mg in 10 mL every 2 weeks for about 12 injections.", adj: "—", ae: "Bruising, pain; rarely hypotension.", avoid: "—", notes: "Modest evidence; low cost. Interferon α-2b is another intralesional option with limited evidence." }
     ] }
  ]
 },

 "Drugs: Stones (MET, Colic & Prevention)": {
  emoji: "🪨", color: "slate", sources: ["EAU-Stones", "AUA-Men", "Labels", "Campbell-Pharm"],
  tagline: "Formulary • colic analgesia • medical expulsive therapy • stent symptoms • citrate • thiazides • allopurinol & febuxostat • cystine & hyperoxaluria drugs",
  badges: ["Drug formulary", "EAU Urolithiasis • AUA medical management"],
  classes: [
   { title: "Renal colic & medical expulsive therapy", src: ["EAU-Stones", "Labels"],
     about: [
      ["Analgesia", "NSAIDs are first-line for colic (for example diclofenac, ibuprofen, ketorolac) and reduce the need for further analgesia; paracetamol IV is an alternative. Avoid NSAIDs in significant CKD, solitary kidney with impaired function, peptic ulcer, heart failure or late pregnancy. Use opioids (morphine, hydromorphone) second-line; avoid pethidine. Hyoscine (antispasmodic) alone adds little."],
      ["MET", "EAU: offer α-blockers as medical expulsive therapy for distal ureteric stones larger than 5 mm, with appropriate analgesia. Benefit for smaller stones is small (they usually pass anyway); evidence for proximal stones is weaker. Large trials (SUSPEND, STONE) were negative overall, but meta-analyses support benefit for larger distal stones. Typically up to 4–6 weeks with follow-up imaging."],
      ["When not to", "No MET if there is sepsis, uncontrolled pain, AKI, a solitary obstructed kidney, or pregnancy (off-label; individual decision) — these need decompression or definitive treatment."]
     ],
     drugs: [
      { n: "Tamsulosin (MET)", dose: "0.4 mg once daily until passage or for up to 4–6 weeks.", adj: "As for LUTS use.", ae: "Dizziness, orthostatic hypotension, ejaculatory dysfunction.", avoid: "Hypotension; planned cataract surgery (IFIS).", notes: "Off-label in many countries for this use; also used after SWL to help fragment clearance and for stent-related symptoms." },
      { n: "Silodosin (MET)", dose: "8 mg once daily.", adj: "As for LUTS use.", ae: "Retrograde ejaculation.", avoid: "As for LUTS use.", notes: "Some trials suggest higher passage rates than tamsulosin for distal stones." },
      { n: "Diclofenac / NSAIDs (colic)", dose: "Diclofenac 75 mg IM or 50 mg orally up to three times daily (max 150 mg/day); ibuprofen 400–600 mg orally three to four times daily; ketorolac per local protocol.", adj: "Avoid if eGFR < 30 mL/min or AKI; caution in CKD.", ae: "GI bleeding, AKI, fluid retention, raised blood pressure, cardiovascular risk (diclofenac).", avoid: "Peptic ulcer, severe heart failure, third trimester, NSAID-sensitive asthma.", notes: "Shortest course possible." },
      { n: "Stent-related symptoms", dose: "Tamsulosin 0.4 mg daily, solifenacin 5 mg daily or mirabegron 50 mg daily, alone or in combination.", adj: "As per drug.", ae: "As per drug.", avoid: "As per drug.", notes: "Combination α-blocker + antimuscarinic seems more effective than either alone in meta-analyses." }
     ] },
   { title: "Urinary alkalinisation & citrate", src: ["EAU-Stones", "Labels"],
     about: [
      ["Targets", "Hypocitraturia and recurrent calcium stones: restore urinary citrate. Uric acid stones: urine pH about 6.5–7.0 for prevention and 7.0–7.2 for dissolution (oral chemolysis). Cystine stones: urine pH above 7.5. Check urine pH with dipsticks or a meter."]
     ],
     drugs: [
      { n: "Potassium citrate", dose: "Typically 30–60 mEq/day (for example 10–20 mEq two or three times daily with meals), titrated to urine pH and citrate.", adj: "Avoid or monitor closely in CKD, with ACE inhibitors, ARBs, potassium-sparing diuretics or spironolactone (hyperkalaemia).", ae: "GI upset (take with food), hyperkalaemia.", avoid: "Hyperkalaemia, delayed gastric emptying or GI obstruction (tablets), active UTI with urease-splitting organisms.", notes: "Also first-line for distal renal tubular acidosis and for uric acid dissolution. Potassium-sodium citrate granules or sodium bicarbonate are alternatives (sodium load raises urinary calcium)." }
     ] },
   { title: "Calcium & uric acid stone prevention", src: ["EAU-Stones", "AUA-Men", "Labels"],
     about: [
      ["Before drugs", "Base therapy on a 24-hour urine metabolic evaluation in high-risk or recurrent stone formers. General measures for all: urine output above 2–2.5 L/day, normal dietary calcium (1000–1200 mg/day — do not restrict), low salt, moderate animal protein, avoid excess oxalate and vitamin C supplements."],
      ["Thiazides — evidence update", "NOSTONE (NEJM 2023) found no reduction in recurrence with hydrochlorothiazide 12.5–50 mg over about 3 years in recurrent calcium stone formers. Guidelines still list thiazides for hypercalciuria, but their benefit is now debated: use selectively, with potassium citrate to prevent hypokalaemia and hypocitraturia."]
     ],
     drugs: [
      { n: "Thiazides (hydrochlorothiazide, chlorthalidone, indapamide)", dose: "Hydrochlorothiazide 25–50 mg daily; chlorthalidone 25 mg daily; indapamide 2.5 mg daily.", adj: "Less effective if eGFR < 30 mL/min.", ae: "Hypokalaemia, hyponatraemia, hyperuricaemia, hyperglycaemia, hyperlipidaemia, photosensitivity, erectile dysfunction.", avoid: "Gout, hyponatraemia; caution with lithium.", notes: "Combine with potassium citrate; check electrolytes and uric acid." },
      { n: "Allopurinol", dose: "100–300 mg daily, adjusted to renal function and urate.", adj: "Lower starting dose in CKD (for example 50–100 mg) and titrate.", ae: "Rash; rare severe cutaneous reactions (SJS/TEN, DRESS) — higher with HLA-B*58:01 (screen in Han Chinese, Korean and Thai patients, and consider in South Asian patients), CKD and starting at high doses.", avoid: "Azathioprine and mercaptopurine (dangerous interaction).", notes: "For calcium oxalate stones with hyperuricosuria, and second-line for uric acid stones after alkalinisation." },
      { n: "Febuxostat", dose: "40–80 mg daily.", adj: "Caution in severe renal impairment.", ae: "Liver enzyme rise, rash; cardiovascular mortality warning (CARES trial).", avoid: "Established cardiovascular disease where alternatives exist; azathioprine/mercaptopurine.", notes: "Option when allopurinol is not tolerated." },
      { n: "Calcium & magnesium (enteric hyperoxaluria)", dose: "Calcium carbonate or citrate taken with meals to bind dietary oxalate in the gut.", adj: "—", ae: "Constipation; hypercalciuria if taken between meals.", avoid: "—", notes: "For malabsorption (bariatric surgery, short bowel, IBD). Also low-fat, low-oxalate diet and good hydration." }
     ] },
   { title: "Cystine, infection & primary hyperoxaluria stones", src: ["EAU-Stones", "Labels"],
     about: [
      ["Cystinuria", "High fluid intake (above 3 L/day, including at night), low salt and protein, and alkalinisation to pH above 7.5 first; add a thiol drug if urinary cystine stays high or stones recur."]
     ],
     drugs: [
      { n: "Tiopronin", dose: "Usually started at about 15 mg/kg/day in 3 divided doses (adults often around 800–1000 mg/day), titrated to urinary cystine.", adj: "Monitor renal function and urine protein.", ae: "Proteinuria, rash, taste disturbance, GI upset; fewer than penicillamine.", avoid: "Pregnancy (relative); previous agranulocytosis on thiols.", notes: "Check FBC, LFTs and urinalysis regularly." },
      { n: "D-penicillamine", dose: "Typically 1–2 g/day in divided doses, with pyridoxine 50 mg daily.", adj: "—", ae: "Frequent: rash, proteinuria and nephrotic syndrome, cytopenias, loss of taste.", avoid: "Previous serious reaction.", notes: "Second choice after tiopronin because of toxicity." },
      { n: "Acetohydroxamic acid", dose: "250 mg three to four times daily (max 1.5 g/day).", adj: "Avoid if CrCl < 20 mL/min.", ae: "Headache, tremor, deep vein thrombosis, haemolytic anaemia.", avoid: "Pregnancy (teratogenic).", notes: "Urease inhibitor for residual infection (struvite) stones after complete clearance and culture-directed antibiotics; rarely used because of toxicity." },
      { n: "Primary hyperoxaluria drugs", dose: "Pyridoxine 5–20 mg/kg/day (type 1, responsive genotypes); lumasiran (RNAi) subcutaneous loading then 3-monthly maintenance, weight-based; nedosiran monthly subcutaneous (type 1).", adj: "Specialist (nephrology/metabolic) care.", ae: "Injection-site reactions (RNAi agents).", avoid: "—", notes: "Diagnose by genetic testing and urine oxalate; very high fluid intake and citrate as base therapy." }
     ] }
  ]
 },

 "Drugs: Urinary Infections": {
  emoji: "🦠", color: "green", sources: ["EAU-UTI", "Labels", "Campbell-Pharm"],
  tagline: "Formulary • cystitis (fosfomycin, nitrofurantoin, pivmecillinam, gepotidacin) • pyelonephritis • parenteral & MDR • prophylaxis & non-antibiotic prevention • fungal UTI",
  badges: ["Drug formulary", "EAU Urological Infections 2026"],
  classes: [
   { title: "Uncomplicated cystitis", src: ["EAU-UTI", "Labels"],
     about: [
      ["Stewardship", "Use local resistance data. Avoid fluoroquinolones and aminopenicillins for empirical cystitis. Do not treat asymptomatic bacteriuria, except in pregnancy and before urological procedures that breach the mucosa."],
      ["Men", "Treat cystitis in men as a UTI in men (no longer 'complicated' by default in EAU): about 7 days with trimethoprim–sulfamethoxazole or a fluoroquinolone according to susceptibility; consider prostate involvement."]
     ],
     drugs: [
      { n: "Fosfomycin trometamol", dose: "3 g single oral dose (women with uncomplicated cystitis).", adj: "Avoid if CrCl < 10 mL/min.", ae: "Diarrhoea, nausea, headache.", avoid: "—", notes: "Convenient single dose; less effective than 5 days of nitrofurantoin in some trials." },
      { n: "Nitrofurantoin", dose: "Macrocrystal/monohydrate modified release 100 mg twice daily for 5 days (or macrocrystals 50–100 mg four times daily).", adj: "Avoid if eGFR < 30 mL/min (inadequate urine levels, more toxicity); some formularies use < 45.", ae: "Nausea, brown urine; with long-term use, pulmonary reactions (acute or fibrosis), hepatitis and peripheral neuropathy.", avoid: "Pyelonephritis or suspected tissue infection; G6PD deficiency; pregnancy at term (neonatal haemolysis).", notes: "Not for upper tract or prostate infection. Monitor lung and liver function if used long-term for prophylaxis." },
      { n: "Pivmecillinam", dose: "400 mg three times daily for 3–5 days (200 mg three times daily also used).", adj: "No adjustment usually needed.", ae: "GI upset; carnitine depletion with prolonged courses.", avoid: "Penicillin allergy; carnitine deficiency, oesophageal strictures.", notes: "Low resistance and little collateral damage; retains activity against many ESBL E. coli." },
      { n: "Trimethoprim / trimethoprim–sulfamethoxazole", dose: "Trimethoprim 200 mg twice daily for 3 days; TMP–SMX 160/800 mg twice daily for 3 days (women), if local resistance is below about 20%.", adj: "Reduce dose or interval if CrCl 15–30; avoid below 15.", ae: "Rash (including SJS with sulfonamides), hyperkalaemia, raised creatinine, folate antagonism, cytopenias.", avoid: "First trimester (folate antagonist); with methotrexate; caution with ACE inhibitors or spironolactone (hyperkalaemia).", notes: "Check local resistance." },
      { n: "Gepotidacin", dose: "1500 mg orally twice daily for 5 days, after food (FDA-approved March 2025; also MHRA).", adj: "Not recommended in severe renal impairment or dialysis per label; check local labelling.", ae: "Diarrhoea, nausea (common), abdominal pain; QT prolongation risk; acetylcholinesterase inhibition (caution in myasthenia gravis or with cholinergic drugs).", avoid: "Strong CYP3A4 inhibitors or inducers; congenital long QT.", notes: "First-in-class triazaacenaphthylene topoisomerase inhibitor for uncomplicated UTI in females ≥ 12 years and ≥ 40 kg (EAGLE-2/3, non-inferior to nitrofurantoin). Reserve for resistance or intolerance to standard options; availability varies." },
      { n: "Oral cephalosporins", dose: "For example cefadroxil 500 mg twice daily for 3 days, or cefpodoxime 100 mg twice daily for 5 days.", adj: "Adjust for renal function.", ae: "GI upset; C. difficile risk.", avoid: "Severe β-lactam allergy.", notes: "Alternatives when first-line options are unsuitable." }
     ] },
   { title: "Pyelonephritis & complicated UTI", src: ["EAU-UTI", "Labels"],
     about: [
      ["Principles", "Send a culture before treatment. Image early (ultrasound or CT) if there is sepsis, obstruction, stones, diabetes, poor response at 48–72 hours or a single kidney — an obstructed infected kidney needs urgent drainage. Switch IV to oral once improving, based on culture."],
      ["Fluoroquinolone safety", "Tendinopathy and tendon rupture (worse with steroids and in older people), aortic aneurysm/dissection, QT prolongation, dysglycaemia, neuropathy and CNS effects. EMA/FDA restrict use: avoid for uncomplicated cystitis and mild infections when alternatives exist."]
     ],
     drugs: [
      { n: "Ciprofloxacin / levofloxacin (oral)", dose: "Ciprofloxacin 500–750 mg twice daily for 7 days; levofloxacin 750 mg once daily for 5 days — only if local resistance is below about 10%.", adj: "Reduce dose if CrCl < 50 (levofloxacin) or < 30 (ciprofloxacin).", ae: "See fluoroquinolone safety.", avoid: "Pregnancy, children (relative), history of FQ adverse reaction, aortic aneurysm risk.", notes: "Good oral bioavailability and tissue (including prostate) penetration." },
      { n: "Oral cephalosporins (pyelonephritis)", dose: "Cefpodoxime 200 mg twice daily or ceftibuten 400 mg once daily for 10 days.", adj: "Adjust for renal function.", ae: "GI upset.", avoid: "Severe β-lactam allergy.", notes: "Lower oral efficacy than FQs; consider an initial single parenteral dose (ceftriaxone)." },
      { n: "Ceftriaxone / cefotaxime (IV)", dose: "Ceftriaxone 1–2 g IV once daily; cefotaxime 2 g IV three times daily.", adj: "Ceftriaxone needs no renal adjustment.", ae: "Biliary sludge (ceftriaxone), C. difficile.", avoid: "Ceftriaxone with IV calcium in neonates.", notes: "Common empirical parenteral choice where ESBL rates permit." },
      { n: "Aminoglycosides (gentamicin, amikacin)", dose: "Gentamicin 5–7 mg/kg IV once daily; amikacin 15 mg/kg IV once daily; dose by weight with level monitoring.", adj: "Extend interval in renal impairment; avoid prolonged courses.", ae: "Nephrotoxicity, ototoxicity (irreversible), neuromuscular blockade.", avoid: "Myasthenia gravis, pre-existing hearing loss; caution with other nephrotoxins.", notes: "Useful single prophylactic dose and for ESBL organisms; combine with a β-lactam in sepsis per protocol." },
      { n: "Piperacillin–tazobactam", dose: "4.5 g IV every 6–8 hours (extended infusion in sepsis).", adj: "Reduce frequency if CrCl < 40.", ae: "Diarrhoea, cytopenias, AKI (especially with vancomycin).", avoid: "Penicillin allergy.", notes: "Broad cover including Pseudomonas and Enterococcus faecalis." },
      { n: "Carbapenems (meropenem, ertapenem)", dose: "Meropenem 1 g IV every 8 hours; ertapenem 1 g IV once daily.", adj: "Adjust for renal function.", ae: "C. difficile; seizures (rare, more with imipenem); lowers valproate levels.", avoid: "Severe β-lactam allergy; valproate co-therapy.", notes: "For ESBL or severe infection; ertapenem does not cover Pseudomonas. Reserve to limit carbapenem resistance." },
      { n: "Newer agents for MDR organisms", dose: "Ceftazidime–avibactam, ceftolozane–tazobactam, meropenem–vaborbactam, imipenem–relebactam, cefiderocol: dose per label and infectious-diseases advice.", adj: "All need renal adjustment.", ae: "Agent-specific.", avoid: "—", notes: "For carbapenem-resistant Enterobacterales or MDR Pseudomonas, guided by susceptibility and resistance mechanism. Use with microbiology or ID input." }
     ] },
   { title: "Recurrent UTI prevention & prophylaxis", src: ["EAU-UTI", "Labels"],
     about: [
      ["Order of options", "Behavioural advice and vaginal oestrogen (postmenopausal women) first; then non-antibiotic options (methenamine hippurate, immunoactive prophylaxis, cranberry); then continuous or post-coital low-dose antibiotics. Self-start therapy suits reliable patients."],
      ["Evidence notes", "ALTAR (BMJ 2022): methenamine hippurate was non-inferior to daily low-dose antibiotics in women. MERIT (JAMA Intern Med 2024): D-mannose did not reduce recurrence in primary care. Cochrane 2023: cranberry products reduce symptomatic UTI in women with recurrent UTI."]
     ],
     drugs: [
      { n: "Methenamine hippurate", dose: "1 g twice daily.", adj: "Avoid in severe renal impairment or hepatic impairment.", ae: "Nausea, dyspepsia, rash; bladder irritation at high doses.", avoid: "Severe dehydration, metabolic acidosis; do not combine with urinary alkalinisers or sulfonamides.", notes: "Works only in acidic urine; no resistance develops. Not for treatment of active infection." },
      { n: "OM-89 bacterial lysate (immunoactive prophylaxis)", dose: "1 capsule daily for 3 months, then booster courses per product.", adj: "—", ae: "GI upset, headache, rash.", avoid: "Autoimmune disease (relative).", notes: "EAU recommends for women with recurrent UTI; availability varies." },
      { n: "Low-dose antibiotic prophylaxis", dose: "Nightly nitrofurantoin 50–100 mg, trimethoprim 100 mg, cefalexin 125–250 mg; or fosfomycin 3 g every 10 days; or a single post-coital dose.", adj: "As per drug.", ae: "Resistance; nitrofurantoin long-term lung, liver and nerve toxicity.", avoid: "As per drug.", notes: "Usually 6–12 months, then review. Exclude structural causes (stones, residual, diverticulum, fistula) first." }
     ] },
   { title: "Fungal UTI & other infections", src: ["EAU-UTI", "Labels"],
     about: [
      ["Candiduria", "Usually colonisation: remove or change the catheter and do not treat asymptomatic candiduria, except in neutropenia, very low birthweight infants, or before a urological procedure. EAU 2026 added a dedicated fungal UTI chapter."],
      ["Genitourinary TB and BCG infection", "Genitourinary TB: standard 6-month regimen (2 months isoniazid, rifampicin, pyrazinamide and ethambutol, then 4 months isoniazid and rifampicin) with ID input. Disseminated BCG infection after intravesical BCG: isoniazid, rifampicin and ethambutol (BCG is intrinsically resistant to pyrazinamide), with steroids for severe sepsis."]
     ],
     drugs: [
      { n: "Fluconazole", dose: "Symptomatic Candida cystitis: 200 mg (3 mg/kg) daily for 2 weeks; pyelonephritis 200–400 mg daily for 2 weeks.", adj: "Halve the dose if CrCl ≤ 50 mL/min (after any loading dose).", ae: "GI upset, raised liver enzymes, QT prolongation.", avoid: "Many CYP interactions (warfarin, sulfonylureas, statins, some immunosuppressants).", notes: "Achieves high urine levels; echinocandins do not, so they are poor for cystitis. For fluconazole-resistant C. glabrata or C. krusei, options include amphotericin B deoxycholate or flucytosine (specialist)." }
     ] }
  ]
 },

 "Drugs: Intravesical, Hormonal & Peri-operative": {
  emoji: "🧪", color: "purple", sources: ["EAU-NMIBC", "EAU-PCa", "Labels", "Campbell-Pharm"],
  tagline: "Formulary • BCG & toxicity • mitomycin C • gemcitabine • docetaxel • ADT practicalities • bone protection • haemorrhagic cystitis • antithrombotics around surgery • phenazopyridine",
  badges: ["Drug formulary", "EAU NMIBC • EAU Prostate • product labels"],
  classes: [
   { title: "Intravesical therapy for NMIBC", src: ["EAU-NMIBC", "Labels"],
     about: [
      ["General", "Instil through a catheter into an emptied bladder and retain for 1–2 hours. Avoid with visible haematuria, traumatic catheterisation, suspected perforation, or symptomatic UTI. Dose schedules and newer BCG-unresponsive agents: see the Ca Bladder page."]
     ],
     drugs: [
      { n: "BCG (intravesical)", dose: "Full dose per strain; induction once weekly for 6 weeks. Maintenance (SWOG schedule) 3 weekly instillations at 3, 6 and 12 months, then every 6 months: 1 year for intermediate risk, up to 3 years for high risk.", adj: "Delay at least 2 weeks after TURBT and until haematuria and catheter trauma have settled.", ae: "Cystitis symptoms, haematuria, flu-like illness (common, self-limiting within 48 hours); granulomatous prostatitis or epididymo-orchitis; BCG sepsis (rare, life-threatening).", avoid: "Immunosuppression or significant immunodeficiency, active TB, within 2 weeks of TURBT, visible haematuria, symptomatic UTI, pregnancy and breastfeeding.", notes: "Toxicity: treat cystitis with NSAIDs or antimuscarinics; fever above 38.5 °C for more than 48 hours — isoniazid and consider pausing; systemic BCG infection — isoniazid, rifampicin and ethambutol with steroids, and stop BCG permanently. Live organism: handle as biohazard; patients should sit to void and disinfect the toilet for 6 hours after instillation." },
      { n: "Mitomycin C (single immediate instillation)", dose: "Commonly 40 mg in 40 mL, within 24 hours of TURBT (ideally within a few hours), retained 1–2 hours.", adj: "—", ae: "Chemical cystitis, palmar or genital rash (contact dermatitis); rare bladder contracture.", avoid: "Suspected or known perforation, extensive resection, bleeding needing irrigation.", notes: "Reduces recurrence in low and intermediate risk tumours. Also used as an adjuvant course; device-assisted (heated/EMDA) delivery in selected cases." },
      { n: "Gemcitabine (intravesical)", dose: "Single post-TURBT instillation of 2 g in 100 mL saline (SWOG S0337); adjuvant courses and sequential gemcitabine–docetaxel per protocol.", adj: "—", ae: "Generally well tolerated: frequency, dysuria, haematuria.", avoid: "As for mitomycin C.", notes: "Cheaper and better tolerated than mitomycin; sequential gemcitabine/docetaxel is used for BCG-unresponsive disease and during BCG shortage." },
      { n: "Epirubicin (intravesical)", dose: "50–80 mg single instillation post-TURBT or as a course.", adj: "—", ae: "Chemical cystitis.", avoid: "Perforation.", notes: "Alternative anthracycline where mitomycin is unavailable." }
     ] },
   { title: "Androgen deprivation: practical pharmacology", src: ["EAU-PCa", "Labels"],
     about: [
      ["Flare", "LHRH agonists cause a testosterone surge for 1–2 weeks. In men with high-volume or symptomatic metastases (spinal cord, bladder outflow), start an antiandrogen such as bicalutamide 50 mg daily about 1 week before and continue 2–4 weeks after, or use an LHRH antagonist."],
      ["Adverse effects to manage", "Hot flushes, sexual dysfunction, fatigue, weight gain, metabolic syndrome and diabetes, cardiovascular risk, anaemia, cognitive change and bone loss. Encourage exercise; check glucose, lipids and blood pressure; assess fracture risk (DEXA) at baseline."],
      ["Regimens", "Full oncology regimens (degarelix, relugolix, ARPIs, docetaxel and others) are in the Protocol / dose library and the Ca Prostate page."]
     ],
     drugs: [
      { n: "Bicalutamide", dose: "50 mg daily for flare protection or combined androgen blockade; 150 mg daily monotherapy in selected settings (not in the US).", adj: "Caution in moderate–severe hepatic impairment.", ae: "Gynaecomastia and breast pain (prophylactic breast radiotherapy or tamoxifen can help at 150 mg), hepatotoxicity, hot flushes.", avoid: "Women; caution with warfarin.", notes: "Check LFTs periodically." },
      { n: "Cyproterone acetate", dose: "100 mg two to three times daily for flare cover (shorter courses); 50 mg for hot flushes.", adj: "Avoid in hepatic disease.", ae: "Hepatotoxicity, thromboembolism, fatigue, depression; meningioma risk with long-term high doses.", avoid: "Liver disease, previous thromboembolism, meningioma.", notes: "Steroidal antiandrogen; used less as safer options exist." },
      { n: "Bone protection on ADT", dose: "Osteoporosis prevention: denosumab 60 mg SC every 6 months, or zoledronic acid 5 mg IV yearly (or alendronate 70 mg weekly), with calcium and vitamin D. Bone metastases (CRPC): denosumab 120 mg SC every 4 weeks or zoledronic acid 4 mg IV every 3–4 weeks.", adj: "Zoledronic acid: reduce dose or avoid by CrCl (avoid if < 35 mL/min for 5 mg); denosumab: watch for hypocalcaemia in CKD.", ae: "Hypocalcaemia, osteonecrosis of the jaw, atypical femoral fracture; rebound fractures if denosumab is stopped abruptly.", avoid: "Uncorrected hypocalcaemia; dental review before starting.", notes: "Do not stop denosumab without planning follow-on bisphosphonate." },
      { n: "Hot flush treatment", dose: "Venlafaxine 37.5–75 mg daily, gabapentin 300–900 mg daily, medroxyprogesterone acetate 20 mg daily or cyproterone 50 mg daily.", adj: "Adjust gabapentin for renal function.", ae: "Agent-specific.", avoid: "Agent-specific.", notes: "Lifestyle measures and acupuncture also help some men." }
     ] },
   { title: "Bladder, bleeding & peri-operative drugs", src: ["Labels", "Campbell-Pharm"],
     about: [
      ["Antithrombotics around urological surgery", "Balance bleeding risk of the procedure against thrombotic risk, with cardiology or haematology input for recent stents, mechanical valves or recent VTE. General patterns: aspirin is often continued (individualise for high-bleeding-risk procedures such as TURP, PCNL or partial nephrectomy); clopidogrel stopped about 5 days, prasugrel 7 days, ticagrelor 3–5 days before; warfarin stopped about 5 days before (target INR < 1.5), with bridging only for very high thrombotic risk; DOACs stopped 24–72 hours before according to drug, renal function and bleeding risk (longer for dabigatran with reduced CrCl). Flexible ureteroscopy with laser can usually be done on antithrombotics."],
      ["Haemorrhagic cystitis", "Stepwise: clot evacuation and continuous bladder irrigation; intravesical alum 1%; hyperbaric oxygen (radiation cystitis); intravesical formalin (1–4%, under anaesthesia, after excluding reflux) or selective embolisation for refractory bleeding. Prevent cyclophosphamide/ifosfamide cystitis with mesna and hyperhydration. Use systemic tranexamic acid cautiously (risk of clot retention and upper-tract clots)."]
     ],
     drugs: [
      { n: "Phenazopyridine", dose: "200 mg three times daily after meals for up to 2 days.", adj: "Avoid if CrCl < 50 mL/min.", ae: "Orange-red urine (stains contact lenses and clothing), headache, GI upset; haemolysis and methaemoglobinaemia (G6PD deficiency, overdose).", avoid: "G6PD deficiency, renal or hepatic impairment.", notes: "Symptomatic relief only — never a substitute for treating infection; interferes with dipstick colour tests." },
      { n: "Intravesical alum (1%)", dose: "Continuous irrigation with 1% alum (aluminium ammonium or potassium sulfate) solution per local protocol.", adj: "Monitor aluminium levels in renal impairment or prolonged use.", ae: "Suprapubic pain, clot retention; aluminium toxicity (encephalopathy) in renal failure.", avoid: "Severe renal impairment (relative).", notes: "No anaesthesia needed; first intravesical step for haemorrhagic cystitis." },
      { n: "Bladder spasm relief (catheter or post-TURP)", dose: "Oxybutynin 2.5–5 mg up to three times daily or solifenacin 5 mg daily; intravesical lidocaine gel or instillation.", adj: "As per drug.", ae: "Anticholinergic effects.", avoid: "Retention without a catheter.", notes: "Check the catheter is draining and not blocked first." }
     ] }
  ]
 }
};

(function buildFormularyPages() {
  const line = (label, v) => v ? `\n${label}: ${v}` : '';
  const text = d => (`Dose: ${d.dose}` + line('Renal/hepatic', d.adj) + line('Adverse effects', d.ae) + line('Avoid/caution', d.avoid) + line('Interactions', d.ix) + line('Notes', d.notes)).trim();
  for (const [topic, t] of Object.entries(FORMULARY)) {
    DISEASES[topic] = {
      sources: t.sources, emoji: t.emoji, color: t.color, tagline: t.tagline, badges: t.badges, formulary: true,
      engine: "oracleOpenFormulary", engineArg: topic, engineLabel: "Compare drugs", classificationSection: 1,
      sections: t.classes.map((c, i) => ({ title: `${i + 1}. ${c.title}`, src: c.src, verified: "2026-11-22", items: [...c.about, ...c.drugs.map(d => [d.n, text(d)])] }))
    };
  }
})();
