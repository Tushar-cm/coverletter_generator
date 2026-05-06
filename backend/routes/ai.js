const express = require('express');
const router = express.Router();
const { getMockCoverLetter, getGeminiCoverLetter, getOpenAICoverLetter } = require('../utils/aiService');
const { extractTextFromPDF } = require('../utils/pdfParser');

// Main endpoint: Generate cover letter
router.post('/generate', async (req, res) => {
  try {
    const { candidateName, jobRole, company, skills, useAI = false, resumeText = '' } = req.body;

    // Validation
    if (!candidateName || !jobRole || !company || !skills) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['candidateName', 'jobRole', 'company', 'skills']
      });
    }

    let coverLetter;

    if (useAI) {
      // Use real AI
      const aiProvider = process.env.AI_PROVIDER || 'gemini';
      
      if (aiProvider === 'gemini') {
        coverLetter = await getGeminiCoverLetter(candidateName, jobRole, company, skills, resumeText);
      } else if (aiProvider === 'openai') {
        coverLetter = await getOpenAICoverLetter(candidateName, jobRole, company, skills, resumeText);
      } else {
        throw new Error(`Unknown AI provider: ${aiProvider}`);
      }
    } else {
      // Use mock AI
      coverLetter = getMockCoverLetter(candidateName, jobRole, company, skills);
    }

    res.json({
      success: true,
      coverLetter,
      generated_at: new Date().toISOString(),
      ai_provider: useAI ? (process.env.AI_PROVIDER || 'gemini') : 'mock'
    });
  } catch (error) {
    console.error('Cover Letter Generation Error:', error);
    res.status(500).json({
      error: 'Failed to generate cover letter',
      message: error.message
    });
  }
});

// Endpoint: Upload and parse PDF resume
router.post('/parse-resume', async (req, res) => {
  try {
    if (!req.files || !req.files.resume) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please upload a PDF resume'
      });
    }

    const resumeFile = req.files.resume;

    // Validate file type
    if (resumeFile.mimetype !== 'application/pdf') {
      return res.status(400).json({
        error: 'Invalid file type',
        message: 'Only PDF files are accepted'
      });
    }

    // Validate file size (max 5MB)
    if (resumeFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        error: 'File too large',
        message: 'Maximum file size is 5MB'
      });
    }

    const resumeText = await extractTextFromPDF(resumeFile.data);

    res.json({
      success: true,
      resumeText,
      fileName: resumeFile.name,
      uploadedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Resume Parsing Error:', error);
    res.status(500).json({
      error: 'Failed to parse resume',
      message: error.message
    });
  }
});

// Endpoint: Health check
router.get('/status', (req, res) => {
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY;

  res.json({
    status: 'ready',
    ai_providers: {
      gemini: hasGeminiKey ? 'configured' : 'not configured',
      openai: hasOpenAIKey ? 'configured' : 'not configured'
    },
    current_provider: process.env.AI_PROVIDER || 'gemini',
    mock_ai_available: true
  });
});

module.exports = router;
