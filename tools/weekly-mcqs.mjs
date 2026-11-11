// Weekly shared MCQ bank. Run by .github/workflows/weekly-mcqs.yml (or by hand):
//   node tools/weekly-mcqs.mjs https://urology-opd-navigator.onrender.com 50
// Asks the live server's /api/mcq (which uses its free AI keys) for batches of 5 questions,
// always on the topic with the fewest questions, grounded in frontend/data/clinical.js.
// Appends survivors to frontend/data/mcq-shared.json and writes a readable review list to mcq-review.md.
import fs from 'node:fs';
import vm from 'node:vm';

const site = (process.argv[2] || 'https://urology-opd-navigator.onrender.com').replace(/\/$/, '');
const target = Math.min(Math.max(Number(process.argv[3]) || 50, 5), 100);
const ROOT = new URL('../', import.meta.url).pathname;
const SHARED = ROOT + 'frontend/data/mcq-shared.json';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 90);

const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(ROOT + 'frontend/data/clinical.js', 'utf8') + '\n' + fs.readFileSync(ROOT + 'frontend/data/mcq-bank.js', 'utf8') + ';this.D=DISEASES;this.B=MCQ_BANK;', ctx);
const shared = JSON.parse(fs.readFileSync(SHARED, 'utf8'));
const topics = Object.keys(ctx.D);

// Same reference text the app sends (app/61-mcq.js and app/05-ai-lab.js).
function reference(d) {
  let text = '';
  for (const sec of ctx.D[d].sections.filter(x => !/trial|follow-up|survivorship/i.test(x.title))) {
    const chunk = '## ' + sec.title + '\n' + (sec.items || []).map(([h, t]) => '- ' + h + ': ' + t).join('\n') + '\n';
    if (text.length + chunk.length > 11000) break; text += chunk;
  }
  return text;
}
const pool = () => ctx.B.concat(shared.questions);

async function batch(topic) {
  const body = JSON.stringify({ topic, reference: reference(topic), count: 5, avoid: pool().filter(q => q.topic === topic).map(q => q.stem) });
  for (let attempt = 1; attempt <= 3; attempt++) {
    const r = await fetch(site + '/api/mcq', { method: 'POST', headers: { 'content-type': 'application/json' }, body });
    const raw = await r.text(); let j = null; try { j = JSON.parse(raw); } catch {}
    if (j && r.ok) return j;
    if (r.status === 429) throw Object.assign(new Error('quota'), { quota: true, detail: j?.error });
    console.log(`  ${topic}: ${j ? 'HTTP ' + r.status + ' ' + String(j.error || '').slice(0, 120) : 'site still waking (HTTP ' + r.status + ')'}; retry ${attempt}/3 in 30 s`);
    await sleep(30000);
  }
  return { questions: [] };
}

const week = new Date().toISOString().slice(0, 10);
const added = []; let rejected = 0, calls = 0, stop = '';
while (added.length < target && calls < Math.ceil(target / 5) + 6) {
  const counts = topics.map(t => [t, pool().filter(q => q.topic === t).length]).sort((a, b) => a[1] - b[1]);
  const topic = counts[calls % 2 === 0 ? 0 : 1][0]; // alternate between the two thinnest topics
  calls++;
  let j;
  try { j = await batch(topic); } catch (e) { if (e.quota) { stop = 'free AI quota used up'; break; } throw e; }
  rejected += Number(j.rejected) || 0;
  const seen = new Set(pool().map(q => norm(q.stem)));
  let n = 0;
  for (const q of j.questions || []) {
    if (added.length >= target) break;
    if (seen.has(norm(q.stem))) { rejected++; continue; }
    const item = { id: `w${week.replace(/-/g, '')}-${String(shared.questions.length + 1).padStart(4, '0')}`, topic, level: q.level, section: q.section, stem: q.stem, options: q.options, answer: q.answer, explain: q.explanation, added: week, model: j.model || '' };
    shared.questions.push(item); added.push(item); seen.add(norm(q.stem)); n++;
  }
  console.log(`batch ${calls}: ${topic} +${n} (total new ${added.length}/${target})`);
  await sleep(Number(process.env.MCQ_GAP_MS ?? 8000));
}

shared.updated = week;
// One question per line, so a pull request shows each new question as one added line.
const lines = shared.questions.map(q => '  ' + JSON.stringify(q)).join(',\n');
fs.writeFileSync(SHARED, `{\n "about": ${JSON.stringify(shared.about)},\n "updated": "${week}",\n "questions": [\n${lines}\n ]\n}\n`);

const letters = 'ABCD';
const md = [`## ${added.length} new MCQs for the shared bank (${week})`, '',
  `Generated from the app's guideline text and checked by the server (one correct answer, real cited section, no duplicates). ${rejected} candidate(s) were rejected.${stop ? ' Stopped early: ' + stop + '.' : ''}`, '',
  '**Merge** to publish them to every phone. To drop a question, delete its line in `frontend/data/mcq-shared.json` in this pull request before merging.', '',
  ...added.map((q, i) => `**${i + 1}. ${q.topic}** · ${q.level} · _${q.section}_ · \`${q.id}\`\n${q.stem}\n${q.options.map((o, k) => `- ${k === q.answer ? '✅' : '▫️'} ${letters[k]}. ${o}`).join('\n')}\n> ${q.explain}\n`)];
fs.writeFileSync(ROOT + 'mcq-review.md', md.join('\n'));
console.log(`\nDone: ${added.length} added, ${rejected} rejected, ${shared.questions.length} in shared bank.${stop ? ' Stopped: ' + stop : ''}`);
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `added=${added.length}\n`);
