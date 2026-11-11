/* V16.8 Offline MCQ practice.
   - Starter bank: data/mcq-bank.js (written from the app's guideline sections), saved offline with the app.
   - Self-growing: when online, the phone asks /api/mcq for 5 new questions on the topic with the fewest,
     at most twice a day. They are grounded in the same guideline text, checked by the server
     (one correct answer, a real cited section), stored only on this phone, and labelled AI-generated. */
(function () {
  const SESSION = 10, MAX_EXTRA = 400, TOPUP_GAP_H = 10, TOPUPS_PER_DAY = 2;
  const K_EXTRA = 'uroMcqExtra', K_STATS = 'uroMcqStats', K_BLOCK = 'uroMcqBlocked', K_TOP = 'uroMcqTopup';
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 90);
  const topics = () => Object.keys(typeof DISEASES !== 'undefined' ? DISEASES : {});

  // Shared weekly bank (data/mcq-shared.json): same for every phone, saved offline by the app.
  let sharedBank = { questions: [] };
  const loadShared = () => fetch('/data/mcq-shared.json').then(r => r.ok ? r.json() : null).then(j => { if (j && Array.isArray(j.questions)) sharedBank = j; }).catch(() => {});
  loadShared();
  function all() {
    const blocked = new Set(load(K_BLOCK, []));
    const base = (typeof MCQ_BANK !== 'undefined' ? MCQ_BANK : []).map(q => ({ ...q, src: 'reviewed' }));
    const shared = (sharedBank.questions || []).map(q => ({ ...q, explain: q.explain || q.explanation, src: 'shared' }));
    return base.concat(shared, load(K_EXTRA, []).map(q => ({ ...q, src: 'ai' }))).filter(q => !blocked.has(q.id));
  }
  function reference(d) {
    if (typeof DISEASES === 'undefined' || !DISEASES[d]) return '';
    let text = '';
    for (const sec of DISEASES[d].sections.filter(x => !/trial|follow-up|survivorship/i.test(x.title))) {
      const chunk = '## ' + sec.title + '\n' + (sec.items || []).map(([h, t]) => '- ' + h + ': ' + t).join('\n') + '\n';
      if (text.length + chunk.length > 11000) break; text += chunk;
    }
    return text;
  }

  // ---------- background top-up ----------
  let topping = false;
  async function topUp(force, topicWanted) {
    if (topping || !navigator.onLine || (navigator.connection && navigator.connection.saveData && !force)) return { added: 0 };
    const log = load(K_TOP, { last: 0, day: '', n: 0 });
    const today = new Date().toISOString().slice(0, 10);
    if (!force && (log.day === today && log.n >= TOPUPS_PER_DAY || Date.now() - log.last < TOPUP_GAP_H * 3600e3)) return { added: 0 };
    const extra = load(K_EXTRA, []);
    if (extra.length >= MAX_EXTRA && !force) return { added: 0 };
    const pool = all();
    const topic = topicWanted || topics().map(t => [t, pool.filter(q => q.topic === t).length]).sort((a, b) => a[1] - b[1])[0]?.[0];
    if (!topic) return { added: 0 };
    topping = true;
    try {
      const r = await fetch('/api/mcq', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ topic, reference: reference(topic), count: 5, avoid: pool.filter(q => q.topic === topic).map(q => q.stem) }) });
      let j = {}; try { j = await r.json(); } catch { throw new Error('The server is waking up. Try again in a minute.'); }
      if (!r.ok) throw new Error(r.status === 429 ? 'The free AI quota is used up for now.' : (j.error || 'Server error ' + r.status));
      const seen = new Set(pool.map(q => norm(q.stem)).concat(load(K_BLOCK + 'Stems', [])));
      const fresh = (j.questions || []).filter(q => !seen.has(norm(q.stem))).map(q => ({ ...q, explain: q.explanation, id: 'ai-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), topic, added: today, model: j.model || '' }));
      save(K_EXTRA, extra.concat(fresh).slice(-MAX_EXTRA));
      save(K_TOP, { last: Date.now(), day: today, n: (log.day === today ? log.n : 0) + 1 });
      return { added: fresh.length, topic };
    } finally { topping = false; }
  }
  // V16.9: no automatic per-phone top-up any more: everyone shares the weekly bank. The manual button stays.

  // ---------- practice ----------
  const st = { topic: '', qs: [], i: 0, score: 0, answered: false };
  function shell(inner) {
    if (typeof window.uroSheetCss === 'function') window.uroSheetCss(); // shared sheet styles from Viva mode
    let v = document.getElementById('mcqView');
    if (!v) { v = document.createElement('div'); v.id = 'mcqView'; v.className = 'uro-sheet'; document.body.appendChild(v); }
    v.innerHTML = `<div class="vw"><header><div><h2>MCQ practice</h2><div class="sub">Works offline · new questions added automatically when online</div></div><button class="ghost" id="mcqClose">Close</button></header>${inner}</div>`;
    v.querySelector('#mcqClose').onclick = () => v.remove();
    v.scrollTop = 0; return v;
  }
  function home(msg) {
    const pool = all(), stats = load(K_STATS, {});
    const count = t => pool.filter(q => !t || q.topic === t).length;
    const done = t => pool.filter(q => (!t || q.topic === t) && stats[q.id]).length;
    const chip = (t, label) => `<button class="chip${st.topic === t ? ' on' : ''}" data-t="${esc(t)}">${esc(label)} <small>&nbsp;${done(t)}/${count(t)}</small></button>`;
    const ai = pool.filter(q => q.src === 'ai').length, sh = pool.filter(q => q.src === 'shared').length;
    const v = shell(`${msg ? `<div class="warn">${esc(msg)}</div>` : ''}
      <div class="card"><b>Topic</b><div class="sub">Numbers show questions attempted / available.</div>
      <div class="chips">${chip('', 'All topics')}${topics().map(t => chip(t, t)).join('')}</div></div>
      <button class="go" id="mcqGo">Start ${SESSION} questions</button>
      <div class="card"><div class="sub">${pool.length - ai - sh} starter questions + ${sh} from the weekly shared bank${sharedBank.updated ? ' (updated ' + esc(sharedBank.updated) + ')' : ''}${ai ? ` + ${ai} added on this phone` : ''}. Unseen and previously missed questions come first.</div>
      <button class="ghost" id="mcqMore" style="margin-top:8px;width:100%">Add 5 extra questions${st.topic ? ' on ' + esc(st.topic) : ''} (this phone only)</button></div>`);
    v.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { st.topic = b.dataset.t; home(); });
    v.querySelector('#mcqGo').onclick = start;
    v.querySelector('#mcqMore').onclick = async () => {
      const b = v.querySelector('#mcqMore'); b.disabled = true; b.textContent = navigator.onLine ? 'Writing new questions…' : 'You are offline';
      if (!navigator.onLine) return;
      try { const r = await topUp(true, st.topic || ''); home(r.added ? `${r.added} new questions added on ${r.topic}.` : 'No new questions this time (duplicates or failed checks). Try again later.'); }
      catch (e) { home(e.message); }
    };
  }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function start() {
    const stats = load(K_STATS, {});
    const pool = all().filter(q => !st.topic || q.topic === st.topic);
    if (!pool.length) return home('No questions for this topic yet.');
    const weight = q => { const s = stats[q.id]; return !s ? 0 : s.correct < s.seen ? 1 : 2; };
    const ordered = shuffle(pool).sort((a, b) => weight(a) - weight(b)).slice(0, SESSION);
    st.qs = ordered.map(q => { const order = shuffle([0, 1, 2, 3]); return { ...q, opts: order.map(i => q.options[i]), correct: order.indexOf(q.answer) }; });
    st.i = 0; st.score = 0; show();
  }
  function show() {
    const q = st.qs[st.i]; st.answered = false;
    const v = shell(`<div class="card"><div class="sub">Question ${st.i + 1} of ${st.qs.length} · ${esc(q.topic)}${q.src === 'ai' ? ' · <b>AI-generated (this phone)</b>' : q.src === 'shared' ? ' · weekly bank' : ''}</div>
      <div class="q" style="margin-top:6px">${esc(q.stem)}</div>
      <div id="mcqOpts" style="margin-top:10px">${q.opts.map((o, i) => `<button class="chip" data-i="${i}" style="display:block;width:100%;text-align:left;border-radius:12px;margin:8px 0;padding:12px">${String.fromCharCode(65 + i)}. ${esc(o)}</button>`).join('')}</div>
      <div id="mcqFb"></div></div>`);
    v.querySelectorAll('[data-i]').forEach(b => b.onclick = () => answer(Number(b.dataset.i)));
  }
  function answer(i) {
    if (st.answered) return; st.answered = true;
    const q = st.qs[st.i], ok = i === q.correct; if (ok) st.score++;
    const stats = load(K_STATS, {}); const s = stats[q.id] || { seen: 0, correct: 0 }; s.seen++; if (ok) s.correct++; s.last = Date.now(); stats[q.id] = s; save(K_STATS, stats);
    const v = document.getElementById('mcqView');
    v.querySelectorAll('[data-i]').forEach(b => { const k = Number(b.dataset.i); b.disabled = true;
      if (k === q.correct) { b.style.background = '#15803d'; b.style.color = '#fff'; b.style.borderColor = '#15803d'; }
      else if (k === i) { b.style.background = '#b91c1c'; b.style.color = '#fff'; b.style.borderColor = '#b91c1c'; } });
    const last = st.i === st.qs.length - 1;
    v.querySelector('#mcqFb').innerHTML = `<div class="model"><b>${ok ? 'Correct.' : 'Not quite.'}</b> ${esc(q.explain || q.explanation || '')}</div>
      <div class="src">Source: ${esc(q.topic)} → ${esc(q.section)}${q.src === 'ai' ? ' · AI-generated question, check against the page' : q.src === 'shared' ? ' · weekly bank (AI-written, approved)' : ' · starter question'}</div>
      ${q.src !== 'reviewed' ? '<button class="ghost" id="mcqReport" style="margin-top:8px">Report error and hide</button>' : ''}
      <button class="ghost" id="mcqPage" style="margin-top:8px">Open this section</button>
      <button class="go" id="mcqNext">${last ? 'See score' : 'Next question'}</button>`;
    v.querySelector('#mcqNext').onclick = () => { if (last) finish(); else { st.i++; show(); } };
    v.querySelector('#mcqPage').onclick = () => { v.remove(); try { (window.trialJump || ((d) => window.openDisease(d)))(q.topic, q.section); } catch { window.openDisease && window.openDisease(q.topic); } };
    const rep = v.querySelector('#mcqReport');
    if (rep) rep.onclick = () => { save(K_BLOCK, load(K_BLOCK, []).concat(q.id)); save(K_BLOCK + 'Stems', load(K_BLOCK + 'Stems', []).concat(norm(q.stem)).slice(-500)); save(K_EXTRA, load(K_EXTRA, []).filter(x => x.id !== q.id)); rep.textContent = q.src === 'shared' ? 'Hidden on this phone (ID ' + q.id + ')' : 'Removed from your bank'; rep.disabled = true; };
  }
  function finish() {
    const n = st.qs.length, pct = Math.round(100 * st.score / n);
    const miss = st.qs.filter(q => { const s = load(K_STATS, {})[q.id]; return s && s.last && s.correct < s.seen; });
    const v = shell(`<div class="card" style="text-align:center"><div class="sub">${esc(st.topic || 'All topics')}</div>
      <div style="font-size:34px;font-weight:900;margin:6px 0">${st.score}/${n}</div><div><b>${pct >= 80 ? 'Excellent.' : pct >= 60 ? 'Good — revise the sections below.' : 'Revise the sections below and try again.'}</b></div>
      ${miss.length ? `<div class="src" style="margin-top:8px">Revise: ${esc([...new Set(miss.map(q => q.topic + ' → ' + q.section))].join(' · '))}</div>` : ''}</div>
      <button class="go" id="mcqAgain">Another ${SESSION}</button><button class="ghost" id="mcqHome" style="margin-top:8px;width:100%">Change topic</button>`);
    v.querySelector('#mcqAgain').onclick = start; v.querySelector('#mcqHome').onclick = () => home();
  }

  window.openMcq = function (topic) { st.topic = (typeof topic === 'string' && topics().includes(topic)) ? topic : ''; home(); loadShared().then(() => { if (document.getElementById('mcqHome') === null && document.getElementById('mcqGo')) home(); }); };
  window.uroMcqTopUp = topUp;

  function tile() {
    const grid = document.getElementById('v141QuickGrid');
    if (!grid || grid.querySelector('[data-core-tool="mcq"]')) return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'v141-tool'; b.dataset.coreTool = 'mcq';
    b.innerHTML = '<b>MCQ practice</b><span>Offline · grows automatically</span>';
    b.onclick = () => window.openMcq();
    const viva = grid.querySelector('[data-core-tool="viva"]'); viva ? viva.after(b) : grid.prepend(b);
  }
  let lastDisease = '';
  function hook() {
    const f = window.openDisease; if (typeof f !== 'function' || f.__mcq) return;
    const w = function (name) { lastDisease = name; const r = f.apply(this, arguments); setTimeout(btn, 0); return r; };
    w.__mcq = true; w.__viva = f.__viva; window.openDisease = w;
  }
  function btn() {
    const host = document.getElementById('diseaseHeader');
    if (!host || host.querySelector('#mcqTopicBtn') || !lastDisease || !topics().includes(lastDisease)) return;
    const b = document.createElement('button'); b.id = 'mcqTopicBtn'; b.type = 'button'; b.className = 'v141-tool';
    b.style.cssText = 'display:block;width:100%;text-align:left;margin:0 0 12px';
    b.innerHTML = '<b>MCQs on this topic</b><span>Works offline · answers explained with the section</span>';
    b.onclick = () => window.openMcq(lastDisease); host.appendChild(b);
  }
  function apply() { hook(); tile(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once: true }); else apply();
  setTimeout(apply, 1300); setTimeout(apply, 3100);
})();
