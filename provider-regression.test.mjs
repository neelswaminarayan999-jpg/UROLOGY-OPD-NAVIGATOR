import assert from 'node:assert/strict';
import fs from 'node:fs';
const s = fs.readFileSync(new URL('../backend-server.mjs', import.meta.url), 'utf8');
assert.match(s, /GROQ_VISION_MODEL.*qwen\/qwen3\.8-27b/);
assert.match(s, /OPENROUTER_MODEL.*openrouter\/free/);
assert.match(s, /if \(!hasImageParts\)/);
assert.match(s, /messages\[0\]\.content/);
console.log('provider regression: PASS');
