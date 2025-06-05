const express = require("express");
const router = express.Router();

const {
    createOrFetchChat,
    sendMessage,
    getUserChats,
    getChatMessages
} = require("../controllers/chat");

const { auth } = require("../middlewares/Auth");  // Authentication middleware

// Create or Fetch Chat between two users
router.post("/chat", auth, createOrFetchChat);

// Send Message in an Existing Chat
router.post("/chat/message", auth, sendMessage);

// Get All Chats for Logged-in User
router.get("/chats", auth, getUserChats);

// Get Messages of a Single Chat by ID
router.get("/chat/:chatId/messages", auth, getChatMessages);

module.exports = router;
