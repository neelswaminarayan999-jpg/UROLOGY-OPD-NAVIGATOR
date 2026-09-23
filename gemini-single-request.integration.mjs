import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
let calls = 0;
let seenThinking = null;
let seenMaxTokens = null;

const mock = http.createServer((req, res) => {
  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    calls += 1;
    const parsed = JSON.parse(body);
    seenThinking = parsed.generationConfig?.thinkingConfig?.thinkingLevel ?? null;
    seenMaxTokens = parsed.generationConfig?.maxOutputTokens ?? null;
    res.writeHead(200, {'Content-Type':'application/json'});
    const valid={technical_adequacy:'Adequate',observations:[],interpretation:'Test',differential:[],urgent_flags:[],missing_data:[],uncertainty:[],suggested_disease:'None',suggested_oracle_values:{disease:'None',fields:[]},pathway_link:{requires_clinician_confirmation:true,suggested_module:'None',note:'Test'},teaching:[]};
    res.end(JSON.stringify({candidates:[{content:{parts:[{text:JSON.stringify(valid)}]}}]}));
  });
});
await new Promise(resolve => mock.listen(8821, '127.0.0.1', resolve));

const child = spawn(process.execPath, [path.join(root, 'backend-server.mjs')], {
  cwd: root,
  env: {
    ...process.env,
    PORT: '8822',
    WEB_ROOT: path.join(root, 'frontend'),
    GEMINI_API_KEY: 'test-key',
    GEMINI_MODEL: 'gemini-3.8-flash',
    GEMINI_API_BASE_URL: 'http://127.0.0.1:8821',
    GROQ_API_KEY: '',
    CEREBRAS_API_KEY: '',
    OPENROUTER_API_KEY: ''
  }
});

const post = payload => new Promise((resolve, reject) => {
  const data = JSON.stringify(payload);
  const req = http.request('http://127.0.0.1:8822/api/urology-ai', {
    method:'POST', headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}
  }, res => {
    let b=''; res.on('data', c => b += c); res.on('end', () => resolve({status:res.statusCode, body:b}));
  });
  req.on('error', reject); req.write(data); req.end();
});

try {
  await new Promise(resolve => setTimeout(resolve, 200));
  const out = await post({study:'test', context:{}, images:[]});
  assert.equal(out.status, 200);
  assert.equal(calls, 1);
  assert.equal(seenThinking, 'medium');
  assert.equal(seenMaxTokens, 3500);
  assert.match(out.body, /"model":"gemini-3.8-flash"/);
  console.log('Gemini single-request integration: PASS (exact V12.1 request profile; fallback skipped unconfigured providers)');
} finally {
  child.kill('SIGTERM');
  await new Promise(resolve => mock.close(resolve));
}
