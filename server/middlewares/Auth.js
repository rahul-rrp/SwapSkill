const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Auth middleware → verifies JWT
exports.auth = (req, res, next) => {
  try {
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // should contain { id, email, accountType }

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};



// Role middlewares
exports.isStudent = (req, res, next) => {
  if (req.user.accountType !== "Student") {
    return res.status(403).json({
      success: false,
      message: "This route is for Students only",
    });
  }
  next();
};



exports.isInstructor = (req, res, next) => {
  if (req.user.accountType !== "Instructor") {
    return res.status(403).json({
      success: false,
      message: "This route is for Instructors only",
    });
  }
  next();
};


exports.isAdmin = (req, res, next) => {
  if (req.user.accountType !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "This route is for Admins only",
    });
  }
  next();
};




// Middleware to allow only specific roles/accountTypes
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.accountType)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action",
      });
    }
    next();
  };
};

