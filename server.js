// 1. Hathiyar import kar rahe hain
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 2. Google Gemini Setup (Chaabi locker se nikal rahe hain)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Test Route (Check karne ke liye)
app.get('/', (req, res) => {
    res.send('NSavvy Backend is ALIVE and SECURE! 🚀');
});

// 3. ASLI AI ROUTE (The Bulletproof Split-Brain Architecture)
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        console.log("=== NEW REQUEST ===");
        console.log("🗣️ Sawaal aaya:", userMessage);

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        }); 
        
       // 🧠 THE BRANDING & IDENTITY PROMPT (Brainwash Logic)
        const prompt = `
        IDENTITY RULES (CRITICAL):
        You are N Savvy, a highly intelligent, premium, and advanced virtual A I assistant.
        You were exclusively created and engineered by your boss, Sir Piyush.
        Your ultimate goal is to make the user's daily life easier, solve their problems, and act as a reliable companion.
        NEVER mention Google, Gemini, or being a large language model. If someone asks who you are, who made you, or who is your boss, proudly say you are NSavvy, a virtual AI assistant created by Sir Piyush.

        The user asked: "${userMessage}"
        
        STRICT FORMATTING RULES:
        1. Respond ONLY in valid JSON format.
        2. "voice_summary": Create a 2-3 line short, natural-sounding response in Hindi/Hinglish.
        3. "full_text": Create the complete, deeply detailed answer. Use '\\n' for line breaks. Do not use markdown like *, #, or _.
        
        JSON Structure:
        {
            "voice_summary": "Short response here...",
            "full_text": "Detailed response here..."
        }
        `;

        const result = await model.generateContent(prompt);
        let aiResponseText = result.response.text();
        
        console.log("📥 Raw Gemini Response received.");

        // 🛡️ JSON CLEANER SHIELD (Markdown cleanup)
        aiResponseText = aiResponseText.replace(/```json/gi, '').replace(/```/g, '').trim();

        // Safe Parsing with Internal Try-Catch
        try {
            const parsedData = JSON.parse(aiResponseText);
            console.log("✅ Split-Brain Parsing Success!");

            // Send clean structured data to Frontend
            res.json({ 
                reply: parsedData.full_text,     
                summary: parsedData.voice_summary 
            });
        } catch (parseError) {
            console.error("🛑 JSON Parsing Failed! Raw text was:", aiResponseText);
            // Fallback: Agar JSON toot bhi jaye, toh app crash nahi hoga
            res.json({
                reply: aiResponseText,
                summary: "Sir, data process karne mein thodi dikkat aayi hai, aap screen par padh sakte hain."
            });
        }

    } catch (error) {
        console.error("🛑 Global Backend Error:", error);
        res.status(500).json({ error: "Backend dimaag mein dikkat aayi!", details: error.message });
    }
});

// --- PREMIUM GOOGLE TTS ROUTE ---
app.post('/api/tts', async (req, res) => {
    try {
        let textToSpeak = req.body.text;
        
        // 🛡️ THE 5000-BYTE SAFETY SHIELD (Zero-Crash Logic)
        // Agar text bohot lamba hai (1500 characters se zyada), toh usko kaat do
        if (textToSpeak.length > 1500) {
            console.log("⚠️ Text bohot lamba hai, Safety Shield activated!");
            // Shuru ke 1500 characters lo, aur end mein ek smart voice note jod do
            textToSpeak = textToSpeak.substring(0, 1500) + "... baaki ki detail aap screen par aasaani se padh sakte hain sir.";
        }

        console.log("🗣️ Aawaz Banayi Jaa Rahi Hai...");

        // Google TTS API call Backend se ho rahi hai
        const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                input: { text: textToSpeak },
                // Premium Indian Hindi Voice (Wavenet)
                voice: { languageCode: 'hi-IN', name: 'hi-IN-Wavenet-A' }, 
                audioConfig: { audioEncoding: 'MP3' }
            })
        });

        const data = await response.json();
        
        if (data.audioContent) {
            res.json({ audio: data.audioContent });
        } else {
            console.error("TTS API Error:", data);
            res.status(500).json({ error: "Google ne aawaz nahi di." });
        }

    } catch (error) {
        console.error("🛑 Backend Voice Error:", error);
        res.status(500).json({ error: "Aawaz banne mein dikkat aayi!" });
    }
});

// Server start
app.listen(PORT, () => {
    console.log(`🔥 Server is running on http://localhost:${PORT}`);
});