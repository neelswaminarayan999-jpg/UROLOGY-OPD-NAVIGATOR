@echo off
setlocal
cd /d "%~dp0backend"
if not exist .env (
  copy /Y .env.example .env >nul
  echo Created backend\.env. Add your server-side OPENAI_API_KEY, then run this file again.
  pause
  exit /b 0
)
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js 20+ is required.
  pause
  exit /b 1
)
start "Urology Oracle" http://127.0.0.1:8787/
npm start
