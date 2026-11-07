@echo off
setlocal
chcp 65001 >nul
title CustomCall installer
cd /d "%~dp0"
echo ============================================
echo   CustomCall - Vencord plugin installer
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 goto NO_NODE
where git >nul 2>nul
if errorlevel 1 goto NO_GIT
if not exist "%~dp0index.tsx" goto NO_PLUGIN

goto START

:NO_NODE
echo [ERROR] Node.js not found.
echo Install it from https://nodejs.org ^(LTS version^), then run this file again.
pause
exit /b 1

:NO_GIT
echo [ERROR] git not found.
echo Install it from https://git-scm.com, then run this file again.
pause
exit /b 1

:NO_PLUGIN
echo [ERROR] index.tsx not found next to this .bat file.
echo Put index.tsx in the same folder as this installer and run again.
pause
exit /b 1

:START
echo [1/5] Enabling pnpm...
call corepack enable >nul 2>nul
where pnpm >nul 2>nul
if errorlevel 1 goto NO_PNPM

if exist "%USERPROFILE%\Vencord" goto SKIPCLONE
echo [2/5] Cloning Vencord...
git clone https://github.com/Vencord/Vencord "%USERPROFILE%\Vencord"
if errorlevel 1 goto GITFAIL
goto CLONED

:SKIPCLONE
echo [2/5] Vencord folder already exists, skipping clone.

:CLONED
echo [3/5] Copying CustomCall into Vencord...
if not exist "%USERPROFILE%\Vencord\src\userplugins" mkdir "%USERPROFILE%\Vencord\src\userplugins"
xcopy /E /I /Y "%~dp0." "%USERPROFILE%\Vencord\src\userplugins\CustomCall" >nul
if errorlevel 1 goto COPYFAIL

rem --- clean up installer files that should not end up inside the plugin ---
del /q "%USERPROFILE%\Vencord\src\userplugins\CustomCall\*.bat" >nul 2>nul

if not exist "%USERPROFILE%\Vencord\src\userplugins\CustomCall\index.tsx" goto COPYFAIL

cd /d "%USERPROFILE%\Vencord"

echo [4/5] Installing dependencies and building...
call pnpm install
if errorlevel 1 goto BUILDFAIL
call pnpm build
if errorlevel 1 goto BUILDFAIL

echo [5/5] Injecting into Discord...
echo ^(in the menu press Enter on "Stable"^)
call pnpm inject
if errorlevel 1 goto INJECTFAIL

echo.
echo ============================================
echo   Done^^! Fully restart Discord ^(also from
echo   tray^) and enable CustomCall in Vencord
echo   settings.
echo ============================================
pause
exit /b 0

:NO_PNPM
echo [ERROR] pnpm is not available after "corepack enable".
echo Make sure Node.js LTS is installed ^(it ships with corepack^):
echo   https://nodejs.org
pause
exit /b 1

:GITFAIL
echo [ERROR] Failed to clone Vencord. Check your internet connection.
pause
exit /b 1

:COPYFAIL
echo [ERROR] Failed to copy plugin (or index.tsx missing at destination).
echo Run this file as Administrator ^(right click - Run as administrator^),
echo or check that the folder is writable.
pause
exit /b 1

:BUILDFAIL
echo [ERROR] Build failed.
echo If you see "Access denied", run this file as Administrator,
echo or delete the folder "%USERPROFILE%\Vencord" and run again.
pause
exit /b 1

:INJECTFAIL
echo [ERROR] Inject failed - usually a network problem ^(GitHub unreachable^).
echo.
echo Try ONE of these:
echo   1. Retry: open a terminal in "%USERPROFILE%\Vencord" and run: pnpm inject
echo   2. Download VencordInstallerCli.exe manually and run it:
echo      https://github.com/Vencord/Installer/releases/latest/download/VencordInstallerCli.exe
echo   3. PowerShell ^(one line^):
echo      iwr "https://raw.githubusercontent.com/Vencord/Installer/main/install.ps1" -UseBasicParsing ^| iex
echo.
echo The plugin itself IS built already - only the inject step failed.
pause
exit /b 1
