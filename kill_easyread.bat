@echo off
:: Check for admin rights and relaunch if needed
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if %errorlevel% neq 0 (
    echo Requesting administrative privileges...
    goto UACPrompt
) else (
    goto GotAdmin
)

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    exit /B

:GotAdmin
    if exist "%temp%\getadmin.vbs" del "%temp%\getadmin.vbs"
    pushd "%CD%"
    CD /D "%~dp0"

:: Main script starts here
echo Running with administrative privileges...
echo.
echo Searching for EasyRead processes...
tasklist /FI "IMAGENAME eq easyread.exe" /FO TABLE

echo.
echo Killing all EasyRead processes...
taskkill /F /IM easyread.exe

echo.
echo Searching for Node.js and Electron processes that might be related...
tasklist /FI "IMAGENAME eq electron.exe" /FO TABLE
tasklist /FI "IMAGENAME eq node.exe" /FO TABLE

echo.
set /p KILL_ALL="Do you want to kill all Electron and Node processes too? (y/n): "
if /i "%KILL_ALL%"=="y" (
    taskkill /F /IM electron.exe
    taskkill /F /IM node.exe
    echo All Electron and Node processes terminated.
) else (
    echo Electron and Node processes not terminated.
)

echo.
echo Process cleanup complete!
pause