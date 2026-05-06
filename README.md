# 🎯 AI Cover Letter Generator

A professional, full-featured application that uses AI to generate personalized cover letters. Features mock AI simulation, real API integration, and advanced PDF parsing for resume uploads.

## ✨ Features

### Level 1: Foundation
- 📝 **Professional Form**: Candidate name, job role, company, and key skills
- 🎭 **Mock AI**: Instant template-based cover letters
- 📋 **Copy to Clipboard**: One-click clipboard functionality
- 🎨 **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### Level 2: Real AI Integration
- 🤖 **Gemini/OpenAI Support**: Connect to real AI APIs
- 🔒 **Secure API Keys**: Uses .env files (never committed to Git)
- ⏳ **Loading States**: Beautiful "Generating..." animations
- 🚀 **Dynamic Prompts**: Contextual, personalized prompts

### Level 3: SaaS Features
- 📄 **PDF Resume Upload**: Extract text from PDF resumes
- 🧠 **Context-Aware Generation**: AI uses resume content for better personalization
- 📊 **Quality Formatting**: Proper paragraphs and professional structure
- ⬇️ **Download as Text**: Save generated letters locally

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3 (No dependencies)
- **Backend**: Node.js with Express.js
- **AI APIs**: Google Gemini or OpenAI
- **PDF Processing**: pdf-parse
- **File Upload**: express-fileupload
- **Environment**: dotenv for secure configuration

## 📋 Prerequisites

- Node.js (v14+)
- npm or yarn
- API Key from either:
  - [Google Gemini AI Studio](https://ai.google.dev/) (Free)
  - [OpenAI Platform](https://platform.openai.com/api-keys) (Paid)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
cd prodesk_ai_coverletter_generator
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment Variables
Create `.env` file in the backend directory:

```env
# Google Gemini API Key (Free Tier)
GEMINI_API_KEY=your_gemini_api_key_here

# OR OpenAI API Key
# OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# AI Provider: 'gemini' or 'openai'
AI_PROVIDER=gemini
```

### 4. Get Your API Key

#### Option A: Google Gemini (Free)
1. Go to [Google AI Studio](https://ai.google.dev/)
2. Click "Get API Key"
3. Create a new API key
4. Copy and paste into `.env` as `GEMINI_API_KEY`

#### Option B: OpenAI (Paid)
1. Sign up at [OpenAI](https://platform.openai.com/signup)
2. Go to API Keys section
3. Create new secret key
4. Copy and paste into `.env` as `OPENAI_API_KEY`

### 5. Start the Server
```bash
npm start
# or for development with hot reload
npm run dev
```

The application will be available at: **http://localhost:5000**

## 📖 How to Use

### Basic Flow
1. **Fill Form**
   - Enter your full name
   - Enter target company
   - Enter job role
   - List your key skills (comma-separated)

2. **Choose AI Mode**
   - 🎭 Mock AI (instant, template-based)
   - 🤖 Real AI (2-5 seconds, personalized)

3. **Optional: Upload Resume**
   - Click "Upload Resume"
   - Select a PDF file
   - AI will use this for better personalization

4. **Generate**
   - Click "Generate Cover Letter"
   - Watch the generating animation
   - Copy or download your letter

## 🔐 Security Best Practices

### ✅ DO
- ✓ Store API keys in `.env` file
- ✓ Add `.env` to `.gitignore`
- ✓ Use environment variables only from backend
- ✓ Never expose keys in client-side code
- ✓ Rotate keys regularly
- ✓ Use Read-Only API keys when possible

### ❌ DON'T
- ✗ Commit `.env` to Git
- ✗ Hardcode API keys in code
- ✗ Share API keys in chat/forum/emails
- ✗ Use production keys in development
- ✗ Expose keys in frontend code

## 📁 Project Structure

```
prodesk_ai_coverletter_generator/
├── backend/
│   ├── server.js                 # Main server file
│   ├── package.json              # Dependencies
│   ├── .env                       # API Keys (KEEP SECRET!)
│   ├── .gitignore                # Git ignore rules
│   ├── routes/
│   │   └── ai.js                 # API endpoints
│   └── utils/
│       ├── aiService.js          # AI integration
│       └── pdfParser.js          # PDF parsing
│
├── frontend/
│   ├── index.html                # Main HTML
│   ├── styles.css                # Styling
│   └── script.js                 # Frontend logic
│
└── README.md                      # This file
```

## 🔌 API Endpoints

### Generate Cover Letter
```http
POST /api/generate
Content-Type: application/json

{
  "candidateName": "John Smith",
  "jobRole": "Senior Software Engineer",
  "company": "Google",
  "skills": ["Python", "React", "Machine Learning"],
  "useAI": true,
  "resumeText": "Optional resume content"
}
```

**Response:**
```json
{
  "success": true,
  "coverLetter": "Dear Hiring Manager...",
  "generated_at": "2024-01-15T10:30:00Z",
  "ai_provider": "gemini"
}
```

### Upload & Parse Resume
```http
POST /api/parse-resume
Content-Type: multipart/form-data

[PDF file upload]
```

**Response:**
```json
{
  "success": true,
  "resumeText": "John Smith\nSoftware Engineer...",
  "fileName": "resume.pdf",
  "uploadedAt": "2024-01-15T10:30:00Z"
}
```

### Check API Status
```http
GET /api/status
```

**Response:**
```json
{
  "status": "ready",
  "ai_providers": {
    "gemini": "configured",
    "openai": "not configured"
  },
  "current_provider": "gemini",
  "mock_ai_available": true
}
```

## ⚠️ Troubleshooting

### Issue: "GEMINI_API_KEY is not configured"
**Solution:**
1. Check `.env` file exists in `/backend` directory
2. Verify `GEMINI_API_KEY=your_key_here` is not commented
3. Restart the server after updating `.env`

### Issue: "Failed to parse PDF"
**Solution:**
1. Ensure PDF is less than 5MB
2. PDF must be valid and not corrupted
3. Try a different PDF file

### Issue: "CORS Error"
**Solution:**
1. Ensure frontend and backend are on same or configured domains
2. Check CORS middleware in `server.js` is properly configured
3. Clear browser cache

### Issue: "API Key Invalid"
**Solution:**
1. Double-check your API key (no extra spaces)
2. Verify the API key isn't expired
3. Regenerate a new key from the API provider
4. Check you're using the correct API provider

## 🚦 Development

### Start in Development Mode
```bash
cd backend
npm install
npm run dev
```

Then open: **http://localhost:5000**

### Available Scripts
- `npm start` - Production mode
- `npm run dev` - Development with hot reload

## 📦 Deployment

### Deploy to Vercel/Netlify

1. **Build backend** (Optional - runs as-is)
2. **Ensure `.env` is set** in production
3. **Upload to hosting**:
   - Push to GitHub
   - Connect to Vercel/Netlify
   - Set environment variables in dashboard
   - Deploy

### Environment Variables (Production)
Set these in your hosting platform's dashboard:
```
GEMINI_API_KEY=your_production_key
PORT=5000
NODE_ENV=production
AI_PROVIDER=gemini
```

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the MIT License.

## 🎓 Learning Resources

- [Google Gemini API Docs](https://ai.google.dev/tutorials/python_quickstart)
- [OpenAI API Docs](https://platform.openai.com/docs/api-reference)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [PDF.js Documentation](https://mozilla.github.io/pdf.js/)

## 💡 Tips & Tricks

1. **Keyboard Shortcut**: Press `Ctrl+Enter` to generate quickly
2. **Multiple Skills**: Use commas to separate skills
3. **Better Results**: Upload your actual resume for AI mode
4. **Mobile Ready**: Share the link directly - works on phones!
5. **No Ads**: 100% ad-free and fast

## 🐛 Reporting Issues

If you find a bug, please create an issue with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, browser, etc.)

## 📞 Support

For questions and support, check:
- README.md (this file)
- API Endpoints section
- Troubleshooting section

---

**Made with ❤️ for job seekers everywhere**

Happy job hunting! 🚀
