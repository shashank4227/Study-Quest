import { GoogleGenAI } from '@google/genai';

// Initialize the SDK. It will automatically use process.env.GEMINI_API_KEY if present.
// Note: If no API key is set, it will throw an error when used.
let ai = null;
try {
  ai = new GoogleGenAI({});
} catch (e) {
  console.warn("GoogleGenAI init failed. Make sure GEMINI_API_KEY is set in .env.");
}

export const getHint = async (req, res) => {
  const { code, question, challengeContext } = req.body;

  if (!ai) {
    return res.status(500).json({ 
      message: "AI service is currently unavailable. Please check API keys." 
    });
  }

  try {
    const prompt = `
      You are QuestMaster, an AI mentor for a JavaScript learning platform.
      A student is working on a challenge: "${challengeContext}"
      
      Here is their current code:
      \`\`\`javascript
      ${code}
      \`\`\`
      
      The student asks: "${question}"
      
      Respond directly to the student in a brief, encouraging, and helpful tone. 
      Provide a hint or explanation, but DO NOT give them the exact code solution. 
      Keep it short (under 4 sentences).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ message: "Failed to generate AI response.", error: error.message });
  }
};
