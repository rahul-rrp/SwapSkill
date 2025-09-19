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
router.post("/logout", auth, logout);          // needs auth
router.post("/forgot", forgotPassword);        // public
router.put("/reset/:token", resetPassword);    // public (uses reset token, not JWT)

module.exports = router;
