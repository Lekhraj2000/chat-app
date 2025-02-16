const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { verifyAccessToken } = require("../middleware/authMiddleware");

const router = express.Router();
const GEMINI_API_KEY = "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

router.post("/chat", verifyAccessToken, async (req, res) => {
    const prompt = req.body.message;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        res.json({ text });
    } catch (error) {
        console.error("Error generating response:", error.message);
        res.status(500).json({ msg: "Error processing request" });
    }
});

module.exports = router;
