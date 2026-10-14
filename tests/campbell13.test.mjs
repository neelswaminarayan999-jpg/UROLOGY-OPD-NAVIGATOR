import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import path from 'node:path';

test('Campbell 13e reference layer serves and validates its chapter map', async (t) => {
  const root = process.cwd();
  const port = 18700 + (process.pid % 900);
  const child = spawn(process.execPath, ['backend/server.mjs'], {
    cwd: root,
    env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', WEB_ROOT: path.join(root, 'frontend'), GEMINI_API_KEY: '' },
    stdio: 'ignore'
  });
  t.after(() => { if (!child.killed) child.kill('SIGTERM'); });

  const base = `http://127.0.0.1:${port}`;
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try {
      const response = await fetch(base + '/health');
      if (response.ok) { ready = true; break; }
    } catch {}
    await delay(200);
  }
  assert.equal(ready, true, 'backend should start and pass /health');

  const home = await fetch(base + '/');
  assert.equal(home.status, 200);
  const html = await home.text();
  assert.match(html, /<script src="\/campbell13-content\.js" defer><\/script>/, 'server injects the 13e layer without rewriting the large HTML file');

  const moduleResponse = await fetch(base + '/campbell13-content.js');
  assert.equal(moduleResponse.status, 200);
  const js = await moduleResponse.text();
  assert.match(js, /Campbell-Walsh-Wein Urology/);
  assert.match(js, /EAU NMIBC Guidelines 2026/);
  const chapterMatch = js.match(/const CHAPTERS=(\[[\s\S]*?\]);\nconst MODULES=/);
  assert.ok(chapterMatch, 'chapter array is embedded as valid JSON');
  const chapters = JSON.parse(chapterMatch[1]);
  assert.equal(chapters.length, 166);
  assert.deepEqual(chapters.map(c => c.chapter), Array.from({ length: 166 }, (_, i) => i + 1));
  const renalPelvis = chapters.find(c => c.chapter === 89);
  assert.equal(renalPelvis.electronicOnly, true);
  assert.equal(renalPelvis.printedPage, null);
  for (const n of [8, 26, 79, 82, 86, 95, 96, 97, 98, 99, 100, 129, 130, 131, 137, 138, 139, 144, 149, 150, 151, 153, 157, 165, 166]) {
    assert.ok(chapters.find(c => c.chapter === n && c.title && c.printedPage), 'chapter ' + n + ' has title and print page');
  }

  const moduleMatch = js.match(/const MODULES=(\[[\s\S]*?\]);\nconst GUIDELINE_AUDIT=/);
  assert.ok(moduleMatch, 'clinical module mapping is embedded as valid JSON');
  const modules = JSON.parse(moduleMatch[1]);
  assert.ok(modules.length >= 10);
  for (const module of modules) {
    assert.ok(module.summary && module.sourcePages && module.chapters.length, module.name + ' should have summary/source/chapter refs');
    for (const n of module.chapters) assert.ok(chapters.some(c => c.chapter === n), module.name + ' references absent chapter ' + n);
  }
  assert.equal((js.match(/title:'EAU /g) || []).length, 6, 'six current guideline checkpoints are rendered');
});
