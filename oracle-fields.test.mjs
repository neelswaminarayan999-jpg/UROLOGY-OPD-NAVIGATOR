// V16: catches rules that can never fire because they test a value the Oracle form never produces.
// Check every v.<field>==='<value>' comparison in Oracle rule code against the field's actual options.
import fs from 'node:fs'; import vm from 'node:vm';
const core = fs.readFileSync('frontend/app/00-core.js', 'utf8');
const i = core.indexOf('const ORACLE_FIELDS'); const j = core.indexOf('\nlet oracleState', i);
const F = vm.runInNewContext(core.slice(i, j).replace('const ORACLE_FIELDS', 'ORACLE_FIELDS') + ';ORACLE_FIELDS', {});
const files = ['frontend/app/00-core.js', 'frontend/app/06-oracle-deep.js', 'frontend/app/07-oracle-workstation.js'];
const bad = [];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  // split by disease blocks: name==='X' ... next name===
  const FN = { bladderOracle: 'Ca Bladder', strictureOracle: 'Urethral Stricture', bphOracle: 'BPH / Male LUTS', stoneOracle: 'Stone Disease', prostateOracle: 'Ca Prostate', utucOracle: 'UTUC', penisOracle: 'Ca Penis', testisOracle: 'Ca Testis', kidneyOracle: 'Ca Kidney', urethralOracle: 'Urethral Cancer', adrenalOracle: 'Adrenal / Neuroendocrine' };
  const re = /name\s*===\s*'([^']+)'|function (\w+Oracle)\(|^function \w+/gm; let m; const marks = [];
  while ((m = re.exec(src))) marks.push([m.index, m[1] || FN[m[2]] || '__none']);
  for (let k = 0; k < marks.length; k++) {
    const [st, d] = marks[k]; const en = k + 1 < marks.length ? marks[k + 1][0] : Math.min(src.length, st + 6000);
    const fields = F[d]; if (!fields) continue;
    const body = src.slice(st, en);
    for (const c of body.matchAll(/v\.(\w+)\s*===?\s*'([^']*)'/g)) {
      const fld = fields.find(x => x.id === c[1]);
      if (!fld) { bad.push(`${f}: ${d}: unknown field v.${c[1]} (=='${c[2]}')`); continue; }
      if (fld.options && !fld.options.includes(c[2]) && c[2] !== '') bad.push(`${f}: ${d}: v.${c[1]}=='${c[2]}' not in [${fld.options.join(' | ')}]`);
    }
    for (const c of body.matchAll(/\[([^\]]*)\]\.includes\(v\.(\w+)\)/g)) {
      const fld = fields.find(x => x.id === c[2]); if (!fld) { bad.push(`${f}: ${d}: unknown field v.${c[2]} in includes`); continue; }
      for (const val of c[1].split(',').map(s => s.trim().replace(/^'|'$/g, ''))) if (fld.options && !fld.options.includes(val)) bad.push(`${f}: ${d}: [..].includes(v.${c[2]}) has '${val}' not in [${fld.options.join(' | ')}]`);
    }
  }
}
// Select values are strings, so numeric options compare equal to their quoted form.
const real = bad.filter(x => !/includes\(v\.gg\) has '"[1-5]"'/.test(x));
if (real.length) { console.error(real.join('\n')); process.exit(1); }
console.log(`oracle field check: PASS — every rule value matches an option the form can produce`);
