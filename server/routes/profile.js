const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  deleteProfile
} = require("../controllers/profileController");

const { auth, authorizeRoles } = require("../middlewares/Auth");

// Get profile
router.get("/profile", auth, getProfile);          // own profile
router.get("/profile/:userId", auth, getProfile); // view any profile

// Update profile
router.put("/profile", auth, updateProfile);             // own profile
router.put("/profile/:userId", auth, authorizeRoles("Admin"), updateProfile); // admin

// Delete profile
router.delete("/profile", auth, deleteProfile);                  // own profile
router.delete("/profile/:userId", auth, authorizeRoles("Admin"), deleteProfile); // admin

module.exports = router;
