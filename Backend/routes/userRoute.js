const express = require("express");
const { google } = require("googleapis");
const { verifyAccessToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/api", verifyAccessToken, async (req, res) => {
    const token = req.cookies.token;

    try {
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: token.access_token });

        const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
        const response = await oauth2.userinfo.get();

        res.send(response.data);
    } catch (error) {
        console.error("Error fetching profile:", error.message);
        res.status(404).json({ error: "Profile not found" });
    }
});

module.exports = router;
