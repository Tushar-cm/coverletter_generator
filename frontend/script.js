// DOM Elements
const form = document.getElementById('coverLetterForm');
const generateBtn = document.getElementById('generateBtn');
const loadingState = document.getElementById('loadingState');
const outputCard = document.getElementById('outputCard');
const emptyState = document.getElementById('emptyState');
const errorState = document.getElementById('errorState');
const coverLetterOutput = document.getElementById('coverLetterOutput');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const errorCloseBtn = document.getElementById('errorCloseBtn');
const resumeFile = document.getElementById('resumeFile');
const fileName = document.getElementById('fileName');
const toast = document.getElementById('toast');
const floatingStatus = document.getElementById('floatingStatus');

let currentCoverLetter = '';
let currentFormData = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkApiStatus();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    form.addEventListener('submit', handleFormSubmit);
    copyBtn.addEventListener('click', copyToClipboard);
    downloadBtn.addEventListener('click', downloadAsText);
    regenerateBtn.addEventListener('click', regenerate);
    errorCloseBtn.addEventListener('click', hideError);
    resumeFile.addEventListener('change', handleResumeUpload);
}

// Check API Status
async function checkApiStatus() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        
        console.log('API Status:', data);
        
        // Update floating status
        const providers = Object.keys(data.ai_providers)
            .filter(p => data.ai_providers[p] === 'configured')
            .join(', ');
        
        if (providers.length > 0) {
            showFloatingStatus(`✅ AI Ready (${providers})`);
        } else {
            showFloatingStatus('⚠️ Configure API Key');
        }
    } catch (error) {
        console.error('Status check failed:', error);
        showFloatingStatus('⚠️ Offline Mode');
    }
}

// Handle Form Submit
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    currentFormData = {
        candidateName: formData.get('candidateName').trim(),
        jobRole: formData.get('jobRole').trim(),
        company: formData.get('company').trim(),
        skills: formData.get('skills').trim().split(',').map(s => s.trim()),
        useAI: formData.get('aiMode') === 'real',
        resumeText: ''
    };
    
    // Validate
    if (!currentFormData.candidateName || !currentFormData.jobRole || 
        !currentFormData.company || currentFormData.skills.length === 0) {
        showError('Please fill in all required fields');
        return;
    }
    
    // Show loading state
    showLoading();
    
    try {
        // If resume was uploaded, it's already in currentFormData
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentFormData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to generate cover letter');
        }
        
        const data = await response.json();
        currentCoverLetter = data.coverLetter;
        
        showOutput(currentCoverLetter);
        showToast(`✅ Cover letter generated using ${data.ai_provider}`, 'success');
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Failed to generate cover letter. Please try again.');
        hideLoading();
    }
}

// Handle Resume Upload
async function handleResumeUpload(e) {
    const file = e.target.files[0];
    
    if (!file) {
        fileName.textContent = '';
        return;
    }
    
    if (file.type !== 'application/pdf') {
        showError('Please upload a PDF file');
        resumeFile.value = '';
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showError('File size must be less than 5MB');
        resumeFile.value = '';
        return;
    }
    
    // Show file name
    fileName.textContent = `✅ ${file.name} ready for parsing`;
    
    // Parse PDF
    const formData = new FormData();
    formData.append('resume', file);
    
    try {
        showFloatingStatus('📄 Parsing resume...');
        const response = await fetch('/api/parse-resume', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to parse resume');
        }
        
        const data = await response.json();
        currentFormData.resumeText = data.resumeText;
        
        fileName.textContent = `✅ ${file.name} parsed (${data.resumeText.length} chars)`;
        showToast('📄 Resume parsed successfully', 'success');
        showFloatingStatus('✅ Resume ready');
    } catch (error) {
        console.error('Resume parsing error:', error);
        fileName.textContent = '❌ Failed to parse resume';
        showError(error.message || 'Failed to parse resume');
        resumeFile.value = '';
    }
}

// Show Loading State
function showLoading() {
    emptyState.classList.add('hidden');
    outputCard.classList.add('hidden');
    errorState.classList.add('hidden');
    loadingState.classList.remove('hidden');
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';
}

// Hide Loading State
function hideLoading() {
    loadingState.classList.add('hidden');
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate Cover Letter';
}

// Show Output
function showOutput(letter) {
    coverLetterOutput.textContent = letter;
    loadingState.classList.add('hidden');
    emptyState.classList.add('hidden');
    errorState.classList.add('hidden');
    outputCard.classList.remove('hidden');
    hideLoading();
}

// Copy to Clipboard
async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(currentCoverLetter);
        showToast('📋 Copied to clipboard!', 'success');
        
        // Visual feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    } catch (error) {
        showError('Failed to copy to clipboard');
    }
}

// Download as Text
function downloadAsText() {
    const element = document.createElement('a');
    const file = new Blob([currentCoverLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `cover-letter-${currentFormData.candidateName.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('⬇️ Downloaded!', 'success');
}

// Regenerate
function regenerate() {
    form.dispatchEvent(new Event('submit'));
}

// Show Error
function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    emptyState.classList.add('hidden');
    outputCard.classList.add('hidden');
    loadingState.classList.add('hidden');
    errorState.classList.remove('hidden');
    hideLoading();
}

// Hide Error
function hideError() {
    errorState.classList.add('hidden');
    emptyState.classList.remove('hidden');
}

// Show Toast Notification
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Show Floating Status
function showFloatingStatus(message) {
    floatingStatus.textContent = message;
    floatingStatus.classList.add('show');
    
    setTimeout(() => {
        floatingStatus.classList.remove('show');
    }, 4000);
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        if (e.key === 'Enter' && !generateBtn.disabled) {
            handleFormSubmit(new Event('submit'));
        }
    }
});

console.log('✅ Cover Letter Generator loaded');
console.log('💡 Tip: Use Ctrl+Enter to quickly generate');
