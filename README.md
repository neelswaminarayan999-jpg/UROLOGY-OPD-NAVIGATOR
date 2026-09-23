# Urology Oracle V13.3 FINAL — offline core + resilient online AI

This release preserves the large V12.1/V13 clinical frontend and adds the V13 deterministic safety/provenance architecture without replacing the clinical corpus with a smaller rewrite.

## Locked architecture
- Clinical Oracle core: offline-capable PWA.
- Investigation AI: ONLINE ONLY through the server-side Gemini endpoint.
- Offline AI / MedGemma: **NOT INCLUDED**.
- API credentials: server-side only.
- AI output: advisory; clinician confirmation is required before Oracle handoff.

## Final release additions
- TNM/classification validation gates.
- Deterministic treatment-gate architecture.
- Explicit cisplatin component collection / Galsky screen support.
- Drug safety registry structure.
- Missing-data and contradiction states.
- Decision trace and clinical provenance metadata.
- Versioned 2026 EAU rule-family metadata.
- Operative and reconstructive atlas preserved.
- Investigation-specific online AI architecture.
- PWA offline core with API paths excluded from caching.
- PWA icon and manifest hardening.
- Regression and HTTP smoke tests.
- V13.3 state bridge so the safety engine reads the live Oracle state correctly.

## Important clinical status
This is a clinical decision-support/teaching tool, not an autonomous prescribing system. Before patient care, verify drug doses, regimen schedules, contraindications and institutional protocols against the current guideline/product information. The Oracle should not override specialist judgement.

## Run
```bash
node backend-server.mjs
```

## Test
```bash
node --check backend-server.mjs
node --check frontend/v13-clinical-engine.js
node tests/v13-clinical-engine.test.mjs
node tests/smoke.mjs
```

## Production configuration
Set `GEMINI_API_KEY` server-side. Do not place a Gemini key in frontend files. `GEMINI_MODEL` may be set server-side; otherwise the configured default is used by the backend.

## Release note
## Online Gemini resilience

- Gemini investigation requests remain online-only.
- The backend retries transient Gemini `408`, `429`, `500`, `502`, `503`, and `504` responses with exponential backoff and jitter.
- Default policy: up to 3 retries (4 total attempts), with a 1–8 second capped backoff window; `Retry-After` is honored when supplied.
- No silent model fallback is performed. A persistent failure is surfaced to the clinician.

V13.3 is the final engineering package in this revision cycle. Future clinical-content changes should be versioned as a new rules release rather than silently modifying this release.
## V13.5 Gemini resilience

The online investigation AI keeps `gemini-3.8-flash` as the primary model. For transient capacity failures (HTTP 502/503/504) only, the backend retries the primary and then transparently attempts configured fallback models in order: `gemini-3.7-flash`, then `gemini-3.6-flash`. Authentication, permission, invalid-request, and quota errors are not hidden by fallback. The response reports the model actually used and whether fallback was used. Gemini 3.6 uses its supported `thinkingBudget` parameter rather than Gemini 3's `thinkingLevel`.

The deterministic offline Oracle remains unchanged and Gemini remains online-only.


## V13.5 correction

The fallback chain is now `gemini-3.7-flash` then `gemini-3.6-flash`. Gemini 2.5 Flash is not used as a default fallback because availability can be restricted for new users.
