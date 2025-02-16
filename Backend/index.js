const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoute");
const chatRoutes = require("./routes/chatRoute");
const userRoutes = require("./routes/userRoute");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.use(authRoutes);
app.use(chatRoutes);
app.use(userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
