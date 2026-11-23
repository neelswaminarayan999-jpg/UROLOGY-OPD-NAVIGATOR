/* Urology Oracle © 2026 Dr Neel Swaminarayan. All rights reserved.
   V16.17 anonymous usage counts. Each device gets a random id (stored only on the device); the app sends the id and
   which feature was opened. No name, email, IP, patient data or typed text is sent. Used only to count visitors. */
(function () {
  let id = '';
  try { id = localStorage.getItem('uroUsageId') || ''; if (!id) { id = (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36)).toLowerCase(); localStorage.setItem('uroUsageId', id); } } catch { id = 'nostorage-' + Math.random().toString(36).slice(2, 10); }
  const sent = {};
  const src = (() => { try { return new URLSearchParams(location.search).get('src') || ''; } catch { return ''; } })();
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  function ping(ev, topic) {
    const key = ev + '|' + (topic || ''); const now = Date.now();
    if (sent[key] && now - sent[key] < 10 * 60e3) return; sent[key] = now;
    const body = JSON.stringify({ id, ev, topic: topic || undefined, src: ev === 'open' ? src : undefined, standalone: ev === 'open' && standalone ? 1 : undefined });
    try { if (navigator.sendBeacon && navigator.sendBeacon('/api/ping', new Blob([body], { type: 'application/json' }))) return; } catch {}
    try { fetch('/api/ping', { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true }).catch(() => {}); } catch {}
  }
  window.uroPing = ping;
  if (navigator.onLine !== false) ping('open');
  const HOOKS = { openViva: 'viva', openMcq: 'mcq', openOnlineAI: 'ai_lab', openNews: 'news', oracleOpenFormulary: 'formulary', openOracle: 'oracle', openCalculators: 'scores', openTrials: 'trials', openProcedureAtlas: 'atlas', openDrugs: 'regimens', openDisease: 'topic', oracleOpenFunctional: 'functional', oracleOpenFistula: 'fistula_tool' };
  function hook() {
    for (const [fn, ev] of Object.entries(HOOKS)) {
      const f = window[fn]; if (typeof f !== 'function' || f.__uroPing) continue;
      const w = function () { try { ping(ev, ev === 'topic' ? String(arguments[0] || '') : ''); } catch {} return f.apply(this, arguments); };
      w.__uroPing = true; Object.keys(f).forEach(k => { try { w[k] = f[k]; } catch {} }); window[fn] = w;
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hook, { once: true }); else hook();
  [1500, 4000, 7000].forEach(t => setTimeout(hook, t));
})();
