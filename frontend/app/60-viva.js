/* V16.7 Viva mode: a strict senior consultant examines you on a synthetic ward-round case.
   Cases and marking are grounded in this app's verified guideline sections (data/clinical.js).
   Uses the same free AI providers as the AI Lab, through /api/viva. No patient data is involved. */
(function(){
  const TOTAL = 5;
  const BENIGN = ['Stone Disease', 'BPH / Male LUTS', 'Urethral Stricture', 'Paediatric urology', 'Urological trauma', 'Male infertility & andrology', 'UTI & urosepsis', 'Female & functional urology'];
  const LEVELS = [['intern', 'Intern'], ['resident', 'Resident'], ['exam', 'Exit exam']];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const st = { topic: '', level: 'resident', vignette: '', title: '', question: '', no: 1, history: [], busy: false };

  function reference(d) {
    if (typeof DISEASES === 'undefined' || !DISEASES[d]) return '';
    let text = '';
    for (const sec of DISEASES[d].sections.filter(x => !/trial|follow-up|survivorship/i.test(x.title))) {
      const chunk = '## ' + sec.title + '\n' + (sec.items || []).map(([h, t]) => '- ' + h + ': ' + t).join('\n') + '\n';
      if (text.length + chunk.length > 11000) break; text += chunk;
    }
    return text;
  }

  function css() {
    if (document.getElementById('vivaCss')) return;
    const s = document.createElement('style'); s.id = 'vivaCss';
    s.textContent = `.uro-sheet{position:fixed;inset:0;z-index:2147483000;background:#f8fafc;color:#0f172a;overflow:auto;font:15px/1.5 system-ui,sans-serif}
.uro-sheet .vw{max-width:760px;margin:0 auto;padding:14px 14px 90px}
.uro-sheet header{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px}
.uro-sheet h2{font-size:20px;font-weight:900;margin:0}.uro-sheet .sub{color:#475569;font-size:13px}
.uro-sheet .card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:14px;margin:10px 0;box-shadow:0 1px 2px rgba(0,0,0,.04)}
.uro-sheet .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.uro-sheet .chip{border:1px solid #cbd5e1;background:#fff;color:#0f172a;border-radius:999px;padding:8px 12px;font-weight:700;font-size:13px}
.uro-sheet .chip.on{background:#0f172a;color:#fff;border-color:#0f172a}
.uro-sheet .chip small{font-weight:500;opacity:.75}
body.viva-open .v158-fab,body.viva-open [class*="floating"]{visibility:hidden}
.uro-sheet .go{background:#0f172a;color:#fff;border:0;border-radius:12px;padding:12px 16px;font-weight:900;width:100%;margin-top:12px;font-size:15px}
.uro-sheet .go:disabled{opacity:.5}
.uro-sheet .ghost{background:transparent;border:1px solid #cbd5e1;border-radius:10px;padding:8px 12px;font-weight:700;color:#0f172a}
.uro-sheet textarea{width:100%;min-height:110px;border:1px solid #cbd5e1;border-radius:12px;padding:10px;font:inherit;background:#fff;color:#0f172a}
.uro-sheet .bed{display:inline-block;background:#fde047;color:#0f172a;font-weight:900;border-radius:8px;padding:2px 8px;font-size:12px}
.uro-sheet .q{font-weight:800;font-size:16px}
.uro-sheet .mark{font-weight:900;border-radius:8px;padding:2px 8px;font-size:13px;color:#fff}
.uro-sheet .m-Correct{background:#15803d}.uro-sheet .m-Partly{background:#b45309}.uro-sheet .m-Incorrect{background:#b91c1c}.uro-sheet .m-Unsafe{background:#7f1d1d}
.uro-sheet .model{background:#f1f5f9;border-radius:10px;padding:10px;margin-top:8px;white-space:pre-wrap;font-size:14px}
.uro-sheet .src{color:#64748b;font-size:12px;margin-top:6px}
.uro-sheet .warn{background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;border-radius:10px;padding:8px 10px;font-size:13px}
.uro-sheet .err{background:#fef2f2;border:1px solid #fecaca;color:#991b1b;border-radius:10px;padding:10px;font-size:14px}
html[data-oracle-theme="dark"] .uro-sheet{background:#020617;color:#e2e8f0}
html[data-oracle-theme="dark"] .uro-sheet .card,html[data-oracle-theme="dark"] .uro-sheet textarea,html[data-oracle-theme="dark"] .uro-sheet .chip{background:#0f172a;border-color:#334155;color:#e2e8f0}
html[data-oracle-theme="dark"] .uro-sheet .chip.on,html[data-oracle-theme="dark"] .uro-sheet .go{background:#38bdf8;color:#0f172a;border-color:#38bdf8}
html[data-oracle-theme="dark"] .uro-sheet .ghost{color:#e2e8f0;border-color:#475569}
html[data-oracle-theme="dark"] .uro-sheet .sub,html[data-oracle-theme="dark"] .uro-sheet .src{color:#94a3b8}
html[data-oracle-theme="dark"] .uro-sheet .model{background:#1e293b}`;
    document.head.appendChild(s);
  }

  function shell(inner) {
    css();
    let v = document.getElementById('vivaView');
    if (!v) { v = document.createElement('div'); v.id = 'vivaView'; v.className = 'uro-sheet'; document.body.appendChild(v); }
    v.innerHTML = `<div class="vw"><header><div><h2>Viva mode</h2><div class="sub">Ward-round viva with a strict senior · synthetic cases</div></div><button class="ghost" id="vivaClose">Close</button></header>${inner}</div>`;
    v.querySelector('#vivaClose').onclick = () => v.remove();
    v.scrollTop = 0; return v;
  }

  function setup(topic) {
    if (topic) st.topic = topic;
    const onc = Object.keys(typeof DISEASES !== 'undefined' ? DISEASES : {});
    const chip = (t, grounded) => `<button class="chip${st.topic === t ? ' on' : ''}" data-topic="${esc(t)}">${esc(t)}${grounded ? '' : ' <small>&nbsp;· general</small>'}</button>`;
    const v = shell(`<div class="card"><b>1. Topic</b><div class="sub">Oncology topics are marked against this app's EAU 2026-checked sections. Topics marked "general" use general guideline knowledge.</div>
      <div class="chips">${onc.map(t => chip(t, true)).join('')}${BENIGN.map(t => chip(t, false)).join('')}</div></div>
      <div class="card"><b>2. Level</b><div class="chips">${LEVELS.map(([k, l]) => `<button class="chip${st.level === k ? ' on' : ''}" data-level="${k}">${l}</button>`).join('')}</div></div>
      <div class="warn">${TOTAL} questions on one case. Each question uses one free AI request, so a full viva uses about ${TOTAL + 1}. AI marking can be wrong — check the model answer against the guideline section shown.</div>
      <button class="go" id="vivaStart"${st.topic ? '' : ' disabled'}>Start viva</button>`);
    v.querySelectorAll('[data-topic]').forEach(b => b.onclick = () => { st.topic = b.dataset.topic; setup(); });
    v.querySelectorAll('[data-level]').forEach(b => b.onclick = () => { st.level = b.dataset.level; setup(); });
    v.querySelector('#vivaStart').onclick = start;
  }

  async function call(payload) {
    if (!navigator.onLine) throw new Error('You are offline. Viva mode needs internet; the rest of the app works offline.');
    const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 150000);
    try {
      const r = await fetch('/api/viva', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload), signal: ctl.signal });
      let j = {}; try { j = await r.json(); } catch { throw new Error(r.status === 404 ? 'Viva mode is not on the server yet.' : 'The server is waking up. Wait 30 seconds and try again.'); }
      if (!r.ok) throw new Error(r.status === 429 ? 'The free AI quota is used up for now. Try again later or tomorrow.' : (j.error || `Server error ${r.status}`).slice(0, 300));
      if (!j.viva || (!j.viva.vignette && !j.viva.feedback)) throw new Error('The AI returned an empty reply. Try again.');
      return j;
    } catch (e) { if (e.name === 'AbortError') throw new Error('The AI took too long to answer. Try again.'); throw e; }
    finally { clearTimeout(timer); }
  }

  function base() { return { topic: st.topic, level: st.level, reference: reference(st.topic), total: TOTAL }; }

  async function start() {
    st.history = []; st.no = 1; st.vignette = ''; st.question = '';
    shell(`<div class="card">Preparing a case on <b>${esc(st.topic)}</b>…</div>`);
    try {
      const { viva } = await call({ ...base(), step: 'start' });
      st.vignette = viva.vignette; st.title = viva.case_title || st.topic; st.question = viva.next_question || 'What is your assessment?';
      ask();
    } catch (e) { failed(e, start); }
  }

  function caseCard() {
    const bed = (st.vignette.match(/\bBed\s*\d+/i) || [''])[0];
    return `<div class="card">${bed ? `<span class="bed">${esc(bed.toUpperCase())}</span> ` : ''}<b>${esc(st.title)}</b><div style="margin-top:6px;white-space:pre-wrap">${esc(st.vignette)}</div></div>`;
  }

  function historyCards() {
    return st.history.map((h, i) => `<div class="card"><div class="sub">Q${i + 1}</div><div class="q">${esc(h.q)}</div>
      <div style="margin-top:6px"><b>You:</b> ${esc(h.a || '(no answer)')}</div>
      <div style="margin-top:8px"><span class="mark m-${esc((h.verdict || 'Incorrect').split(' ')[0])}">${esc(h.verdict || '—')} · ${h.score}/10</span></div>
      <div style="margin-top:6px">${esc(h.feedback)}</div>
      ${h.model ? `<div class="model"><b>Expected answer</b>\n${esc(h.model)}</div>` : ''}
      ${h.src ? `<div class="src">Source: ${esc(h.src)}</div>` : ''}</div>`).join('');
  }

  function ask() {
    const v = shell(`${caseCard()}${historyCards()}<div class="card"><div class="sub">Question ${st.no} of ${TOTAL}</div><div class="q">${esc(st.question)}</div>
      <textarea id="vivaAns" placeholder="Answer as you would to your senior. Be specific: what exactly would you do?"></textarea>
      <button class="go" id="vivaSend">Submit answer</button><button class="ghost" id="vivaSkip" style="margin-top:8px;width:100%">I don't know — show me</button></div>`);
    const send = async (answer) => {
      if (st.busy) return; st.busy = true;
      v.querySelector('#vivaSend').disabled = true; v.querySelector('#vivaSkip').disabled = true; v.querySelector('#vivaSend').textContent = 'Your senior is thinking…';
      try {
        const { viva } = await call({ ...base(), step: 'answer', vignette: st.vignette, question: st.question, answer, question_no: st.no, history: st.history.map(h => ({ q: h.q, a: h.a, score: h.score })) });
        st.history.push({ q: st.question, a: answer, verdict: viva.verdict, score: viva.score, feedback: viva.feedback, model: viva.model_answer, src: viva.guideline_section });
        if (st.no >= TOTAL || !viva.next_question) return finish();
        st.no++; st.question = viva.next_question; ask();
        setTimeout(() => { const c = document.querySelectorAll('#vivaView .card'); c[c.length - 2]?.scrollIntoView({ block: 'start' }); }, 50);
      } catch (e) { failed(e, () => ask()); }
      finally { st.busy = false; }
    };
    v.querySelector('#vivaSend').onclick = () => send(v.querySelector('#vivaAns').value.trim());
    v.querySelector('#vivaSkip').onclick = () => send('');
    v.querySelector('#vivaAns').focus({ preventScroll: true });
  }

  function finish() {
    const total = st.history.reduce((a, h) => a + (h.score || 0), 0), max = st.history.length * 10;
    const pct = Math.round(100 * total / Math.max(max, 1));
    const band = pct >= 80 ? 'Pass with credit — your senior would trust you on this.' : pct >= 60 ? 'Pass — revise the points marked below.' : pct >= 40 ? 'Borderline — go through the expected answers again.' : 'Not yet — read the guideline section and try another case.';
    const weak = st.history.filter(h => h.score < 6).map((h, i) => h.src).filter(Boolean);
    const v = shell(`<div class="card" style="text-align:center"><div class="sub">${esc(st.topic)} · ${esc((LEVELS.find(l => l[0] === st.level) || [])[1] || '')}</div>
      <div style="font-size:34px;font-weight:900;margin:6px 0">${total}/${max}</div><div><b>${esc(band)}</b></div>
      ${weak.length ? `<div class="src" style="margin-top:8px">Revise: ${esc([...new Set(weak)].join(' · '))}</div>` : ''}</div>
      ${caseCard()}${historyCards()}
      <button class="go" id="vivaAgain">Another case on ${esc(st.topic)}</button><button class="ghost" id="vivaNew" style="margin-top:8px;width:100%">Change topic or level</button>`);
    v.querySelector('#vivaAgain').onclick = start;
    v.querySelector('#vivaNew').onclick = () => setup();
    try { const log = JSON.parse(localStorage.getItem('uroVivaLog') || '[]'); log.push({ d: new Date().toISOString().slice(0, 10), t: st.topic, l: st.level, s: total, m: max }); localStorage.setItem('uroVivaLog', JSON.stringify(log.slice(-100))); } catch {}
  }

  function failed(e, retry) {
    const v = shell(`${st.vignette ? caseCard() + historyCards() : ''}<div class="err">${esc(e.message || e)}</div><button class="go" id="vivaRetry">Try again</button><button class="ghost" id="vivaBack" style="margin-top:8px;width:100%">Back to topics</button>`);
    v.querySelector('#vivaRetry').onclick = retry; v.querySelector('#vivaBack').onclick = () => setup();
  }

  window.uroSheetCss = css;
  window.openViva = function (topic) { setup(typeof topic === 'string' ? topic : ''); };

  // Home tile, next to the other quick tools.
  function tile() {
    const grid = document.getElementById('v141QuickGrid');
    if (!grid || grid.querySelector('[data-core-tool="viva"]')) return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'v141-tool'; b.dataset.coreTool = 'viva';
    b.innerHTML = '<b>Viva mode</b><span>Ward-round viva with a strict senior · AI-marked</span>';
    b.onclick = () => window.openViva(); grid.prepend(b);
  }
  // A "Viva on this topic" button at the top of each oncology disease page.
  // Remember which disease page is open (openDisease is wrapped once, after the other layers have loaded).
  let lastDisease = '';
  function hookOpenDisease() {
    const f = window.openDisease;
    if (typeof f !== 'function' || f.__viva) return;
    const w = function (name) { lastDisease = name; const r = f.apply(this, arguments); setTimeout(diseaseButton, 0); return r; };
    w.__viva = true; window.openDisease = w;
  }
  function diseaseButton() {
    const host = document.getElementById('diseaseHeader');
    if (!host || host.querySelector('#vivaTopicBtn')) return;
    const name = lastDisease;
    if (!name || typeof DISEASES === 'undefined' || !DISEASES[name]) return;
    const b = document.createElement('button'); b.id = 'vivaTopicBtn'; b.type = 'button'; b.className = 'v141-tool';
    b.style.cssText = 'display:block;width:100%;text-align:left;margin:0 0 12px';
    b.innerHTML = '<b>Viva me on this topic</b><span>5 questions from a strict senior, marked against this page</span>';
    b.onclick = () => window.openViva(name); host.appendChild(b);
  }
  function apply() { hookOpenDisease(); tile(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once: true }); else apply();
  setTimeout(apply, 1200); setTimeout(apply, 3000);
})();
