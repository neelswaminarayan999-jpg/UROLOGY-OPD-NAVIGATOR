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
const API_KEY = process.env.GEMINI_API_KEY || '';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
const GROQ_VISION_MODEL = process.env.GROQ_VISION_MODEL || 'qwen/qwen3.8-27b';
const GROQ_API_BASE_URL = (process.env.GROQ_API_BASE_URL || 'https://api.groq.com/openai/v1').replace(/\/$/, '');
const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY || '';
const CEREBRAS_MODEL = process.env.CEREBRAS_MODEL || 'gpt-oss-120b';
const CEREBRAS_API_BASE_URL = (process.env.CEREBRAS_API_BASE_URL || 'https://api.cerebras.ai/v1').replace(/\/$/, '');
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openrouter/free';
const OPENROUTER_API_BASE_URL = (process.env.OPENROUTER_API_BASE_URL || 'https://openrouter.ai/api/v1').replace(/\/$/, '');
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

function extractOpenAIText(data) {
  const c = data?.choices?.[0]?.message?.content;
  if (Array.isArray(c)) return c.map(x => typeof x === 'string' ? x : String(x?.text || '')).join('\n').trim();
  return c || data?.choices?.[0]?.text || data?.output_text || '';
}

const ORACLE_KEYS = [
  'technical_adequacy','observations','interpretation','differential','urgent_flags',
  'missing_data','uncertainty','suggested_disease','suggested_oracle_values','pathway_link','teaching'
];
function stripJsonFences(text) {
  return String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
}
function validateOracleOutput(text) {
  const cleaned = stripJsonFences(text);
  // Never accept provider safety-classification/refusal text as a successful Oracle answer.
  if (/^user\s+safety\s*:/i.test(cleaned) || /safety\s+categories\s*:/i.test(cleaned)) {
    const e = new Error('Provider returned a safety-classification response instead of Oracle JSON.'); e.code = 'INVALID_ORACLE_RESPONSE'; throw e;
  }
  let obj;
  try { obj = JSON.parse(cleaned); }
  catch { const e = new Error('Provider returned non-JSON content; expected Oracle JSON.'); e.code = 'INVALID_ORACLE_RESPONSE'; throw e; }
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) { const e = new Error('Provider returned an invalid Oracle JSON object.'); e.code='INVALID_ORACLE_RESPONSE'; throw e; }
  const keys = Object.keys(obj);
  const missing = ORACLE_KEYS.filter(k => !(k in obj));
  const extra = keys.filter(k => !ORACLE_KEYS.includes(k));
  if (missing.length || extra.length) {
    const e = new Error(`Invalid Oracle schema: missing=${missing.join(',') || 'none'}; extra=${extra.join(',') || 'none'}`);
    e.code = 'INVALID_ORACLE_RESPONSE'; throw e;
  }
  if (!Array.isArray(obj.observations) || !Array.isArray(obj.differential) || !Array.isArray(obj.urgent_flags) ||
      !Array.isArray(obj.missing_data) || !Array.isArray(obj.uncertainty) || !Array.isArray(obj.teaching)) {
    const e = new Error('Invalid Oracle schema: list fields must be arrays.'); e.code='INVALID_ORACLE_RESPONSE'; throw e;
  }
  if (!obj.pathway_link || obj.pathway_link.requires_clinician_confirmation !== true) {
    const e = new Error('Invalid Oracle schema: clinician-confirmation gate is missing or false.'); e.code='INVALID_ORACLE_RESPONSE'; throw e;
  }
  return { cleaned, obj };
}

function extractInputMessages(body) {
  if (Array.isArray(body?.messages) && body.messages.length) return body.messages;
  if (!Array.isArray(body?.input)) return null;
  return body.input.map(item => {
    const role = item?.role === 'system' ? 'system' : item?.role === 'assistant' ? 'assistant' : 'user';
    const content = Array.isArray(item?.content) ? item.content.map(part => {
      if (part?.type === 'input_text') return { type: 'text', text: String(part.text || '') };
      if (part?.type === 'input_image' && part?.image_url) return { type: 'image_url', image_url: { url: String(part.image_url) } };
      if (part?.type === 'text') return { type: 'text', text: String(part.text || '') };
      if (part?.type === 'image_url') return part;
      return null;
    }).filter(Boolean) : String(item?.content || '');
    return { role, content };
  });
}

function buildCompatMessages(body) {
  const inputMessages = extractInputMessages(body);
  if (inputMessages) return inputMessages;
  const content = [{ type: 'text', text: makePrompt(body) }];
  if (typeof body.context?.report === 'string' && body.context.report) content.push({ type: 'text', text: 'Written report:\n' + body.context.report });
  for (const img of (body.images || [])) {
    if (typeof img === 'string' && img.startsWith('data:image/')) content.push({ type: 'image_url', image_url: { url: img } });
  }
  return [{ role: 'user', content }];
}

async function fetchJsonWithTimeout(url, options, timeoutMs=12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally { clearTimeout(timer); }
}

async function callGemini(body) {
  if (!API_KEY) throw new Error('Gemini is not configured.');
  const parts = [{ text: makePrompt(body) }];
  if (Array.isArray(body?.input)) {
    const texts = [];
    for (const item of body.input) {
      if (typeof item?.content === 'string') texts.push(item.content);
      else if (Array.isArray(item?.content)) for (const part of item.content) if (part?.type === 'input_text') texts.push(String(part.text || ''));
    }
    if (texts.length) parts[0] = { text: texts.join('\n\n') };
  }
  if (typeof body.context?.report === 'string' && body.context.report) parts.push({ text: 'Written report:\n' + body.context.report });
  for (const img of (body.images || [])) {
    const x = stripDataUrl(img);
    if (x && /^image\//i.test(x.mimeType)) parts.push({ inline_data: { mime_type: x.mimeType, data: x.data } });
  }
  const request = {
    contents: [{ role: 'user', parts }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: outputSchema(),
      thinkingConfig: { thinkingLevel: 'medium' },
      maxOutputTokens: 3500
    }
  };
  const url = `${GEMINI_API_BASE_URL}/models/${encodeURIComponent(MODEL)}:generateContent`;
  const r = await fetchJsonWithTimeout(url, { method: 'POST', headers: { 'x-goog-api-key': API_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(request) });
  const txt = await r.text(); let data = {}; try { data = JSON.parse(txt); } catch {}
  if (!r.ok) { const err = new Error(`Gemini HTTP ${r.status}: ${data?.error?.message || txt.slice(0, 500)}`); err.status = r.status; throw err; }
  const output_text = extractGeminiText(data); if (!output_text) throw new Error('Gemini returned an empty response.');
  const valid = validateOracleOutput(output_text);
  return { output_text: valid.cleaned, model: MODEL, provider: 'Gemini' };
}

async function callOpenAICompatible(body, cfg) {
  if (!cfg.apiKey) throw new Error(`${cfg.name} is not configured.`);
  const messages = buildCompatMessages(body);
  const systemSuffix = '\n\nReturn valid JSON only. Do not wrap JSON in markdown fences. The JSON must contain exactly these top-level keys: technical_adequacy, observations, interpretation, differential, urgent_flags, missing_data, uncertainty, suggested_disease, suggested_oracle_values, pathway_link, teaching. pathway_link.requires_clinician_confirmation must be true.';
  if (Array.isArray(messages[0]?.content)) messages[0].content = messages[0].content.map((p,i) => i===0 && p.type==='text' ? { ...p, text: p.text + systemSuffix } : p);
  else messages[0].content = String(messages[0].content || '') + systemSuffix;
  const hasImageParts = messages.some(m => Array.isArray(m?.content) && m.content.some(p => p?.type === 'image_url'));
  // Groq's GPT-OSS text models require string content. Keep text-only requests
  // compatible, while using the Groq vision model when image input is present.
  let model = cfg.model;
  if (cfg.name === 'Groq' && hasImageParts) model = GROQ_VISION_MODEL;
  if (!hasImageParts) {
    for (const m of messages) {
      if (Array.isArray(m.content)) m.content = m.content.map(p => p?.type === 'text' ? p.text : '').filter(Boolean).join('\n');
    }
  }
  const request = {
    model,
    messages,
    temperature: 0.1,
    max_tokens: 3500,
    response_format: { type: 'json_object' }
  };
  const r = await fetchJsonWithTimeout(cfg.url, { method: 'POST', headers: { Authorization: `Bearer ${cfg.apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify(request) });
  const txt = await r.text(); let data = {}; try { data = JSON.parse(txt); } catch {}
  if (!r.ok) { const err = new Error(`${cfg.name} HTTP ${r.status}: ${data?.error?.message || txt.slice(0, 500)}`); err.status = r.status; throw err; }
  const output_text = extractOpenAIText(data); if (!output_text) throw new Error(`${cfg.name} returned an empty response.`);
  const valid = validateOracleOutput(output_text);
  return { output_text: valid.cleaned, model: data.model || model, provider: cfg.name };
}

const PROVIDERS = [
  { name: 'Groq', apiKey: GROQ_API_KEY, model: GROQ_MODEL, url: `${GROQ_API_BASE_URL}/chat/completions` },
  { name: 'Gemini', apiKey: API_KEY, model: MODEL },
  { name: 'Cerebras', apiKey: CEREBRAS_API_KEY, model: CEREBRAS_MODEL, url: `${CEREBRAS_API_BASE_URL}/chat/completions` },
  { name: 'OpenRouter', apiKey: OPENROUTER_API_KEY, model: OPENROUTER_MODEL, url: `${OPENROUTER_API_BASE_URL}/chat/completions` }
];

async function callWithFallback(body) {
  const attempts = [];
  for (const p of PROVIDERS) {
    try {
      const result = p.name === 'Gemini' ? await callGemini(body) : await callOpenAICompatible(body, p);
      return { ...result, fallback_attempts: attempts };
    } catch (e) {
      attempts.push({ provider: p.name, status: e?.status || 0, error: String(e?.message || e).slice(0, 500) });
    }
  }
  const summary = attempts.map(a => `${a.provider}${a.status ? ` (${a.status})` : ''}: ${a.error}`).join(' | ');
  const err = new Error(`All AI providers failed. ${summary}`); err.status = 503; err.attempts = attempts; throw err;
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
      return json(res, 200, { ok: true, service: 'urology-oracle-online-ai', version: '13.9.0', fallbackOrder: PROVIDERS.map(p => p.name), configured: Object.fromEntries(PROVIDERS.map(p => [p.name, Boolean(p.apiKey)])), offlineCore: true, offlineAI: false }, origin);
    }
    if (req.method === 'POST' && req.url === '/api/urology-ai') {
      if (!rateAllowed(req)) return json(res, 429, { error: 'Rate limit reached. Please try again later.' }, origin);
      const raw = await readBody(req);
      let body = {}; try { body = JSON.parse(raw); } catch { return json(res, 400, { error: 'Invalid JSON payload.' }, origin); }
      return json(res, 200, await callWithFallback(body), origin);
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
