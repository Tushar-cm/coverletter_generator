const axios = require('axios');

// Mock AI Service - Returns hardcoded template
function getMockCoverLetter(candidateName, jobRole, company, skills) {
  const skillsList = Array.isArray(skills) ? skills.join(', ') : skills;
  
  const template = `Dear Hiring Manager at ${company},

I am ${candidateName}, and I am excited to apply for the ${jobRole} position at your esteemed organization.

With a strong background in ${skillsList}, I am confident that I can contribute significantly to your team. My expertise aligns perfectly with the requirements you've outlined, and I am eager to bring my skills and dedication to ${company}.

Throughout my career, I have demonstrated a commitment to excellence and continuous learning. I am particularly drawn to ${company}'s mission and values, and I believe my ${skillsList} expertise will enable me to make meaningful contributions to your organization.

I welcome the opportunity to discuss how my background, skills, and enthusiasm can benefit ${company}. Thank you for considering my application.

Best regards,
${candidateName}`;

  return template;
}

// Real AI Service - Gemini API
async function getGeminiCoverLetter(candidateName, jobRole, company, skills, resumeText = '') {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const skillsList = Array.isArray(skills) ? skills.join(', ') : skills;
  
  let prompt = `Write a professional, personalized cover letter for:
- Candidate Name: ${candidateName}
- Job Role: ${jobRole}
- Company: ${company}
- Key Skills: ${skillsList}`;

  if (resumeText) {
    prompt += `\n- Resume Content:\n${resumeText}`;
  }

  prompt += `\n
Requirements:
- Professional and formal tone
- 3-4 well-structured paragraphs
- Highlight relevant skills
- Show enthusiasm for the company
- Include a strong closing
- Do NOT include any markdown formatting, just plain text`;

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
        }
      }
    );

    if (response.data.candidates && response.data.candidates[0]) {
      const content = response.data.candidates[0].content.parts[0].text;
      return content;
    }

    throw new Error('No content generated');
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    throw new Error(`Gemini API Error: ${error.message}`);
  }
}

// Real AI Service - OpenAI API
async function getOpenAICoverLetter(candidateName, jobRole, company, skills, resumeText = '') {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const skillsList = Array.isArray(skills) ? skills.join(', ') : skills;
  
  let prompt = `Write a professional, personalized cover letter for:
- Candidate Name: ${candidateName}
- Job Role: ${jobRole}
- Company: ${company}
- Key Skills: ${skillsList}`;

  if (resumeText) {
    prompt += `\n- Resume Content:\n${resumeText}`;
  }

  prompt += `\n
Requirements:
- Professional and formal tone
- 3-4 well-structured paragraphs
- Highlight relevant skills
- Show enthusiasm for the company
- Include a strong closing
- Do NOT include any markdown formatting, just plain text`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].message.content;
    }

    throw new Error('No content generated');
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    throw new Error(`OpenAI API Error: ${error.message}`);
  }
}

module.exports = {
  getMockCoverLetter,
  getGeminiCoverLetter,
  getOpenAICoverLetter
};
