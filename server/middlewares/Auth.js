const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.auth = async (req, res, next) => {
  try {
    // Get token from headers, cookies, or body
    const token =
      req.headers["authorization"]?.replace("Bearer ", "") ||
      req.cookies?.token ||
      req.body?.token;

    // If no token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found. Please login.",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded JWT:", decoded);

      // Attach decoded user info to req.user
      req.user = decoded;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please login again.",
      });
    }

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during authentication.",
    });
  }
};
