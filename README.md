# Urology Oracle V13.7 — offline core + multi-provider AI failover

This release preserves the large clinical Oracle and the V13 offline/PWA architecture while replacing the single-provider AI dependency with ordered multi-provider failover. The clinical Oracle/UI are otherwise preserved.

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
- `GROQ_API_KEY`, `GROQ_MODEL`
- `GEMINI_API_KEY`, `GEMINI_MODEL`
- `CEREBRAS_API_KEY`, `CEREBRAS_MODEL`
- `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`

Keys remain server-side only; do not put them in frontend code.

## Offline behaviour
- `sw.js` caches the core Oracle assets and excludes `/api/` from caching.
- Gemini remains unavailable offline by design.
- Cache version remains `urology-oracle-v13.6-core` because the clinical frontend is intentionally unchanged in this provider-only release.

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
