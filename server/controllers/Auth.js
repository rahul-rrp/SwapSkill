const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const sendEmail = require("../utilis/sendEmail");
const crypto = require("crypto");
const Profile = require("../models/Profile");

const User = require("../models/User");
const Profile = require("../models/Profile");

// ---------------- SIGNUP Controller ----------------
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      image,
      skillsOffered,
      bio,
    } = req.body;

    // 1. Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword || !accountType) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided!",
      });
    }

    // 2. Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match!",
      });
    }

    // 3. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists, please login.",
      });
    }

    // 4. Create the user (password hashed via pre-save hook)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      accountType,
      image: image || "",
      skillsOffered: skillsOffered || [],
      bio: bio || "",
    });

    // 5. Create default profile linked to the user
    const profile = await Profile.create({
      user: user._id,
      bio: "",
      location: "",
      skills: [],
      interests: [],
      socialLinks: {
        linkedin: "",
        github: "",
        website: "",
        twitter: "",
      },
      education: [],
      experience: [],
      profileImage: "",
      achievements: [],
    });

    // 6. Link profile to user
    user.additionalDetails = profile._id;
    await user.save();

    // 7. Return success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        accountType: user.accountType,
        profileId: profile._id,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: "User registration failed. Something went wrong!",
    });
  }
};



// LOGIN Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required.",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not registered.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password.",
      });
    }

    // Generate JWT
const token = jwt.sign(
  { id: user._id, email: user.email, role: user.accountType },
  process.env.JWT_SECRET,
  { expiresIn: "24h" }
);


    user.password = undefined; // Don't send password back

    // Set token in HTTP-only cookie
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
      message: "User login successful!",
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed. Internal Server Error.",
    });
  }
};


// GET USER DETAILS Controller
exports.getUserDetails = async (req, res) => {
  try {
    // 1. Get user ID from auth middleware
    const userId = req.user.id;

    // 2. Find user by ID (exclude password)
    const user = await User.findById(userId)
      .select("-password")
      .populate("additionalDetails"); // optional: populate Profile details if needed

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // 3. Send user data
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get User Details Error:", error);
    res.status(500).json({
      success: false,
      message: "Cannot fetch user data.",
    });
  }
};


// LOGOUT Controller
exports.logout = (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "User logged out successfully!",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not log out user.",
    });
  }
};




// @desc    Forgot password
// @route   POST /api/auth/forgot
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Create reset token
    const resetToken = user.getResetPasswordToken();
  

    // 3. Save user with reset token and expiry
    await user.save({ validateBeforeSave: false });

    // 4. Create reset link
    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reset/${resetToken}`;

    // 5. Send email
    await sendEmail(
      user.email,
      "Password Reset Request",
      `<p>You requested a password reset.</p>
       <p>Click this link to reset your password:</p>
       <a href="${resetUrl}">${resetUrl}</a>`
    );

    // Return message (and resetUrl in dev mode)
    const response = { message: "Reset link sent to your email" };


    res.json(response);
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};



// @desc    Reset password
// @route   PUT /api/auth/reset/:token
exports.resetPassword = async (req, res) => {
  try {
    // 1. Hash the token from URL
    const resetToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // 2. Find user with this token and check expiry
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }, // ✅ fixed plural
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const { password, confirmPassword } = req.body;

    // 3. Check if passwords match
    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Password and Confirm Password are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 4. Set new password (pre-save hook will hash it)
    user.password = password;

    // 5. Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // 6. Save user
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

