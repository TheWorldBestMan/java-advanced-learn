@echo off
title Java Learning Site - LAN access
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install Node.js and try again.
  pause
  exit /b 1
)
echo LAN access is enabled. Use this only on a trusted network.
echo The server will print phone addresses and the code required to run Java.
echo Keep this window open while using the site.
node "%~dp0server.js" --lan
pause
