const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    accountType: {
      type: String,
      enum: ["admin", "student", "instructor"],
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-zA-Z0-9_.]+$/, "Only letters, numbers, underscores and dots are allowed"],
    },
    skillsOffered: {
      type: [String],
      default: [],
    },
    skillsWanted: {
      type: [String],
      default: [],
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    completedSwaps: {
      type: Number,
      default: 0,
    },
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    image: {
      type: String,
    },
    bio: {
      type: String,
      trim: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Pre-save hook → hash password
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

// Normalize username
UserSchema.pre("save", function (next) {
  if (this.isModified("username")) {
    this.username = this.username.toLowerCase().trim();
  }
  next();
});

// Compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate & hash password reset token
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");
  const expires = Date.now() + 10 * 60 * 1000;

  return { resetToken, hashed, expires };
};

// Update average rating & totalReviews after new review
UserSchema.methods.updateRating = async function () {
  const Review = require("./Review");
  const reviews = await Review.find({ reviewedUser: this._id });

  if (reviews.length === 0) {
    this.averageRating = 0;
    this.totalReviews = 0;
  } else {
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = total / reviews.length;
    this.totalReviews = reviews.length;
  }

  await this.save();
};

module.exports = mongoose.model("User", UserSchema);
