const express = require("express");
const http = require("http"); // ← Required for socket.io
const socketIO = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

// Initialize
dotenv.config();
const app = express();
const server = http.createServer(app); // ← use server, not app.listen

const io = socketIO(server, {
  cors: {
    origin: "*", // frontend origin or "*"
    methods: ["GET", "POST"],
  },
});

// Middlewares
app.use(cors({ origin: "*", credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Connect DB
const { connect } = require("./config/db");
connect();

// Socket.io Logic
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    console.log(`📥 User joined chat room: ${chatId}`);
  });

  socket.on("send_message", (data) => {
    const { chatId, message } = data;
    io.to(chatId).emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Routes
const userRoutes = require("./routes/user");
const requestRoutes = require("./routes/request");
const chatRoutes = require("./routes/chat");

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/request", requestRoutes);
app.use("/api/v1/chat", chatRoutes);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
