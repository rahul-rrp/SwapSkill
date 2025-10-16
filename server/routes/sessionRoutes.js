// routes/sessionRoutes.js
const express = require("express");
const { scheduleSession, completeSession } = require("../controllers/sessionController");
const { auth } = require("../middlewares/Auth");
const router = express.Router();

router.post("/schedule", auth, scheduleSession);
router.put("/:sessionId/complete", auth, completeSession);
router.get("/user", auth, getUserSessions);

module.exports = router;
