const express = require("express");
const rateLimit = require("express-rate-limit");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const helmet = require("helmet");
const dotenv = require("dotenv");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const app = express();
const cors = require("cors");

const limiter = rateLimit({
  max: 50, //max no of request per IP
  windowMs: 60 * 60 * 1000, //time frame b4 resetting max limit  in ms
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use(cors());
app.use("/api", limiter);

dotenv.config({ path: "./config.env" });
// 1) MIDDLEWARES
app.use(helmet());
app.use(express.json({ limit: "10kb" }));

app.use(express.static(path.join(__dirname, "public")));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    //SKIP DULICATES FIELDS IF THEY ARE FROM THE BELOW LISTS
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use((req, res, next) => {
  console.log("Hello from the middleware APPJS 👋");
  // console.log(`app dir name :${__dirname}`);
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

console.log(app.get("env"));
console.log(process.env.NODE_ENV);
// 3) ROUTES

//api route
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/reviews", reviewRouter);

//global redirect for any other routes
app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

//error handler
app.use(globalErrorHandler);

module.exports = app;
