/* V16.11 Urinary fistula decision engine (Campbell 13e Ch. 121 topic; ICI fistula algorithms; WHO obstetric fistula guidance).
   Turns the patient's fistula type, cause, timing, size, site, previous repair, upper-tract status, sepsis, radiation and
   malignancy status into: urgent actions, work-up still missing, simple/complex grading, a management plan,
   interposition advice and post-operative care. Decision support only. */
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const F = [
    ['fType', 'Fistula type', ['Vesicovaginal (VVF)', 'Ureterovaginal', 'Urethrovaginal', 'Vesicouterine', 'Colovesical', 'Rectourethral', 'Enterovesical (Crohn\'s)']],
    ['fCause', 'Cause', ['Hysterectomy / pelvic surgery', 'Obstetric (obstructed labour)', 'Caesarean section', 'Radiotherapy', 'Pelvic malignancy', 'Diverticular disease', 'Crohn\'s disease', 'Prostatectomy / prostate ablation', 'Anti-incontinence / mesh / diverticulectomy']],
    ['fTime', 'Time since leakage began', ['Under 6 weeks', '6–12 weeks', 'Over 12 weeks']],
    ['fSize', 'Size', ['Tiny (< 5 mm)', 'Small (5 mm – 1.5 cm)', 'Medium (1.5–3 cm)', 'Large (> 3 cm)', 'Not measured']],
    ['fSite', 'Site (urogenital)', ['Vault / supratrigonal', 'Trigone, near ureteric orifices', 'Involves urethra / bladder neck', 'Not applicable']],
    ['fPrior', 'Previous repair attempts', ['None', 'One', 'Two or more']],
    ['fUpper', 'Upper tracts (CT urography)', ['Normal', 'Hydronephrosis / ureteric injury', 'Not yet imaged']],
    ['fSepsis', 'Sepsis or urinoma', ['No', 'Yes']],
    ['fRad', 'Pelvic radiotherapy in the past', ['No', 'Yes']],
    ['fMal', 'Malignancy at the fistula', ['Excluded / not suspected', 'Suspected, not biopsied', 'Confirmed']],
    ['fBladder', 'Bladder capacity / urethra', ['Adequate', 'Small contracted bladder', 'Urethra destroyed']]
  ];
  function css() {
    if (typeof window.uroSheetCss === 'function') window.uroSheetCss();
    if (document.getElementById('fistCss')) return;
    const s = document.createElement('style'); s.id = 'fistCss';
    s.textContent = `#fistView label{display:block;font-weight:700;font-size:13px;margin-top:10px}#fistView select{width:100%;margin-top:4px;padding:10px;border-radius:10px;border:1px solid #cbd5e1;background:#fff;color:#0f172a;font:inherit}
html[data-oracle-theme="dark"] #fistView select{background:#0f172a;color:#e2e8f0;border-color:#334155}
#fistView .blk{border-radius:12px;padding:12px;margin:10px 0;border:1px solid #e2e8f0}#fistView .blk h4{margin:0 0 6px;font-size:14px;font-weight:900}#fistView .blk ul{margin:0;padding-left:18px}#fistView .blk li{margin:4px 0}
#fistView .urg{background:#fef2f2;border-color:#fecaca;color:#7f1d1d}#fistView .gap{background:#fff7ed;border-color:#fed7aa;color:#7c2d12}#fistView .plan{background:#f0fdf4;border-color:#bbf7d0;color:#14532d}#fistView .info{background:#f8fafc}
html[data-oracle-theme="dark"] #fistView .urg{background:#450a0a;color:#fecaca;border-color:#7f1d1d}html[data-oracle-theme="dark"] #fistView .gap{background:#431407;color:#fed7aa;border-color:#7c2d12}html[data-oracle-theme="dark"] #fistView .plan{background:#052e16;color:#bbf7d0;border-color:#14532d}html[data-oracle-theme="dark"] #fistView .info{background:#0f172a;border-color:#334155}`;
    document.head.appendChild(s);
  }
  function open() {
    css();
    let v = document.getElementById('fistView');
    if (!v) { v = document.createElement('div'); v.id = 'fistView'; v.className = 'uro-sheet'; document.body.appendChild(v); }
    v.innerHTML = `<div class="vw"><header><div><h2>Urinary fistula decision engine</h2><div class="sub">Campbell 13e Ch. 121 topic · ICI / WHO fistula guidance · decision support only</div></div><button class="ghost" id="fistClose">Close</button></header>
      <div class="card">${F.map(([id, label, opts]) => `<label for="${id}">${esc(label)}<select id="${id}"><option value="">Select…</option>${opts.map(o => `<option>${esc(o)}</option>`).join('')}</select></label>`).join('')}
      <button class="go" id="fistGo">Show plan</button></div><div id="fistOut"></div></div>`;
    v.querySelector('#fistClose').onclick = () => v.remove();
    v.querySelector('#fistGo').onclick = () => { v.querySelector('#fistOut').innerHTML = plan(read()); v.querySelector('#fistOut').scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  }
  function read() { const o = {}; F.forEach(([id]) => o[id] = document.getElementById(id).value); return o; }

  // Exposed for tests: pure function from inputs to an HTML plan.
  function plan(x) {
    const T = x.fType, urg = [], gap = [], steps = [], flap = [], info = [];
    if (!T) return '<div class="blk gap"><h4>Choose the fistula type first.</h4></div>';
    const uro = ['Vesicovaginal (VVF)', 'Ureterovaginal', 'Urethrovaginal', 'Vesicouterine'].includes(T);
    const rad = x.fRad === 'Yes' || x.fCause === 'Radiotherapy';
    const early = x.fTime === 'Under 6 weeks';
    const small = x.fSize === 'Tiny (< 5 mm)' || x.fSize === 'Small (5 mm – 1.5 cm)';
    const urethral = x.fSite === 'Involves urethra / bladder neck' || T === 'Urethrovaginal';
    const nearOrifices = x.fSite === 'Trigone, near ureteric orifices';
    const failed = x.fPrior === 'One' || x.fPrior === 'Two or more';
    const large = x.fSize === 'Large (> 3 cm)';

    // 1. urgent
    if (x.fSepsis === 'Yes') urg.push('Control sepsis first: cultures, antibiotics, and drainage of any urinoma or collection (percutaneous drain, nephrostomy or stent).');
    if (x.fUpper === 'Hydronephrosis / ureteric injury') urg.push('Decompress the obstructed kidney: retrograde stent if it passes, otherwise percutaneous nephrostomy. Treat as a combined ureteric injury.');
    if (x.fMal === 'Confirmed') urg.push('Malignant fistula: stage the disease and refer to the oncology MDT. Repair alone is not appropriate; consider en bloc resection or urinary diversion.');

    // 2. work-up still missing
    if (x.fUpper === 'Not yet imaged' || !x.fUpper) gap.push('CT urography (or retrograde pyelography) is mandatory: about 1 in 10 VVFs has a coexisting ureteric injury, which changes the operation.');
    if (x.fMal === 'Suspected, not biopsied' || (rad && x.fMal !== 'Excluded / not suspected')) gap.push('Biopsy the fistula edge to exclude recurrent or new malignancy before any repair.');
    if (uro) gap.push('Confirm and map the fistula: speculum examination, dye test (methylene blue ± oral phenazopyridine), and cystoscopy to record size, site and distance from the ureteric orifices and meatus.');
    if (T === 'Colovesical') gap.push('CT abdomen and pelvis (air in the bladder, thickened adherent colon), cystoscopy with biopsy of any abnormal area, and colonoscopy to exclude colorectal cancer.');
    if (T === 'Rectourethral') gap.push('Cystourethroscopy and proctoscopy or sigmoidoscopy, with a contrast study or MRI to map the tract. Biopsy if there has been radiation or ablation.');
    if (T === 'Enterovesical (Crohn\'s)') gap.push('MR or CT enterography to map disease activity, abscess and the fistula tract, plus gastroenterology input.');
    if (x.fCause === 'Obstetric (obstructed labour)') gap.push('Look for associated field injuries: rectovaginal fistula, foot drop, vaginal stenosis, anaemia, malnutrition, HIV status and psychological distress.');

    // 3. classification
    const complex = !uro ? null : (large || urethral || failed || rad || x.fUpper === 'Hydronephrosis / ureteric injury' || x.fSize === 'Medium (1.5–3 cm)' && x.fCause === 'Obstetric (obstructed labour)' || x.fBladder !== 'Adequate' && x.fBladder !== '');
    if (uro) info.push(`<b>${complex ? 'Complex' : 'Simple'} fistula</b> (WHO/ICI). ${complex ? 'Large, involving the urethra or ureter, previously failed, radiated or with poor bladder or urethra: refer to an experienced fistula surgeon and plan interposition.' : 'Single, small, closure mechanism spared, first repair, not radiated: a good chance of first-attempt closure (around 90%) in experienced hands.'}`);

    // 4. plan by type
    if (x.fBladder === 'Small contracted bladder' || x.fBladder === 'Urethra destroyed') {
      steps.push(x.fBladder === 'Urethra destroyed' ? 'Urethra destroyed: reconstruction (for example a bladder-flap neourethra) is possible only in expert centres. Otherwise offer continent or incontinent urinary diversion where long-term stoma care is available.' : 'Small contracted bladder: combine repair with augmentation cystoplasty (abdominal route), or offer urinary diversion.');
    }
    if (T === 'Vesicovaginal (VVF)') {
      if (early && small && !rad && !failed && x.fMal !== 'Confirmed') steps.push('Fresh, small, non-radiated VVF: start continuous catheter drainage now (keep it free-draining, high fluid intake) and review weekly. A fistula still leaking after about 4–6 weeks is unlikely to close, so plan repair. A tiny tract (< 5 mm) may also suit fulguration or fibrin glue with catheter drainage.');
      if (rad) steps.push('Radiation VVF: spontaneous closure is very rare. After a negative biopsy, repair at about 6–12 months, once the radiation injury has matured, ALWAYS with a vascularised interposition flap. If tissue or bladder is too poor, consider urinary diversion.');
      else steps.push('Timing: there is no proven benefit to routine delay. Repair once the tissues are healthy, clean and free of slough. ' + (x.fCause === 'Obstetric (obstructed labour)' ? 'Obstetric fistulae are usually repaired once slough and inflammation have settled (about 2–3 months).' : 'An uncomplicated post-hysterectomy VVF can be repaired early.'));
      if (x.fSite === 'Vault / supratrigonal' && !nearOrifices) steps.push('Route: vaginal repair is first choice for most vault and post-hysterectomy fistulae (layered flap-splitting repair, or Latzko partial colpocleisis for a small vault fistula; counsel about slight vaginal shortening). Choose the abdominal or robotic route for a high, inaccessible fistula, a narrow vagina, or coexisting abdominal pathology.');
      if (!x.fSite || x.fSite === 'Not applicable') steps.push('Route: choose the one giving the best exposure that the surgeon does best. Vaginal for most VVFs; abdominal or robotic for high or inaccessible fistulae, fistulae near the ureteric orifices, or when a ureteric reimplant or augmentation is needed. Record the site to refine this plan.');
      if (nearOrifices) steps.push('Fistula near the ureteric orifices: catheterise both ureters during repair. If an orifice is involved or the fistula is large, prefer the abdominal (O\'Connor transvesical) or robotic route, with ureteroneocystostomy as needed.');
      if (urethral) steps.push('The urethral closure mechanism is involved: vaginal repair with a Martius flap plus closure-mechanism repair (pubocervical fascia plication and refixation, or an autologous sling). Counsel about the risk of residual stress incontinence even after closure.');
      if (failed) steps.push('Previous failed repair: the next attempt has a lower chance of success. Ensure an experienced fistula surgeon, the best route, and interposition of fresh vascularised tissue.');
    }
    if (T === 'Ureterovaginal') {
      steps.push('First line: retrograde ureteric stent (or antegrade through a nephrostomy). If a stent passes, leave it about 6–8 weeks; many fistulae heal, and image afterwards to detect stricture.');
      steps.push('If the stent fails, or the fistula persists or strictures: ureteroneocystostomy (psoas hitch, or Boari flap for a longer gap) once infection and urinoma are controlled. Early repair is acceptable in a fit patient. Exclude a coexisting VVF with a dye test or cystogram.');
    }
    if (T === 'Urethrovaginal') {
      steps.push('A distal fistula beyond the sphincter may be asymptomatic: if continent and not bothered, observation is acceptable. A proximal or symptomatic fistula needs vaginal layered repair with a Martius flap, plus urethral reconstruction if tissue has been lost.');
      steps.push('Plan for stress incontinence: an autologous fascial sling at the same time or later. Never place synthetic mesh in a fistula bed. If the fistula followed mesh surgery, excise the eroded mesh.');
    }
    if (T === 'Vesicouterine') steps.push('Typically follows caesarean section; look for Youssef syndrome (cyclical haematuria, amenorrhoea, continence). A small fistula may close with prolonged catheter drainage or hormonal suppression of menses. Otherwise repair transabdominally or robotically: separate bladder from uterus, close in layers, interpose omentum or peritoneum, with or without hysterectomy depending on fertility wishes. Advise caesarean delivery in future pregnancies.');
    if (T === 'Colovesical') steps.push(x.fMal === 'Confirmed' ? 'Malignant colovesical fistula: en bloc resection of the bowel segment with partial cystectomy (or more radical surgery) after MDT staging.' : 'Diverticular or inflammatory: segmental colectomy (usually sigmoid) with primary anastomosis, debridement and closure of the bladder defect, and omental interposition, often one-stage and laparoscopic. Keep the catheter about 7–10 days, with a cystogram if the bladder repair is large. For frail patients with few symptoms, conservative care and antibiotics for UTIs.');
    if (T === 'Rectourethral') {
      if (!rad && early && small) steps.push('Small, non-irradiated fistula after prostatectomy: a trial of urethral or suprapubic catheter drainage, with or without temporary diverting colostomy. Some close spontaneously.');
      steps.push(rad ? 'Radiated or ablation-related fistula: faecal diversion first, then delayed transperineal repair with gracilis (or other vascularised) interposition once inflammation settles. With extensive tissue destruction, consider permanent urinary and faecal diversion.' : 'Persistent fistula: faecal diversion as needed, then repair once inflammation settles, either transperineally with gracilis or dartos interposition, or by the posterior transanal transsphincteric (York-Mason) approach.');
    }
    if (T === 'Enterovesical (Crohn\'s)') steps.push('Medical therapy first (biologics, nutrition, drain any abscess). If the fistula persists or is symptomatic: resect the diseased bowel; the bladder usually needs only simple closure and catheter drainage.');

    // 5. interposition
    if (rad || failed || large || urethral || T === 'Rectourethral') {
      if (uro && (urethral || x.fSite !== 'Vault / supratrigonal')) flap.push('Vaginal route: Martius (labial fibrofatty or bulbocavernosus) flap.');
      if (uro && x.fSite === 'Vault / supratrigonal') flap.push('Vault, vaginal route: peritoneal flap. Abdominal route: omentum.');
      if (T === 'Rectourethral' || rad) flap.push('Large, radiated or rectourethral: gracilis muscle flap (or rectus abdominis).');
      if (!flap.length) flap.push('Omentum (abdominal) or Martius (vaginal) flap.');
    }

    const post = ['Free continuous catheter drainage: ' + (rad ? 'about 2–3 weeks after a radiated repair, with a cystogram before removal.' : T === 'Colovesical' ? 'about 7–10 days.' : 'about 10–14 days (WHO: about 7 days is enough after a simple obstetric repair).'),
      'Bladder spasm: anticholinergic as needed. Treat UTI. Use vaginal oestrogen if postmenopausal.',
      uro ? 'No intercourse or tampons for about 3 months. Review with a dye test if any leakage recurs.' : 'Follow up with imaging if symptoms recur.',
      x.fCause === 'Obstetric (obstructed labour)' ? 'Future deliveries by planned caesarean section. Offer social reintegration and counselling.' : 'Record closure and continence separately at follow-up.'];

    const blk = (cls, h, arr) => arr.length ? `<div class="blk ${cls}"><h4>${h}</h4><ul>${arr.map(a => `<li>${a}</li>`).join('')}</ul></div>` : '';
    return blk('urg', 'Do first', urg) + blk('gap', 'Work-up still needed', gap) + (info.length ? `<div class="blk info">${info.join('')}</div>` : '') +
      blk('plan', 'Management plan', steps) + blk('info', 'Tissue interposition', flap) + blk('info', 'After repair', post) +
      '<div class="src">Sources: ICI fistula algorithms (ICS/ICUD); WHO Obstetric fistula guiding principles 2006 and catheter recommendation 2018; EAU Urological Trauma 2026; Campbell-Walsh-Wein 13e Ch. 121. Reviewed 11 Nov 2026. Decision support only; individualise with your team.</div>';
  }
  window.oracleOpenFistula = open;
  window.fistulaPlan = plan;
})();
