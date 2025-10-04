const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();
const sendEmail = require("../utilis/sendEmail");
const Profile = require("../models/Profile");
const generateUsername = require("../utilis/generateUsername");

// ---------------- SIGNUP ----------------
exports.signup = async (req, res) => {
  try {

    // fetch data from req.body
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
      skillsWanted
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword || !accountType) {
      return res.status(400).json({ success: false, message: "All required fields must be provided!" });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Password and Confirm Password do not match!" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists, please login." });
    }

    // Generate unique username
    let username = await generateUsername(firstName, lastName);
    let check = await User.findOne({ username });
    while (check) {
      username = await generateUsername(firstName, lastName);
      check = await User.findOne({ username });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      accountType,
      image: image || "",
      skillsOffered: skillsOffered || [],
      skillsWanted: skillsWanted || [],
      bio: bio || "",
      username,
      averageRating: 0,
      totalReviews: 0,
      completedSwaps: 0,
    });

    // Create default profile
    const profile = await Profile.create({
      user: user._id,
      bio: "",
      location: "",
      skills: [],
      interests: [],
      socialLinks: { linkedin: "", github: "", website: "", twitter: "" },
      education: [],
      experience: [],
      profileImage: "",
      achievements: [],
    });

    // Link profile to user
    user.additionalDetails = profile._id;

    // Save user with profile reference
    await user.save();

    // Respond with success
    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        accountType: user.accountType,
        profileId: profile._id,
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted,
        averageRating: user.averageRating,
        totalReviews: user.totalReviews,
        completedSwaps: user.completedSwaps,
      },
    });
} catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
        success: false,
        message: "User registration failed.",
        error: error.message // <-- send the actual error to Postman for debugging
    });
}

};

// ---------------- LOGIN ----------------
exports.login = async (req, res) => {
  try {
    // Fetch data from request body
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not registered." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password." });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username, accountType: user.accountType },
      process.env.JWT_SECRET,
      { expiresIn: "3d" } // aligned with cookie expiry
    );

    // Remove password from user object
    user.password = undefined;

    // Set cookie
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    };
    res.cookie("token", token, options);

    // Respond with success
    res.status(200).json({
      success: true,
      message: "User login successful!",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        accountType: user.accountType,
        profileId: user.additionalDetails,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Login failed." });
  }
};

// ---------------- GET USER DETAILS ----------------
// Pass either ?id=<userId> OR ?username=<username>
// If logged-in user is Admin, they can see all details of any user
// If logged-in user is not Admin:
//    - they can see full details of non-Admin users
//    - they can see limited details of Admin users (no email, skills, image, createdAt)

exports.getUserDetails = async (req, res) => {
  try {
    const { userId, username } = req.params;

    if (!userId && !username) {
      return res.status(400).json({
        success: false,
        message: "Please provide user id or username",
      });
    }

    // Fetch the target user
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne({ username });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const requesterRole = req.user.accountType; // role of logged-in user
    const targetRole = user.accountType;        // role of target user

    let responseUser = {};

    if (requesterRole === "admin") {
      // Admin can see all details
      responseUser = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        accountType: user.accountType,
        bio: user.bio,
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted,
        image: user.image,
        averageRating: user.averageRating,
        totalReviews: user.totalReviews,
        completedSwaps: user.completedSwaps,
        createdAt: user.createdAt,
      };
    } else {
      // Non-admin requesting user details
      if (targetRole === "admin") {
        // Limited details for Admin
        responseUser = {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          accountType: user.accountType,
          bio: user.bio,
        };
      } else {
        // Full details for non-admin
        responseUser = {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          accountType: user.accountType,
          bio: user.bio,
          skillsOffered: user.skillsOffered,
          skillsWanted: user.skillsWanted,
          image: user.image,
          averageRating: user.averageRating,
          totalReviews: user.totalReviews,
          completedSwaps: user.completedSwaps,
          createdAt: user.createdAt,
        };
      }
    }

    return res.status(200).json({
      success: true,
      user: responseUser,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching user details",
      error: error.message,
    });
  }
};


// ---------------- UPDATE USERNAME ---------------
// Allow user to update their username &&  admin or user is not allowed to update username of any user due to privacy reasons
exports.updateUsername = async (req, res) => {
  try {
    let { newUsername, id } = req.body; // id = target user
    const requesterId = req.user.id;
    const requesterRole = req.user.accountType;

    // Validate new username
    if (!newUsername) {
      return res.status(400).json({
        success: false,
        message: "New username is required",
      });
    }

    // Normalize
    newUsername = newUsername.toLowerCase().trim();

    // Check if username already exists
    const exists = await User.findOne({ username: newUsername });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Username already taken.",
      });
    }

    let targetUserId;

    if (requesterRole === "admin") {
      // Admin can update anyone
      targetUserId = id || requesterId; 
    } else {
      // Normal user can ONLY update themselves
      if (id && id !== requesterId) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to update another user's username",
        });
      }
      targetUserId = requesterId;
    }

    const user = await User.findByIdAndUpdate(
      targetUserId,
      { username: newUsername },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Username updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update Username Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



// ---------------- LOGOUT ----------------
exports.logout = (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ success: true, message: "User logged out successfully!" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ success: false, message: "Could not log out user." });
  }
};

// ---------------- FORGOT PASSWORD ----------------
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "If the email is registered, a reset link has been sent",
      });
    }

    // Generate reset token
    const { resetToken, hashed, expires } = user.getResetPasswordToken();

    // Update only token + expiry (no full validation)
    await User.updateOne(
      { _id: user._id },
      {
        resetPasswordToken: hashed,
        resetPasswordExpires: expires,
      }
    );

    // Build reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email
    await sendEmail(
      user.email,
      "Password Reset Request",
      `<p>You requested a password reset.</p>
       <p>Click this link to reset your password:</p>
       <a href="${resetUrl}">${resetUrl}</a>`
    );

    return res.json({
      message: "If the email is registered, a reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};


// ---------------- RESET PASSWORD ----------------
exports.resetPassword = async (req, res) => {
  try {
    const resetToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Password and Confirm Password are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash new password and update user-> we are using 12 rounds of hashing here while we
    // already have a pre-save hook that hashes password with 10 rounds.because here we are not using user.save() method
    // here we are using updateOne method which directly updates the document in the database without triggering pre-save hooks.
    // therefore we need to hash the password here itself.
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password and clear reset token fields-> we are using updateOne method here instead of user.save() to avoid triggering pre-save hooks.
    // user.save() give us full validation but here we don't need full validation we just need to update password and clear reset token fields.
   await User.updateOne(
  { _id: user._id },
  { password: hashedPassword, resetPasswordToken: undefined, resetPasswordExpires: undefined }
);


    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message
     });
  }
};

// ---------------- DELETE USER (ADMIN ONLY) ----------------

// DELETE /api/v1/admin/user
// Pass either ?id=<userId> OR ?username=<username>
exports.deleteUser = async (req, res) => {
  try {
    const { id, username } = req.query;

    // Must provide id or username
    if (!id && !username) {
      return res.status(400).json({
        success: false,
        message: "Please provide either user id or username",
      });
    }

    let user;

    // Find by id or username
    if (id) {
      user = await User.findById(id);
    } else if (username) {
      user = await User.findOne({ username });
    }

    // If no user found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Safeguard: prevent admin from deleting themselves
    if (req.user && req.user._id && user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Admins cannot delete their own account",
      });
    }

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: `User '${user.username}' deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting user",
      error: error.message,
    });
  }
};
