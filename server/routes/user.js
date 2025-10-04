const express = require("express");
const router = express.Router();

const {
    login,
    signup,
    getUserDetails,
    logout,
    forgotPassword,
    resetPassword,
    updateUsername,
    deleteUser
} = require("../controllers/Auth");

const { auth , authorizeRoles } = require("../middlewares/Auth");

// Corrected Routes
router.post("/login", login);
router.post("/signup", signup);
router.get("/id/:userId", auth, getUserDetails);
router.get("/username/:username", auth, getUserDetails);
router.post("/logout", auth, logout);          // needs auth
router.patch("/update-username", auth, updateUsername);
router.post("/forgot", forgotPassword);        // public
router.put("/reset/:token", resetPassword);    // public (uses reset token, not JWT)
router.delete("/admin/user", auth, authorizeRoles("admin"), deleteUser);

module.exports = router;
