@echo off
title Java Advanced - Learning Site
cd /d "%~dp0"

echo ==========================================
echo   Java Advanced - Data Structures and Algorithms
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 goto nonode

echo Starting the local server...
echo.
echo   * Browser opens automatically in 2 seconds.
echo   * To RUN code in the browser, JDK (java / javac) must be installed.
echo.
echo   Keep THIS window open while you use the site.
echo.

start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:8766/"
node "%~dp0server.js"

echo.
echo [INFO] The server has stopped (see message above).
echo        Press any key to close this window.
pause >nul
goto end

:nonode
echo [INFO] Node.js not found, opening index.html directly.
echo        In direct-file mode, running code is unavailable.
echo        Install Node.js from nodejs.org and run this file again for full features.
echo.
start "" "index.html"
echo Press any key to close this window.
pause >nul

:end
