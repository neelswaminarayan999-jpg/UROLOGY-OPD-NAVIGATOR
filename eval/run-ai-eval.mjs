// Live AI accuracy check. Sends each case exactly as the AI Lab does (study type, instruction,
// guideline reference from frontend/data/clinical.js). Uses real model quota.
// Usage: node eval/run-ai-eval.mjs https://your-site.onrender.com  [caseId ...]
import fs from 'node:fs';
import vm from 'node:vm';
const base = (process.argv[2] || 'http://127.0.0.1:8080').replace(/\/$/, '');
const only = process.argv.slice(3);
const { cases } = JSON.parse(fs.readFileSync(new URL('./ai-cases.json', import.meta.url)));

// Same reference builder as aiReference12() in frontend/app/05-ai-lab.js
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(new URL('../frontend/data/clinical.js', import.meta.url), 'utf8') + ';this.D=DISEASES;', ctx);
function reference(d) {
  if (!d || !ctx.D[d]) return '';
  let text = '';
  for (const sec of ctx.D[d].sections.filter(x => !/trial|follow-up|survivorship/i.test(x.title))) {
    const chunk = '## ' + sec.title + '\n' + (sec.items || []).map(([h, t]) => '- ' + h + ': ' + t).join('\n') + '\n';
    if (text.length + chunk.length > 11000) break; text += chunk;
  }
  return text;
}
// Same instruction text as aiInstruction12() in the AI Lab
const lab = fs.readFileSync(new URL('../frontend/app/05-ai-lab.js', import.meta.url), 'utf8');
const instr = vm.runInNewContext(lab.match(/function aiInstruction12\(study\)\{[\s\S]*?`;\}/)[0] + ';aiInstruction12');

const NEG = /\b(no|not|avoid|avoided|without|never|unnecessary|contraindicated|rather than|instead of|do not|don't|should not)\b[^.]{0,40}$/;
const hit = (text, term) => { let i = -1; while ((i = text.indexOf(term, i + 1)) >= 0) { if (!NEG.test(text.slice(Math.max(0, i - 60), i))) return true; } return false; };

let pass = 0, run = 0; const lines = [];
for (const c of cases.filter(c => !only.length || only.includes(c.id))) {
  run++;
  const t0 = Date.now();
  let text = '', provider = '', err = '', note = '';
  try {
    const r = await fetch(base + '/api/urology-ai', { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ study: c.study, instruction: instr(c.study), context: { report: c.report, structured: {} }, images: [], reference: reference(c.disease), reference_disease: c.disease }) });
    const j = await r.json();
    if (!r.ok) err = `HTTP ${r.status} ${(j.error || '').slice(0, 120)}`;
    provider = `${j.provider || '?'}/${j.model || '?'}`;
    note = (j.fallback_attempts || []).map(a => `${a.model}: ${a.status || a.code || 'error'}`).join(', ');
    text = JSON.stringify(j.result || j.output || j).toLowerCase();
  } catch (e) { err = e.message; }
  const missing = c.must.filter(group => !group.some(t => text.includes(t.toLowerCase()))).map(g => g[0]);
  const wrong = c.must_not.filter(t => hit(text, t.toLowerCase()));
  const ok = !err && !missing.length && !wrong.length;
  if (ok) pass++;
  const problem = err || [missing.length ? 'missing: ' + missing.join('; ') : '', wrong.length ? 'unsafe: ' + wrong.join('; ') : ''].filter(Boolean).join(' · ') || '—';
  lines.push(`| ${ok ? '✅' : '❌'} | ${c.id} | ${problem} | ${provider}${note ? ' (fell back after ' + note + ')' : ''} |`);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.id.padEnd(24)} ${provider.padEnd(34)} ${((Date.now() - t0) / 1000).toFixed(1)}s  ${problem}${note ? '  [fallback: ' + note + ']' : ''}`);
  await new Promise(r => setTimeout(r, 6000)); // stay inside free-tier rate limits
}
const score = `AI accuracy: ${pass}/${run} (${Math.round(100 * pass / Math.max(run, 1))}%)`;
console.log('\n' + score);
// In GitHub Actions, write a phone-readable table to the run summary page (problem column before model).
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## ${score}\n\nSite: ${base}\n\n| | Case | Problem | Model |\n|---|---|---|---|\n${lines.join('\n')}\n`);
const minPass = Number(process.env.MIN_PASS || run);
process.exit(pass >= minPass ? 0 : 1);
