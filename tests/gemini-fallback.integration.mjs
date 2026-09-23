import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
let primaryCalls = 0;
let fallbackCalls = 0;
let fallbackThinkingLevel = null;

const mock = http.createServer((req, res) => {
  const model = req.url.match(/models\/([^:]+):generateContent/)?.[1] || '';
  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    if (model === 'gemini-3.8-flash') {
      primaryCalls += 1;
      res.writeHead(503, {'Content-Type':'application/json'});
      res.end(JSON.stringify({error:{message:'temporary overload',status:'UNAVAILABLE'}}));
      return;
    }
    if (model === 'gemini-3.7-flash') {
      fallbackCalls += 1;
      const parsed = JSON.parse(body);
      fallbackThinkingLevel = parsed.generationConfig?.thinkingConfig?.thinkingLevel || null;
      res.writeHead(200, {'Content-Type':'application/json'});
      res.end(JSON.stringify({candidates:[{content:{parts:[{text:'{"ok":true}'}]}}]}));
      return;
    }
    res.writeHead(404, {'Content-Type':'application/json'});
    res.end(JSON.stringify({error:{message:'unexpected model'}}));
  });
});
await new Promise(resolve => mock.listen(8811, '127.0.0.1', resolve));

const child = spawn(process.execPath, [path.join(root, 'backend-server.mjs')], {
  cwd: root,
  env: {
    ...process.env,
    PORT: '8812',
    WEB_ROOT: path.join(root, 'frontend'),
    GEMINI_API_KEY: 'test-key',
    GEMINI_MODEL: 'gemini-3.8-flash',
    GEMINI_FALLBACK_MODELS: 'gemini-3.7-flash,gemini-3.6-flash',
    GEMINI_API_BASE_URL: 'http://127.0.0.1:8811',
    GEMINI_MAX_RETRIES: '3',
    GEMINI_FALLBACK_RETRIES: '0',
    GEMINI_RETRY_BASE_MS: '5',
    GEMINI_RETRY_MAX_MS: '10'
  }
});

const post = (payload) => new Promise((resolve, reject) => {
  const data = JSON.stringify(payload);
  const req = http.request('http://127.0.0.1:8812/api/urology-ai', {
    method: 'POST', headers: {'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}
  }, res => {
    let b = '';
    res.on('data', c => b += c);
    res.on('end', () => resolve({status: res.statusCode, body: b}));
  });
  req.on('error', reject);
  req.write(data); req.end();
});

try {
  await new Promise(resolve => setTimeout(resolve, 200));
  const out = await post({study:'test',context:{},images:[]});
  assert.equal(out.status, 200);
  assert.equal(primaryCalls, 4);
  assert.equal(fallbackCalls, 1);
  assert.equal(fallbackThinkingLevel, 'low');
  assert.match(out.body, /"model":"gemini-3.7-flash"/);
  assert.match(out.body, /"fallback_used":true/);
  assert.match(out.body, /"requested_model":"gemini-3.8-flash"/);
  console.log('Gemini fallback integration: PASS (3.8 transient 503 → retries exhausted → 3.7 fallback succeeds)');
} finally {
  child.kill('SIGTERM');
  await new Promise(resolve => mock.close(resolve));
}
