// V16.6: the offline worker must list every app file and carry the current content hash.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildSw, shellFiles } from './tools/build-sw.mjs';
const current = fs.readFileSync('frontend/sw.js', 'utf8');
assert.equal(current, buildSw(), 'frontend/sw.js is out of date: run  node tools/build-sw.mjs  and upload frontend/sw.js');
const html = fs.readFileSync('frontend/index.html', 'utf8');
for (const f of shellFiles().filter(f => /\.(js|css)$/.test(f))) assert.ok(html.includes(`"${f}"`), `${f} is cached offline but index.html does not load it`);
for (const m of html.matchAll(/(?:src|href)="(\/[^"]+\.(?:js|css))"/g)) assert.ok(shellFiles().includes(m[1]), `${m[1]} is loaded by index.html but not cached offline`);
assert.match(html, /rel="manifest"/);
console.log(`offline worker: PASS — ${shellFiles().length} files cached, version up to date`);
