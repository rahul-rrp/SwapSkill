const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.auth = async (req, res, next) => {


    try {
        // Check token from cookie, body, or headers

        const token = req.headers["authorization"]?.replace("Bearer ", "");
      

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found. Please login.",
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded JWT:", decoded);
            req.user = decoded;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token.",
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
