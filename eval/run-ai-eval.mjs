// Live AI accuracy check. Uses real model quota: run before a release or after changing models/prompts.
// Usage: node eval/run-ai-eval.mjs https://your-site.onrender.com  [caseId ...]
import fs from 'node:fs';
const base = (process.argv[2] || 'http://127.0.0.1:8080').replace(/\/$/, '');
const only = process.argv.slice(3);
const { cases } = JSON.parse(fs.readFileSync(new URL('./ai-cases.json', import.meta.url)));
let pass = 0, run = 0;
for (const c of cases.filter(c => !only.length || only.includes(c.id))) {
  run++;
  const t0 = Date.now();
  let text = '', provider = '', err = '';
  try {
    const r = await fetch(base + '/api/urology-ai', { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ study: c.study, context: { report: c.report }, images: [] }) });
    const j = await r.json();
    if (!r.ok) err = `HTTP ${r.status} ${j.error || ''}`;
    provider = `${j.provider || '?'}/${j.model || '?'}`;
    text = JSON.stringify(j.result || j.output || j).toLowerCase();
  } catch (e) { err = e.message; }
  const missing = c.must.filter(group => !group.some(t => text.includes(t.toLowerCase()))).map(g => g.join('|'));
  const wrong = c.must_not.filter(t => text.includes(t.toLowerCase()));
  const ok = !err && !missing.length && !wrong.length;
  if (ok) pass++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.id.padEnd(24)} ${provider.padEnd(34)} ${((Date.now() - t0) / 1000).toFixed(1)}s` +
    (err ? `  error: ${err}` : '') + (missing.length ? `  missing: ${missing.join('; ')}` : '') + (wrong.length ? `  unsafe: ${wrong.join('; ')}` : ''));
  await new Promise(r => setTimeout(r, 4000)); // stay inside free-tier rate limits
}
console.log(`\nAI accuracy: ${pass}/${run} (${Math.round(100 * pass / Math.max(run, 1))}%)`);
process.exit(pass === run ? 0 : 1);
