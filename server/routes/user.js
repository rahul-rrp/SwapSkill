const express = require("express");
const router = express.Router();

const {
    login,
    signup,
    getUserDetails,
    logout
} = require("../controllers/Auth");

const { auth } = require("../middlewares/Auth");

// Corrected Routes
router.post("/login", login);
router.post("/signup", signup);
router.get("/getUserDetails", auth, getUserDetails);
router.post("/logout", auth, logout);            // ✅ This is for logging out.

module.exports = router;
