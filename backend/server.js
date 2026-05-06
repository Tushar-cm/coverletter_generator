const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fileUpload = require('express-fileupload');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(fileUpload());

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api', require('./routes/ai'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cover Letter Generator API is running' });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Cover Letter Generator API running on http://localhost:${PORT}`);
  console.log(`📋 Frontend: http://localhost:${PORT}`);
  console.log(`🔑 AI Provider: ${process.env.AI_PROVIDER || 'gemini'}`);
});
