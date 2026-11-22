/* Urology Oracle © 2026 Dr Neel Swaminarayan. All rights reserved.
   V16.13 streamlined home screen.
   Rebuilds the home layout into: news ticker → 4 primary actions → tools → topics grouped by area → collapsible extras.
   It only MOVES or HIDES existing elements (their buttons and handlers keep working); nothing is deleted. Runs last. */
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const call = (fn, arg) => { const f = window[fn]; if (typeof f === 'function') f(arg); };

  function css() {
    if (document.getElementById('homeV2Css')) return;
    const s = document.createElement('style'); s.id = 'homeV2Css';
    s.textContent = `
#homeView>.h2-hide{display:none!important}
#homeV2{display:flex;flex-direction:column;gap:14px;margin-bottom:8px}
#homeV2 .h2-sec{font-size:11.5px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#64748b;margin:4px 2px 6px}
#newsTicker{display:flex;align-items:center;gap:10px;background:linear-gradient(90deg,#0f172a,#1e293b);color:#fff;border-radius:14px;padding:10px 12px;cursor:pointer;overflow:hidden;box-shadow:0 6px 18px rgba(15,23,42,.18);border:0;width:100%;text-align:left;font:inherit}
#newsTicker .nt-badge{flex:none;display:flex;align-items:center;gap:6px;background:#ef4444;color:#fff;font-weight:900;font-size:11px;letter-spacing:.06em;padding:4px 8px;border-radius:999px}
#newsTicker .nt-dot{width:7px;height:7px;border-radius:50%;background:#fff;animation:ntPulse 1.4s infinite}
@keyframes ntPulse{0%{box-shadow:0 0 0 0 rgba(255,255,255,.8)}70%{box-shadow:0 0 0 8px rgba(255,255,255,0)}100%{box-shadow:0 0 0 0 rgba(255,255,255,0)}}
#newsTicker .nt-win{flex:1;overflow:hidden;white-space:nowrap;mask-image:linear-gradient(90deg,transparent,#000 4%,#000 92%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 4%,#000 92%,transparent)}
#newsTicker .nt-track{display:inline-block;padding-left:100%;animation:ntScroll var(--nt-dur,60s) linear infinite;font-size:13px;font-weight:700}
#newsTicker:hover .nt-track,#newsTicker:focus .nt-track{animation-play-state:paused}
#newsTicker .nt-track span,#newsTicker .nt-track a{margin-right:28px;color:#fff;text-decoration:none}#newsTicker .nt-track a:active{text-decoration:underline}#newsTicker .nt-track i{font-style:normal;color:#7dd3fc;margin-right:6px}
#newsTicker .nt-go{flex:none;font-size:12px;font-weight:900;color:#7dd3fc}
#newsTicker .nt-track,#newsTicker .nt-track span,#newsTicker .nt-track a,#newsTicker .nt-track i{display:inline!important;white-space:nowrap!important}#newsTicker .nt-track{display:inline-block!important}
#homeV2 .h2-p b,#homeV2 .h2-t b,#homeV2 .h2-row b{color:#0f172a!important;display:block}#homeV2 .h2-p.dark b{color:#fff!important}
html[data-oracle-theme="dark"] #homeV2 .h2-p b,html[data-oracle-theme="dark"] #homeV2 .h2-t b,html[data-oracle-theme="dark"] #homeV2 .h2-row b{color:#f1f5f9!important}
#homeV2 .h2-p span:not(.ic){display:block}
@keyframes ntScroll{from{transform:translateX(0)}to{transform:translateX(-100%)}}
@media (prefers-reduced-motion:reduce){#newsTicker .nt-track{animation:none;padding-left:0;white-space:normal}}
#homeV2 .h2-primary{display:grid;grid-template-columns:1fr 1fr;gap:10px}
#homeV2 .h2-p{display:flex;flex-direction:column;gap:4px;text-align:left;padding:14px;border-radius:16px;border:1px solid #e2e8f0;background:#fff;box-shadow:0 1px 2px rgba(15,23,42,.05);font:inherit;color:#0f172a;min-height:92px}
#homeV2 .h2-p .ic{font-size:22px}#homeV2 .h2-p b{font-size:14.5px}#homeV2 .h2-p span{font-size:11.5px;color:#64748b;line-height:1.35}
#homeV2 .h2-p.dark{background:#0f172a;color:#fff;border-color:#0f172a}#homeV2 .h2-p.dark span{color:#cbd5e1}
#homeV2 .h2-tools{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
#homeV2 .h2-t{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:12px 6px;border-radius:14px;border:1px solid #e2e8f0;background:#fff;font:inherit;color:#0f172a;text-align:center;min-height:76px}
#homeV2 .h2-t .ic{font-size:20px}#homeV2 .h2-t b{font-size:12px;line-height:1.2}
#homeV2 .h2-group{border:1px solid #e2e8f0;border-radius:16px;background:#fff;overflow:hidden}
#homeV2 .h2-group>summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;padding:12px 14px;font-weight:900;font-size:14px}
#homeV2 .h2-group>summary::-webkit-details-marker{display:none}#homeV2 .h2-group>summary small{font-weight:700;color:#64748b;font-size:12px}
#homeV2 .h2-group>summary::after{content:'›';font-size:20px;color:#94a3b8;transition:transform .2s;margin-left:8px}#homeV2 .h2-group[open]>summary::after{transform:rotate(90deg)}
#homeV2 .h2-row{display:flex;gap:10px;align-items:center;width:100%;text-align:left;padding:10px 14px;border:0;border-top:1px solid #f1f5f9;background:transparent;font:inherit;color:#0f172a}
#homeV2 .h2-row .ic{font-size:18px;width:26px;text-align:center;flex:none}#homeV2 .h2-row b{display:block;font-size:13.5px}
#homeV2 .h2-row span{display:block;font-size:11.5px;color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(100vw - 110px)}
#homeV2 .h2-extra{padding:4px 10px 12px}
#homeV2 .h2-safety{font-size:11.5px;color:#92400e;background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:8px 10px;line-height:1.45}
html[data-oracle-theme="dark"] #homeV2 .h2-p,html[data-oracle-theme="dark"] #homeV2 .h2-t,html[data-oracle-theme="dark"] #homeV2 .h2-group{background:#0f172a;border-color:#334155;color:#e2e8f0}
html[data-oracle-theme="dark"] #homeV2 .h2-p.dark{background:#1e3a8a;border-color:#1e3a8a}
html[data-oracle-theme="dark"] #homeV2 .h2-row{color:#e2e8f0;border-color:#1e293b}html[data-oracle-theme="dark"] #homeV2 .h2-safety{background:#422006;color:#fde68a;border-color:#78350f}
html[data-oracle-theme="dark"] #newsTicker{background:linear-gradient(90deg,#020617,#0f172a);border:1px solid #334155}
@media (min-width:900px){#homeV2 .h2-primary{grid-template-columns:repeat(4,1fr)}#homeV2 .h2-tools{grid-template-columns:repeat(6,1fr)}#homeV2 .h2-topics{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;align-items:start}}
`;
    document.head.appendChild(s);
  }

  /* ---- news ticker ---- */
  let headlines = null;
  function loadHeadlines() {
    if (headlines) return Promise.resolve(headlines);
    return fetch('/data/news.json').then(r => r.ok ? r.json() : null).then(j => {
      const items = (j?.items || []);
      const weekly = items.filter(x => !x.pinned), pinned = items.filter(x => x.pinned);
      headlines = [...weekly.slice(0, 8), ...pinned.slice(0, 4)].map(x => ({ cat: x.category || 'News', t: x.title, url: x.url || (x.pmid ? 'https://pubmed.ncbi.nlm.nih.gov/' + x.pmid + '/' : '') }));
      return headlines;
    }).catch(() => (headlines = []));
  }
  function ticker() {
    const b = document.createElement('div'); b.id = 'newsTicker'; b.setAttribute('role', 'button'); b.tabIndex = 0; b.setAttribute('aria-label', "Open what's new in urology");
    b.innerHTML = `<span class="nt-badge"><span class="nt-dot"></span>NEW</span><span class="nt-win"><span class="nt-track">Loading this week's urology news…</span></span><span class="nt-go">Open ›</span>`;
    b.onclick = e => { if (e.target.closest('a')) return; call('openNews'); };
    loadHeadlines().then(h => {
      const tr = b.querySelector('.nt-track');
      if (!h.length) { tr.textContent = "What's new in urology — weekly research digest"; return; }
      tr.innerHTML = h.map(x => x.url ? `<a class="nt-a" href="${esc(x.url)}" target="_blank" rel="noopener"><i>${esc(x.cat)}</i>${esc(x.t)}</a>` : `<span><i>${esc(x.cat)}</i>${esc(x.t)}</span>`).join('');
      const chars = h.reduce((n, x) => n + x.t.length + x.cat.length, 0);
      b.style.setProperty('--nt-dur', Math.max(30, Math.round(chars / 9)) + 's');
    });
    return b;
  }

  /* ---- topics ---- */
  function groups() {
    const names = typeof DISEASES === 'object' ? Object.keys(DISEASES) : [];
    const onco = names.filter(n => /^(Ca |UTUC|Urethral Cancer|Adrenal)/.test(n));
    const drugs = names.filter(n => /^Drugs: /.test(n));
    const benign = names.filter(n => !onco.includes(n) && !drugs.includes(n));
    return [
      { key: 'onco', title: 'Uro-oncology', list: onco },
      { key: 'benign', title: 'Benign, functional & female urology', list: benign },
      { key: 'drugs', title: 'Drug formulary', list: drugs }
    ].filter(g => g.list.length);
  }
  function topicRow(n) {
    const d = DISEASES[n];
    const tag = String(d.tagline || '').replace(/^Formulary • /, '').replace(/^Campbell 13e[^•]*• /, '');
    const b = document.createElement('button'); b.type = 'button'; b.className = 'h2-row';
    b.innerHTML = `<span class="ic">${esc(d.emoji || '•')}</span><span style="min-width:0"><b>${esc(n.replace(/^Drugs: /, ''))}</b><span>${esc(tag)}</span></span>`;
    b.onclick = () => call('openDisease', n);
    return b;
  }

  function build() {
    const hv = document.getElementById('homeView'); if (!hv || typeof DISEASES !== 'object') return;
    css();
    let root = document.getElementById('homeV2');
    if (!root) {
      root = document.createElement('div'); root.id = 'homeV2';
      root.appendChild(ticker());
      const primary = [
        ['🧭', 'Clinical Oracle', 'Inputs → classification → treatment plan', 'openOracle', 'dark'],
        ['🤖', 'Investigation AI', 'Image or report → interpretation', 'openOnlineAI'],
        ['🎓', 'Viva mode', 'Ward-round viva, marked by AI', 'openViva'],
        ['✅', 'MCQ practice', 'Offline · new questions weekly', 'openMcq']
      ];
      const sec = t => { const d = document.createElement('div'); d.className = 'h2-sec'; d.textContent = t; return d; };
      const pWrap = document.createElement('div'); pWrap.innerHTML = '';
      pWrap.appendChild(sec('Start'));
      const pg = document.createElement('div'); pg.className = 'h2-primary';
      primary.forEach(([ic, t, s, fn, cls]) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'h2-p' + (cls ? ' ' + cls : ''); b.innerHTML = `<span class="ic">${ic}</span><b>${esc(t)}</b><span>${esc(s)}</span>`; b.onclick = () => call(fn); pg.appendChild(b); });
      pWrap.appendChild(pg); root.appendChild(pWrap);

      const tools = [
        ['🧮', 'Scores', 'openCalculators'], ['💊', 'Formulary', 'oracleOpenFormulary'], ['💉', 'Regimens', 'openDrugs'],
        ['🛠️', 'Op atlas', 'openProcedureAtlas'], ['📚', 'Trials', 'openTrials'], ['📰', "What's new", 'openNews']
      ];
      const tWrap = document.createElement('div'); tWrap.appendChild(sec('Tools'));
      const tg = document.createElement('div'); tg.className = 'h2-tools';
      tools.forEach(([ic, t, fn]) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'h2-t'; b.innerHTML = `<span class="ic">${ic}</span><b>${esc(t)}</b>`; b.onclick = () => call(fn); tg.appendChild(b); });
      tWrap.appendChild(tg); root.appendChild(tWrap);

      const topWrap = document.createElement('div'); topWrap.appendChild(sec('Topics'));
      const tp = document.createElement('div'); tp.className = 'h2-topics'; tp.id = 'homeV2Topics'; topWrap.appendChild(tp); root.appendChild(topWrap);

      const more = document.createElement('div'); more.appendChild(sec('More'));
      more.innerHTML += '';
      const mWrap = document.createElement('div'); mWrap.id = 'homeV2More'; mWrap.style.cssText = 'display:flex;flex-direction:column;gap:10px';
      more.appendChild(mWrap); root.appendChild(more);
      const safety = document.createElement('div'); safety.className = 'h2-safety';
      safety.innerHTML = '<b>Clinical safety:</b> doses and algorithms are reference protocols. Confirm the current product label, renal/hepatic function, interactions and local protocols before treatment.';
      root.appendChild(safety);
      hv.prepend(root);
    }
    // Topics (rebuilt if the topic list changes)
    const tp = document.getElementById('homeV2Topics');
    const sig = Object.keys(DISEASES).join('|');
    if (tp.dataset.sig !== sig) {
      tp.dataset.sig = sig; tp.innerHTML = '';
      groups().forEach((g, i) => {
        const d = document.createElement('details'); d.className = 'h2-group'; if (i === 0) d.open = true;
        d.innerHTML = `<summary><span>${esc(g.title)}</span><small>${g.list.length} topics</small></summary>`;
        g.list.forEach(n => d.appendChild(topicRow(n))); tp.appendChild(d);
      });
    }
    // Move the older blocks into collapsible "More" groups instead of showing them all at once.
    const more = document.getElementById('homeV2More');
    const adopt = (id, title, note) => {
      const el = document.getElementById(id); if (!el || el.closest('#homeV2')) return;
      const d = document.createElement('details'); d.className = 'h2-group'; d.dataset.for = id;
      d.innerHTML = `<summary><span>${esc(title)}</span><small>${esc(note)}</small></summary>`;
      const box = document.createElement('div'); box.className = 'h2-extra'; box.appendChild(el); d.appendChild(box); more.appendChild(d);
    };
    adopt('v142ClinicalNav', 'Clinical Oracle by problem', 'pathways');
    adopt('v141QuickTools', 'OPD quick tools', 'checklists · registries · risk');
    // Hide the duplicate intro card and the old one-card-per-line grid (their actions now live above).
    [...hv.children].forEach(c => { if (c.id !== 'homeV2' && !c.closest('#homeV2')) c.classList.add('h2-hide'); });
  }
  /* ---- authorship, copyright and terms ---- */
  const YEAR = Math.max(2026, new Date().getFullYear());
  function footer() {
    if (document.getElementById('uroFooter')) return;
    const main = document.querySelector('main') || document.body;
    const f = document.createElement('footer'); f.id = 'uroFooter'; f.className = 'no-print';
    f.innerHTML = `<div class="uf-in"><div class="uf-brand">Urology Oracle</div><div>Created by <b>Dr Neel Swaminarayan</b></div>
<div>© ${YEAR} Dr Neel Swaminarayan. All rights reserved.</div><button type="button" id="uroAboutBtn">About, terms &amp; copyright</button></div>`;
    main.appendChild(f);
    f.querySelector('#uroAboutBtn').onclick = openAbout;
    if (!document.getElementById('uroFooterCss')) {
      const s = document.createElement('style'); s.id = 'uroFooterCss';
      s.textContent = `#uroFooter{margin:28px 0 90px;padding:16px 4px;border-top:1px solid #e2e8f0;text-align:center;font-size:12px;color:#64748b;line-height:1.7}#uroFooter .uf-brand{font-weight:900;color:#0f172a;font-size:13px}
#uroFooter button{margin-top:6px;background:none;border:0;color:#0369a1;font-weight:800;font-size:12px;text-decoration:underline;cursor:pointer}
html[data-oracle-theme="dark"] #uroFooter{border-color:#334155;color:#94a3b8}html[data-oracle-theme="dark"] #uroFooter .uf-brand{color:#e2e8f0}html[data-oracle-theme="dark"] #uroFooter button{color:#7dd3fc}
#aboutView .card p{margin:0 0 10px;font-size:13.5px;line-height:1.55}#aboutView h3{font-size:14px;margin:14px 0 6px}`;
      document.head.appendChild(s);
    }
  }
  function openAbout() {
    if (typeof window.uroSheetCss === 'function') window.uroSheetCss();
    let v = document.getElementById('aboutView');
    if (!v) { v = document.createElement('div'); v.id = 'aboutView'; v.className = 'uro-sheet'; document.body.appendChild(v); }
    v.innerHTML = `<div class="vw"><header><div><h2>About Urology Oracle</h2><div class="sub">Created by Dr Neel Swaminarayan</div></div><button class="ghost" id="aboutClose">Close</button></header><div class="card">
<p><b>Urology Oracle</b> (Urology OPD Navigator) was conceived, designed and written by <b>Dr Neel Swaminarayan</b>. It brings together clinical pathways, calculators, a drug formulary, original diagrams, viva and MCQ practice and a weekly research digest for urologists and urology residents.</p>
<h3>Copyright</h3>
<p>© ${YEAR} Dr Neel Swaminarayan. All rights reserved. The application, its source code, clinical text, original diagrams, question banks, calculators and design are protected by copyright. No part may be copied, reproduced, republished, scraped, redistributed, sold or used to create derivative works without prior written permission.</p>
<h3>Permitted use</h3>
<p>Clinicians and trainees may use the hosted app for personal education and clinical reference. Linking to the app is welcome.</p>
<h3>Clinical disclaimer</h3>
<p>An educational and reference tool for qualified clinicians. It does not replace clinical judgement, the current product label, local protocols or specialist advice. Verify doses, renal and hepatic adjustments and interactions before prescribing. AI features can be wrong and must be checked.</p>
<h3>Privacy</h3>
<p>Do not enter patient-identifiable information. AI requests are sent to third-party AI providers without identifiers; offline features keep data on your device.</p>
<h3>Third-party material</h3>
<p>Guideline names, trial names, journals and linked articles belong to their respective owners and are cited for education. Summaries are original wording.</p>
<h3>Contact</h3>
<p>For permissions, collaboration or corrections, contact Dr Neel Swaminarayan.</p></div></div>`;
    v.querySelector('#aboutClose').onclick = () => v.remove();
  }
  window.openAbout = openAbout;

  function run() { try { build(); footer(); } catch (e) { console.warn('home v2', e); } }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true }); else run();
  [800, 1700, 3500, 6000].forEach(t => setTimeout(run, t));
  const sh = window.showHome; if (typeof sh === 'function' && !sh.__h2) { const w = function () { const r = sh.apply(this, arguments); setTimeout(run, 0); return r; }; w.__h2 = true; window.showHome = w; }
})();
