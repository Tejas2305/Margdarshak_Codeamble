@echo off
echo.
echo ============================================
echo   Starting Margdarshak on USB Device
echo ============================================
echo.

set ADB_PATH=C:\Users\rudra\AppData\Local\Android\Sdk\platform-tools
set PATH=%ADB_PATH%;%PATH%

echo Checking for connected devices...
adb devices
echo.

if errorlevel 1 (
    echo ERROR: Could not connect to ADB
    pause
    exit /b 1
)

echo Starting React Native development server...
echo.
call npm start

pause
