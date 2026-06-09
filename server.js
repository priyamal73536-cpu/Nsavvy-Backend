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

// 3. ASLI AI ROUTE (Frontend yahan sawaal bhejega)
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        console.log("🗣️ Sawaal aaya:", userMessage);

        // Gemini 1.5 Flash (Bohot fast aur ₹0 budget ke liye best)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
        
        // Google se jawaab mangwao
        const result = await model.generateContent(userMessage);
        const aiResponseText = result.response.text();

        // Frontend ko jawaab wapas bhej do
        res.json({ reply: aiResponseText });

    } catch (error) {
        console.error("🛑 Dimaag mein error:", error);
        res.status(500).json({ error: "Backend dimaag mein dikkat aayi!" });
    }
});

// --- PREMIUM GOOGLE TTS ROUTE ---
app.post('/api/tts', async (req, res) => {
    try {
        const textToSpeak = req.body.text;
        console.log("🗣️ Aawaz Banayi Jaa Rahi Hai:", textToSpeak);

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
            // Base64 Audio Frontend ko wapas bhej do
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