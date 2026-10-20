import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(express.json());

  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  app.post('/api/collaborate', async (req, res) => {
    const { task, history } = req.body;
    
    const prompt = `
      You are an expert AI development team consisting of a UI/UX Architect, a Lead Fullstack Dev, and a QA Engineer.
      The user wants to build: "${task}".
      
      Maintain a collaborative, expert tone. 
      Do NOT loop or repeat previous messages.
      Provide one concise action per message.
      
      Return a JSON object: 
      {
        "persona": "Persona Name",
        "text": "The message here...",
        "comp": "hero|container|test|grid|filter",
        "code": "/* optional code snippet */"
      }
      
      Current history: ${JSON.stringify(history.slice(-5))}
    `;

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      if (!text) {
        console.error("AI response was empty.");
        res.status(500).json({ error: "AI returned empty response" });
        return;
      }

      // Improved parsing: find first '{' and last '}'
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
          try {
              const jsonStr = text.substring(firstBrace, lastBrace + 1);
              res.json(JSON.parse(jsonStr));
          } catch (e) {
              console.error("JSON Parse Error:", e, "Raw text:", text);
              res.status(500).json({ error: "Failed to parse AI JSON response" });
          }
      } else {
          console.error("No JSON braces found. Raw text:", text);
          res.status(500).json({ error: "Failed to find JSON in AI response" });
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: String(error) });
    }
  });

  app.use(vite.middlewares);

  app.listen(3000, () => console.log('Server running on port 3000'));
}

startServer();
