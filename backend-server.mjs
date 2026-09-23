import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(process.env.WEB_ROOT || path.join(__dirname, 'frontend'));

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
const FALLBACK_MODELS = String(process.env.GEMINI_FALLBACK_MODELS || 'gemini-3.7-flash,gemini-3.6-flash').split(',').map(s => s.trim()).filter(Boolean).filter(m => m !== MODEL);
const API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_BASE_URL = (process.env.GEMINI_API_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, '');
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
  const diseases = [
    'Ca Prostate','Ca Bladder','UTUC','Ca Penis','Ca Testis','Ca Kidney',
    'Urethral Cancer','Adrenal / Neuroendocrine','Urethral Stricture',
    'BPH / Male LUTS','Stone Disease','None'
  ];
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
      suggested_disease: { type: 'string', enum: diseases },
      suggested_oracle_values: {
        type: 'object',
        properties: {
          disease: { type: 'string' },
          fields: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                value: { type: 'string' }
              },
              required: ['id','value']
            }
          }
        },
        required: ['disease','fields']
      },
      pathway_link: {
        type: 'object',
        properties: {
          requires_clinician_confirmation: { type: 'boolean' },
          suggested_module: { type: 'string' },
          note: { type: 'string' }
        },
        required: ['requires_clinician_confirmation','suggested_module','note']
      }
    },
    required: [
      'technical_adequacy','observations','interpretation','differential',
      'urgent_flags','missing_data','uncertainty','teaching',
      'suggested_disease','suggested_oracle_values','pathway_link'
    ]
  };
}

const GEMINI_MAX_RETRIES = Math.max(0, Number(process.env.GEMINI_MAX_RETRIES || 3));
const GEMINI_RETRY_BASE_MS = Math.max(100, Number(process.env.GEMINI_RETRY_BASE_MS || 1000));
const GEMINI_RETRY_MAX_MS = Math.max(GEMINI_RETRY_BASE_MS, Number(process.env.GEMINI_RETRY_MAX_MS || 8000));
const GEMINI_FALLBACK_RETRIES = Math.max(0, Number(process.env.GEMINI_FALLBACK_RETRIES || 1));

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function isRetryableGeminiStatus(status) {
  return status === 408 || status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}
function retryDelayMs(attempt, retryAfterHeader) {
  const retryAfter = Number(retryAfterHeader);
  if (Number.isFinite(retryAfter) && retryAfter >= 0) {
    return Math.min(GEMINI_RETRY_MAX_MS, retryAfter * 1000);
  }
  const exponential = Math.min(GEMINI_RETRY_MAX_MS, GEMINI_RETRY_BASE_MS * (2 ** attempt));
  return Math.round(Math.random() * exponential);
}

function requestForModel(model, parts) {
  const generationConfig = {
    responseMimeType: 'application/json',
    responseSchema: outputSchema(),
    maxOutputTokens: 2400
  };
  if (model.startsWith('gemini-2.5-')) {
    generationConfig.thinkingConfig = { thinkingBudget: 1024 };
  } else {
    generationConfig.thinkingConfig = { thinkingLevel: 'low' };
  }
  return {
    contents: [{ role: 'user', parts }],
    generationConfig
  };
}

async function callGeminiModel(model, parts, maxRetries) {
  const request = requestForModel(model, parts);
  const url = `${GEMINI_API_BASE_URL}/models/${encodeURIComponent(model)}:generateContent`;
  let lastStatus = 0;
  let lastMessage = '';
  let lastRetryableStatus = false;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    let r;
    try {
      r = await fetch(url, {
        method: 'POST',
        headers: { 'x-goog-api-key': API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
    } catch (err) {
      if (attempt >= maxRetries) throw Object.assign(new Error(`Gemini API network error after ${attempt + 1} attempts: ${err?.message || String(err)}`), { retryable: true, status: 0, model });
      const delay = retryDelayMs(attempt, '');
      console.warn(`Gemini ${model} network error; retry ${attempt + 1}/${maxRetries} in ${delay}ms.`);
      await sleep(delay);
      continue;
    }

    const txt = await r.text();
    let data = {}; try { data = JSON.parse(txt); } catch {}
    if (r.ok) {
      return { output_text: extractGeminiText(data), model, provider: 'Gemini', fallback_used: model !== MODEL };
    }

    lastStatus = r.status;
    lastMessage = data?.error?.message || txt.slice(0, 1000) || `Gemini HTTP ${r.status}`;
    lastRetryableStatus = isRetryableGeminiStatus(r.status);
    if (!lastRetryableStatus || attempt >= maxRetries) break;

    const delay = retryDelayMs(attempt, r.headers.get('retry-after'));
    console.warn(`Gemini ${model} HTTP ${r.status}; retry ${attempt + 1}/${maxRetries} in ${delay}ms.`);
    await sleep(delay);
  }

  const err = new Error(`Gemini API HTTP ${lastStatus} after ${maxRetries + 1} attempts: ${lastMessage}`);
  err.status = lastStatus;
  err.retryable = lastRetryableStatus;
  err.model = model;
  throw err;
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

  const errors = [];
  const modelsToTry = [MODEL, ...FALLBACK_MODELS];
  for (let i = 0; i < modelsToTry.length; i += 1) {
    const model = modelsToTry[i];
    try {
      const result = await callGeminiModel(model, parts, i === 0 ? GEMINI_MAX_RETRIES : GEMINI_FALLBACK_RETRIES);
      return { ...result, requested_model: MODEL };
    } catch (err) {
      errors.push({ model, status: err?.status || 0, message: err?.message || String(err) });
      // Automatic fallback is used only after a transient 502/503/504 from the current model.
      // Authentication, permission, invalid-request and quota errors are not masked by model switching.
      const canFallback = err?.retryable && [502, 503, 504].includes(err?.status) && i < modelsToTry.length - 1;
      if (!canFallback) break;
      console.warn(`Gemini ${model} unavailable (${err.status}); trying fallback model ${modelsToTry[i + 1]}.`);
    }
  }

  const summary = errors.map(e => `${e.model}: HTTP ${e.status || 'network'} — ${e.message}`).join(' | ');
  throw new Error(`Gemini analysis unavailable. ${summary}`);
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
      return json(res, 200, { ok: true, service: 'urology-oracle-online-ai', version: '13.5.0', model: MODEL, fallbackModels: FALLBACK_MODELS, provider: 'Gemini', configured: Boolean(API_KEY), offlineCore: true, offlineAI: false }, origin);
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
      const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json; charset=utf-8' };
      res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      return fs.createReadStream(file).pipe(res);
    }
    return json(res, 405, { error: 'Method not allowed' }, origin);
  } catch (e) {
    return json(res, 500, { error: e?.message || String(e) }, origin);
  }
});

server.listen(PORT, HOST, () => console.log(`Urology Oracle backend listening on ${HOST}:${PORT}`));
