const Session = require("../models/Session");
const Request = require("../models/Request");
const { sendNotification } = require("./notificationController");

// ---------------- SCHEDULE A SESSION ----------------
exports.scheduleSession = async (req, res) => {
  try {
    const { requestId, date, duration } = req.body;
    const userId = req.user.id;

    if (!requestId || !date) {
      return res.status(400).json({ success: false, message: "Request ID and date are required." });
    }

    // Fetch request
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found." });
    }

    // Only receiver can schedule the session after accepting
    if (request.receiverId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to schedule this session." });
    }

    if (request.response !== "accepted") {
      return res.status(400).json({ success: false, message: "Request is not accepted yet." });
    }

    // Create session
    const session = new Session({
      requestId,
      requester: request.senderId,
      provider: request.receiverId,
      date,
      duration: duration || 60, // default 60 minutes
    });

    await session.save();

    // Update request status to 'scheduled'
    request.response = "scheduled";
    await request.save();

    // Send notifications
    await Promise.all([
      sendNotification(request.senderId, `Your session has been scheduled with ${req.user.firstName}.`, "schedule"),
      sendNotification(request.receiverId, `You have scheduled a session with ${req.user.firstName}.`, "schedule")
    ]);

    res.status(201).json({ success: true, message: "Session scheduled successfully.", session });
  } catch (error) {
    console.error("Error scheduling session:", error);
    res.status(500).json({ success: false, message: "Failed to schedule session.", error: error.message });
  }
};

// ---------------- COMPLETE A SESSION ----------------
exports.completeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found." });
    }

    // Only requester or provider can complete the session
    if (![session.requester.toString(), session.provider.toString()].includes(userId)) {
      return res.status(403).json({ success: false, message: "Not authorized to complete this session." });
    }

    session.status = "completed";
    await session.save();

    // Update the original request as completed
    const request = await Request.findById(session.requestId);
    if (request) {
      request.response = "completed";
      await request.save();
    }

    // Send review notifications
    await Promise.all([
      sendNotification(session.requester, "Your session is completed. Please leave a review.", "review"),
      sendNotification(session.provider, "Your session is completed. Please leave a review.", "review")
    ]);

    res.status(200).json({ success: true, message: "Session completed successfully.", session });
  } catch (error) {
    console.error("Error completing session:", error);
    res.status(500).json({ success: false, message: "Failed to complete session.", error: error.message });
  }
};




// ---------------- GET ALL USER SESSIONS ----------------
exports.getUserSessions = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all sessions where the user is either requester or provider
    const sessions = await Session.find({
      $or: [{ requester: userId }, { provider: userId }],
    })
      .populate("requester", "firstName lastName email skillsOffered") // requester info
      .populate("provider", "firstName lastName email skillsOffered") // provider info
      .populate({
        path: "requestId",
        select: "offeredSkills requestedSkills response createdAt",
      }) // populate request details
      .sort({ date: 1 }) // upcoming sessions first
      .lean();

    // Optional: categorize by status
    const categorized = {
      scheduled: [],
      completed: [],
      cancelled: [],
    };

    sessions.forEach((s) => {
      categorized[s.status].push(s);
    });

    res.status(200).json({
      success: true,
      total: sessions.length,
      sessions,
      categorized,
    });
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sessions",
      error: error.message,
    });
  }
};
