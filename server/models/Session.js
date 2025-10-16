// models/Session.js
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  requestId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Request", 
    required: true
 },
  requester: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true
 },
  provider: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true
  },
  date: {
    type: Date, 
    required: true 
},
  duration: {
    type: Number, 
    default: 60
  }, // in minutes
  status: { 
    type: String, 
    enum: ["scheduled", "completed", "cancelled"], 
    default: "scheduled"
  },
  createdAt: {
   type: Date, 
    default: Date.now
  }
});

module.exports = mongoose.model("Session", sessionSchema);
