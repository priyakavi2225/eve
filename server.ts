import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK securely
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
let aiInstance: GoogleGenAI | null = null;

if (GEMINI_API_KEY && GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
  try {
    aiInstance = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log("Stitch AI Assistant model initialized securely on the server.");
  } catch (err) {
    console.error("Failed to boot Gemini client utility:", err);
  }
} else {
  console.log("No GEMINI_API_KEY injected yet. Stitch Assistant will run on simulated, friendly expert explanations.");
}

// 1. Ask Doubt endpoint for our Personalized Whimsical AI Tutor "Stitch"
app.post('/api/tutor/ask', async (req, res) => {
  const { message, history, levelTitle, studyingFor, knowledgeLevel } = req.body;

  if (!message) {
    res.status(400).json({ error: 'Question message is required for Stitch' });
    return;
  }

  // If Gemini API Key is missing, fall back to helpful simulated cute teacher answers
  if (!aiInstance) {
    let simulatedResponse = `✨ Stitch here! Splendid question! 🍬\n\nSince we are practicing the **"${levelTitle || 'Work Hard'}"** level of your toppers journey for **${studyingFor || 'School'}**, let's sweeten this concept up! \n\n* **Step 1: Simplify!** Focus strictly on the primary building blocks. \n* **Step 2: Connect!** Think of this like combining sweet candy levels; every little milestone stacks up directly to your XP score.\n\nCould you try explaining this concept in your own words? I will reward you with **5 extra imaginary Gems** for the attempt! 💎`;
    
    if (message.toLowerCase().includes('recall')) {
      simulatedResponse = `🧠 **Fabulous recall inquiry!** Active recall is like practicing a Level-9 boss test repeatedly instead of just reading the recipe map. By triggering recall, you strengthen the synapses, forming ironclad memory shields! Remember to take continuous 5-minute hydration breaks as discussed in "Healthy Lifestyle"! 🍭`;
    } else if (message.toLowerCase().includes('plan')) {
      simulatedResponse = `📅 **A custom planning block!** Building a Topper Study Plan requires balancing high-intensity research sprint blocks (25 mins Pomodoro) with deep, restorative breaks (sleep cycles consolidate critical memory!). Make sure to schedule recreation so your brain doesn't hit a level-lock! 🚀`;
    }
    
    res.json({ text: simulatedResponse });
    return;
  }

  try {
    // Formulate a fun, whimsically sweet helper context
    const systemPrompt = `You are "Stitch", a whimsical, energetic, highly motivational, and student-friendly smart AI Educational Tutor. 
Our education app is inspired by the vibrant visual style of Candy Crush and the "Roadmap to become a Topper" mountain pathway climb.
You must use playful analogies, positive reinforcement (references to unlocking nodes, earning stars, gold coins, glowing gems, XP levels, and clearing focus milestones!).
The student is:
- Studying for: ${studyingFor || 'General Science & Skills'}
- Knowledge level: ${knowledgeLevel || 'Beginner'}
- Active roadmap focus level: "${levelTitle || 'Work Hard'}"

Keep your tone:
- Energizing, friendly, and accessible. Use clean formatting, clear bullets, simple words, and neat markdown.
- Do NOT use clinical jargon. Use sweet, gamified comparisons (e.g. "Think of this math formula like matching 3 delicious puzzle candies", "Your brain is like a muscle rocket power-up!").
- Keep replies moderately concise (max 3 short paragraphs) to keep student cognitive load light, ending with a small fun active review question that prompts them to retrieve the answer for an XP boost!`;

    // Package previous context for conversational persistence
    const formattedContents = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        formattedContents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      });
    }
    
    // Add active prompt
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await aiInstance.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: message, // simplest entry matching contents
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      }
    });

    res.json({ text: response.text || "Sweet! Stitch is processing this further. Please try rephrasing!" });
  } catch (error: any) {
    console.error("Gemini assistant route failed:", error);
    res.status(500).json({ 
      error: 'Stitch is slightly sleepy and digesting high-sugar candies. Please try again! Internal detail: ' + error.message 
    });
  }
});

// Serve health status
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', firebaseActive: false });
});

// Configure Vite or production file serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Stitch AI Server listening on port ${PORT}`);
  });
}

setupServer();
