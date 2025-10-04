const Notification = require("../models/Notification");

// ---------------- CREATE / SEND NOTIFICATION ----------------
// Utility function (not an endpoint) to send notification to a user
exports.sendNotification = async (userId, message, type = "system") => {
  try {
    const notification = new Notification({
      user: userId,
      message,
      type,
    });
    await notification.save();
    return notification;
  } catch (err) {
    console.error("Error sending notification:", err.message);
  }
};

// ---------------- GET USER NOTIFICATIONS ----------------
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (err) {
    console.error("Get Notifications Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

// ---------------- MARK NOTIFICATION AS READ ----------------
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // ensure only owner can update
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found or not authorized",
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (err) {
    console.error("Mark Notification Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to update notification",
    });
  }
};
