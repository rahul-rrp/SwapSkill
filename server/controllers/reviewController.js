const Review = require("../models/Review");
const User = require("../models/User");
const Request = require("../models/Request");
const { sendNotification } = require("./notificationController");

// ---------------- ADD REVIEW ----------------
exports.addReview = async (req, res) => {
  try {
    const reviewerId = req.user.id;
    const reviewedUserId = req.params.userId;
    const { rating, comment, requestId } = req.body;

    if (reviewerId === reviewedUserId) {
      return res.status(400).json({ message: "You cannot review yourself." });
    }

    // Check if they have completed a swap together
    const completedSwap = await Request.findOne({
      response: "completed",
      $or: [
        { senderId: reviewerId, receiverId: reviewedUserId },
        { senderId: reviewedUserId, receiverId: reviewerId },
      ],
    });

    if (!completedSwap) {
      return res.status(400).json({ message: "You can only review users you have completed a swap with." });
    }

    // Check if review for this request already exists
    const existing = await Review.findOne({ reviewer: reviewerId, reviewedUser: reviewedUserId, requestId });
    if (existing) {
      return res.status(400).json({ message: "You already reviewed this user for this swap." });
    }

    // Create review
    const review = await Review.create({
      reviewer: reviewerId,
      reviewedUser: reviewedUserId,
      requestId,
      rating,
      comment,
    });

    // Recalculate stats
    const reviews = await Review.find({ reviewedUser: reviewedUserId });
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;

    await User.findByIdAndUpdate(reviewedUserId, { totalReviews, averageRating });

    // ✅ Notify the reviewed user
    await sendNotification(
      reviewedUserId,
      `${req.user.firstName} left you a review: "${comment || "No comment"}"`,
      "review"
    );

    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ---------------- GET REVIEWS FOR USER ----------------
exports.getReviewsForUser = async (req, res) => {
  try {
    const reviewedUserId = req.params.userId;

    const reviews = await Review.find({ reviewedUser: reviewedUserId })
      .populate("reviewer", "username firstName lastName");

    const avgRating = reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

    res.json({ success: true, avgRating, totalReviews: reviews.length, reviews });
  } catch (error) {
    console.error("Get Reviews Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ---------------- UPDATE REVIEW ----------------
exports.updateReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found." });

    if (review.reviewer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this review." });
    }

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();

    // Recalculate stats
    const reviews = await Review.find({ reviewedUser: review.reviewedUser });
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;
    await User.findByIdAndUpdate(review.reviewedUser, { totalReviews, averageRating });

    // ✅ Notify reviewed user that review was updated
    await sendNotification(
      review.reviewedUser,
      `${req.user.firstName} updated their review for you.`,
      "review"
    );

    res.json({ success: true, message: "Review updated", review });
  } catch (error) {
    console.error("Update Review Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ---------------- DELETE REVIEW ----------------
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found." });

    if (review.reviewer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this review." });
    }

    await review.deleteOne();

    // Recalculate stats
    const reviews = await Review.find({ reviewedUser: review.reviewedUser });
    const totalReviews = reviews.length;
    const averageRating = reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
      : 0;
    await User.findByIdAndUpdate(review.reviewedUser, { totalReviews, averageRating });

    // ✅ Notify reviewed user that review was deleted
    await sendNotification(
      review.reviewedUser,
      `${req.user.firstName} deleted their review for you.`,
      "review"
    );

    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({ message: error.message });
  }
};
