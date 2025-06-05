const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    skillsOffered: {
      type: [String],
      required: true,
    },
    bio: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // fixed typo
  }
);

module.exports = mongoose.model("User", UserSchema); // ✅ Capital 'U'
