@echo off
title Install Briunka Light — Auto-start on boot
cd /d "%~dp0"

set STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
set SHORTCUT=%STARTUP%\Briunka Light Bio Page.lnk"

powershell -NoProfile -Command ^
  "$s = New-Object -ComObject WScript.Shell; ^
   $l = $s.CreateShortcut('%SHORTCUT%'); ^
   $l.TargetPath = '%~dp0START BIO PAGE.bat'; ^
   $l.WorkingDirectory = '%~dp0'; ^
   $l.WindowStyle = 1; ^
   $l.Description = 'Briunka Light link-in-bio server'; ^
   $l.Save()"

echo.
echo  Done! Briunka Light will start automatically when you log in.
echo  Shortcut added to Windows Startup folder.
echo.
echo  To remove later: delete "Briunka Light Bio Page" from Startup.
echo.
pause