/* Urology Oracle © 2026 Dr Neel Swaminarayan. All rights reserved. */
/* V16.13 "Compare drugs": side-by-side tables for the urology drug formulary (data/formulary.js), with a search across all drugs. */
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function css() {
    if (typeof window.uroSheetCss === 'function') window.uroSheetCss();
    if (document.getElementById('fmCss')) return;
    const s = document.createElement('style'); s.id = 'fmCss';
    s.textContent = `#fmView select,#fmView input{width:100%;margin-top:6px;padding:10px;border-radius:10px;border:1px solid #cbd5e1;background:#fff;color:#0f172a;font:inherit;box-sizing:border-box}
#fmView .tw{overflow-x:auto;margin-top:10px;border:1px solid #e2e8f0;border-radius:12px}#fmView table{border-collapse:collapse;min-width:720px;font-size:12.5px;line-height:1.45}
#fmView th,#fmView td{border-bottom:1px solid #e2e8f0;padding:8px;vertical-align:top;text-align:left}#fmView th{background:#f1f5f9;font-weight:800;position:sticky;top:0}#fmView td:first-child{font-weight:800;min-width:110px}
#fmView h3{margin:16px 0 4px;font-size:15px}#fmView .hint{font-size:12px;opacity:.75;margin-top:6px}
html[data-oracle-theme="dark"] #fmView select,html[data-oracle-theme="dark"] #fmView input{background:#0f172a;color:#e2e8f0;border-color:#334155}
html[data-oracle-theme="dark"] #fmView .tw{border-color:#334155}html[data-oracle-theme="dark"] #fmView th{background:#1e293b;color:#e2e8f0}html[data-oracle-theme="dark"] #fmView th,html[data-oracle-theme="dark"] #fmView td{border-color:#334155}`;
    document.head.appendChild(s);
  }
  const cols = [['dose', 'Dose'], ['adj', 'Renal / hepatic'], ['ae', 'Adverse effects'], ['avoid', 'Avoid / caution'], ['ix', 'Interactions']];
  function table(drugs) {
    return `<div class="tw"><table><thead><tr><th>Drug</th>${cols.map(c => `<th>${c[1]}</th>`).join('')}</tr></thead><tbody>${drugs.map(d => `<tr><td>${esc(d.n)}${d.topic ? `<div style="font-weight:400;opacity:.7;font-size:11px">${esc(d.topic.replace(/^Drugs: /, ''))}</div>` : ''}</td>${cols.map(c => `<td>${esc(d[c[0]] || '—')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  function render(v, topic, q) {
    const F = window.FORMULARY || (typeof FORMULARY !== 'undefined' ? FORMULARY : {});
    const out = v.querySelector('#fmOut');
    q = (q || '').trim().toLowerCase();
    if (q.length >= 2) {
      const hits = [];
      for (const [t, data] of Object.entries(F)) for (const c of data.classes) for (const d of c.drugs)
        if ([d.n, d.dose, d.ae, d.avoid, d.ix, d.notes, c.title].join(' ').toLowerCase().includes(q)) hits.push({ ...d, topic: t });
      out.innerHTML = hits.length ? `<h3>${hits.length} match${hits.length > 1 ? 'es' : ''} for “${esc(q)}”</h3>` + table(hits) : '<div class="hint">No drug matches that search.</div>';
      return;
    }
    const data = F[topic]; if (!data) { out.innerHTML = ''; return; }
    out.innerHTML = data.classes.filter(c => c.drugs.length).map(c => `<h3>${esc(c.title)}</h3>` + table(c.drugs)).join('') +
      '<div class="hint">Swipe the tables sideways. Usual adult doses — always confirm with the current product label and local formulary. Full class notes and pearls are on the topic page.</div>';
  }
  function open(topic) {
    css();
    const F = typeof FORMULARY !== 'undefined' ? FORMULARY : {};
    const names = Object.keys(F); if (!F[topic]) topic = names[0];
    let v = document.getElementById('fmView');
    if (!v) { v = document.createElement('div'); v.id = 'fmView'; v.className = 'uro-sheet'; document.body.appendChild(v); }
    v.innerHTML = `<div class="vw"><header><div><h2>Compare drugs</h2><div class="sub">Urology drug formulary · side-by-side tables</div></div><button class="ghost" id="fmClose">Close</button></header>
<div class="card"><input id="fmSearch" type="search" placeholder="Search all drugs (e.g. silodosin, QT, CrCl, pregnancy)"><select id="fmTopic">${names.map(n => `<option ${n === topic ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select></div><div id="fmOut"></div></div>`;
    v.querySelector('#fmClose').onclick = () => v.remove();
    v.querySelector('#fmTopic').onchange = e => { v.querySelector('#fmSearch').value = ''; render(v, e.target.value, ''); };
    v.querySelector('#fmSearch').oninput = e => render(v, v.querySelector('#fmTopic').value, e.target.value);
    render(v, topic, '');
  }
  window.oracleOpenFormulary = open;
})();
(function () {
  function tile() {
    const grid = document.getElementById('v141QuickGrid');
    if (!grid || grid.querySelector('[data-core-tool="formulary"]') || typeof window.oracleOpenFormulary !== 'function') return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'v141-tool'; b.dataset.coreTool = 'formulary';
    b.innerHTML = '<b>Drug formulary</b><span>Compare urology drugs · offline</span>';
    b.onclick = () => window.oracleOpenFormulary();
    const mcq = grid.querySelector('[data-core-tool="mcq"]'); mcq ? mcq.after(b) : grid.append(b);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tile, { once: true }); else tile();
  setTimeout(tile, 1400); setTimeout(tile, 3200);
})();
