// models/Review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviewedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment: {
    type: String,
    maxlength: 500,
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
    required: true },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
