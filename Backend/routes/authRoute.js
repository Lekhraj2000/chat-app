const express = require("express");
const { google } = require("googleapis");
const router = express.Router();

const CLIENT_ID =  "";
const CLIENT_SECRET = "";
const REDIRECT_URL = "http://localhost:3000/oauthcallback";

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
];

// Google Auth URL
router.get("/auth", (req, res) => {
    const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        include_granted_scopes: true,
    });
    res.redirect(authorizationUrl);
});

// OAuth callback
router.get("/oauthcallback", async (req, res) => {
    if (req.query.error) {
        return res.status(400).json({ msg: "Authorization Error" });
    }

    try {
        const { tokens } = await oauth2Client.getToken(req.query.code);
        oauth2Client.setCredentials(tokens);
        res.cookie("token", tokens, { httpOnly: true, secure: true });
        res.redirect("http://localhost:5173");
    } catch (error) {
        console.error("Error exchanging token:", error.message);
        res.status(500).json({ msg: "Error authenticating" });
    }
});

// Logout and revoke token
router.get("/logout", async (req, res) => {
    const token = req.cookies.token;
    
    if (!token || !token.access_token) {
        return res.status(400).json({ error: "Access token is required" });
    }

    try {
        await fetch("https://oauth2.googleapis.com/revoke", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `token=${token.access_token}`,
        });

        res.clearCookie("token");
        res.json({ message: "Token revoked successfully" });
    } catch (error) {
        console.error("Error revoking token:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
