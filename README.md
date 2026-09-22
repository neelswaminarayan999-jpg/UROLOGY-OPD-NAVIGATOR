# Urology Oracle V12 — GitHub + Online AI deployment package

This repository package preserves the V12 offline Clinical Oracle and adds a clean Online AI route without exposing endpoint/model/API-key controls in the clinical UI.

## Recommended live setup
Use GitHub as the source repository and Render as the full-stack web host. Render serves `frontend/index.html` and the `/api/urology-ai` backend from the same origin, so the online AI requires no CORS or browser endpoint configuration.

1. Create a GitHub repository and upload the contents of this folder.
2. In Render, choose **New → Blueprint** and point it to the GitHub repository. Render will read `render.yaml`.
3. In Render, set `GEMINI_API_KEY` as a secret environment variable.
4. Deploy. Open the generated Render URL; the Oracle and `/api/urology-ai` are on the same origin.
5. Test `https://YOUR-RENDER-URL/health` and confirm `{ "ok": true }`.

## Optional GitHub Pages frontend
A GitHub Pages workflow is included at `.github/workflows/pages.yml`. Pages hosts only the static frontend. If you use it, edit `frontend/oracle-config.js` once after the Render backend exists:

`window.UROLOGY_ORACLE_AI_BASE_URL = "https://YOUR-RENDER-SERVICE.onrender.com";`

Then commit the change. The clinical UI still shows no endpoint/model/API-key controls; this file is deployment configuration, not a clinical setting.

## Local test
From the repository root:

`cd backend`

Copy `.env.example` to `.env`, set `GEMINI_API_KEY`, then run:

`npm start`

The server will serve the frontend at `http://127.0.0.1:8787/`.

## Security / clinical use
Never commit `.env` or an API key. Keep the Gemini credential only in the backend host's secret store. Online AI output is advisory and must be independently checked against the original investigation and clinical context. The deterministic Clinical Oracle is kept separate from AI output.


## Gemini API
Create a Gemini API key in Google AI Studio and set it only as the Render environment variable `GEMINI_API_KEY`. Do not commit it to GitHub or put it in the browser. The backend uses Gemini multimodal image input and structured JSON output. Current default model: `gemini-3.8-flash`.
