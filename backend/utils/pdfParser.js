const pdfParse = require('pdf-parse');

async function extractTextFromPDF(fileBuffer) {
  try {
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF Parsing Error:', error.message);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}

module.exports = {
  extractTextFromPDF
};
