const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User"); // to fetch full user details

// Authentication Middleware

exports.auth = async (req, res, next) => {
  try {
    // Extract token
    const token =
      req.headers["authorization"]?.replace("Bearer ", "") ||
      req.cookies?.token ||
      req.body?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found. Please login.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // { id, email, username, accountType }

    // Fetch full user from DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please login again.",
      });
    }

    // Attach full user
    req.user = user; // now req.user._id exists

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token. Please login again.",
    });
  }
};

// Generic Role Authorization Middleware
exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.accountType) {
      return res.status(403).json({
        success: false,
        message: "Access denied. User is not authorized.",
      });
    }

    const userRole = req.user.accountType.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};

