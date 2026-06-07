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

// Server start
app.listen(PORT, () => {
    console.log(`🔥 Server is running on http://localhost:${PORT}`);
});