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
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
const GEMINI_FALLBACK_MODELS = String(process.env.GEMINI_FALLBACK_MODELS || 'gemini-3.8-flash').split(',').map(x => x.trim()).filter(Boolean);
const API_KEY = process.env.GEMINI_API_KEY || '';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
const GROQ_VISION_MODEL = process.env.GROQ_VISION_MODEL || 'qwen/qwen3.8-27b';
const GROQ_API_BASE_URL = (process.env.GROQ_API_BASE_URL || 'https://api.groq.com/openai/v1').replace(/\/$/, '');
const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY || '';
const CEREBRAS_MODEL = process.env.CEREBRAS_MODEL || 'gpt-oss-120b';
const CEREBRAS_API_BASE_URL = (process.env.CEREBRAS_API_BASE_URL || 'https://api.cerebras.ai/v1').replace(/\/$/, '');
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'qwen/qwen3.8-27b:free';
const OPENROUTER_FALLBACK_MODELS = String(process.env.OPENROUTER_FALLBACK_MODELS || 'google/gemma-4-26b-a4b-it:free,openrouter/free').split(',').map(x => x.trim()).filter(Boolean);
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
  const isUroflow = /uroflow|flow[- ]rate|qmax|q\\s*max|voided volume/i.test(study + ' ' + JSON.stringify(ctx));
  const specialtyGuardrail = isUroflow ? `
UROFLOWMETRY-SPECIFIC ACCURACY RULES:
- Report the exact readable Qmax, Qavg, voided volume, flow pattern and PVR only when present.
- A low Qmax is an abnormal low-flow finding, but uroflowmetry alone cannot distinguish bladder outlet obstruction (BOO/BPO) from detrusor underactivity (DU) or an under-filled bladder.
- Do NOT state or imply that Qmax <10 mL/s by itself is diagnostic of significant obstruction.
- For a voided volume around/above 150 mL, state that the tracing is more interpretable; for volumes <150 mL, recommend repeat uroflowmetry when clinically appropriate.
- Use the flow curve as supportive information, not as proof of urethral stricture.
- If the question is BOO vs DU, explain that pressure-flow urodynamics provides the functional distinction when indicated; do not infer BOO from uroflow alone.
- If a urethral stricture is suggested, require direct supporting evidence such as visible narrowing on urethroscopy/RUG/VCUG rather than low flow alone.
- Keep interpretation proportional to the data: do not invent prostate size, PVR, symptoms, obstruction grade, stricture length or detrusor contractility.
` : '';
  return `You are the image/report interpretation assistant inside a urology clinical decision-support and teaching tool. Study: ${study}.
  
Patient/context data:
${JSON.stringify(ctx)}

Analyze only the supplied image(s), written report and structured data. This is clinician-facing support, not autonomous medical care. Do NOT identify a person, make a definitive patient diagnosis, prescribe treatment, or issue a treatment order. Describe visible radiologic/clinical features, extract measurements only when clearly readable, identify important abnormalities and limitations, and suggest which existing Oracle module should be opened for clinician review. Do not invent measurements or facts. Distinguish direct observations from interpretation. ${specialtyGuardrail}Return valid JSON matching the requested schema. Canonical Oracle modules: ${canonical.join(', ')}. The clinician must confirm all findings and treatment decisions.`;
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
function readableValue(value) {
  if (value == null) return '';
  if (typeof value === 'string') {
    const t = value.trim();
    if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) {
      try { return readableValue(JSON.parse(t)); } catch {}
    }
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(readableValue).filter(Boolean).join('; ');
  if (typeof value === 'object') {
    const preferred=['summary','notes','note','finding','findings','text','description','observation','interpretation','value','details','reason'];
    for (const key of preferred) {
      if (value[key] != null) {
        const v=readableValue(value[key]);
        if(v) return v;
      }
    }
    return Object.entries(value)
      .map(([k,v])=>{ const x=readableValue(v); return x ? `${k.replace(/_/g,' ')}: ${x}` : ''; })
      .filter(Boolean).join('; ');
  }
  return String(value);
}

function normalizeOracleObject(obj) {
  const listKeys = ['observations','differential','urgent_flags','missing_data','uncertainty','teaching'];
  for (const key of listKeys) {
    if (obj[key] == null) obj[key] = [];
    else if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
    obj[key] = obj[key].map(readableValue).filter(Boolean);
  }
  obj.technical_adequacy = readableValue(obj.technical_adequacy) || 'Not stated by provider.';
  obj.interpretation = readableValue(obj.interpretation) || 'No provider interpretation returned.';
  if (obj.suggested_oracle_values == null || typeof obj.suggested_oracle_values !== 'object' || Array.isArray(obj.suggested_oracle_values)) {
    obj.suggested_oracle_values = { disease: 'None', fields: [] };
  }
  if (!obj.suggested_oracle_values.disease) obj.suggested_oracle_values.disease = 'None';
  if (!Array.isArray(obj.suggested_oracle_values.fields)) {
    obj.suggested_oracle_values.fields = obj.suggested_oracle_values.fields == null ? [] : [{ id: 'unparsed', value: readableValue(obj.suggested_oracle_values.fields) }];
  }
  obj.suggested_oracle_values.fields = obj.suggested_oracle_values.fields
    .filter(Boolean)
    .map((x,i) => typeof x === 'object'
      ? { id: String(x.id ?? 'field_'+(i+1)), value: readableValue(x.value ?? x) }
      : { id: 'field_'+(i+1), value: readableValue(x) });
  if (!obj.pathway_link || typeof obj.pathway_link !== 'object' || Array.isArray(obj.pathway_link)) {
    obj.pathway_link = {
      requires_clinician_confirmation: true,
      suggested_module: 'None',
      note: 'No safe Oracle handoff could be established from the provider response.'
    };
  }
  obj.pathway_link.requires_clinician_confirmation = true;
  if (!obj.pathway_link.suggested_module) obj.pathway_link.suggested_module = 'None';
  obj.pathway_link.note = readableValue(obj.pathway_link.note) || 'Clinician confirmation required.';
  if (!obj.suggested_disease) obj.suggested_disease = 'None';
  return obj;
}

function validateOracleOutput(text) {
  const cleaned = stripJsonFences(text);
  if (/^user\s+safety\s*:/i.test(cleaned) || /safety\s+categories\s*:/i.test(cleaned)) {
    const e = new Error('Provider returned a safety-classification response instead of Oracle JSON.'); e.code = 'INVALID_ORACLE_RESPONSE'; throw e;
  }
  let obj;
  try { obj = JSON.parse(cleaned); }
  catch { const e = new Error('Provider returned non-JSON content; expected Oracle JSON.'); e.code = 'INVALID_ORACLE_RESPONSE'; throw e; }
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) { const e = new Error('Provider returned an invalid Oracle JSON object.'); e.code='INVALID_ORACLE_RESPONSE'; throw e; }
  obj = normalizeOracleObject(obj);
  const missing = ORACLE_KEYS.filter(k => !(k in obj));
  if (missing.length) {
    const e = new Error(`Invalid Oracle schema: missing=${missing.join(',')}`);
    e.code = 'INVALID_ORACLE_RESPONSE'; throw e;
  }
  // Free models may append harmless non-Oracle metadata keys. Preserve only the
  // canonical Oracle contract so provider-specific extras cannot break the handoff.
  obj = Object.fromEntries(ORACLE_KEYS.map(k => [k, obj[k]]));
  if (!Array.isArray(obj.observations) || !Array.isArray(obj.differential) || !Array.isArray(obj.urgent_flags) ||
      !Array.isArray(obj.missing_data) || !Array.isArray(obj.uncertainty) || !Array.isArray(obj.teaching)) {
    const e = new Error('Invalid Oracle schema: list fields must be arrays.'); e.code='INVALID_ORACLE_RESPONSE'; throw e;
  }
  if (!obj.pathway_link || obj.pathway_link.requires_clinician_confirmation !== true) {
    const e = new Error('Invalid Oracle schema: clinician-confirmation gate is missing or false.'); e.code='INVALID_ORACLE_RESPONSE'; throw e;
  }
  return { cleaned: JSON.stringify(obj), obj };
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

async function callGemini(body, model = MODEL) {
  if (!API_KEY) throw new Error('Gemini is not configured.');
  const parts = [{ text: makePrompt(body) }];
  if (Array.isArray(body?.input)) {
    const texts = [];
    const inlineImages = [];
    for (const item of body.input) {
      if (typeof item?.content === 'string') texts.push(item.content);
      else if (Array.isArray(item?.content)) {
        for (const part of item.content) {
          if (part?.type === 'input_text') texts.push(String(part.text || ''));
          if (part?.type === 'input_image' && typeof part.image_url === 'string') inlineImages.push(part.image_url);
        }
      }
    }
    if (texts.length) parts[0] = { text: texts.join('\n\n') };
    if (!Array.isArray(body.images)) body.images = [];
    for (const img of inlineImages) if (!body.images.includes(img)) body.images.push(img);
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
  const url = `${GEMINI_API_BASE_URL}/models/${encodeURIComponent(model)}:generateContent`;
  const r = await fetchJsonWithTimeout(url, { method: 'POST', headers: { 'x-goog-api-key': API_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(request) });
  const txt = await r.text(); let data = {}; try { data = JSON.parse(txt); } catch {}
  if (!r.ok) { const err = new Error(`Gemini HTTP ${r.status}: ${data?.error?.message || txt.slice(0, 500)}`); err.status = r.status; throw err; }
  const output_text = extractGeminiText(data); if (!output_text) throw new Error('Gemini returned an empty response.');
  const valid = validateOracleOutput(output_text);
  return { output_text: valid.cleaned, model, provider: 'Gemini' };
}

async function callOpenAICompatible(body, cfg) {
  if (!cfg.apiKey) throw new Error(`${cfg.name} is not configured.`);
  const messages = buildCompatMessages(body);
  const systemSuffix = '\n\nReturn valid JSON only. Do not wrap JSON in markdown fences. The JSON must contain exactly these top-level keys: technical_adequacy, observations, interpretation, differential, urgent_flags, missing_data, uncertainty, suggested_disease, suggested_oracle_values, pathway_link, teaching. pathway_link.requires_clinician_confirmation must be true.';
  if (Array.isArray(messages[0]?.content)) messages[0].content = messages[0].content.map((p,i) => i===0 && p.type==='text' ? { ...p, text: p.text + systemSuffix } : p);
  else messages[0].content = String(messages[0].content || '') + systemSuffix;
  const hasImageParts = messages.some(m => Array.isArray(m?.content) && m.content.some(p => p?.type === 'image_url'));
  const model = cfg.model;
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

  let r, txt = '', data = {};
  let lastError = null;
  for (const delay of [0, 1200, 3000]) {
    if (delay) await new Promise(resolve => setTimeout(resolve, delay));
    r = await fetchJsonWithTimeout(cfg.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://urology-opd-navigator.onrender.com',
        'X-Title': 'Urology Oracle V14.0'
      },
      body: JSON.stringify(request)
    });
    txt = await r.text();
    data = {}; try { data = JSON.parse(txt); } catch {}
    if (r.ok) break;
    lastError = new Error(`${cfg.name} HTTP ${r.status}: ${data?.error?.message || data?.error?.metadata?.raw || txt.slice(0, 800)}`);
    lastError.status = r.status;
    lastError.providerResponse = data?.error || null;
    if (![429, 502, 503, 504].includes(r.status)) throw lastError;
  }
  if (!r.ok) throw lastError || new Error(`${cfg.name} request failed.`);

  const output_text = extractOpenAIText(data);
  if (!output_text) throw new Error(`${cfg.name} returned an empty response.`);
  const valid = validateOracleOutput(output_text);
  return { output_text: valid.cleaned, model: data.model || model, provider: cfg.name };
}

const PROVIDERS = [];



async function callWithFallback(body) {
  const attempts = [];
  const models = [OPENROUTER_MODEL, ...OPENROUTER_FALLBACK_MODELS.filter(x => x !== OPENROUTER_MODEL)];
  if (!OPENROUTER_API_KEY) {
    const err = new Error('OPENROUTER_API_KEY is not configured.'); err.status = 503; err.attempts = []; throw err;
  }
  for (const model of models) {
    const cfg = { name: 'OpenRouter', apiKey: OPENROUTER_API_KEY, model, url: `${OPENROUTER_API_BASE_URL}/chat/completions` };
    try {
      const result = await callOpenAICompatible(body, cfg);
      return { ...result, fallback_attempts: attempts };
    } catch (e) {
      attempts.push({ provider: 'OpenRouter', model, status: e?.status || 0, code: e?.code || '', error: String(e?.message || e).slice(0, 500) });
      if (e?.status && ![429, 502, 503, 504].includes(e.status) && e?.code !== 'INVALID_ORACLE_RESPONSE') {
        // A permanent HTTP/authentication error should not be hidden by model fallback.
        break;
      }
    }
  }
  const summary = attempts.map(a => `${a.provider} / ${a.model}${a.status ? ` (${a.status})` : ''}: ${a.error}`).join(' | ');
  const status = attempts.find(a => a.status === 429)?.status || attempts.find(a => a.status === 503)?.status || 503;
  const err = new Error(`OpenRouter AI failed. ${summary}`); err.status = status; err.attempts = attempts; throw err;
}

function hotfixHtml(html) {
  const tags = [
    '<script src="/v14-release-hotfix.js" defer></script>',
    '<script src="/v14.1-opd-suite.js" defer></script>',
    '<script src="/v14.1-core-hardening.js" defer></script>',
    '<script src="/v14.2-clinical-navigation.js" defer></script>',
    '<script src="/v14.3-prostate-pathway.js" defer></script>',
    '<script src="/v14.4-oncology-pathways.js" defer></script>',
    '<script src="/v14.5-urgent-urology.js" defer></script>',
    '<script src="/v14.6-stone-engine.js" defer></script>'
  ];
  let out = html;
  for (const tag of tags) {
    const src = tag.match(/src="([^"]+)"/)?.[1];
    if (src && !out.includes(src) && out.includes('</head>')) out = out.replace('</head>', tag + '</head>');
    else if (src && !out.includes(src)) out += tag;
  }
  return out;
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
      return json(res, 200, { ok: true, service: 'urology-oracle-online-ai', version: '14.0.0', release: 'FINAL CLINICAL WORKSTATION', provider: 'OpenRouter', model: OPENROUTER_MODEL, fallbackModels: OPENROUTER_FALLBACK_MODELS, freeTier: true, configured: { OpenRouter: Boolean(OPENROUTER_API_KEY) }, offlineCore: true, offlineAI: false }, origin);
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
      const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json; charset=utf-8', '.svg': 'image/svg+xml' };
      res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      if (ext === '.html') {
        const html = hotfixHtml(fs.readFileSync(file, 'utf8'));
        res.end(html);
        return;
      }
      return fs.createReadStream(file).pipe(res);
    }
    return json(res, 405, { error: 'Method not allowed' }, origin);
  } catch (e) {
    const status = Number.isInteger(e?.status) && e.status >= 400 && e.status < 600 ? e.status : 500;
    return json(res, status, { error: e?.message || String(e), provider: 'OpenRouter', attempts: e?.attempts || undefined }, origin);
  }
});

server.listen(PORT, HOST, () => console.log(`Urology Oracle backend listening on ${HOST}:${PORT}`));
