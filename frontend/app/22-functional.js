/* V16.11 Female & functional urology tools (Campbell 13e Chs 105–119; EAU Female LUTS; AUA/SUFU SUI 2023 & OAB 2024;
   ICS Good Urodynamic Practices; ICS/IUGA POP-Q; ICS nocturia standardisation).
   Four tabs: continence plan, urodynamics calculator, POP-Q stager and nocturia (frequency-volume chart) calculator.
   The maths lives in pure functions on window.functionalCalc so the tests can check them. Decision support only. */
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = v => (v === '' || v == null || isNaN(+v)) ? null : +v;
  const r1 = v => Math.round(v * 10) / 10;

  /* ---------- pure calculators ---------- */
  function uds(x) {
    const out = { notes: [], warn: [] };
    const q = num(x.qmax), p = num(x.pdet), vv = num(x.vv), pvr = num(x.pvr);
    if (q != null && p != null) {
      if (x.sex === 'male') {
        out.booi = r1(p - 2 * q); out.bci = r1(p + 5 * q);
        out.booiClass = out.booi > 40 ? 'Obstructed' : out.booi >= 20 ? 'Equivocal' : 'Unobstructed';
        out.bciClass = out.bci > 150 ? 'Strong' : out.bci >= 100 ? 'Normal' : 'Weak (detrusor underactivity)';
      } else {
        out.booif = r1(p - 2.2 * q);
        out.booifClass = out.booif > 18 ? 'Obstruction likely' : out.booif < 0 ? 'Obstruction unlikely' : 'Indeterminate';
        out.defreitas = q <= 12 && p >= 25;
        out.pip1 = r1(p + q);
        out.notes.push('No female index is universally accepted: read BOOIf and Defreitas with the flow curve, straining and (ideally) video images.');
      }
    }
    if (vv != null && vv < 150) out.warn.push('Voided volume below 150 mL: Qmax may be unrepresentative. Repeat if possible.');
    if (pvr != null) {
      const cap = vv != null ? vv + pvr : null;
      out.pvrSig = pvr > 150 || (cap && pvr > cap / 3) || false;
      if (out.pvrSig) out.warn.push('Significant residual: explain it (BOO, detrusor underactivity, neurogenic) before any outlet surgery.');
    }
    const dv = num(x.dv), dp = num(x.dp);
    if (dv != null && dp != null && dp > 0) {
      out.compliance = r1(dv / dp);
      out.complianceLow = out.compliance < 20;
      if (out.complianceLow) out.warn.push('Low compliance (< 20 mL/cmH2O): assess storage pressure and upper tracts.');
    }
    const endFill = num(x.fillPdet);
    if (endFill != null && endFill > 40) out.warn.push('Filling Pdet above 40 cmH2O: upper-tract risk (McGuire threshold). Image the kidneys and lower storage pressure.');
    const alpp = num(x.alpp);
    if (alpp != null) out.alppClass = alpp < 60 ? 'Suggests ISD' : alpp > 90 ? 'Suggests urethral hypermobility' : 'Intermediate (60–90)';
    return out;
  }

  const POPQ = ['Aa', 'Ba', 'C', 'D', 'Ap', 'Bp'];
  function popq(x) {
    const tvl = num(x.tvl);
    const vals = {}; POPQ.forEach(k => { const v = num(x[k]); if (v != null) vals[k] = v; });
    const errs = [];
    if (tvl == null || tvl <= 0) errs.push('Enter total vaginal length (tvl).');
    ['Aa', 'Ap'].forEach(k => { if (vals[k] != null && (vals[k] < -3 || vals[k] > 3)) errs.push(`${k} must lie between −3 and +3.`); });
    const keys = Object.keys(vals);
    if (!keys.length) errs.push('Enter at least one point.');
    if (errs.length) return { errs };
    let lead = keys[0]; keys.forEach(k => { if (vals[k] > vals[lead]) lead = k; });
    const m = vals[lead];
    let stage;
    if (m >= tvl - 2) stage = 'IV';
    else if (m > 1) stage = 'III';
    else if (m >= -1) stage = 'II';
    else {
      const anterior = ['Aa', 'Ba', 'Ap', 'Bp'].every(k => vals[k] == null || vals[k] === -3);
      const apex = ['C', 'D'].every(k => vals[k] == null || vals[k] <= -(tvl - 2));
      stage = anterior && apex ? '0' : 'I';
    }
    const comp = { Aa: 'anterior', Ba: 'anterior', C: 'apical (cervix / vault)', D: 'apical (posterior fornix)', Ap: 'posterior', Bp: 'posterior' }[lead];
    return { stage, lead, leadValue: m, compartment: comp };
  }

  function nocturia(x) {
    const v24 = num(x.v24), nuv = num(x.nuv), w = num(x.weight), mvv = num(x.mvv), anv = num(x.anv), age = num(x.age);
    const out = { flags: [] };
    if (v24 != null && nuv != null && v24 > 0) {
      out.npi = r1(nuv / v24 * 100);
      const cut = age != null && age < 35 ? 20 : 33;
      out.npiCut = cut;
      out.nocturnalPolyuria = out.npi > cut;
      if (out.nocturnalPolyuria) out.flags.push(`Nocturnal polyuria (NPi ${out.npi}% > ${cut}%).`);
    }
    if (v24 != null && w) {
      out.perKg = r1(v24 / w);
      out.globalPolyuria = out.perKg > 40;
      if (out.globalPolyuria) out.flags.push(`Global polyuria (${out.perKg} mL/kg/24 h > 40).`);
    }
    if (nuv != null && mvv) {
      out.ni = r1(nuv / mvv);
      out.pnv = r1(out.ni - 1);
      if (anv != null) {
        out.nbci = r1(anv - out.pnv);
        out.reducedCapacity = out.nbci > 0;
        if (out.reducedCapacity) out.flags.push(`Reduced nocturnal bladder capacity (NBCi ${out.nbci} > 0).`);
      }
    }
    return out;
  }

  function continence(x) {
    const urgent = [], gaps = [], plan = [], warn = [];
    const t = x.type || '';
    const complicated = [];
    if (x.prior === 'Yes') complicated.push('previous SUI / pelvic surgery');
    if (x.pop === 'Grade 3–4') complicated.push('prolapse grade 3–4');
    if (x.pvr === 'Raised (> 150 mL or > ⅓ capacity)') complicated.push('incomplete emptying');
    if (x.neuro === 'Yes') complicated.push('neurogenic LUTD');
    if (t === 'Mixed, urgency-predominant') complicated.push('urgency-predominant MUI');
    if (x.demo === 'No' && /Stress|stress-predominant/.test(t)) complicated.push('SUI not demonstrated');
    if (x.rad === 'Yes') complicated.push('pelvic radiotherapy');
    if (x.mesh === 'Mesh complication') complicated.push('mesh complication');
    if (x.red === 'Yes') urgent.push('Red flags (haematuria, recurrent UTI, pain, continuous leakage): cystoscopy and imaging first — exclude malignancy, stone, fistula or mesh in the urinary tract.');
    if (/Continuous/.test(t)) urgent.push('Continuous leakage: think fistula or ectopic ureter — open the Urinary Tract Fistulae engine.');
    gaps.push('3-day bladder diary, urinalysis, PVR, ICIQ-UI SF and pelvic examination with a cough stress test (if not done).');
    const index = !complicated.length && /Stress|stress-predominant/.test(t);
    let uds = 'Not needed before first-line treatment.';
    if (/Stress|stress-predominant/.test(t)) uds = index ? 'Not needed before primary SUI surgery in this index patient (AUA/SUFU; ValUE trial).' : 'Recommended before surgery — complicated features: ' + complicated.join(', ') + '.';
    else if (complicated.length) uds = 'Consider (video)urodynamics if it will change management: ' + complicated.join(', ') + '.';
    plan.push('Lifestyle: weight loss if BMI raised, fluid/caffeine review, treat constipation and cough. Vaginal oestrogen if postmenopausal with atrophy.');
    if (/Stress|stress-predominant/.test(t)) {
      plan.push('Supervised pelvic floor muscle training for at least 3 months first-line.');
      if (x.cons === 'Yes, failed') {
        const opts = [];
        if (x.meshPref !== 'Declines mesh' && x.rad !== 'Yes' && x.mesh !== 'Mesh complication') opts.push('mid-urethral sling (retropubic preferred for ISD or recurrent SUI)');
        opts.push('colposuspension (Burch)', 'autologous fascial sling');
        opts.push('urethral bulking (lower, less durable efficacy; suits frail or surgery-averse)');
        plan.push('Surgery by shared decision: ' + opts.join('; ') + '.');
        if (x.rad === 'Yes' || x.mesh === 'Mesh complication') warn.push('Avoid synthetic mesh where wound healing is poor or after mesh complications — use autologous fascia or colposuspension.');
        if (x.prior === 'Yes') warn.push('Recurrent SUI: (video)urodynamics and cystoscopy before choosing; expert-centre options include AUS/adjustable devices.');
        if (x.pop === 'Grade 3–4') warn.push('With prolapse surgery, test for occult SUI with the prolapse reduced and decide on concomitant sling together.');
      }
    }
    if (/Urgency|urgency-predominant/.test(t)) {
      plan.push('Bladder training and urge suppression for all; add a β3 agonist (preferred if older or cognitively vulnerable) or an antimuscarinic (discuss dementia risk). Review at 4–8 weeks.');
      plan.push('Refractory: onabotulinumtoxinA 100 U (must accept CISC), sacral neuromodulation or PTNS.');
      if (t === 'Mixed, urgency-predominant') warn.push('Treat the urgency component first; a sling may not help and urgency can persist.');
    }
    if (t === 'Mixed, stress-predominant') warn.push('A sling cures or improves urgency in many, but warn about persistent or de novo urgency.');
    if (x.pvr === 'Raised (> 150 mL or > ⅓ capacity)') warn.push('Explain the residual (BOO vs detrusor underactivity) before outlet surgery; teach CISC if needed. Avoid anticholinergic load.');
    if (x.age === 'Frail / elderly') warn.push('Frail: favour devices, containment, bulking; assess mobility, cognition and toileting access.');
    return { urgent, gaps, index, complicated, uds, plan, warn };
  }

  window.functionalCalc = { uds, popq, nocturia, continence };

  /* ---------- UI ---------- */
  function css() {
    if (typeof window.uroSheetCss === 'function') window.uroSheetCss();
    if (document.getElementById('funcCss')) return;
    const s = document.createElement('style'); s.id = 'funcCss';
    s.textContent = `#funcView label{display:block;font-weight:700;font-size:13px;margin-top:10px}#funcView select,#funcView input{width:100%;margin-top:4px;padding:10px;border-radius:10px;border:1px solid #cbd5e1;background:#fff;color:#0f172a;font:inherit;box-sizing:border-box}
#funcView .tabs{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}#funcView .tabs button{padding:8px 12px;border-radius:999px;border:1px solid #cbd5e1;background:#f8fafc;font-weight:800;font-size:12px;color:#0f172a}#funcView .tabs button.on{background:#0f172a;color:#fff;border-color:#0f172a}
#funcView .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px}#funcView .blk{margin-top:10px;padding:10px 12px;border-radius:12px;background:#f1f5f9;font-size:14px;line-height:1.5}#funcView .blk.red{background:#fee2e2}#funcView .blk.amb{background:#fef3c7}#funcView .blk.grn{background:#dcfce7}#funcView .blk b{display:block;margin-bottom:4px}
html[data-oracle-theme="dark"] #funcView select,html[data-oracle-theme="dark"] #funcView input{background:#0f172a;color:#e2e8f0;border-color:#334155}html[data-oracle-theme="dark"] #funcView .tabs button{background:#1e293b;color:#e2e8f0;border-color:#334155}html[data-oracle-theme="dark"] #funcView .tabs button.on{background:#e2e8f0;color:#0f172a}
html[data-oracle-theme="dark"] #funcView .blk{background:#1e293b;color:#e2e8f0}html[data-oracle-theme="dark"] #funcView .blk.red{background:#450a0a}html[data-oracle-theme="dark"] #funcView .blk.amb{background:#422006}html[data-oracle-theme="dark"] #funcView .blk.grn{background:#052e16}`;
    document.head.appendChild(s);
  }
  const sel = (id, lab, opts) => `<label>${esc(lab)}<select id="${id}"><option value="">—</option>${opts.map(o => `<option>${esc(o)}</option>`).join('')}</select></label>`;
  const inp = (id, lab, ph) => `<label>${esc(lab)}<input id="${id}" type="number" inputmode="decimal" step="any" placeholder="${esc(ph || '')}"></label>`;
  const blk = (cls, title, lines) => lines.length ? `<div class="blk ${cls}"><b>${esc(title)}</b>${lines.map(l => `<div>• ${esc(l)}</div>`).join('')}</div>` : '';

  const TABS = {
    continence: {
      label: 'Continence plan',
      form: () => sel('c_type', 'Leakage type', ['Stress', 'Mixed, stress-predominant', 'Mixed, urgency-predominant', 'Urgency', 'Continuous']) +
        sel('c_demo', 'SUI demonstrated on cough test', ['Yes', 'No']) + sel('c_cons', 'Conservative treatment (PFMT ≥ 3 months)', ['Not yet', 'Yes, failed']) +
        sel('c_prior', 'Previous SUI or pelvic floor surgery', ['No', 'Yes']) + sel('c_pop', 'Prolapse', ['None / grade 1–2', 'Grade 3–4']) +
        sel('c_pvr', 'Post-void residual', ['Normal', 'Raised (> 150 mL or > ⅓ capacity)']) + sel('c_neuro', 'Neurological disease', ['No', 'Yes']) +
        sel('c_rad', 'Pelvic radiotherapy', ['No', 'Yes']) + sel('c_mesh', 'Mesh history', ['None', 'Previous mesh, no problem', 'Mesh complication']) +
        sel('c_meshPref', 'Patient view on mesh', ['Accepts after counselling', 'Declines mesh']) + sel('c_age', 'Frailty', ['Fit', 'Frail / elderly']) +
        sel('c_red', 'Red flags (haematuria, recurrent UTI, pain)', ['No', 'Yes']),
      run: g => {
        const r = continence({ type: g('c_type'), demo: g('c_demo'), cons: g('c_cons'), prior: g('c_prior'), pop: g('c_pop'), pvr: g('c_pvr'), neuro: g('c_neuro'), rad: g('c_rad'), mesh: g('c_mesh'), meshPref: g('c_meshPref'), age: g('c_age'), red: g('c_red') });
        if (!g('c_type')) return '<div class="blk amb"><b>Choose the leakage type first.</b></div>';
        return blk('red', 'Act first', r.urgent) + blk('', 'Work-up', r.gaps) +
          blk(r.index ? 'grn' : 'amb', r.index ? 'Index patient (uncomplicated)' : 'Complicated / non-index features', r.index ? ['No complicating features recorded.'] : (r.complicated.length ? r.complicated : ['Not an SUI-predominant presentation.'])) +
          blk('', 'Urodynamics', [r.uds]) + blk('grn', 'Plan', r.plan) + blk('amb', 'Watch for', r.warn);
      }
    },
    uds: {
      label: 'UDS calculator',
      form: () => sel('u_sex', 'Sex', ['female', 'male']) + '<div class="grid">' + inp('u_pdet', 'PdetQmax (cmH2O)', 'e.g. 45') + inp('u_qmax', 'Qmax (mL/s)', 'e.g. 9') +
        inp('u_vv', 'Voided volume (mL)') + inp('u_pvr', 'PVR (mL)') + inp('u_dv', 'Compliance: ΔV (mL)') + inp('u_dp', 'Compliance: ΔPdet (cmH2O)') +
        inp('u_fill', 'Max filling Pdet (cmH2O)') + inp('u_alpp', 'Abdominal LPP (cmH2O)') + '</div>',
      run: g => {
        const r = uds({ sex: g('u_sex') || 'female', pdet: g('u_pdet'), qmax: g('u_qmax'), vv: g('u_vv'), pvr: g('u_pvr'), dv: g('u_dv'), dp: g('u_dp'), fillPdet: g('u_fill'), alpp: g('u_alpp') });
        const L = [];
        if (r.booi != null) L.push(`BOOI = ${r.booi} → ${r.booiClass}`, `BCI = ${r.bci} → ${r.bciClass}`);
        if (r.booif != null) L.push(`BOOIf (Solomon-Greenwell) = ${r.booif} → ${r.booifClass}`, `Defreitas criteria (Qmax ≤ 12 and PdetQmax ≥ 25): ${r.defreitas ? 'met — suggests obstruction' : 'not met'}`, `PIP1 (contractility, proposed) = ${r.pip1}`);
        if (r.compliance != null) L.push(`Compliance = ${r.compliance} mL/cmH2O${r.complianceLow ? ' (low)' : ''}`);
        if (r.alppClass) L.push(`ALPP: ${r.alppClass}`);
        if (!L.length) return '<div class="blk amb"><b>Enter PdetQmax and Qmax (and any other values).</b></div>';
        return blk('grn', 'Indices', L) + blk('amb', 'Warnings', r.warn) + blk('', 'Notes', r.notes.concat(['Always read the raw traces and check quality control (cough tests, resting pressures).']));
      }
    },
    popq: {
      label: 'POP-Q stager',
      form: () => '<div class="grid">' + POPQ.map(k => inp('p_' + k, k + ' (cm)', k === 'Aa' || k === 'Ap' ? '−3 to +3' : '')).join('') + inp('p_tvl', 'tvl (cm)', 'e.g. 9') + '</div><div class="blk">Values in cm relative to the hymen at maximal strain: above = negative, below = positive. Leave D blank after hysterectomy.</div>',
      run: g => {
        const x = { tvl: g('p_tvl') }; POPQ.forEach(k => x[k] = g('p_' + k));
        const r = popq(x);
        if (r.errs) return blk('amb', 'Check the entries', r.errs);
        return blk('grn', `POP-Q stage ${r.stage}`, [`Leading point ${r.lead} at ${r.leadValue > 0 ? '+' : ''}${r.leadValue} cm (${r.compartment}).`]) +
          blk('', 'Next', ['Treat only if symptomatic. Stage III–IV with voiding difficulty or raised PVR: renal ultrasound for hydronephrosis.', 'Test for occult SUI with the prolapse reduced before surgery.', 'Always assess apical support when repairing any compartment.']);
      }
    },
    nocturia: {
      label: 'Nocturia calculator',
      form: () => '<div class="grid">' + inp('n_v24', '24-h urine volume (mL)') + inp('n_nuv', 'Nocturnal urine volume (mL, incl. first morning void)') +
        inp('n_mvv', 'Maximum voided volume (mL)') + inp('n_anv', 'Actual night voids (number)') + inp('n_w', 'Weight (kg)') + inp('n_age', 'Age (years)') + '</div>',
      run: g => {
        const r = nocturia({ v24: g('n_v24'), nuv: g('n_nuv'), mvv: g('n_mvv'), anv: g('n_anv'), weight: g('n_w'), age: g('n_age') });
        const L = [];
        if (r.npi != null) L.push(`Nocturnal polyuria index = ${r.npi}% (cut-off ${r.npiCut}%)`);
        if (r.perKg != null) L.push(`24-h output = ${r.perKg} mL/kg`);
        if (r.ni != null) L.push(`Nocturia index Ni = ${r.ni}; predicted night voids = ${r.pnv}` + (r.nbci != null ? `; NBCi = ${r.nbci}` : ''));
        if (!L.length) return '<div class="blk amb"><b>Enter the frequency-volume chart values.</b></div>';
        const next = [];
        if (r.nocturnalPolyuria) next.push('Nocturnal polyuria: evening fluid/caffeine/alcohol limits, earlier diuretic timing, leg elevation for oedema; screen for OSA, heart failure, CKD. Consider low-dose desmopressin if appropriate — check sodium at baseline, within 1 week and at 1 month.');
        if (r.globalPolyuria) next.push('Global polyuria: check glucose/HbA1c, calcium, diuretics and fluid intake; consider diabetes insipidus.');
        if (r.reducedCapacity) next.push('Reduced nocturnal capacity: treat OAB, BOO or BPS.');
        if (!next.length) next.push('No single phenotype stands out: review sleep disorders and the diary quality.');
        return blk('grn', 'Results', L) + blk('amb', 'Phenotype', r.flags) + blk('', 'Next', next);
      }
    }
  };

  function open(tab) {
    css();
    tab = TABS[tab] ? tab : 'continence';
    let v = document.getElementById('funcView');
    if (!v) { v = document.createElement('div'); v.id = 'funcView'; v.className = 'uro-sheet'; document.body.appendChild(v); }
    v.innerHTML = `<div class="vw"><header><div><h2>Female & functional urology tools</h2><div class="sub">Campbell 13e Chs 105–119 · EAU · AUA/SUFU · ICS · decision support only</div></div><button class="ghost" id="funcClose">Close</button></header>
<div class="tabs">${Object.keys(TABS).map(k => `<button type="button" data-t="${k}" class="${k === tab ? 'on' : ''}">${esc(TABS[k].label)}</button>`).join('')}</div>
<div class="card" id="funcForm">${TABS[tab].form()}<button type="button" class="go" id="funcGo">Calculate</button></div><div id="funcOut"></div></div>`;
    const g = id => { const el = v.querySelector('#' + id); return el ? el.value : ''; };
    v.querySelector('#funcClose').onclick = () => v.remove();
    v.querySelectorAll('.tabs button').forEach(b => b.onclick = () => open(b.dataset.t));
    v.querySelector('#funcGo').onclick = () => { const o = v.querySelector('#funcOut'); o.innerHTML = TABS[tab].run(g); o.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  }
  window.oracleOpenFunctional = open;
})();
