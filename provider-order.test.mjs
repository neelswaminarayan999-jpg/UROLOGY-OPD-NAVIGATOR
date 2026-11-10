import assert from 'node:assert/strict';
import http from 'node:http';

// All providers configured; AI_TIMEOUT_MS kept small so the hang case finishes quickly.
process.env.PORT = '8811';
process.env.GEMINI_API_KEY = 'test-gemini';
process.env.GROQ_API_KEY = 'test-groq';
process.env.OPENROUTER_API_KEY = 'test-openrouter';
process.env.AI_TIMEOUT_MS = '5000';

const valid = {
  technical_adequacy: 'Adequate', observations: [], interpretation: 'Test', differential: [], urgent_flags: [],
  missing_data: [], uncertainty: [], suggested_disease: 'None', suggested_oracle_values: { disease: 'None', fields: [] },
  pathway_link: { requires_clinician_confirmation: true, suggested_module: 'None', note: 'Test' }, teaching: []
};
const ok = body => new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });
const compat = () => ok({ choices: [{ message: { content: JSON.stringify(valid) } }] });

let mode = 'gemini-ok';
const calls = [];
global.fetch = async (url, opts = {}) => {
  const u = String(url);
  const host = u.includes('googleapis') ? 'gemini' : u.includes('groq') ? 'groq' : 'openrouter';
  calls.push(host);
  if (host === 'gemini') {
    if (mode === 'gemini-ok') return ok({ candidates: [{ content: { parts: [{ text: JSON.stringify(valid) }] } }] });
    if (mode === 'gemini-429') return new Response(JSON.stringify({ error: { message: 'quota' } }), { status: 429 });
    if (mode === 'gemini-hang') return new Promise((_, reject) => opts.signal.addEventListener('abort', () => { const e = new Error('aborted'); e.name = 'AbortError'; reject(e); }));
  }
  return compat();
};

await import('./backend-server.mjs?order-test=1');
await new Promise(r => setTimeout(r, 80));
const post = () => new Promise((resolve, reject) => {
  const req = http.request('http://127.0.0.1:8811/api/urology-ai', { method: 'POST', headers: { 'content-type': 'application/json' } }, r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => resolve({ status: r.statusCode, json: JSON.parse(d) }));
  });
  req.on('error', reject); req.end(JSON.stringify({ study: 'test', context: {} }));
});

// 1. Gemini is tried first by default.
let res = await post();
assert.equal(res.status, 200);
assert.equal(res.json.provider, 'Gemini');
assert.equal(res.json.model, 'gemini-3.8-flash');
assert.deepEqual(calls, ['gemini']);

// 2. Gemini quota exhausted on both models -> Groq answers next (not OpenRouter).
mode = 'gemini-429'; calls.length = 0;
res = await post();
assert.equal(res.status, 200);
assert.equal(res.json.provider, 'Groq');
assert.deepEqual(calls, ['gemini', 'gemini', 'groq']);

// 3. A hung provider times out (408) and fallback continues instead of failing.
mode = 'gemini-hang'; calls.length = 0;
res = await post();
assert.equal(res.status, 200);
assert.equal(res.json.provider, 'Groq');
assert.equal(res.json.fallback_attempts[0].status, 408);

// 4. Health reports the order and which keys are present (never the keys themselves).
const health = await new Promise(resolve => http.get('http://127.0.0.1:8811/health', r => { let d = ''; r.on('data', c => d += c); r.on('end', () => resolve(JSON.parse(d))); }));
assert.deepEqual(health.providerOrder, ['gemini', 'groq', 'cerebras', 'openrouter']);
assert.equal(health.configured.Groq, true);
assert.ok(!JSON.stringify(health).includes('test-groq'));

console.log('provider order + timeout fallback: PASS');
process.exit(0);
