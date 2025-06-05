const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import database connection
const { connect } = require("./config/db");

// Middlewares
app.use(cors({
    origin: "*", // frontend URL
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Connect to MongoDB
connect();

// Routes
const userRoutes = require("./routes/User");
const requestRoutes = require("./routes/request");
const chatRoutes = require("./routes/chat");

// Route mounting
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/request", requestRoutes);
app.use("/api/v1/chat", chatRoutes);

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
