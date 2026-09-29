import assert from 'node:assert/strict';
import fs from 'node:fs';

const s = fs.readFileSync(new URL('./backend-server.mjs', import.meta.url), 'utf8');

assert.ok(s.includes("OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'qwen/qwen3.8-27b'"));
assert.ok(s.includes('OPENROUTER_FALLBACK_MODELS'));
assert.ok(s.includes('if (!hasImageParts)'));
assert.ok(s.includes("response_format: { type: 'json_object' }"));
assert.ok(s.includes('pathway_link.requires_clinician_confirmation'));
assert.ok(s.includes("provider: 'OpenRouter'"));

console.log('provider regression: PASS — OpenRouter/Qwen free-vision pathway');
