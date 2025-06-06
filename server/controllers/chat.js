const Chat = require("../models/Chat");

// Create or Fetch Existing Chat between Two Users
exports.createOrFetchChat = async (req, res) => {
    try {
        const { participantId } = req.body;
        const currentUserId = req.user.id;  // From Auth Middleware

        if (!participantId) {
            return res.status(400).json({
                success: false,
                message: "Participant ID is required.",
            });
        }

        // Check if chat already exists between two users
        let chat = await Chat.findOne({
            participants: { $all: [currentUserId, participantId] }
        }).populate("participants", "firstName lastName email");

        if (!chat) {
            // If chat does not exist, create a new one
            chat = await Chat.create({
                participants: [currentUserId, participantId],
            });
        }

        res.status(200).json({
            success: true,
            chat,
        });
    } catch (error) {
        console.error("Error fetching/creating chat:", error);
        res.status(500).json({
            success: false,
            message: "Could not create or fetch chat.",
        });
    }
};

// Send Message in a Chat
exports.sendMessage = async (req, res) => {
    try {
        const { chatId, text } = req.body;
        const senderId = req.user.id;

        if (!chatId || !text) {
            return res.status(400).json({
                success: false,
                message: "chatId and text are required.",
            });
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found.",
            });
        }

        const newMessage = {
            senderId,
            text,
        };

        chat.messages.push(newMessage);
        await chat.save();

        res.status(200).json({
            success: true,
            message: "Message sent successfully!",
            chat,
        });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send message.",
        });
    }
};

// Get All Chats for Logged-in User
exports.getUserChats = async (req, res) => {
    try {
        const userId = req.user.id;

        const chats = await Chat.find({
            participants: userId,
        })
        .populate("participants", "firstName lastName email")
        .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            chats,
        });
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).json({
            success: false,
            message: "Could not fetch chats.",
        });
    }
};

// Get Single Chat Messages
exports.getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await Chat.findById(chatId)
            .populate("participants", "firstName lastName email")
            .populate("messages.senderId", "firstName lastName email");

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found.",
            });
        }

        res.status(200).json({
            success: true,
            messages: chat.messages,
        });

    } catch (error) {
        console.error("Error fetching chat messages:", error);
        res.status(500).json({
            success: false,
            message: "Could not fetch chat messages.",
        });
    }
};




