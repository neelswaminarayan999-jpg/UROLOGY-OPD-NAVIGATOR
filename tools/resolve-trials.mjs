// Resolves each trial name in frontend/data/trial-links.json to one PubMed record (PMID + title), so tapping a trial
// name in the app opens that paper directly. Run by .github/workflows/resolve-trials.yml (manual), which opens a pull
// request listing every trial with the paper it matched, for review. Trials whose query finds nothing keep a search link.
import fs from 'node:fs';
const E = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
const ROOT = new URL('../', import.meta.url).pathname, FILE = ROOT + 'frontend/data/trial-links.json';
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function get(url) {
  for (let i = 1; i <= 4; i++) { try { const r = await fetch(url); if (r.ok) return r.json(); } catch {} await sleep(1500 * i); }
  throw new Error('PubMed unreachable');
}
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const rows = [];
for (const [name, t] of Object.entries(data.trials)) {
  if (t.locked) { rows.push(`- ✅ **${name}** (locked) → ${t.title || ''} https://pubmed.ncbi.nlm.nih.gov/${t.pmid}/`); continue; }
  const s = await get(`${E}esearch.fcgi?db=pubmed&retmode=json&sort=relevance&retmax=3&term=${encodeURIComponent(t.q)}&tool=urology-opd-navigator`);
  await sleep(400);
  const ids = s.esearchresult?.idlist || [], count = Number(s.esearchresult?.count || 0);
  t.count = count;
  if (!ids.length) { delete t.pmid; delete t.title; rows.push(`- ❌ **${name}**: no match for \`${t.q}\` (app keeps a search link)`); continue; }
  const sum = await get(`${E}esummary.fcgi?db=pubmed&retmode=json&id=${ids[0]}&tool=urology-opd-navigator`); await sleep(400);
  const r = sum.result?.[ids[0]] || {};
  t.pmid = ids[0]; t.title = String(r.title || '').replace(/<[^>]+>/g, ''); t.journal = r.source || ''; t.year = String(r.pubdate || '').slice(0, 4);
  rows.push(`- ${count === 1 ? '✅' : '⚠️'} **${name}** → ${t.title} (*${t.journal} ${t.year}*${count > 1 ? `, best of ${count}` : ''}) https://pubmed.ncbi.nlm.nih.gov/${t.pmid}/`);
}
fs.writeFileSync(FILE, JSON.stringify(data, null, 1) + '\n');
fs.writeFileSync(ROOT + 'trials-review.md', ['## Trial links', '', '✅ single exact match · ⚠️ best of several (check it) · ❌ no match', '', ...rows].join('\n') + '\n');
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, 'done=1\n');
console.log(rows.join('\n'));
