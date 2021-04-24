const express = require("express");
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews.controller");

const Review = require("../models/Review");

const router = express.Router({ mergeParams: true });

const filteredResults = require("../middlewares/resultFiltering");
const { protect, authorize } = require("../middlewares/auth.middleware");

router
  .route("/")
  .get(
    filteredResults(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protect, authorize("user", "admin"), addReview);

router
  .route("/:id")
  .get(getReview)
  .put(protect, authorize("user", "admin"), updateReview)
  .delete(protect, authorize("user", "admin"), deleteReview);

module.exports = router;
