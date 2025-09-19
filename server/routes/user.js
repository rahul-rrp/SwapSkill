const express = require("express");
const router = express.Router();

const {
    login,
    signup,
    getUserDetails,
    logout,
    forgotPassword,
    resetPassword
} = require("../controllers/Auth");

const { auth } = require("../middlewares/Auth");

// Corrected Routes
router.post("/login", login);
router.post("/signup", signup);
router.get("/getUserDetails", auth, getUserDetails);
router.post("/logout", auth, logout);            // ✅ This is for logging out.
router.post("/forgot",forgotPassword);          // ✅ This is for initiating password reset.
router.put("/reset/:token",auth, resetPassword);      // ✅ This is for resetting the password using the token.

module.exports = router;
