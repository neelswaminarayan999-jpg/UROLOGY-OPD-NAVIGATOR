/* Urology Oracle © 2026 Dr Neel Swaminarayan. All rights reserved. */
/* V16.13 "What's new in urology": weekly digest from data/news.json (built every Monday by tools/weekly-news.mjs from PubMed,
   summarised by the server's free AI, reviewed in a GitHub pull request). Saved offline like the other data files. */
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let data = null, cat = 'All', q = '';
  const load = () => fetch('/data/news.json').then(r => r.ok ? r.json() : null).then(j => { if (j && Array.isArray(j.items)) data = j; }).catch(() => {});
  function css() {
    if (typeof window.uroSheetCss === 'function') window.uroSheetCss();
    if (document.getElementById('newsCss')) return;
    const s = document.createElement('style'); s.id = 'newsCss';
    s.textContent = `#newsView .chips{display:flex;gap:6px;overflow-x:auto;padding:4px 0 8px}#newsView .chips button{flex:none;padding:7px 11px;border-radius:999px;border:1px solid #cbd5e1;background:#f8fafc;color:#0f172a;font-weight:800;font-size:12px}
#newsView .chips button.on{background:#0f172a;color:#fff;border-color:#0f172a}#newsView input{width:100%;padding:10px;border-radius:10px;border:1px solid #cbd5e1;background:#fff;color:#0f172a;font:inherit;box-sizing:border-box}
#newsView .it{cursor:pointer;padding:12px;border:1px solid #e2e8f0;border-radius:14px;margin-top:10px;background:#fff}#newsView .meta{font-size:11.5px;opacity:.75;display:flex;gap:6px;flex-wrap:wrap;align-items:center}
#newsView .tag{padding:2px 8px;border-radius:999px;background:#e0f2fe;color:#075985;font-weight:800;font-size:11px}#newsView .tag.pin{background:#fef3c7;color:#92400e}#newsView a.t{display:block;font-weight:800;font-size:14px;line-height:1.35;margin:6px 0;color:inherit;text-decoration:none}
#newsView .sum{font-size:13.5px;line-height:1.5}#newsView .why{font-size:13px;line-height:1.45;margin-top:6px;padding:6px 8px;border-left:3px solid #0ea5e9;background:#f0f9ff;border-radius:6px}#newsView h3{margin:16px 0 0;font-size:13px;text-transform:uppercase;letter-spacing:.04em;opacity:.7}
html[data-oracle-theme="dark"] #newsView .it{background:#0f172a;border-color:#334155}html[data-oracle-theme="dark"] #newsView input{background:#0f172a;color:#e2e8f0;border-color:#334155}html[data-oracle-theme="dark"] #newsView .chips button{background:#1e293b;color:#e2e8f0;border-color:#334155}
html[data-oracle-theme="dark"] #newsView .chips button.on{background:#e2e8f0;color:#0f172a}html[data-oracle-theme="dark"] #newsView .why{background:#082f49}html[data-oracle-theme="dark"] #newsView .tag{background:#0c4a6e;color:#e0f2fe}`;
    document.head.appendChild(s);
  }
  function card(x) {
    const url = x.url || (x.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${x.pmid}/` : '');
    return `<div class="it" data-url="${esc(url)}" role="link" tabindex="0"><div class="meta">${x.pinned ? '<span class="tag pin">Recent advance</span>' : ''}<span class="tag">${esc(x.category || 'Other')}</span><span>${esc(x.journal || '')}</span>${x.type ? `<span>· ${esc(x.type)}</span>` : ''}${x.date ? `<span>· ${esc(x.date)}</span>` : ''}</div>
<a class="t" href="${esc(url)}" target="_blank" rel="noopener">${esc(x.title)} <span style="color:#0369a1;font-size:12px">↗</span></a>${x.summary ? `<div class="sum">${esc(x.summary)}</div>` : '<div class="sum" style="opacity:.7">Summary not available — open the source.</div>'}${x.why ? `<div class="why"><b>Why it matters:</b> ${esc(x.why)}</div>` : ''}</div>`;
  }
  function render(v) {
    const out = v.querySelector('#newsOut');
    if (!data) { out.innerHTML = '<div class="card">News could not be loaded. Connect to the internet once to download it; after that it is saved for offline reading.</div>'; return; }
    const cats = ['All', ...new Set(data.items.map(x => x.category || 'Other'))];
    v.querySelector('#newsChips').innerHTML = cats.map(c => `<button type="button" data-c="${esc(c)}" class="${c === cat ? 'on' : ''}">${esc(c)}</button>`).join('');
    v.querySelectorAll('#newsChips button').forEach(b => b.onclick = () => { cat = b.dataset.c; render(v); });
    const ql = q.toLowerCase();
    const list = data.items.filter(x => (cat === 'All' || (x.category || 'Other') === cat) && (!ql || [x.title, x.summary, x.why, x.journal].join(' ').toLowerCase().includes(ql)));
    out.onclick = e => { if (e.target.closest('a')) return; const it = e.target.closest('.it[data-url]'); if (it && it.dataset.url) window.open(it.dataset.url, '_blank', 'noopener'); };
    const pinned = list.filter(x => x.pinned), weekly = list.filter(x => !x.pinned);
    const weeks = [...new Set(weekly.map(x => x.week || ''))];
    out.innerHTML = (pinned.length ? '<h3>Recent advances</h3>' + pinned.map(card).join('') : '') +
      weeks.map(w => `<h3>${w ? 'Week of ' + esc(w) : 'Latest'}</h3>` + weekly.filter(x => (x.week || '') === w).map(card).join('')).join('') +
      (list.length ? '' : '<div class="card">Nothing matches.</div>') +
      '<div style="font-size:11.5px;opacity:.7;margin-top:12px">Tap any item to open the full article. Summaries are AI-written from PubMed abstracts and reviewed before publishing. Always read the original paper before changing practice.</div>';
  }
  function open() {
    css();
    let v = document.getElementById('newsView');
    if (!v) { v = document.createElement('div'); v.id = 'newsView'; v.className = 'uro-sheet'; document.body.appendChild(v); }
    v.innerHTML = `<div class="vw"><header><div><h2>What's new in urology</h2><div class="sub" id="newsSub">Updated every Monday</div></div><button class="ghost" id="newsClose">Close</button></header>
<input id="newsQ" type="search" placeholder="Search news"><div class="chips" id="newsChips"></div><div id="newsOut"><div class="card">Loading…</div></div></div>`;
    v.querySelector('#newsClose').onclick = () => v.remove();
    v.querySelector('#newsQ').oninput = e => { q = e.target.value; render(v); };
    const go = () => { if (data?.updated) v.querySelector('#newsSub').textContent = 'Updated every Monday · last update ' + data.updated; render(v); };
    data ? go() : load().then(go);
  }
  window.openNews = open;
  function tile() {
    const grid = document.getElementById('v141QuickGrid');
    if (!grid || grid.querySelector('[data-core-tool="news"]')) return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'v141-tool'; b.dataset.coreTool = 'news';
    b.innerHTML = "<b>What's new</b><span>Weekly urology research digest</span>";
    b.onclick = open; grid.prepend(b);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tile, { once: true }); else tile();
  setTimeout(tile, 1500); setTimeout(tile, 3300); load();
})();
