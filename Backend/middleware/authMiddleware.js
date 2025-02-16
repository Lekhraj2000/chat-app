const axios = require("axios");

async function verifyAccessToken(req, res, next) {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ error: "Token not found" });
    }

    try {
        const response = await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token.access_token}`);
        console.log("User is valid:", response.data);
        next();
    } catch (error) {
        console.error("Invalid Token:", error.response ? error.response.data : error.message);
        return res.status(401).json({ message: "Invalid Token" });
    }
}

module.exports = { verifyAccessToken };
