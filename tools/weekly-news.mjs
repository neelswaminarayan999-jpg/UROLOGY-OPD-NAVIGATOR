// Weekly "What's new in urology" digest. Run by .github/workflows/weekly-news.yml (or by hand):
//   node tools/weekly-news.mjs https://urology-opd-navigator.onrender.com 20
// 1. Searches PubMed (free NCBI E-utilities, no key) for records added in the last 8 days to leading urology journals,
//    plus urology papers in major general and oncology journals.
// 2. Ranks them (guidelines and randomised trials first, then meta-analyses and big journals) and drops letters,
//    editorials and replies.
// 3. Sends titles + abstracts to the live server's /api/news, which writes short plain-language summaries.
// 4. Prepends the items to frontend/data/news.json and writes news-review.md for the pull request.
import fs from 'node:fs';

const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
const TOOL = '&tool=urology-opd-navigator';
const sleep = ms => new Promise(r => setTimeout(r, ms));

export const SPECIALTY = ['Eur Urol', 'J Urol', 'BJU Int', 'Eur Urol Oncol', 'Eur Urol Focus', 'Nat Rev Urol', 'Urology', 'World J Urol',
  'Prostate Cancer Prostatic Dis', 'J Endourol', 'Neurourol Urodyn', 'J Sex Med', 'Indian J Urol', 'Urolithiasis', 'Eur Urol Open Sci'];
export const GENERAL = ['N Engl J Med', 'Lancet', 'Lancet Oncol', 'JAMA', 'JAMA Oncol', 'JAMA Netw Open', 'J Clin Oncol', 'Ann Oncol', 'BMJ', 'Nat Med'];
const URO_TERMS = ['urolog*', 'prostat*', 'bladder', 'urothelial', '"renal cell"', 'nephrolithiasis', '"kidney stone*"', 'urolithiasis', 'testicular',
  '"urinary tract infection*"', '"urinary incontinence"', 'erectile', 'penile', 'cystectomy', 'nephrectomy', 'ureter*'];
export function query() {
  const ta = list => list.map(j => `"${j}"[ta]`).join(' OR ');
  return `((${ta(SPECIALTY)}) OR ((${ta(GENERAL)}) AND (${URO_TERMS.map(t => t + '[tiab]').join(' OR ')})))`;
}

const SKIP_TYPES = /^(Comment|Editorial|Letter|Erratum|Published Erratum|Retraction of Publication|Retracted Publication|News|Biography|Portrait|Interview|Video-Audio Media|Congress|Patient Education Handout)$/i;
const SKIP_TITLE = /^(re:|reply|in reply|response to|editorial comment|words of wisdom|erratum|corrigendum|correction|retraction|letter|comment on|this month in|highlights)|\bimages? in\b|case report/i;
const BIG = { 'N Engl J Med': 4, 'Lancet': 4, 'JAMA': 3.5, 'Lancet Oncol': 3.5, 'J Clin Oncol': 3, 'Ann Oncol': 2.5, 'BMJ': 3, 'Nat Med': 3, 'JAMA Oncol': 3, 'Eur Urol': 2.5, 'J Urol': 2, 'BJU Int': 1.5, 'Eur Urol Oncol': 1.5, 'Eur Urol Focus': 1.2, 'Nat Rev Urol': 1.2 };

// Score one esummary record; returns null if it should be skipped.
export function score(rec) {
  const types = (rec.pubtype || []).map(String);
  const title = String(rec.title || '').replace(/<[^>]+>/g, '').trim();
  if (!title || title.length < 25 || types.some(t => SKIP_TYPES.test(t)) || SKIP_TITLE.test(title)) return null;
  let s = BIG[rec.source] || 1;
  const t = title.toLowerCase(), all = types.join(' ').toLowerCase();
  if (/guideline|consensus|recommendation/.test(all + ' ' + t)) s += 5;
  if (/randomi[sz]ed controlled trial|clinical trial, phase iii/.test(all) || /\brandomi[sz]ed\b|phase (3|iii)\b|\btrial\b/.test(t)) s += 4;
  if (/meta-analysis|systematic review/.test(all + ' ' + t)) s += 2.5;
  if (/multicenter|multicentre|prospective|cohort|nationwide|population-based/.test(all + ' ' + t)) s += 1;
  if (/\breview\b/.test(all) && !/systematic/.test(all + t)) s -= 1;
  if (/\b(rat|rats|mice|mouse|murine|in vitro|cell line)\b/.test(t)) s -= 3;
  if (/\b(rationale|protocol|study design|enrollment characteristics|trial in progress)\b/.test(t)) s -= 3;
  const type = /guideline|consensus/.test(all + ' ' + t) ? 'Guideline / consensus' : /randomi[sz]ed|phase (3|iii)/.test(all + ' ' + t) ? 'Randomised trial'
    : /meta-analysis/.test(all + ' ' + t) ? 'Meta-analysis' : /systematic review/.test(all + ' ' + t) ? 'Systematic review' : /trial/.test(t) ? 'Clinical trial' : 'Study';
  const doi = (rec.articleids || []).find(a => a.idtype === 'doi')?.value || '';
  return { pmid: String(rec.uid), title, journal: rec.source || rec.fulljournalname || '', date: String(rec.sortpubdate || rec.pubdate || '').slice(0, 10).replace(/\//g, '-'), type, doi, score: s };
}

// Pull PMID -> abstract text out of an efetch XML response.
export function abstracts(xml) {
  const out = {};
  for (const art of String(xml).split('<PubmedArticle>').slice(1)) {
    const pmid = (art.match(/<PMID[^>]*>(\d+)<\/PMID>/) || [])[1]; if (!pmid) continue;
    const parts = [...art.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)].map(m => {
      const label = (m[1].match(/Label="([^"]+)"/) || [])[1];
      const text = m[2].replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x2009;|&#8201;/g, ' ').replace(/\s+/g, ' ').trim();
      return label ? `${label}: ${text}` : text;
    });
    out[pmid] = parts.join(' ').slice(0, 3000);
  }
  return out;
}

async function get(url, kind = 'json') {
  for (let i = 1; i <= 3; i++) {
    try { const r = await fetch(url); if (r.ok) return kind === 'json' ? r.json() : r.text(); console.log(`  PubMed HTTP ${r.status}, retry ${i}/3`); } catch (e) { console.log(`  PubMed error ${e.message}, retry ${i}/3`); }
    await sleep(3000 * i);
  }
  throw new Error('PubMed unreachable: ' + url.slice(0, 120));
}

async function main() {
  const site = (process.argv[2] || 'https://urology-opd-navigator.onrender.com').replace(/\/$/, '');
  const target = Math.min(Math.max(Number(process.argv[3]) || 20, 3), 40);
  const ROOT = new URL('../', import.meta.url).pathname, FILE = ROOT + 'frontend/data/news.json';
  const news = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const have = new Set(news.items.map(x => String(x.pmid || '')));
  const week = new Date().toISOString().slice(0, 10);

  const s = await get(`${EUTILS}esearch.fcgi?db=pubmed&retmode=json&retmax=400&datetype=edat&reldate=8&term=${encodeURIComponent(query())}${TOOL}`);
  const ids = (s.esearchresult?.idlist || []).filter(id => !have.has(id));
  console.log(`PubMed: ${s.esearchresult?.count || 0} records in the last 8 days, ${ids.length} new`);
  const recs = [];
  for (let i = 0; i < ids.length; i += 150) {
    const j = await get(`${EUTILS}esummary.fcgi?db=pubmed&retmode=json&id=${ids.slice(i, i + 150).join(',')}${TOOL}`); await sleep(400);
    for (const id of j.result?.uids || []) { const r = score(j.result[id]); if (r) recs.push(r); }
  }
  recs.sort((a, b) => b.score - a.score);
  // Spread across journals: at most 4 items per journal, so high-volume journals cannot crowd out the rest.
  const perJournal = {}, spread = recs.filter(r => (perJournal[r.journal] = (perJournal[r.journal] || 0) + 1) <= Number(process.env.NEWS_PER_JOURNAL || 4));
  const pool = spread.slice(0, target * 2);
  const abs = pool.length ? abstracts(await get(`${EUTILS}efetch.fcgi?db=pubmed&retmode=xml&id=${pool.map(r => r.pmid).join(',')}${TOOL}`, 'text')) : {};
  const chosen = pool.filter(r => (abs[r.pmid] || '').length > 200).slice(0, target);
  console.log(`Chosen ${chosen.length} records with abstracts`);

  const added = [];
  for (let i = 0; i < chosen.length; i += 5) {
    const batch = chosen.slice(i, i + 5);
    let sums = [];
    try {
      const r = await fetch(site + '/api/news', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items: batch.map(b => ({ title: b.title, abstract: abs[b.pmid], journal: b.journal, type: b.type })) }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok) sums = j.items || []; else console.log(`  summaries HTTP ${r.status}: ${String(j.error || '').slice(0, 120)}`);
    } catch (e) { console.log('  summaries failed: ' + e.message); }
    batch.forEach((b, k) => {
      const m = sums.find(x => x.index === k) || {};
      added.push({ id: 'pm' + b.pmid, pmid: b.pmid, week, date: b.date, journal: b.journal, type: b.type, category: m.category || 'Other', title: b.title, summary: m.summary || '', why: m.why || '', url: `https://pubmed.ncbi.nlm.nih.gov/${b.pmid}/`, doi: b.doi });
    });
    await sleep(Number(process.env.NEWS_GAP_MS ?? 6000));
  }

  const pinned = news.items.filter(x => x.pinned), older = news.items.filter(x => !x.pinned);
  news.items = [...pinned, ...added, ...older].slice(0, 200);
  news.updated = week;
  fs.writeFileSync(FILE, `{\n "about": ${JSON.stringify(news.about)},\n "updated": "${week}",\n "items": [\n${news.items.map(x => '  ' + JSON.stringify(x)).join(',\n')}\n ]\n}\n`);
  const md = [`## What's new in urology — week of ${week}`, '', `${added.length} new items. Edit or delete any line of \`frontend/data/news.json\` on this branch before merging.`, '',
    ...added.map((x, n) => `${n + 1}. **${x.title}** — *${x.journal}, ${x.type}* · ${x.category}\n   ${x.summary || '_(no summary)_'}${x.why ? `\n   _Why it matters:_ ${x.why}` : ''}\n   ${x.url}`)].join('\n');
  fs.writeFileSync(ROOT + 'news-review.md', md + '\n');
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `added=${added.length}\n`);
  console.log(`Added ${added.length} items`);
}
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) main().catch(e => { console.error(e); process.exit(1); });
