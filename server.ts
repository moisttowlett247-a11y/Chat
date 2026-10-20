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
      const result = await genAI.models.generateContent({ model: 'gemini-3.8-flash', contents: prompt });
      const text = result.text;
      
      if (!text) {
        console.error("AI response was empty.");
        res.status(500).json({ error: "AI returned empty response" });
        return;
      }

      // Robust parsing: strip markdown code blocks, find first '{' and last '}'
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const firstBrace = cleanedText.indexOf('{');
      const lastBrace = cleanedText.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1) {
          try {
              const jsonStr = cleanedText.substring(firstBrace, lastBrace + 1);
              res.json(JSON.parse(jsonStr));
          } catch (e) {
              console.error("JSON Parse Error:", e, "Raw text:", cleanedText);
              res.status(500).json({ error: "Failed to parse AI JSON response" });
          }
      } else {
          console.error("No JSON braces found. Raw text:", cleanedText);
          res.status(500).json({ error: "Failed to find JSON in AI response" });
      }
    } catch (error: any) {
      if (error?.status === 429 || error?.toString().includes("RESOURCE_EXHAUSTED")) {
        console.warn("Quota exceeded, using mock fallback.");
        const mockResponses = [
            { persona: "🎨 Architect", text: "Refining the visual hierarchy.", comp: "hero" },
            { persona: "💻 Lead Dev", text: "Optimizing the component structure.", comp: "grid" },
            { persona: "🛡️ QA", text: "Visual test passed.", comp: "test" }
        ];
        res.json(mockResponses[Math.floor(Math.random() * mockResponses.length)]);
      } else {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: String(error) });
      }
    }
  });

  app.use(vite.middlewares);

  app.listen(3000, () => console.log('Server running on port 3000'));
}

startServer();
