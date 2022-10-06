const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.createReviews
  );

router.route("/:id").get(reviewController.getReview);

module.exports = router;
