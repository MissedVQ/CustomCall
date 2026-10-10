@echo off
chcp 65001 >nul
title CustomCall installer
cd /d "%~dp0"
echo ============================================
echo   CustomCall - Vencord plugin installer
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js not found.
    echo Install it from https://nodejs.org (LTS version), then run this file again.
    pause
    exit /b 1
)

where git >nul 2>nul
if errorlevel 1 (
    echo [ERROR] git not found.
    echo Install it from https://git-scm.com, then run this file again.
    pause
    exit /b 1
)

echo [1/5] Enabling pnpm...
call corepack enable >nul 2>nul

if not exist "%USERPROFILE%\Vencord" (
    echo [2/5] Cloning Vencord...
    git clone https://github.com/Vencord/Vencord "%USERPROFILE%\Vencord"
) else (
    echo [2/5] Vencord folder already exists, skipping clone.
)

echo [3/5] Copying CustomCall into Vencord...
xcopy /E /I /Y "%~dp0." "%USERPROFILE%\Vencord\src\userplugins\CustomCall" >nul

cd /d "%USERPROFILE%\Vencord"

echo [4/5] Installing dependencies and building...
call pnpm install
call pnpm build

echo [5/5] Injecting into Discord...
echo (in the menu press Enter on "Stable")
call pnpm inject

echo.
echo ============================================
echo   Done! Fully restart Discord (also from tray)
echo   and enable CustomCall in Vencord settings.
echo ============================================
pause
