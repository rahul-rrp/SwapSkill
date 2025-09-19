const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// SIGNUP Controller
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      image,
      skillsOffered,
      bio,
      resetPasswordToken,
      resetPasswordExpires
    } = req.body;
    console.log(req.body);

    // Validate all fields 
    if (!firstName || !lastName || !email || !password || !confirmPassword|| !skillsOffered || !bio) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match!",
      });
    }

    // Check if user already exists
    const emailExist = await User.findOne({ email });
    console.log(emailExist);
    if (emailExist) {
      return res.status(409).json({
        success: false,
        message: "User already exists, please login.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      image,
      skillsOffered,
      bio,
      resetPasswordToken,
      resetPasswordExpires
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      }
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
      { id: user._id, email: user.email },
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
    // Assumes auth middleware has set req.user
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get User Details Error:", error);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch user data.",
    });
  }
};

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

    // 3.Save user with reset token and expiry
    await user.save({ validateBeforeSave: false });

    // 4. Create reset link
    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reset/${resetToken}`;

    // 5. Send email
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message: `Click this link to reset your password: ${resetUrl}`,
    });

    res.json({ message: "Reset link sent to your email" });
  } catch (error) {
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
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    // 3. Set new password
    user.password = req.body.password;

    // 4. Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // 5. Save user
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
