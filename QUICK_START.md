# 🚀 QUICK START GUIDE

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies (1 minute)
```bash
cd backend
npm install
```

### Step 2: Get Free API Key (2 minutes)
**EASIEST: Google Gemini (Completely Free)**
1. Go to: https://ai.google.dev/
2. Click "Get API Key"
3. Click "Create API Key in new project"
4. Copy your key

**OR: OpenAI (Paid, $5-20/month)**
1. Go to: https://platform.openai.com/api-keys
2. Create new secret key
3. Copy your key

### Step 3: Add API Key (1 minute)
Open `backend/.env` and replace:
```
GEMINI_API_KEY=paste_your_key_here
```

### Step 4: Start Server (1 minute)
```bash
npm start
```

### Step 5: Open App (instant)
Go to: http://localhost:5000

---

## 🎮 First Test

1. **Mock AI (No API Key Needed)**
   - Fill the form
   - Select "🎭 Mock AI (Fast)"
   - Click "Generate" - should work instantly

2. **Real AI (With API Key)**
   - Make sure API key is in `.env`
   - Select "🤖 Real AI (Better)"
   - Click "Generate" - wait 2-5 seconds

3. **With Resume (Optional)**
   - Click "Upload Resume" (PDF only)
   - Select a PDF
   - Generate again - AI will use resume content

---

## ❌ Common Issues

**"Cannot find module 'express'"**
→ Run: `npm install`

**"GEMINI_API_KEY is not configured"**
→ Check `.env` file has your key

**"Port 5000 already in use"**
→ Change PORT in `.env` or kill process on port 5000

**"CORS Error"**
→ Restart server and clear browser cache

---

## 📁 File Structure
```
backend/
  ├── server.js          ← Start here
  ├── .env               ← Add API key here!
  ├── routes/ai.js       ← API endpoints
  └── utils/             ← Helper functions
frontend/
  ├── index.html         ← Served at localhost:5000
  ├── styles.css         ← Beautiful design
  └── script.js          ← User interactions
```

---

## 🔑 API Key Comparison

| Feature | Gemini (Google) | OpenAI |
|---------|---|---|
| Cost | Free | ~$0.002 per request |
| Speed | Fast (2-3s) | Fast (2-3s) |
| Quality | Excellent | Excellent |
| Limit | 15 requests/min | Based on usage |
| Setup | 2 clicks | Create account |

**Recommendation**: Start with Gemini (free), switch to OpenAI if needed.

---

## 🆘 Need Help?

1. Check `README.md` in root
2. See troubleshooting section
3. Check browser console: F12 → Console tab
4. Check terminal for server errors

---

**You're all set! 🎉**
