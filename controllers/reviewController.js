const Review = require("./../models/reviewModel");
const catchAsync = require("./../utils/catchAsync");

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.findById(req.params.id)
    .populate({
      path: "tour",
      select: "_id name",
    })
    .populate({
      path: "user",
      select: "_id name photo",
    });

  res.status(200).json({
    status: "success",
    data: {
      reviews,
    },
  });
});

exports.createReviews = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  console.log("review param:", req.params);
  console.log("review User:", req.user);
  console.log("req body", req.body);
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: "success",

    data: {
      review: newReview,
    },
  });
});
