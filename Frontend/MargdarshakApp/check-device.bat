@echo off
echo.
echo ============================================
echo   Checking for Connected Android Devices
echo ============================================
echo.

set ADB_PATH=C:\Users\rudra\AppData\Local\Android\Sdk\platform-tools

if not exist "%ADB_PATH%\adb.exe" (
    echo ERROR: ADB not found at %ADB_PATH%
    echo Please install Android SDK Platform Tools
    pause
    exit /b 1
)

"%ADB_PATH%\adb.exe" devices

echo.
echo ============================================
echo   Instructions:
echo ============================================
echo 1. Enable USB Debugging on your phone
echo 2. Connect phone via USB cable
echo 3. Accept "Allow USB debugging" prompt
echo 4. Run this script again
echo.
pause
