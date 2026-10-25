import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
let calls = 0;
const mock = http.createServer((req, res) => {
  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    calls += 1;
    if (calls <= 2) {
      res.writeHead(503, {'Content-Type':'application/json'});
      res.end(JSON.stringify({error:{message:'temporary overload',status:'UNAVAILABLE'}}));
      return;
    }
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify({candidates:[{content:{parts:[{text:'{"ok":true}'}]}}]}));
  });
});
await new Promise(resolve => mock.listen(8801, '127.0.0.1', resolve));

const child = spawn(process.execPath, [path.join(root, 'backend-server.mjs')], {
  cwd: root,
  env: {
    ...process.env,
    PORT: '8802',
    WEB_ROOT: path.join(root, 'frontend'),
    GEMINI_API_KEY: 'test-key',
    GEMINI_MODEL: 'gemini-3.8-flash',
    GEMINI_API_BASE_URL: 'http://127.0.0.1:8801',
    GEMINI_MAX_RETRIES: '3',
    GEMINI_RETRY_BASE_MS: '20',
    GEMINI_RETRY_MAX_MS: '40'
  }
});

const post = (payload) => new Promise((resolve, reject) => {
  const data = JSON.stringify(payload);
  const req = http.request('http://127.0.0.1:8802/api/urology-ai', {
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
  assert.equal(calls, 3);
  assert.match(out.body, /"provider":"Gemini"/);
  console.log('Gemini transient-503 retry integration: PASS (2 failures → success on 3rd attempt)');
} finally {
  child.kill('SIGTERM');
  await new Promise(resolve => mock.close(resolve));
}
