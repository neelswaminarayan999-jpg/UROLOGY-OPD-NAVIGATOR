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

## Offline mode (V16.6)

- `frontend/sw.js` is the offline worker. It saves all 27 app files on the first visit. After that, the app opens from the phone's copy instantly, even with no signal or while the free Render server is asleep. The AI Lab and `/health` always go to the server. Book figures are saved the first time they are opened.
- `frontend/app/00-offline.js` registers the worker, shows a bar when the phone is offline, and shows "A new version of the app is ready — Update now" when a new release has been downloaded.
- **`sw.js` is generated.** After changing any file in `frontend/`, run `node tools/build-sw.mjs` and upload the new `frontend/sw.js` with your change. `offline.test.mjs` fails (and Render won't deploy) if you forget, so phones never keep an outdated copy.

## MCQ banks (V16.8–V16.9)

- `frontend/data/mcq-bank.js`: 43 starter questions written from the guideline sections. They are part of the app and change only with an app upload.
- `frontend/data/mcq-shared.json`: the **weekly shared bank**. Every Monday at 07:47 IST, `.github/workflows/weekly-mcqs.yml` runs `tools/weekly-mcqs.mjs`, which asks the live server's `/api/mcq` for 50 new questions on the thinnest topics. The server checks each question (4 distinct options, one valid answer, a cited section that exists). The job then opens a pull request, `Weekly MCQs <date>`, listing every question with its answer. **Merging it publishes the questions to every phone**, without an app update. To drop a question, delete its line in the file in that pull request before merging.
- While a weekly pull request is open, the next week's run is skipped, so merge or close each one.
- Phones save the shared file for offline use and refresh it in the background.
- The workflow file must exist on `main` (GitHub runs schedules only from the default branch) as well as on `v13.2-final`.
