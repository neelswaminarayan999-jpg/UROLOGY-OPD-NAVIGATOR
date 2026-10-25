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
  assert.match(js, /function mountPlanContext/, '13e context is attached to the active treatment output');
  assert.match(js, /cw13ActivePlanContext/, 'context panel target is present');
  assert.match(js, /contentAvailability/, 'chapter access limitations are displayed');
  assert.match(js, /const CHAPTER_SYNTHESIS=\[/, 'chapter-specific original syntheses are present');
  const synthesisMatch = js.match(/const CHAPTER_SYNTHESIS=(\[[\s\S]*?\]);\nCHAPTER_SYNTHESIS\.forEach/);
  assert.ok(synthesisMatch, 'chapter synthesis registry has a closed boundary');
  const synthesisCount = (synthesisMatch[1].match(/\{chapter:\d+,focus:/g) || []).length;
  assert.ok(synthesisCount >= 100, 'priority chapters have chapter-specific syntheses');
  for (const n of [2,3,4,5,6,7,8,11,12,17,20,24,25,26,27,28,29,30,31,33,38,41,45,49,54,56,57,72,73,79,80,82,83,86,88,90,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,153,154,155,156,157,158,159,160,161,162,163,164,165,166]) {
    assert.match(synthesisMatch[1], new RegExp('\\{chapter:' + n + ',focus:'), 'chapter ' + n + ' has an original chapter-specific synthesis');
  }
  assert.match(js, /data-chapter-synthesis=/, 'chapter summaries render as searchable UI cards');
  assert.match(js, /chapterNoteHtml/, 'chapter summaries are connected to the selected treatment context');
  assert.match(js, /chapterSynthesisCount:CHAPTER_SYNTHESIS.length/, 'chapter synthesis coverage is exposed in metadata');
  const synthesisIds = [...synthesisMatch[1].matchAll(/\\{chapter:(\\d+),focus:/g)].map(m => Number(m[1]));
  assert.equal(new Set(synthesisIds).size, synthesisIds.length, 'chapter synthesis ids are unique');
  assert.ok(synthesisIds.every(n => n >= 1 && n <= 166), 'synthesis chapters are in the contents index');
  const chapterMatch = js.match(/const CHAPTERS=(\[[\s\S]*?\]);\nconst MODULES=/);
  assert.ok(chapterMatch, 'chapter array is embedded as valid JSON');
  const chapters = JSON.parse(chapterMatch[1]);
  assert.equal(chapters.length, 166);
  assert.deepEqual(chapters.map(c => c.chapter), Array.from({ length: 166 }, (_, i) => i + 1));
  const renalPelvis = chapters.find(c => c.chapter === 89);
  assert.equal(renalPelvis.electronicOnly, true);
  assert.equal(renalPelvis.printedPage, null);
  const acuteStone = chapters.find(c => c.chapter === 96);
  assert.ok(acuteStone.contentAvailability && acuteStone.contentAvailability.includes('Elsevier eBooks'), 'Chapter 96 partial-preview limitation is retained');
  for (const n of [8, 26, 79, 82, 86, 95, 96, 97, 98, 99, 100, 129, 130, 131, 137, 138, 139, 144, 149, 150, 151, 153, 157, 165, 166]) {
    assert.ok(chapters.find(c => c.chapter === n && c.title && c.printedPage), 'chapter ' + n + ' has title and print page');
  }

  assert.match(js, /COVERED_CHAPTERS/, 'chapter coverage states are computed from topic mappings');
  assert.match(js, /Referenced by a broader topic summary\/checklist; chapter-specific synthesis not yet complete/, 'broader module mapping is not overstated as chapter-by-chapter synthesis');
  assert.match(js, /TOC index only; detailed synthesis not yet completed/, 'unmapped chapters are clearly distinguished from synthesized content');
  assert.match(js, /eBook-only; full chapter not present in the supplied inspection PDFs/, 'eBook-only content is clearly marked');
  const moduleMatch = js.match(/const MODULES=(\[[\s\S]*?\]);\nconst COVERED_CHAPTERS=/);
  assert.ok(moduleMatch, 'clinical module mapping is embedded as valid JSON');
  const modules = JSON.parse(moduleMatch[1]);
  assert.ok(modules.length >= 20, 'core disease and non-oncology reference modules are included');
  const moduleIds = modules.map(m => m.id);
  assert.equal(new Set(moduleIds).size, moduleIds.length, 'module ids are unique');
  for (const module of modules) {
    assert.ok(module.summary && module.sourcePages && module.chapters.length, module.name + ' should have summary/source/chapter refs');
    assert.ok(Array.isArray(module.checkpoints) && module.checkpoints.length >= 3, module.name + ' should include practical decision checks');
    for (const n of module.chapters) assert.ok(chapters.some(c => c.chapter === n), module.name + ' references absent chapter ' + n);
  }
  for (const requiredId of ['clinicalworkup','surgicalprinciples','stones','bladder','prostate','bph','stricture','utuc','testis','penis','urethralcancer','upperobstruction','lutf','continence','andrology','infertility','transplant','adrenal','trauma','pediatric','genderaffirming','geriatric','femalesexual']) {
    assert.ok(modules.some(m => m.id === requiredId), 'required module mapping: ' + requiredId);
  }
  const mod = id => modules.find(m => m.id === id);
  assert.ok(mod('prostate').chapters.includes(148), 'prostate anatomy chapter is mapped to prostate content');
  assert.ok(mod('bph').chapters.includes(148), 'prostate anatomy chapter is mapped to BPH content');
  assert.ok(!mod('adrenal').chapters.includes(148), 'prostate anatomy chapter is not misclassified as adrenal content');
  assert.ok(mod('lutf').chapters.includes(115), 'neuromodulation chapter is mapped to LUT dysfunction');
  assert.ok(mod('trauma').chapters.includes(125), 'genital/lower tract trauma chapter is mapped');
  assert.equal((js.match(/title:'EAU /g) || []).length, 6, 'six current guideline checkpoints are rendered');
});
