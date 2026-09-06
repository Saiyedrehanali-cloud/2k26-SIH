@echo off
title IP-SAKTI Sahayak Launcher
echo ========================================================
echo   Starting IP-SAKTI Sahayak (Ministry of Ayush)
echo ========================================================
echo.

echo Starting Python Backend (FastAPI on Port 8000)...
start "IP-SAKTI Backend" cmd /k "python -m uvicorn backend.main:app --reload --port 8000"

echo Starting Next.js Frontend (Port 3000)...
start "IP-SAKTI Frontend" cmd /k "npm --prefix frontend run start"

timeout /t 3 >nul
echo Opening application in browser...
start http://localhost:3000

echo.
echo ========================================================
echo   Both servers are running!
echo   Frontend: http://localhost:3000
echo   Backend API: http://localhost:8000
echo ========================================================
