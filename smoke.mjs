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
  'frontend/app/10-ui-hotfix.js',
  'frontend/app/11-opd-suite.js',
  'frontend/app/12-core-hardening.js',
  'frontend/app/13-navigation.js',
  'frontend/app/20-engines.js',
  'frontend/app/20-engines.js',
  'v13.9-content-pack.js',
  'v13-clinical-engine.js',
  'frontend/app/30-operative-atlas.js',
  'frontend/app/30-operative-atlas.js',
  'frontend/app/30-operative-atlas.js',
  'frontend/app/30-operative-atlas.js',
  'frontend/app/30-operative-atlas.js',
  'frontend/app/30-operative-atlas.js',
  'frontend/app/30-operative-atlas.js',
  'frontend/app/30-operative-atlas.js',
  'frontend/app/40-opd-workflow.js'
]) {
  execFileSync(process.execPath, ['--check', path.join(ROOT, file)], { stdio: 'inherit' });
}

const manifest = JSON.parse(fs.readFileSync(path.join(FRONT, 'manifest.webmanifest'), 'utf8'));
assert.equal(manifest.name, 'Urology Oracle');
assert.equal(manifest.short_name, 'Oracle');
const hotfix = fs.readFileSync(path.join(FRONT, 'app/10-ui-hotfix.js'), 'utf8');
assert.match(fs.readFileSync(path.join(FRONT, 'index.html'), 'utf8'), /<title>Urology Oracle<\/title>/);
assert.match(hotfix, /window\.modal=function/);
assert.match(hotfix, /@media print/);
// V16: one stone pathway. The Oracle hands stone/BPH/stricture to their engines; no polling patches remain.
const core = fs.readFileSync(path.join(FRONT, 'app/00-core.js'), 'utf8');
assert.match(core, /const ENGINE_HANDOFF=\{/);
for (const k of ['Stone Disease', 'BPH / Male LUTS', 'Urethral Stricture']) assert.ok(core.includes(`'${k}':{fn:`), `handoff for ${k}`);
assert.doesNotMatch(hotfix, /stoneDecisionV14/);
for (const f of fs.readdirSync(path.join(FRONT, 'app'))) assert.doesNotMatch(fs.readFileSync(path.join(FRONT, 'app', f), 'utf8'), /setInterval\(/, `${f} must not poll`);

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
  assert.match(health.body, /"version":"16.8.0"/);
  assert.match(health.body, /"provider":"Multi-provider fallback"/);
  assert.match(health.body, /"configured":\{"Gemini":(true|false),"Groq":(true|false),"Cerebras":(true|false),"OpenRouter":/);
  assert.match(health.body, /"freeTier":true/);

  const index = await get('/');
  assert.equal(index.status, 200);
  // V16: index.html lists every module itself; check each is referenced and served.
  const mods = ['/app/00-offline.js', '/data/clinical.js', '/data/fistula-figures.js', '/data/functional-figures.js', '/app/21-fistula.js', '/app/22-functional.js', '/app/00-core.js', '/app/01-core-init.js', '/app/02-book-lab.js', '/app/03-ai-online-v11.js', '/app/04-figure-meta.js', '/app/05-ai-lab.js', '/app/06-oracle-deep.js', '/app/07-oracle-workstation.js', '/app/10-ui-hotfix.js', '/app/11-opd-suite.js', '/app/12-core-hardening.js', '/app/13-navigation.js', '/app/20-engines.js', '/app/30-operative-atlas.js', '/app/40-opd-workflow.js', '/app/50-campbell13.js', '/app/60-viva.js', '/data/mcq-bank.js', '/app/61-mcq.js'];
  for (const m of mods) {
    assert.ok(index.body.includes(`src="${m}"`), `index.html must load ${m}`);
    const r = await get(m); assert.equal(r.status, 200, `${m} must be served`);
  }
  const figs = await get('/book-figures.json'); assert.equal(figs.status, 200);

  const manifestRes = await get('/manifest.webmanifest');
  assert.equal(manifestRes.status, 200);
  assert.match(manifestRes.body, /Urology Oracle/);
  const contentPack = fs.readFileSync(path.join(ROOT, 'v13.9-content-pack.js'), 'utf8');
  assert.doesNotMatch(contentPack, /V13\.9 —/);

  const icon = await get('/icon.svg');
  assert.equal(icon.status, 200);
  assert.match(String(icon.headers['content-type'] || ''), /image\/svg\+xml/);

  console.log('V16 full regression smoke: PASS');
} finally {
  child.kill('SIGTERM');
}