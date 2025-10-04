// routes/notificationRoutes.js
const express = require("express");
const {
  getUserNotifications,
  markAsRead,
} = require("../controllers/notificationController");

const { auth, authorizeRoles } = require("../middlewares/Auth");

const router = express.Router();

// ---------------- NOTIFICATION ROUTES ----------------

//  Get all notifications for logged-in user
router.get("/", auth, getUserNotifications);

// Mark a specific notification as read
router.put("/:id/read", auth, markAsRead);

// (Optional) Admin route to see all notifications of a user
router.get(
  "/user/:userId",
  auth,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const Notification = require("../models/Notification");
      const notifications = await Notification.find({ user: req.params.userId }).sort({
        createdAt: -1,
      });
      res.status(200).json({ success: true, notifications });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch notifications" });
    }
  }
);

module.exports = router;
// comment out below code