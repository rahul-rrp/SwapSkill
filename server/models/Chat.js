const mongoose = require("mongoose");

// Sub-schema for individual chat messages
const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User who sent the message
    required: true
  },
  text: {
    type: String,
    required: true // Message must contain text
  },
  timestamp: {
    type: Date,
    default: Date.now // Default to current time
  }
});

// Main chat schema
const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true
    }
  ],
  messages: {
    type: [messageSchema], // Embed message sub-documents
    default: []
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Export the model
module.exports=mongoose.model("Chat",chatSchema);
