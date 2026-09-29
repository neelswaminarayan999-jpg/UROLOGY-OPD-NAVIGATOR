import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const FRONT = path.join(ROOT, 'frontend');

for (const file of [
  'backend-server.mjs',
  'smoke.mjs',
  'frontend/v14-release-hotfix.js',
  'frontend/v14.1-opd-suite.js',
  'frontend/v14.1-core-hardening.js',
  'frontend/v14.2-clinical-navigation.js',
  'frontend/v14.3-prostate-pathway.js',
  'v13.9-content-pack.js',
  'v13-clinical-engine.js'
]) {
  execFileSync(process.execPath, ['--check', path.join(ROOT, file)], { stdio: 'inherit' });
}

const manifest = JSON.parse(fs.readFileSync(path.join(FRONT, 'manifest.webmanifest'), 'utf8'));
assert.equal(manifest.name, 'Urology Oracle');
assert.equal(manifest.short_name, 'Oracle');
const hotfix = fs.readFileSync(path.join(FRONT, 'v14-release-hotfix.js'), 'utf8');
assert.match(hotfix, /document\.title='Urology Oracle'/);
assert.match(hotfix, /window\.modal=function/);
assert.match(hotfix, /lowerPole/);
assert.match(hotfix, /stoneDecisionV14/);
assert.match(hotfix, /UROLOGICAL EMERGENCY — DRAIN FIRST/);
assert.match(hotfix, /@media print/);

const child = spawn(process.execPath, [path.join(ROOT, 'backend-server.mjs')], {
  cwd: ROOT,
  env: { ...process.env, PORT: '8799', WEB_ROOT: FRONT, GEMINI_API_KEY: '', OPENROUTER_API_KEY: '' }
});

const get = p => new Promise((resolve, reject) => {
  const req = http.get('http://127.0.0.1:8799' + p, res => {
    let body = '';
    res.on('data', x => body += x);
    res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
  });
  req.on('error', reject);
});

try {
  await new Promise(r => setTimeout(r, 400));
  const health = await get('/health');
  assert.equal(health.status, 200);
  assert.match(health.body, /"version":"14\.0\.0"/);
  assert.match(health.body, /"provider":"OpenRouter"/);
  assert.match(health.body, /"freeTier":true/);

  const index = await get('/');
  assert.equal(index.status, 200);
  assert.match(index.body, /v14-release-hotfix\.js/);
  assert.match(index.body, /v14\.1-opd-suite\.js/);
  assert.match(index.body, /v14\.1-core-hardening\.js/);
  assert.match(index.body, /v14\.2-clinical-navigation\.js/);
  assert.match(index.body, /v14\.3-prostate-pathway\.js/);

  const manifestRes = await get('/manifest.webmanifest');
  assert.equal(manifestRes.status, 200);
  assert.match(manifestRes.body, /Urology Oracle/);
  const contentPack = fs.readFileSync(path.join(ROOT, 'v13.9-content-pack.js'), 'utf8');
  assert.doesNotMatch(contentPack, /V13\.9 —/);

  const icon = await get('/icon.svg');
  assert.equal(icon.status, 200);
  assert.match(String(icon.headers['content-type'] || ''), /image\/svg\+xml/);

  console.log('V14 regression smoke: PASS');
} finally {
  child.kill('SIGTERM');
}