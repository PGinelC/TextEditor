@echo off

set "SCRIPT_DIR=%~dp0"

START /B "" "%SCRIPT_DIR%\easyread.exe" "%~1"