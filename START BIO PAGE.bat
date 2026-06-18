@echo off
title Briunka Light - Link in Bio
cd /d "%~dp0"

echo.
echo   BRIUNKA LIGHT - Link in Bio
echo   http://localhost:8847
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8847 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1

pip install -q -r requirements.txt 2>nul
if not exist .env copy .env.example .env

start http://localhost:8847
python server.py
pause