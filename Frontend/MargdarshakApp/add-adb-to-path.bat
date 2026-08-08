@echo off
echo.
echo ============================================
echo   Adding ADB to System PATH
echo ============================================
echo.
echo This will add Android SDK Platform Tools to your PATH permanently.
echo You'll be able to use 'adb' command from any terminal.
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

echo.
echo Adding to PATH...
setx PATH "%PATH%;C:\Users\rudra\AppData\Local\Android\Sdk\platform-tools"

echo.
echo ============================================
echo   SUCCESS!
echo ============================================
echo.
echo ADB has been added to your PATH.
echo Please RESTART your terminal/PowerShell for changes to take effect.
echo.
echo After restart, you can use these commands:
echo   - adb devices
echo   - adb logcat
echo   - etc.
echo.
pause
