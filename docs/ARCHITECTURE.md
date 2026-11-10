# Urology Oracle — V16 structure

The app is a static frontend (`frontend/`) served by one Node server (`backend-server.mjs`), which also proxies the AI Lab to free model providers. There is no build step: what is in `frontend/` is what the browser loads.

## Where things live

| Path | What it holds |
|---|---|
| `frontend/index.html` | Page markup only (about 8 KB). It lists every stylesheet and script in load order. |
| `frontend/css/00–05.css` | Styles, in the same order they had inside the old single-file page. |
| `frontend/data/clinical.js` | **All clinical content**: `SOURCES` (source registry), `META`, `DISEASES` (with 2026 addenda merged in), `DRUGS`, `TRIALS`, `PROTOCOLS_2026`, `PROCEDURES`. |
| `frontend/book-figures.json` | The 27 textbook figures, loaded after the page is usable. |
| `frontend/app/00–07` | Core app: views, Oracle form and rules, calculators, book lab, AI Lab, deep-reasoning layer, workstation. |
| `frontend/app/10–13` | UI fixes, OPD suite, core hardening, home navigation and tiles. |
| `frontend/app/20-engines.js` | Decision engines: prostate, oncology pathways, urgent urology, stone, stricture, BPH, scores. |
| `frontend/app/30-operative-atlas.js` | Operative atlas (all procedure groups and the launcher). |
| `frontend/app/40-opd-workflow.js` | OPD workflow and light/dark theme. |
| `frontend/app/50-campbell13.js` | Campbell 13e chapter summaries (original text, no reproduction). |

The old `frontend/v14*.js` / `v15*.js` files are no longer loaded. They can be deleted from the repo at any time.

## Editing clinical content

Each disease section in `data/clinical.js` looks like this:

```js
{title:"3. TNM staging & risk",src:["EAU-PCa","NCCN","TNM9"],verified:"2026-11-10",items:[
  ["Heading","Text shown on the card"],
]}
```

- `src` lists keys from `SOURCES` at the top of the file. Add a new source there first.
- `verified` is the date the section was last checked against those sources. Update it whenever you re-check the section.
- The page shows both under every section ("Source: … — reviewed 10 Nov 2026").
- `npm test` fails if a section has no source, uses an unknown source key, or has no review date. It warns when the oldest review is more than 180 days old.

## One pathway per condition

Stone disease, BPH / male LUTS and urethral stricture each have one decision engine (`20-engines.js`). Choosing them in the Clinical Oracle opens that engine. The older parallel rule sets for these conditions are no longer used.

## Tests (`npm test`, also run by GitHub Actions on every push)

- `smoke.mjs`: server, every module is listed in `index.html` and served, figures, no polling timers.
- `ui-regression.test.mjs`, `provider-*.test.mjs`: UI contract and AI provider routing.
- `clinical-eval.test.mjs`: EAU 2026 prostate risk groups, EAU NMIBC four-group risk, key content facts, source coverage.
- `oracle-fields.test.mjs`: every Oracle safety rule tests a value the form can actually produce.
- `eval/run-ai-eval.mjs` (manual, uses model quota): 12 synthetic cases against the live AI.
