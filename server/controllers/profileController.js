const Profile = require("../models/Profile");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();



// ---------------- GET PROFILE ----------------
exports.getProfile = async (req, res) => {
  try {
    const requesterId = req.user.id;
    const targetUserId = req.params.userId || requesterId;

    let profile = await Profile.findOne({ user: targetUserId });

    // Auto-create profile only for logged-in user if missing
    if (!profile && targetUserId === requesterId) {
      profile = await Profile.create({
        user: requesterId,
        bio: "",
        location: "",
        skills: [],
        interests: [],
        socialLinks: { linkedin: "", github: "", website: "", twitter: "" },
        education: [],
        experience: [],
        profileImage: "",
        achievements: [],
      });
      await User.findByIdAndUpdate(requesterId, { additionalDetails: profile._id });
    }

    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  UPDATE PROFILE 
exports.updateProfile = async (req, res) => {
  try {
    const requesterId = req.user.id;
    const requesterRole = req.user.accountType;
    const targetUserId = req.params.userId || requesterId;

    // Normal users cannot update others
    if (requesterRole !== "Admin" && targetUserId !== requesterId) {
      return res.status(403).json({ success: false, message: "Not authorized to update this profile." });
    }

    let profile = await Profile.findOne({ user: targetUserId });
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

    const allowedFields = [
      "bio", "location", "skills", "interests",
      "socialLinks", "education", "experience",
      "profileImage", "achievements",
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key) && req.body[key] !== undefined) updates[key] = req.body[key];
    });

    profile = await Profile.findOneAndUpdate({ user: targetUserId }, updates, { new: true, runValidators: true });

    res.status(200).json({ success: true, message: "Profile updated", profile });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  DELETE PROFILE
exports.deleteProfile = async (req, res) => {
  try {
    const requesterId = req.user.id;
    const requesterRole = req.user.accountType;
    let targetUserId = requesterId;

    if (requesterRole === "Admin" && req.params.userId) {
        targetUserId = req.params.userId;
    }
    else if (requesterRole !== "Admin" && req.params.userId && req.params.userId !== requesterId) {
        return res.status(403).json({ success: false, message: "Not authorized to delete this profile." });
    }
    const profile = await Profile.findOneAndDelete({ user: targetUserId });
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

    await User.findByIdAndUpdate(targetUserId, { $unset: { additionalDetails: "" } });

    res.status(200).json({ success: true, message: `Profile of ${targetUserId} deleted successfully` });
  } catch (error) {
    console.error("Delete Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


