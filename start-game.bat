@echo off
echo ========================================
echo   🐀 ESCAPE THE RAT RACE
echo ========================================
echo.
echo Starting servers...
echo.

echo Starting Multiplayer Server on port 3001...
start "Rat Race Server" cmd /k "cd /d %~dp0server && npm start"

timeout /t 2 /nobreak >nul

echo Starting Game Client on port 3000...
start "Rat Race Client" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ========================================
echo   SERVERS STARTED!
echo ========================================
echo.
echo   Game: http://localhost:3000
echo   Multiplayer Server: ws://localhost:3001
echo.
echo   Close the command windows to stop.
echo ========================================
pause
