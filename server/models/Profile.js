const mongoose = require("mongoose");
const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
     
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    skills: {
      type: [String], // list of skills the user wants to offer
      default: [],
    },
    interests: {
      type: [String], // skills the user wants to learn
      default: [],
    },
    socialLinks: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      website: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    education: {
      type: [
        {
          institution: { type: String, default: "" },
          degree: { type: String, default: "" },
          from: { type: Date },
          to: { type: Date },
          current: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    experience: {
      type: [
        {
          title: { type: String, default: "" },
          company: { type: String, default: "" },
          from: { type: Date },
          to: { type: Date },
          current: { type: Boolean, default: false },
          description: { type: String, default: "" },
        },
      ],
      default: [],
    },
    profileImage: {
      type: String,
      default: "",
    },
    achievements: {
      type: [
        {
          title: { type: String, default: "" },
          description: { type: String, default: "" },
          date: { type: Date },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Profile", ProfileSchema);