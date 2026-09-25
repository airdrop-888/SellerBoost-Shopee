@echo off
REM SellerBoost Launcher - Runs silently without console window
REM This launches run_silent.vbs which starts the app in background

start "" /b wscript.exe "%~dp0run_silent.vbs"

REM Exit immediately - the VBS handles everything silently
exit