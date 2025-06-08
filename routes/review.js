// routes/review.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const reviewController = require("../controllers/reviews.js");
const { isLoggedin,validateReview,isReviewAuthor } = require("../middleware.js");


// POST review
router.post("/",isLoggedin, validateReview, wrapAsync(reviewController.createReview));

// DELETE review
router.delete("/:reviewId",isLoggedin,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
