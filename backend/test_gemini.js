const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function test() {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: "hi" }] }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    console.log("Success with query key!", response.data.candidates[0].content.parts[0].text);
  } catch (e) {
    console.error("Error with query key:", e.response?.status, JSON.stringify(e.response?.data));
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`,
      {
        contents: [{ parts: [{ text: "hi" }] }]
      },
      {
        headers: { 
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
         }
      }
    );
    console.log("Success with header key!", response.data.candidates[0].content.parts[0].text);
  } catch (e) {
    console.error("Error with header key:", e.response?.status, JSON.stringify(e.response?.data));
  }
}

test();
