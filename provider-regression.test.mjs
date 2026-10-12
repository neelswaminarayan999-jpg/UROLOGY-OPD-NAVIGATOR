import assert from 'node:assert/strict';
import fs from 'node:fs';

const s = fs.readFileSync(new URL('./backend-server.mjs', import.meta.url), 'utf8');

assert.ok(s.includes("OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'thinkingmachines/inkling:free'"));
assert.ok(s.includes("[400, 404, 408, 429, 502, 503, 504].includes(e.status)"));
assert.ok(s.includes('OPENROUTER_FALLBACK_MODELS'));
assert.ok(s.includes('if (!hasImageParts)'));
assert.ok(s.includes("response_format: { type: 'json_object' }"));
assert.ok(s.includes('pathway_link.requires_clinician_confirmation'));
assert.ok(s.includes("provider: 'Multi-provider fallback'"));
assert.ok(s.includes("if (GROQ_API_KEY)"));
assert.ok(s.includes("if (CEREBRAS_API_KEY && !image)"));
assert.ok(s.includes("if (API_KEY)"));
assert.ok(s.includes("All configured AI providers failed."));
assert.ok(s.includes("fallback_count: attempts.length"));

console.log('provider regression: PASS — configured multi-provider fallback and Oracle JSON contract');
