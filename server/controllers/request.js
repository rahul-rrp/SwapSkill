const Request = require("../models/Request");
const User = require("../models/User");
const mongoose = require("mongoose");
const { sendNotification } = require("./notificationController");

// ---------------- CREATE REQUEST ----------------
exports.createRequest = async (req, res) => {
  try {
    const { receiverId, offeredSkills, requestedSkills } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !offeredSkills || !requestedSkills) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    if (!Array.isArray(offeredSkills) || !Array.isArray(requestedSkills)) {
      return res.status(400).json({ success: false, message: "Skills must be arrays." });
    }

    // Check if there's already a pending request
    const existing = await Request.findOne({
      senderId,
      receiverId,
      response: "pending",
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You already have a pending request with this user.",
      });
    }

    const newRequest = await Request.create({
      senderId,
      receiverId,
      offeredSkills,
      requestedSkills,
    });

    // ✅ Send notification to receiver
    await sendNotification(receiverId, `You have a new skill swap request from ${req.user.firstName}.`, "request");

    res.status(201).json({
      success: true,
      message: "Skill exchange request sent successfully!",
      request: newRequest,
    });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ success: false, message: "Failed to create skill exchange request." });
  }
};

// ---------------- GET SENT REQUESTS ----------------
exports.getSentRequests = async (req, res) => {
  try {
    const senderId = req.user.id;

    const requests = await Request.find({ senderId })
      .populate("receiverId", "firstName lastName email skillsOffered")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching sent requests:", error);
    res.status(500).json({ success: false, message: "Could not fetch sent requests." });
  }
};

// ---------------- GET RECEIVED REQUESTS ----------------
exports.getReceivedRequests = async (req, res) => {
  try {
    const receiverId = req.user.id;

    const requests = await Request.find({ receiverId })
      .populate("senderId", "firstName lastName email skillsOffered")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching received requests:", error);
    res.status(500).json({ success: false, message: "Could not fetch received requests." });
  }
};

// ---------------- UPDATE REQUEST STATUS ----------------
exports.updateRequestStatus = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const { status, response } = req.body;
    const newStatus = status || response;

    if (!newStatus) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const allowedStatuses = ["pending", "accepted", "declined", "completed"];
    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { response: newStatus },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    // ✅ Send notification based on status
    if (newStatus === "accepted") {
      await sendNotification(updatedRequest.senderId, `${req.user.firstName} accepted your skill swap request!`, "request");
    } else if (newStatus === "declined") {
      await sendNotification(updatedRequest.senderId, `${req.user.firstName} declined your skill swap request.`, "request");
    } else if (newStatus === "completed") {
      await User.findByIdAndUpdate(updatedRequest.senderId, { $inc: { completedSwaps: 1 } });
      await User.findByIdAndUpdate(updatedRequest.receiverId, { $inc: { completedSwaps: 1 } });

      // Notify both users to leave a review
      await sendNotification(updatedRequest.senderId, `Your skill swap with ${req.user.firstName} is completed. Please leave a review.`, "review");
      await sendNotification(updatedRequest.receiverId, `Your skill swap with ${req.user.firstName} is completed. Please leave a review.`, "review");
    }

    res.status(200).json({
      success: true,
      message: `Request ${newStatus} successfully!`,
      request: updatedRequest,
      note: newStatus === "completed" ? "You can now review your swap partner." : undefined,
    });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ success: false, message: "Failed to update request status.", error: error.message });
  }
};

// ---------------- FIND USERS BY SKILL ----------------
exports.getUsersBySkill = async (req, res) => {
  try {
    const skill = req.query.skill;
    const currentUserId = req.user.id;

    if (!skill) {
      return res.status(400).json({ success: false, message: "Skill is required" });
    }

    let users = await User.find({
      skillsOffered: skill,
      _id: { $ne: currentUserId },
    }).select("firstName lastName email skillsOffered");

    const sentRequests = await Request.find({
      senderId: currentUserId,
      response: "pending",
    }).select("receiverId");

    const blockedUserIds = sentRequests.map((req) => req.receiverId.toString());
    const filteredUsers = users.filter((user) => !blockedUserIds.includes(user._id.toString()));

    res.status(200).json({ success: true, users: filteredUsers });
  } catch (err) {
    console.error("Error finding users by skill:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- GET ACCEPTED REQUESTS ----------------
exports.getAcceptedRequests = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const requests = await Request.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
      response: "accepted",
    })
      .populate("senderId", "firstName lastName email")
      .populate("receiverId", "firstName lastName email")
      .lean();

    return res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching accepted requests:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch accepted requests", error: error.message });
  }
};
