const cron = require("node-cron");
const Session = require("../models/Session");
const { sendNotification } = require("../controllers/notificationController");

function initSessionReminders() {
  // Every minute
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      // 🔹 Reminders (30 mins before)
      const upcomingSessions = await Session.find({
        status: "scheduled",
        date: { $lte: new Date(now.getTime() + 30 * 60 * 1000), $gte: now }
      }).populate("requester provider");

      for (const session of upcomingSessions) {
        await sendNotification(session.requester._id, "Reminder: Your session starts in 30 minutes", "schedule");
        await sendNotification(session.provider._id, "Reminder: Your session starts in 30 minutes", "schedule");
      }

      // 🔹 Auto-complete sessions that have already passed
      const expiredSessions = await Session.find({
        status: "scheduled",
        date: { $lt: now }
      }).populate("requester provider");

      for (const session of expiredSessions) {
        session.status = "completed";
        await session.save();

        await sendNotification(session.requester._id, "Your session has been auto-completed. Leave a review.", "review");
        await sendNotification(session.provider._id, "Your session has been auto-completed. Leave a review.", "review");
      }
    } catch (err) {
      console.error("Reminder job error:", err.message);
    }
  });

  console.log("✅ Session reminder cron job initialized");
}

module.exports = initSessionReminders;
