const Request = require("../models/Request");
const User = require("../models/User");

// Create a new skill exchange request
exports.createRequest = async (req, res) => {
  try {
    const { receiverId, offeredSkills, requestedSkills } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !offeredSkills || !requestedSkills) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    if (!Array.isArray(offeredSkills) || !Array.isArray(requestedSkills)) {
      return res.status(400).json({
        success: false,
        message: "Skills must be arrays.",
      });
    }

    // Check if there's already a pending request from sender to receiver
    const existing = await Request.findOne({
      senderId,
      receiverId,
      response: "pending", // Ensure your schema field is "response"
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

    res.status(201).json({
      success: true,
      message: "Skill exchange request sent successfully!",
      request: newRequest,
    });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create skill exchange request.",
    });
  }
};

// Fetch requests sent by the logged-in user
exports.getSentRequests = async (req, res) => {
  try {
    const senderId = req.user.id;

    const requests = await Request.find({ senderId })
      .populate("receiverId", "firstName lastName email skillsOffered")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Error fetching sent requests:", error);
    res.status(500).json({
      success: false,
      message: "Could not fetch sent requests.",
    });
  }
};

// Fetch requests received by the logged-in user
exports.getReceivedRequests = async (req, res) => {
  try {
    const receiverId = req.user.id;

    const requests = await Request.find({ receiverId })
      .populate("senderId", "firstName lastName email skillsOffered")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Error fetching received requests:", error);
    res.status(500).json({
      success: false,
      message: "Could not fetch received requests.",
    });
  }
};

// Update request status (accept, decline, complete)
exports.updateRequestStatus = async (req, res) => {
  try {
    const requestId = req.params.requestId; // Use :requestId from route param
    const { status } = req.body;

    const allowedStatuses = ["pending", "accepted", "declined", "completed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { response: status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.status(200).json({
      success: true,
      message: `Request ${status} successfully!`,
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update request status.",
    });
  }
};

// Find users by skill (excluding self and users with pending requests)
exports.getUsersBySkill = async (req, res) => {
  try {
    const skill = req.query.skill;
    const currentUserId = req.user.id;

    if (!skill) {
      return res.status(400).json({ success: false, message: "Skill is required" });
    }

    // Find users offering the skill, excluding self
    let users = await User.find({
      skillsOffered: skill,
      _id: { $ne: currentUserId },
    }).select("firstName lastName email skillsOffered");

    // Find users with pending requests sent by current user
    const sentRequests = await Request.find({
      senderId: currentUserId,
      response: "pending",
    }).select("receiverId");

    const blockedUserIds = sentRequests.map((req) => req.receiverId.toString());

    // Filter out users already having a pending request
    const filteredUsers = users.filter((user) => !blockedUserIds.includes(user._id.toString()));

    res.status(200).json({ success: true, users: filteredUsers });
  } catch (err) {
    console.error("Error finding users by skill:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



exports.getAcceptedRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all requests where the logged-in user is involved and status is "Accepted"
    const requests = await Request.find({
      $or: [{ sender: userId }, { receiver: userId }],
      status: "Accepted"
    })
    .populate("sender", "firstName lastName email")
    .populate("receiver", "firstName lastName email");

    return res.status(200).json({
      success: true,
      requests,
    });

  } catch (error) {
    console.error("Error fetching accepted requests:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch accepted requests",
      error: error.message
    });
  }
};
