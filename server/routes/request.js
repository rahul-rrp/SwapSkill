const express = require("express");
const router = express.Router();

const {
  createRequest,
  getSentRequests,
  getReceivedRequests,
  updateRequestStatus,
  getUsersBySkill,
  getAcceptedRequests
} = require("../controllers/request");

const { auth } = require("../middlewares/Auth"); // Authentication middleware

// Create New Skill Exchange Request
router.post("/request", auth, createRequest);

// Fetch Requests Sent by the User
router.get("/requests/sent", auth, getSentRequests);

// Fetch Requests Received by the User
router.get("/requests/received", auth, getReceivedRequests);

// Update Request Status (Accept, Decline, Complete)
router.put("/request/:requestId", auth, updateRequestStatus);

// Get Users by Skill
router.get("/user/userbyskills", auth, getUsersBySkill);

router.get("/request/accepted",auth,getAcceptedRequests);

module.exports = router;
