@echo off
REM 🎯 SETUP.bat - Automated Setup Script for Windows Users

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   🎉 AI COVER LETTER GENERATOR - AUTOMATED SETUP 🎉            ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo 📥 Download from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%
echo.

REM Navigate to backend
cd backend || exit /b 1

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully!
echo.
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    ✨ SETUP COMPLETE! ✨                       ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📋 Next Steps:
echo.
echo 1️⃣  GET API KEY (Optional for Real AI):
echo    🌐 Visit: https://ai.google.dev/
echo    📋 Copy your key
echo    ✏️  Edit: backend\.env
echo    🔑 Add: GEMINI_API_KEY=your_key_here
echo.
echo 2️⃣  START SERVER:
echo    ▶️  Run: npm start
echo    ✅ See: 🚀 Running on http://localhost:5000
echo.
echo 3️⃣  OPEN IN BROWSER:
echo    🌐 Visit: http://localhost:5000
echo    ✨ Start generating cover letters!
echo.
echo 💡 TEST OPTIONS:
echo    • 🎭 Mock AI (No API key needed, instant)
echo    • 🤖 Real AI (With API key, 2-5 seconds)
echo.
echo 📚 DOCUMENTATION:
echo    • START_HERE.md - Visual quick start
echo    • README.md - Full documentation
echo    • QUICK_START.md - 5-minute setup
echo.
echo ═════════════════════════════════════════════════════════════════
echo Happy generating! 🎉
echo ═════════════════════════════════════════════════════════════════
echo.
pause
