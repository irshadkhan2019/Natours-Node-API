const mongoose = require("mongoose");
const slugify = require("slugify");
const User = require("./userModel");
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal then 40 characters"],
      minlength: [10, "A tour name must have more or equal then 10 characters"],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    //New fields  Nesting done lvl 2
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: "Point", //can be polygon and other
        enum: ["Point"],
      },
      coordinates: [Number], //specify [long ,lat] here
      address: String,
      description: String,
    },
    locations: [
      //arr of locations this tour have
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    secretTour: {
      type: Boolean,
      default: false,
    },
    guides: [
      {
        type: mongoose.Schema.ObjectId, //JUST SPECIFY THAT IT TAKES REFRENCE oF ANOTHER SCHEMA OBJECT ID .
        ref: "User", //WHICH MODEL TO REFER
      },
    ],
  },
  {
    //options
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ startLocation: "2dsphere" });

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7; //this refers to the document
});

//doc middleware for doc save /creation but not update
tourSchema.pre("save", function (next) {
  //it has acces to this keyword which refers to the current document which is about to get saved .
  console.log("saving doc to db");
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.post("save", function (doc, next) {
  //it don't have acces to this keyword .
  console.log(doc.slug, "save successfully");
  next();
});

//query middleware
tourSchema.pre(/^find/, function (next) {
  //this refer to query obj
  console.log("FIND for Query Middleware ran");
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  //we get access to docs returned by our query in post middleware
  //this middleware runs after our  query has xecuted
  // console.log("After query run:", docs.constructor);
  console.log("After query run:");

  next();
});

// tourSchema.pre("aggregate", function (next) {
//   //this points to current aggregation object  .
//   //unshift() adds element at beginiing of arry .
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   //we are adding 1 more stage at beginning of aggregation pipeline()

//   console.log(this.pipeline());
//   next();
// });

// tourSchema.pre("save", async function (next) {
//   //for each user id we mentioned in guides get actual user
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

tourSchema.pre(/^find/, function (next) {
  console.log("populate ran");
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});

//virtual populate review for a tour
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
