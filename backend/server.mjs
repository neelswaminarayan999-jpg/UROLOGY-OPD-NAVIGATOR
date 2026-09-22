import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(process.env.WEB_ROOT || path.join(__dirname, '../frontend'));

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m || process.env[m[1]] !== undefined) continue;
    process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}
loadEnv(path.join(__dirname, '.env'));

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || '0.0.0.0';
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const API_KEY = process.env.GEMINI_API_KEY || '';
const MAX_BODY = 32 * 1024 * 1024;
const RATE_LIMIT = Number(process.env.RATE_LIMIT_PER_10MIN || 30);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
const buckets = new Map();

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGIN === '*' || origin === ALLOWED_ORIGIN;
  return allowed ? {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN === '*' ? '*' : origin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
    'Vary': 'Origin'
  } : {};
}
function json(res, status, body, origin='') {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...corsHeaders(origin)
  });
  res.end(payload);
}
function clientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || req.socket.remoteAddress || 'unknown';
}
function allowedOrigin(req) {
  const origin = String(req.headers.origin || '');
  return !origin || ALLOWED_ORIGIN === '*' || origin === ALLOWED_ORIGIN;
}
function rateAllowed(req) {
  const now = Date.now();
  const key = clientIp(req);
  const tenMin = 10 * 60 * 1000;
  const recent = (buckets.get(key) || []).filter(t => now - t < tenMin);
  if (recent.length >= RATE_LIMIT) { buckets.set(key, recent); return false; }
  recent.push(now); buckets.set(key, recent);
  if (buckets.size > 5000) {
    for (const [k, vals] of buckets) if (!vals.some(t => now - t < tenMin)) buckets.delete(k);
  }
  return true;
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let total = 0, chunks = [];
    req.on('data', c => {
      total += c.length;
      if (total > MAX_BODY) { req.destroy(); reject(new Error('Request too large')); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}
function extractGeminiText(data) {
  const parts = [];
  for (const c of (data?.candidates || [])) {
    for (const p of (c?.content?.parts || [])) {
      if (typeof p?.text === 'string') parts.push(p.text);
    }
  }
  return parts.join('\n').trim();
}
function stripDataUrl(dataUrl) {
  const m = String(dataUrl || '').match(/^data:([^;]+);base64,(.+)$/s);
  return m ? { mimeType: m[1], data: m[2] } : null;
}
function makePrompt(body) {
  const study = String(body.study || 'investigation');
  const ctx = body.context || {};
  const canonical = ['Ca Prostate','Ca Bladder','UTUC','Ca Penis','Ca Testis','Ca Kidney','Urethral Cancer','Adrenal / Neuroendocrine','Urethral Stricture','BPH / Male LUTS','Stone Disease'];
  return `You are the online investigation assistant inside a urology clinical decision-support tool. Study: ${study}.\n\nPatient/context data:\n${JSON.stringify(ctx)}\n\nTask: interpret only the supplied images, report and structured data. Do not invent measurements. State technical limitations and distinguish what is visible/readable from what cannot be established. Give a concise, clinically useful provisional interpretation, key alternatives, urgent findings, missing information, uncertainty, and teaching points. Where an existing Oracle module is reasonably suggested, choose exactly one of: ${canonical.join(', ')}. Only provide suggested Oracle field values when directly supported. Return valid JSON matching the requested schema. This is advisory clinical decision support; do not issue an autonomous diagnosis or treatment order.`;
}
function outputSchema() {
  return {
    type: 'object',
    properties: {
      technical_adequacy: { type: 'string' },
      observations: { type: 'array', items: { type: 'string' } },
      interpretation: { type: 'string' },
      differential: { type: 'array', items: { type: 'string' } },
      urgent_flags: { type: 'array', items: { type: 'string' } },
      missing_data: { type: 'array', items: { type: 'string' } },
      uncertainty: { type: 'array', items: { type: 'string' } },
      teaching: { type: 'array', items: { type: 'string' } },
      suggested_disease: { type: 'string', enum: ['Ca Prostate','Ca Bladder','UTUC','Ca Penis','Ca Testis','Ca Kidney','Urethral Cancer','Adrenal / Neuroendocrine','Urethral Stricture','BPH / Male LUTS','Stone Disease',''] },
      suggested_oracle_values: { type: 'object', properties: { disease: {type:'string'}, fields: {type:'object'} } }
    },
    required: ['technical_adequacy','observations','interpretation','differential','urgent_flags','missing_data','uncertainty','teaching','suggested_disease','suggested_oracle_values']
  };
}
async function callGemini(body) {
  if (!API_KEY) throw new Error('Server is not configured with GEMINI_API_KEY.');
  const parts = [{ text: makePrompt(body) }];
  if (typeof body.context?.report === 'string' && body.context.report) {
    parts.push({ text: 'Written report:\n' + body.context.report });
  }
  for (const img of (body.images || [])) {
    const x = stripDataUrl(img);
    if (x && /^image\//i.test(x.mimeType)) parts.push({ inline_data: { mime_type: x.mimeType, data: x.data } });
  }
  const request = {
    contents: [{ role: 'user', parts }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: outputSchema(),
      temperature: 0.1,
      maxOutputTokens: 3500
    }
  };
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'x-goog-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  const txt = await r.text();
  let data = {}; try { data = JSON.parse(txt); } catch {}
  if (!r.ok) throw new Error(data?.error?.message || txt.slice(0, 800) || `Gemini HTTP ${r.status}`);
  return { output_text: extractGeminiText(data), model: MODEL, provider: 'Gemini' };
}

const server = http.createServer(async (req, res) => {
  const origin = String(req.headers.origin || '');
  try {
    if (!allowedOrigin(req)) return json(res, 403, { error: 'Origin is not allowed.' }, origin);
    if (req.method === 'OPTIONS') {
      res.writeHead(204, corsHeaders(origin));
      return res.end();
    }
    if (req.method === 'GET' && req.url === '/health') {
      return json(res, 200, { ok: true, service: 'urology-oracle-online-ai', model: MODEL, provider: 'Gemini', configured: Boolean(API_KEY) }, origin);
    }
    if (req.method === 'POST' && req.url === '/api/urology-ai') {
      if (!rateAllowed(req)) return json(res, 429, { error: 'Rate limit reached. Please try again later.' }, origin);
      const raw = await readBody(req);
      let body = {}; try { body = JSON.parse(raw); } catch { return json(res, 400, { error: 'Invalid JSON payload.' }, origin); }
      return json(res, 200, await callGemini(body), origin);
    }
    if (req.method === 'GET') {
      let urlPath = (req.url || '/').split('?')[0];
      if (urlPath === '/') urlPath = '/index.html';
      if (!urlPath.startsWith('/') || urlPath.includes('..')) return json(res, 400, { error: 'Invalid path' }, origin);
      const file = path.resolve(WEB_ROOT, `.${urlPath}`);
      if (!file.startsWith(WEB_ROOT) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return json(res, 404, { error: 'Not found' }, origin);
      const ext = path.extname(file).toLowerCase();
      const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8' };
      res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      return fs.createReadStream(file).pipe(res);
    }
    return json(res, 405, { error: 'Method not allowed' }, origin);
  } catch (e) {
    return json(res, 500, { error: e?.message || String(e) }, origin);
  }
});

server.listen(PORT, HOST, () => console.log(`Urology Oracle backend listening on ${HOST}:${PORT}`));
