@echo off
title Briunka Light — Public Tunnel
cd /d "%~dp0"

echo.
echo  Starting local server + public tunnel...
echo.

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8847 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1

start "Briunka Server" cmd /k "python server.py"
timeout /t 3 /nobreak >nul

set CF=%LOCALAPPDATA%\cloudflared\cloudflared.exe
if not exist "%CF%" (
    echo Downloading cloudflared...
    mkdir "%LOCALAPPDATA%\cloudflared" 2>nul
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe' -OutFile '%CF%'"
)

echo.
echo  Tunnel starting — copy the https://....trycloudflare.com URL below
echo  Keep this window open while sharing your link
echo.

"%CF%" tunnel --url http://localhost:8847
pause