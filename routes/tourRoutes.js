const tourController = require("../controllers/tourController");
const express = require("express");
const tourRouter = express.Router();
const router = express.Router();
const authController = require("./../controllers/authController");
const reviewController = require("./../controllers/reviewController");
const reviewRouter = require("./reviewRoutes");
// router.param("id", tourController.checkID);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

router
  .route("/top-5-cheap-tour")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getTourStats);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

router.use("/:tourId/reviews", reviewRouter);

//geospatial
router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getToursWithin);

router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);
module.exports = router;
