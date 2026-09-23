# Urology Oracle V13.9 — strict AI fallback + expanded clinical protocols

This release preserves the large clinical Oracle and the V13 offline/PWA architecture while replacing the single-provider AI dependency with ordered multi-provider failover. The clinical Oracle/UI are preserved and extended additively. V13.9 adds strict provider-response validation, automatic fallback for malformed/safety-classification outputs, an expanded protocol content pack, and visual pathway diagrams without replacing the existing clinical corpus.

## Architecture
- Clinical Oracle core: offline-capable PWA on every device after first successful online load.
- Investigation AI: ONLINE ONLY through the server-side AI endpoint with ordered failover: Groq → Gemini → Cerebras → OpenRouter.
- Offline AI / MedGemma: NOT INCLUDED.
- API credentials: server-side only.
- AI output: advisory; clinician confirmation is required before Oracle handoff.

## Gemini behaviour restored from V12.1
- Primary model: `gemini-3.8-flash` (unless `GEMINI_MODEL` is explicitly changed server-side).
- One Gemini API request per clinician submission.
- `thinkingLevel: medium`.
- `maxOutputTokens: 3500`.
- No automatic model fallback.
- No multi-attempt retry cascade.
- A transient 503 is reported as temporary Gemini unavailability rather than consuming multiple free-tier requests.
- A quota/rate-limit response is surfaced without repeated retry attempts.

## Provider environment variables
- `GROQ_API_KEY`, `GROQ_MODEL`, `GROQ_VISION_MODEL`
- `GEMINI_API_KEY`, `GEMINI_MODEL`
- `CEREBRAS_API_KEY`, `CEREBRAS_MODEL`
- `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` (default: `openrouter/free`)

Keys remain server-side only; do not put them in frontend code.

## Offline behaviour
- `sw.js` caches the core Oracle assets and excludes `/api/` from caching.
- Gemini remains unavailable offline by design.
- Cache version is `urology-oracle-v13.9-core` and includes the additive V13.9 content pack.

## Clinical safety architecture retained
- TNM/classification validation gates.
- Deterministic treatment-gate architecture.
- Explicit cisplatin component collection / Galsky screen support.
- Missing-data and contradiction states.
- Decision trace and clinical provenance metadata.
- Operative and reconstructive atlas preserved.
- Investigation-specific online AI with clinician confirmation before Oracle handoff.

## Test
```bash
node --check backend-server.mjs
node --check frontend/v13-clinical-engine.js
npm test
```

## Clinical status
This remains a clinical decision-support/teaching tool, not an autonomous prescribing system. Verify doses, contraindications, regimen schedules and institutional protocols against current authoritative sources before patient care.


### Provider notes
- Groq text requests use `openai/gpt-oss-120b`; image requests automatically use `GROQ_VISION_MODEL` (default `qwen/qwen3.8-27b`).
- OpenRouter defaults to `openrouter/free`, which dynamically selects an available free model.
- Cerebras is retained in the fallback order but may return HTTP 402 when the account has no active inference credit; the router then continues to OpenRouter.


## V13.9 changes
- Provider responses are now schema-validated before being accepted. A safety-classification/refusal string such as `User Safety: unsafe` is treated as a provider failure and the next configured provider is attempted.
- Required Oracle schema is enforced: `technical_adequacy`, `observations`, `interpretation`, `differential`, `urgent_flags`, `missing_data`, `uncertainty`, `suggested_disease`, `suggested_oracle_values`, `pathway_link`, `teaching`.
- `pathway_link.requires_clinician_confirmation` must be `true`.
- Added expanded treatment-protocol checkpoints for prostate, bladder, UTUC, RCC, testis, penis, urethral cancer, adrenal disease, urethral stricture, male LUTS and stone disease.
- Added visual pathway diagrams for stone emergencies, urethral stricture phenotypes, bladder cancer decision layers and renal mass management.
- Existing operative atlas, clinical engine, calculators, drug library and disease encyclopaedia are retained; the new material is additive.
- Current EAU 2026 guidance should still be checked live before patient care; the 2026 EAU urethral-stricture and urolithiasis guidelines include substantive updates, and the RCC guideline also has 2026 updates.

## V13.9 regression tests
```bash
node --check backend-server.mjs
node --check frontend/v13-clinical-engine.js
node --check frontend/v13.9-content-pack.js
npm test
```
