// routes/reviewRoutes.js
const express = require("express");
const { addReview, getReviewsForUser, updateReview, deleteReview } = require("../controllers/reviewController");
const { auth } = require("../middlewares/Auth");
const router = express.Router();

router.post("/:userId", auth, addReview);
router.get("/:userId", auth, getReviewsForUser);
router.put("/:reviewId", auth, updateReview);
router.delete("/:reviewId", auth, deleteReview);
module.exports = router;
