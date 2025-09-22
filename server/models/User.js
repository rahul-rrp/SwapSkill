const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto"); // <-- add this

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // better to enforce unique emails
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountType:{
      type:String,
      enum:["Admin","Student","Instructor"],
      required:true,
    },
    skillsOffered: {
      type: [String],
      required: true,
    },
    additionalDetails:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:"Profile",
    },
    image:{
      type: String,
    },
    bio: {
      type: String,
      trim: true,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {   // ✅ match naming
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook → hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare passwords at login
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate & hash password reset token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire (10 minutes)
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  return resetToken; // plain token (to send via email)
};

module.exports = mongoose.model("User", UserSchema);
