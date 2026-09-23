import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const code=fs.readFileSync(new URL('../frontend/v13.9-content-pack.js',import.meta.url),'utf8');
const names=['Ca Prostate','Ca Bladder','UTUC','Ca Kidney','Ca Testis','Ca Penis','Urethral Cancer','Adrenal / Neuroendocrine','Urethral Stricture','BPH / Male LUTS','Stone Disease'];
const diseases=Object.fromEntries(names.map(n=>[n,{sections:[]}]))
const ctx={window:{DISEASES:diseases,openDisease(){}}};
vm.createContext(ctx); vm.runInContext(code,ctx);
assert.equal(ctx.window.UROLOGY_ORACLE_V139_CONTENT.version,'13.9.0');
for(const n of names) assert.ok(ctx.window.DISEASES[n].sections.length>=1,`missing content for ${n}`);
console.log('content pack: PASS');
