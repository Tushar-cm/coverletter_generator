# 🏗️ SYSTEM ARCHITECTURE & CONFIGURATION

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER BROWSER                               │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (HTML/CSS/JavaScript)                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  📝 Form (Name, Company, Role, Skills)                  │   │
│  │  📄 PDF Resume Upload                                   │   │
│  │  🎭 Mock AI / 🤖 Real AI Toggle                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                    HTTP POST                                   │
│                          ▼                                      │
└─────────────────────────────────────────────────────────────────┘
                            │
                 ┌──────────┴──────────┐
                 │                     │
          POST /api/generate     POST /api/parse-resume
                 │                     │
                 ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│               BACKEND SERVER (Node.js/Express)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Route Handler: /api/generate                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 1. Validate form data                                 │    │
│  │ 2. Check useAI flag                                   │    │
│  │ 3. Routes to appropriate service:                     │    │
│  │    - Mock AI ──→ getMockCoverLetter()                │    │
│  │    - Real AI ──→ getGeminiCoverLetter()              │    │
│  │                 or getOpenAICoverLetter()            │    │
│  │ 4. Return cover letter + metadata                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Route Handler: /api/parse-resume                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 1. Receive PDF file                                   │    │
│  │ 2. Validate (type, size)                              │    │
│  │ 3. Extract text using pdf-parse                       │    │
│  │ 4. Return extracted text                              │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  AI Services (utils/aiService.js)                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                                                        │    │
│  │  Mock AI: Returns template with filled values         │    │
│  │  │                                                    │    │
│  │  Gemini: Calls Google Gemini API                      │    │
│  │  │  ├─ Constructs dynamic prompt                      │    │
│  │  │  ├─ Sends to Gemini API                            │    │
│  │  │  └─ Parses response                                │    │
│  │  │                                                    │    │
│  │  OpenAI: Calls OpenAI GPT API                         │    │
│  │     ├─ Constructs dynamic prompt                      │    │
│  │     ├─ Sends to OpenAI API                            │    │
│  │     └─ Parses response                                │    │
│  │                                                        │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Configuration (process.env via .env file)                     │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ • GEMINI_API_KEY=AIz...                              │    │
│  │ • OPENAI_API_KEY=sk-...                              │    │
│  │ • AI_PROVIDER=gemini|openai                           │    │
│  │ • PORT=5000                                           │    │
│  │ • NODE_ENV=development|production                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            │
         ┌──────────────────┴──────────────────┐
         │                                     │
    (Mock AI)                            (Real AI)
    Returns                          Calls External API
    Instantly                        2-5 seconds
         │                                     │
         └──────────────────┬──────────────────┘
                            │
                     HTTP Response
                            │
                            ▼
         ┌──────────────────────────────────────┐
         │  Response JSON:                      │
         │  ├─ success: true                    │
         │  ├─ coverLetter: "Dear Hiring..."    │
         │  ├─ ai_provider: "gemini"            │
         │  └─ generated_at: "2024-01-15..."    │
         └──────────────────────────────────────┘
                            │
                    Display in UI
```

---

## 🔐 Security Layer

```
┌──────────────────────────────────────┐
│       FRONTEND (PUBLIC)               │
│  • HTML (visible)                     │
│  • CSS (visible)                      │
│  • JavaScript (visible)               │
│  • NO API keys here! ✅               │
└──────────────────────────────────────┘
                │
            (Request)
                │
                ▼
┌──────────────────────────────────────┐
│       BACKEND (PRIVATE)               │
│  • Reads .env file                    │
│  • Has API keys in memory             │
│  • Secrets never exposed to client    │
│  • Makes requests to external APIs    │
└──────────────────────────────────────┘
                │
            (Calls)
                │
      ┌─────────┴──────────┐
      │                    │
      ▼                    ▼
┌──────────────────┐ ┌─────────────────────┐
│ Google Gemini    │ │ OpenAI GPT          │
│ API              │ │ API                 │
│ (External)       │ │ (External)          │
└──────────────────┘ └─────────────────────┘
```

---

## 📁 File Organization & Purpose

### Backend Files

#### `server.js` - Main Application
```javascript
- Initializes Express server
- Sets up CORS middleware
- Serves static frontend files
- Routes API requests
- Handles errors
```

#### `routes/ai.js` - API Endpoints
```javascript
POST /api/generate
├─ Validates input data
├─ Calls AI service (mock or real)
└─ Returns cover letter

POST /api/parse-resume
├─ Receives PDF file
├─ Extracts text
└─ Returns extracted text

GET /api/status
├─ Checks configured AI providers
└─ Returns system status
```

#### `utils/aiService.js` - AI Integration
```javascript
getMockCoverLetter()
└─ Returns template with data filled in

getGeminiCoverLetter()
├─ Constructs prompt
├─ Calls Google Gemini API
└─ Returns generated letter

getOpenAICoverLetter()
├─ Constructs prompt
├─ Calls OpenAI API
└─ Returns generated letter
```

#### `utils/pdfParser.js` - PDF Processing
```javascript
extractTextFromPDF()
├─ Receives PDF buffer
├─ Uses pdf-parse library
└─ Returns extracted text
```

### Frontend Files

#### `index.html` - User Interface Structure
```html
<form>
  - Candidate Name input
  - Company Name input
  - Job Role input
  - Skills textarea
  - Resume PDF upload
  - AI Mode selection
  - Generate button

<output>
  - Loading state (spinner)
  - Cover letter display
  - Copy button
  - Download button
  - Regenerate button
```

#### `styles.css` - Styling & Responsive Design
```css
- Color scheme with gradients
- Professional layout
- Mobile responsive breakpoints
- Animations (spinner, fade-in, slide-in)
- Dark/light mode ready
- Print styles
```

#### `script.js` - User Interactions
```javascript
- Form submission handling
- PDF file upload processing
- API calls to backend
- UI state management
- Error handling
- Toast notifications
- Keyboard shortcuts
```

### Configuration Files

#### `.env` - Secret Storage
```bash
# API Keys (KEEP SECRET!)
GEMINI_API_KEY=AIz...
OPENAI_API_KEY=sk-...

# Server config
PORT=5000
NODE_ENV=development
AI_PROVIDER=gemini
```

#### `.gitignore` - Prevent Accidental Commits
```
.env              ← Most important!
node_modules/
*.log
```

#### `package.json` - Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",      ← Web server
    "cors": "^2.8.5",          ← Cross-origin requests
    "dotenv": "^16.0.3",       ← .env file handling
    "axios": "^1.4.0",         ← HTTP client
    "multer": "^1.4.5",        ← File uploads
    "pdf-parse": "^1.1.1",     ← PDF text extraction
    "express-fileupload": "^1.4.0"  ← File handling
  }
}
```

---

## 🔄 Request/Response Cycle

### Example: Generate Cover Letter (Real AI)

**1. Frontend sends request:**
```javascript
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    candidateName: "John Smith",
    jobRole: "Senior Engineer",
    company: "Google",
    skills: ["Python", "React"],
    useAI: true,
    resumeText: "Optional resume content..."
  })
});
```

**2. Backend processes (routes/ai.js):**
```javascript
- Validate: All fields present? ✓
- Check: useAI = true? ✓
- Call: getGeminiCoverLetter() with data
- Gemini API returns generated letter
- Format response: { success, coverLetter, ai_provider }
```

**3. Gemini API call (utils/aiService.js):**
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
Headers: { x-goog-api-key: $GEMINI_API_KEY }
Body: { contents: [{ parts: [{ text: "Write a cover letter for..." }] }] }
```

**4. Response returns to frontend:**
```json
{
  "success": true,
  "coverLetter": "Dear Hiring Manager at Google,\n\nI am John Smith...",
  "ai_provider": "gemini",
  "generated_at": "2024-01-15T10:30:00Z"
}
```

**5. Frontend displays:**
- Remove loading spinner
- Show cover letter in output box
- Enable copy/download buttons
- Show success toast

---

## ⚙️ Configuration Options

### AI Provider Selection

```bash
# Use Gemini (Google) - Recommended
AI_PROVIDER=gemini
GEMINI_API_KEY=AIz...

# Use OpenAI - Alternative
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...

# Both configured - AI_PROVIDER determines which to use
AI_PROVIDER=gemini  # This one will be used
```

### Server Configuration

```bash
# Development (auto-reload, verbose errors)
NODE_ENV=development
PORT=5000

# Production (optimized, minimal errors)
NODE_ENV=production
PORT=5000
```

---

## 📊 Component Relationships

```
┌─ Frontend
│  ├─ index.html (UI structure)
│  ├─ styles.css (styling)
│  └─ script.js (user interactions)
│
├─ Backend
│  ├─ server.js (entry point)
│  │
│  ├─ routes/
│  │  └─ ai.js (endpoints)
│  │
│  └─ utils/
│     ├─ aiService.js (AI logic)
│     └─ pdfParser.js (PDF processing)
│
└─ Configuration
   ├─ .env (secrets)
   ├─ .gitignore (security)
   └─ package.json (dependencies)
```

---

## 🔌 External Dependencies

```
Express.js
├─ Web server framework
├─ Handles HTTP requests
└─ Serves static files

CORS
├─ Cross-Origin Resource Sharing
├─ Allows frontend to call backend
└─ Security middleware

dotenv
├─ Loads .env file
├─ Makes variables available
└─ Keeps secrets safe

Axios
├─ HTTP client
├─ Makes API calls
└─ Promise-based

pdf-parse
├─ PDF text extraction
├─ Parses binary PDF data
└─ Returns plain text

express-fileupload
├─ Handles file uploads
├─ Processes multipart/form-data
└─ Manages file buffers
```

---

## 🔐 Security Layers

### Layer 1: Environment Variables
```
✓ API keys in .env file
✓ Not in source code
✓ Not committed to Git
```

### Layer 2: Backend Processing
```
✓ Frontend never sees API keys
✓ Backend handles all API calls
✓ Keys never transmitted to client
```

### Layer 3: Input Validation
```
✓ Form data validated
✓ File type checked (PDF only)
✓ File size limited (5MB max)
```

### Layer 4: Error Handling
```
✓ Errors logged on server
✓ Generic errors sent to client
✓ No sensitive info leaked
```

---

## 📈 Performance Considerations

```
Mock AI
├─ Response time: ~100ms
├─ No API calls
└─ Best for testing

Gemini API
├─ Response time: 2-3 seconds
├─ 1 API call
└─ Free tier available

OpenAI API
├─ Response time: 3-5 seconds
├─ 1 API call
└─ Paid but powerful
```

---

## 🎯 Next Steps to Enhance

1. **Caching**
   - Store generated letters in database
   - Avoid duplicate requests

2. **Authentication**
   - User accounts
   - Save letters history
   - Personalized experience

3. **Advanced Features**
   - Multiple templates
   - Format customization
   - PDF export
   - Email sending

4. **Analytics**
   - Track usage
   - Monitor errors
   - Performance metrics

---

This architecture ensures security, scalability, and maintainability! 🚀
