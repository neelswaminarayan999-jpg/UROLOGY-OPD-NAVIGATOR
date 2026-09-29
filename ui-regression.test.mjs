import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const suite = fs.readFileSync(new URL('./frontend/v14.1-opd-suite.js', import.meta.url), 'utf8');
const nav = fs.readFileSync(new URL('./frontend/v14.2-clinical-navigation.js', import.meta.url), 'utf8');
const prostate = fs.readFileSync(new URL('./frontend/v14.3-prostate-pathway.js', import.meta.url), 'utf8');
const hotfix = fs.readFileSync(new URL('./frontend/v14-release-hotfix.js', import.meta.url), 'utf8');

execFileSync(process.execPath, ['--check', new URL('./frontend/v14.1-opd-suite.js', import.meta.url).pathname], {stdio:'pipe'});
execFileSync(process.execPath, ['--check', new URL('./frontend/v14-release-hotfix.js', import.meta.url).pathname], {stdio:'pipe'});
execFileSync(process.execPath, ['--check', new URL('./frontend/v14.2-clinical-navigation.js', import.meta.url).pathname], {stdio:'pipe'});
execFileSync(process.execPath, ['--check', new URL('./frontend/v14.3-prostate-pathway.js', import.meta.url).pathname], {stdio:'pipe'});

assert.ok(nav.includes('Clinical Oracle'));
assert.ok(nav.includes('Bladder cancer pathway'));
assert.ok(nav.includes('Second TURBT indicated'));
assert.ok(nav.includes('enfortumab vedotin + pembrolizumab'));
assert.ok(nav.includes('cisplatin/gemcitabine + durvalumab'));
assert.ok(nav.includes('v142ClinicalNav'));
assert.ok(prostate.includes('Prostate cancer pathway'));
assert.ok(prostate.includes('ISUP Grade Group'));
assert.ok(prostate.includes('PEACE-1'));
assert.ok(prostate.includes('ARASENS'));
assert.ok(prostate.includes('STAMPEDE'));
assert.ok(suite.includes('OPD quick tools'));
assert.ok(!hotfix.includes("document.title='Urology Oracle V14.0"));
assert.ok(!hotfix.includes("h.textContent='Urology Oracle V14.0"));
console.log('UI regression: PASS');
