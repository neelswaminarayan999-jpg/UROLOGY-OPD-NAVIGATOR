// V15.13 clinical accuracy evaluation set (deterministic). Runs in `npm test` and in CI.
// Each case states the guideline source it checks so a failing case says what to re-verify.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// V16: content lives in data/ and app/; check the whole shipped frontend.
const html = ['frontend/index.html', 'frontend/data/clinical.js', ...fs.readdirSync('frontend/app').map(f => 'frontend/app/' + f)].map(f => fs.readFileSync(f, 'utf8')).join('\n');
const prostate = fs.readFileSync('frontend/app/20-engines.js', 'utf8');

// 1. EAU 2026 prostate risk table (rule engine, not AI)
const src = prostate.match(/function risk\(psa,gg,t,n\)\{[\s\S]*?\n\}/)[0];
const risk = vm.runInNewContext(src + ';risk');
const riskCases = [
  [[5, 1, 'T1c', 'N0'], 'Low risk', 'GG1, PSA<10, cT1-2'],
  [[12, 1, 'T2a', 'N0'], 'Favourable intermediate risk', 'GG1 with PSA 10-20'],
  [[6, 2, 'T2a', 'N0'], 'Favourable intermediate risk', 'GG2 with PSA<10'],
  [[14, 2, 'T2b', 'N0'], 'Unfavourable intermediate risk', 'GG2 with PSA 10-20'],
  [[4, 3, 'T1c', 'N0'], 'Unfavourable intermediate risk', 'GG3 any PSA <=20'],
  [[8, 4, 'T2a', 'N0'], 'High risk', 'GG4'],
  [[25, 1, 'T1c', 'N0'], 'High risk', 'PSA >20'],
  [[6, 2, 'T3a', 'N0'], 'Locally advanced', 'cT3a'],
  [[6, 2, 'T2a', 'N1'], 'Locally advanced', 'cN1'],
  [[null, 2, 'T2a', 'N0'], 'Risk group incomplete', 'missing PSA'],
];
for (const [args, want, why] of riskCases) assert.equal(risk(...args), want, `EAU 2026 risk: ${why}`);

// 2. Content facts that must stay correct (source in the message)
const facts = [
  [/pT1 limited to testis[^"]*without lymphovascular invasion or epididymal invasion/, 'TNM 9 testis: epididymal invasion is pT2, not pT1'],
  [/IGCCCG 2021/, 'IGCCCG 2021 update for seminoma/non-seminoma prognosis'],
  [/≤10 HU on unenhanced CT/, 'ESE 2023 adrenal: ≤10 HU benign threshold'],
  [/Bosniak/, 'Bosniak v2019 cystic renal mass classification present'],
  [/PI-RADS/, 'PI-RADS v2.1 present'],
  [/EV-302/, 'EV-302 (enfortumab vedotin + pembrolizumab) first-line mUC'],
  [/KEYNOTE-564/, 'KEYNOTE-564 adjuvant pembrolizumab RCC'],
  [/lastVerified:\s*"20\d\d-\d\d-\d\d"/, 'META.lastVerified date present'],
  [/Prasugrel<\/td><td>7 days/, 'anticoagulation table: prasugrel 7-day stop (CHEST 2022)'],
  [/Dabigatran, CrCl &lt;50 mL\/min<\/td><td>Omit 2 days before<\/td><td>Omit 4 days before/, 'anticoagulation table: dabigatran renal adjustment (CHEST 2022)'],
  [/Do not use DVIU for penile|do not use DVIU \(EAU 2026, strong/, 'stricture engine: no DVIU for penile strictures (EAU 2026, strong)'],
  [/do not use DVIU or dilatation as the only treatment \(EAU 2026, strong\)/, 'stricture engine: no solitary DVIU for >2 cm (EAU 2026, strong)'],
];
for (const [re, why] of facts) assert.ok(re.test(html), `missing: ${why}`);

// 3. Retired / wrong statements that must not come back
const banned = [
  [/epididymal invasion (?:is|=|→) ?pT1\b/i, 'epididymal invasion must not be stated as pT1'],
  [/race-adjusted STONE/i, 'unvalidated race-free STONE bands were removed'],
  [/data-del="'\+i\+'"/, 'stent registry must delete by id, not by position in a sorted list'],
  [/stDate'\); d\.value=new Date\(\)\.toISOString/, 'stent dates must use local dates, not UTC'],
];
for (const [re, why] of banned) assert.ok(!re.test(html), `regression: ${why}`);


// 5. V16: every disease section names its sources and a review date
{
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync('frontend/data/clinical.js', 'utf8') + ';this.D=DISEASES;this.S=SOURCES;', ctx);
  let n = 0, oldest = '9999';
  for (const [d, v] of Object.entries(ctx.D)) {
    assert.ok(Array.isArray(v.sources) && v.sources.length, `${d}: disease-level sources missing`);
    for (const sec of v.sections) {
      n++;
      assert.ok(Array.isArray(sec.src) && sec.src.length, `${d} / ${sec.title}: no source`);
      for (const k of sec.src) assert.ok(ctx.S[k] && /^https:\/\//.test(ctx.S[k].url), `${d} / ${sec.title}: unknown source key ${k}`);
      assert.match(sec.verified || '', /^\d{4}-\d\d-\d\d$/, `${d} / ${sec.title}: no review date`);
      if (sec.verified < oldest) oldest = sec.verified;
    }
  }
  const age = (Date.now() - Date.parse(oldest)) / 864e5;
  if (age > 180) console.warn(`clinical eval: WARNING oldest section review is ${oldest} (${Math.round(age)} days)`);
  facts.push([/./, `${n} sections sourced`]);
}

// 6. EAU NMIBC four-group risk calculator (DOM inputs stubbed)
{
  const core = fs.readFileSync('frontend/app/00-core.js', 'utf8');
  const fn = core.match(/function calcEAURisk\(\)\{[\s\S]*?\n\}/)[0];
  const run = (stage, grade, { cis = false, vhi = false, age = 'le70', mult = 'single', size = 'lt3', status = 'primary' } = {}) => {
    const out = { innerHTML: '' };
    const c = { erxStage: { value: stage }, erxGrade: { value: grade }, erxCIS: { checked: cis }, erxVHI: { checked: vhi }, erxAge: { value: age }, erxMult: { value: mult }, erxSize: { value: size }, erxStatus: { value: status }, eauriskOut: out, esc: x => String(x) };
    vm.runInNewContext(fn + ';calcEAURisk()', c);
    return out.innerHTML.match(/four-group risk: ([A-Za-z ]+)</)[1].trim();
  };
  const cases = [
    [['Ta', 'LG1'], 'Low', 'primary single Ta LG <3 cm'],
    [['T1', 'LG1'], 'Low', 'primary single T1 LG <3 cm, age <=70'],
    [['Ta', 'LG1', { status: 'recurrent' }], 'Intermediate', 'recurrent tumours are never low risk'],
    [['T1', 'HG3'], 'High', 'T1 HG without CIS'],
    [['Ta', 'HG3', { cis: true }], 'High', 'CIS'],
    [['T1', 'HG3', { age: 'gt70', mult: 'multi', size: 'ge3' }], 'Very High', 'T1 HG + all three risk factors'],
    [['Ta', 'LG1', { vhi: true }], 'Very High', 'variant histology / LVI'],
  ];
  for (const [args, want, why] of cases) assert.equal(run(...args), want, `EAU NMIBC risk: ${why}`);
  riskCases.push(...cases);
}

// 7. V16.8 offline MCQ bank: well-formed, one correct answer, cited section exists in the app
{
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync('frontend/data/clinical.js', 'utf8') + '\n' + fs.readFileSync('frontend/data/mcq-bank.js', 'utf8') + ';this.D=DISEASES;this.B=MCQ_BANK;', ctx);
  const ids = new Set();
  for (const q of ctx.B) {
    assert.ok(!ids.has(q.id), `MCQ id ${q.id} duplicated`); ids.add(q.id);
    assert.ok(ctx.D[q.topic], `MCQ ${q.id}: unknown topic ${q.topic}`);
    assert.ok(ctx.D[q.topic].sections.some(s => s.title === q.section), `MCQ ${q.id}: section "${q.section}" not in ${q.topic}`);
    assert.equal(q.options.length, 4, `MCQ ${q.id}: needs 4 options`);
    assert.equal(new Set(q.options.map(o => o.toLowerCase())).size, 4, `MCQ ${q.id}: duplicate options`);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4, `MCQ ${q.id}: bad answer index`);
    assert.ok(q.stem.length > 15 && q.explain.length > 15, `MCQ ${q.id}: stem/explanation too short`);
    assert.ok(['intern', 'resident', 'exam'].includes(q.level), `MCQ ${q.id}: bad level`);
  }
  for (const t of Object.keys(ctx.D)) assert.ok(ctx.B.filter(q => q.topic === t).length >= 4, `MCQ bank: fewer than 4 questions on ${t}`);
  facts.push([/./, `${ctx.B.length} MCQs`]);
  // shared weekly bank: same rules, plus unique ids across both banks
  const shared = JSON.parse(fs.readFileSync('frontend/data/mcq-shared.json', 'utf8'));
  assert.ok(Array.isArray(shared.questions), 'mcq-shared.json must have a questions array');
  for (const q of shared.questions) {
    assert.ok(!ids.has(q.id), `shared MCQ id ${q.id} duplicated`); ids.add(q.id);
    assert.ok(ctx.D[q.topic] && ctx.D[q.topic].sections.some(s => s.title === q.section), `shared MCQ ${q.id}: section "${q.section}" not in ${q.topic}`);
    assert.ok(q.options.length === 4 && new Set(q.options.map(o => o.toLowerCase())).size === 4 && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4, `shared MCQ ${q.id}: malformed`);
  }
}

// 4. Lastverified freshness: warn (not fail) if older than 120 days
const lv = html.match(/lastVerified:\s*"([\d-]+)"/)[1];
const ageDays = (Date.now() - Date.parse(lv)) / 864e5;
if (ageDays > 120) console.warn(`clinical eval: WARNING content last verified ${lv} (${Math.round(ageDays)} days ago)`);

console.log(`clinical eval: PASS — ${riskCases.length} risk-engine cases, ${facts.length} content facts, ${banned.length} regression guards`);
