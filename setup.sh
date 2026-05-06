#!/bin/bash
# 🎯 SETUP.sh - Automated Setup Script for Linux/Mac Users

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   🎉 AI COVER LETTER GENERATOR - AUTOMATED SETUP 🎉            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "📥 Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Navigate to backend
cd backend || exit 1

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    ✨ SETUP COMPLETE! ✨                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1️⃣  GET API KEY (Optional for Real AI):"
echo "   🌐 Visit: https://ai.google.dev/"
echo "   📋 Copy your key"
echo "   ✏️  Edit: backend/.env"
echo "   🔑 Add: GEMINI_API_KEY=your_key_here"
echo ""
echo "2️⃣  START SERVER:"
echo "   ▶️  Run: npm start"
echo "   ✅ See: 🚀 Running on http://localhost:5000"
echo ""
echo "3️⃣  OPEN IN BROWSER:"
echo "   🌐 Visit: http://localhost:5000"
echo "   ✨ Start generating cover letters!"
echo ""
echo "💡 TEST OPTIONS:"
echo "   • 🎭 Mock AI (No API key needed, instant)"
echo "   • 🤖 Real AI (With API key, 2-5 seconds)"
echo ""
echo "📚 DOCUMENTATION:"
echo "   • START_HERE.md - Visual quick start"
echo "   • README.md - Full documentation"
echo "   • QUICK_START.md - 5-minute setup"
echo ""
echo "═════════════════════════════════════════════════════════════════"
echo "Happy generating! 🎉"
echo "═════════════════════════════════════════════════════════════════"
