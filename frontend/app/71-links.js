/* Urology Oracle © 2026 Dr Neel Swaminarayan. All rights reserved.
   V16.14 "tap to open the source": turns short references across the app into links.
   - Named trials (from TRIALS plus trials cited in the formulary and news) → PubMed search for that trial.
   - Drug names in the formulary pages, Compare drugs table and Protocol / dose library → the drug's label search on DailyMed.
   Works on whatever is on screen (topic pages, trials, modals, sheets), skipping links, inputs, buttons and diagrams. */
(function () {
  const EXTRA = ['PIVOT', 'SPCG-4', 'NOSTONE', 'TRAVERSE', 'ALTAR', 'MERIT', 'MTOPS', 'CombAT', 'ALFAUR', 'ValUE', 'EAGLE-2', 'EAGLE-3', 'SUSPEND', 'CARES', 'PCPT', 'REDUCE', 'SOFIA', 'NEPTUNE', 'ALLHAT', 'SWOG S0337', 'ARAMIS', 'SPARTAN', 'PROSPER', 'KEYNOTE-057', 'NIAGARA', 'CheckMate 274', 'KEYNOTE-564'];
  const SKIP_NAMES = /^(IGCCCG cohorts|De-escalation programmes|TIP phase II|LITESPARK|carboplatin studies|CheckMate 274 UTUC subgroup)$/;
  let trialRe = null;
  function trialNames() {
    const raw = (typeof TRIALS !== 'undefined' ? TRIALS.map(t => t[1]) : []).flatMap(n => String(n).split(/\s*\/\s*/)).concat(EXTRA, Object.keys(LINKS));
    return [...new Set(raw.map(s => s.replace(/\s*\(.*?\)\s*/g, '').trim()).filter(s => s.length >= 4 && !SKIP_NAMES.test(s)))].sort((a, b) => b.length - a.length);
  }
  function getTrialRe() {
    if (trialRe) return trialRe;
    const names = trialNames(); if (!names.length) return null;
    const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    trialRe = new RegExp('(?<![\\w-])(' + names.map(escRe).join('|') + ')(?![\\w-])', 'g');
    return trialRe;
  }
  // Exact paper per trial from data/trial-links.json (PMID once resolved; otherwise a precise author/year/journal query,
  // which PubMed opens directly when it matches one paper). Unknown names fall back to a title search.
  let LINKS = {};
  const loadLinks = fetch('/data/trial-links.json').then(r => r.ok ? r.json() : null).then(j => { LINKS = j?.trials || {}; trialRe = null; }).catch(() => {});
  const pubmed = n => {
    const t = LINKS[n];
    if (t?.pmid) return 'https://pubmed.ncbi.nlm.nih.gov/' + t.pmid + '/';
    if (t?.q) return 'https://pubmed.ncbi.nlm.nih.gov/?term=' + encodeURIComponent(t.q);
    return 'https://pubmed.ncbi.nlm.nih.gov/?term=' + encodeURIComponent('"' + n + '"[tiab] AND (randomized OR trial)');
  };
  const dailymed = n => 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=' + encodeURIComponent(n);
  // Turn a drug entry name into a label search term; returns '' for class or regimen entries that have no single label.
  const NO_LABEL = /^(oral cephalosporins|newer agents|low-dose|om-89|stent-related|bone protection|hot flush|calcium & magnesium|primary hyperoxaluria|bladder spasm|trimix|daily ssris|lhrh|adt|bep|ep |vip|gem\/cis|ddmvac|nivolumab \+|pembrolizumab \+|lenvatinib \+|enfortumab|durvalumab|atezolizumab|lu-177|avelumab|belzutifan)/i;
  const drugQuery = n => {
    n = String(n).trim();
    if (NO_LABEL.test(n) || /\+/.test(n)) return '';
    const cls = n.match(/^(Thiazides|Aminoglycosides|Carbapenems|Diclofenac \/ NSAIDs)\s*\(([^,)]+)/i);
    if (cls) return cls[2].trim();
    return _drugQuery(n);
  };
  const _drugQuery = n => String(n).split(/\s*[(–—/]|\s+-\s+|\s+\(|,/)[0].replace(/\b(intracavernosal|intravesical|intraurethral|or topical|daily, for LUTS|MET|colic|single immediate instillation|long-acting IM|on ADT)\b/gi, '').trim();

  function css() {
    if (document.getElementById('refLinkCss')) return;
    const s = document.createElement('style'); s.id = 'refLinkCss';
    s.textContent = `a.ref-link{color:#0369a1;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:2px;font-weight:inherit}a.ref-link::after{content:' ↗';font-size:.8em;text-decoration:none}
a.lbl-link{display:inline-block;margin-top:6px;font-size:11.5px;font-weight:800;color:#0369a1;text-decoration:none;border:1px solid #bae6fd;background:#f0f9ff;border-radius:999px;padding:3px 9px}
html[data-oracle-theme="dark"] a.ref-link,html[data-oracle-theme="dark"] a.lbl-link{color:#7dd3fc}html[data-oracle-theme="dark"] a.lbl-link{background:#082f49;border-color:#0c4a6e}`;
    document.head.appendChild(s);
  }

  // Wrap trial names in text nodes under `root`.
  function linkTrials(root) {
    const re = getTrialRe(); if (!re || !root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue || n.nodeValue.length < 4) return NodeFilter.FILTER_REJECT;
        const p = n.parentElement;
        if (!p || p.closest('a,button,input,textarea,select,svg,script,style,summary,#newsTicker,.no-autolink,header')) return NodeFilter.FILTER_REJECT;
        re.lastIndex = 0; return re.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const n of nodes) {
      const frag = document.createDocumentFragment(); let last = 0; const text = n.nodeValue; re.lastIndex = 0; let m;
      while ((m = re.exec(text))) {
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const a = document.createElement('a'); a.className = 'ref-link'; a.href = pubmed(m[1]); a.target = '_blank'; a.rel = 'noopener'; a.textContent = m[1];
        a.title = 'Open ' + m[1] + ' on PubMed'; a.dataset.trial = m[1]; frag.appendChild(a); last = m.index + m[1].length;
      }
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      n.parentNode.replaceChild(frag, n);
    }
  }

  // Formulary topic pages: add a "Label ↗" chip to each drug card.
  function linkFormularyCards() {
    if (typeof FORMULARY === 'undefined') return;
    const names = new Set(Object.values(FORMULARY).flatMap(t => t.classes.flatMap(c => c.drugs.map(d => d.n))));
    document.querySelectorAll('#diseaseContent article.card h3').forEach(h => {
      const n = h.textContent.trim(); const card = h.closest('article');
      if (!names.has(n) || card.querySelector('.lbl-link')) return;
      const q = drugQuery(n); if (!q) return;
      const a = document.createElement('a'); a.className = 'lbl-link'; a.href = dailymed(q); a.target = '_blank'; a.rel = 'noopener';
      a.textContent = 'Product label (DailyMed) ↗'; card.appendChild(a);
    });
  }
  // Compare drugs table and Protocol / dose library: drug name → label search.
  function linkDrugTables() {
    document.querySelectorAll('#fmView td:first-child').forEach(td => {
      if (td.querySelector('a')) return;
      const first = td.firstChild; if (!first || first.nodeType !== 3) return;
      const n = first.nodeValue.trim(), q = drugQuery(n); if (!q) return;
      const a = document.createElement('a'); a.className = 'ref-link'; a.href = dailymed(q); a.target = '_blank'; a.rel = 'noopener'; a.textContent = n; a.title = 'Open the product label';
      td.replaceChild(a, first);
    });
    document.querySelectorAll('#drugGrid article').forEach(card => {
      if (card.querySelector('.lbl-link')) return;
      const badge = card.querySelector('.badge'); if (!badge) return;
      const q = drugQuery(badge.textContent.replace(/\s+–\s+.*$/, '')); if (!q || q.length < 4 || /\s/.test(q)) return;
      const a = document.createElement('a'); a.className = 'lbl-link'; a.href = dailymed(q); a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Product label ↗'; card.appendChild(a);
    });
  }

  let pending = false;
  function sweep() {
    pending = false; css();
    try {
      ['diseaseContent', 'trialGrid', 'drugGrid', 'fmView', 'v141GlobalSearchModal', 'searchView'].forEach(id => { const el = document.getElementById(id); if (el) linkTrials(el); });
      document.querySelectorAll('.v141-core-note, [role="dialog"], .uro-sheet:not(#newsView):not(#vivaView):not(#mcqView)').forEach(linkTrials);
      linkFormularyCards(); linkDrugTables();
    } catch (e) { console.warn('auto-link', e); }
  }
  const schedule = () => { if (!pending) { pending = true; setTimeout(sweep, 120); } };
  function start() {
    sweep();
    loadLinks.then(() => { document.querySelectorAll('a.ref-link[data-trial]').forEach(a => { a.href = pubmed(a.dataset.trial); }); sweep(); });
    new MutationObserver(muts => { if (muts.some(m => m.addedNodes.length && ![...m.addedNodes].every(n => n.nodeType === 1 && n.matches?.('a.ref-link,a.lbl-link')))) schedule(); })
      .observe(document.body, { childList: true, subtree: true });
  }
  window.uroAutoLink = { linkTrials, trialNames, drugQuery, sweep };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
