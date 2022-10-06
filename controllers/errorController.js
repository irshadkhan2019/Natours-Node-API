const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path} :${err.value}`;
  return new AppError(message, 404); //via this we transforemd the error of mongoose into operational error .
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate fields ${err.keyValue.name} ADDED`;
  console.log(err);
  return new AppError(message, 404);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Validation error occured ${errors.join(". ")}`;
  console.log(err);
  return new AppError(message, 404);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  //operational trusted msg send to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //log error
    console.error("ERROR BOOM~~", err);
    //programming or other unknown error :don;t leak error details
    res.status(500).json({
      status: "error",
      message: "something went very wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  console.log("From global error handler");
  console.log(err.stack); //show us where error happened
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    //handling invalid database id
    let error = { ...err };
    console.log("INSIDE production");
    console.log("error name", err);
    if (err.name === "CastError") {
      console.log("INSIDE production if");
      error = handleCastErrorDB(error);
    }
    //Handling Duplciate key Db error
    if (err.code == 11000) {
      error = handleDuplicateFieldsDB(err);
    }
    if (err.name === "ValidationError") {
      error = handleValidationErrorDB(err);
    }

    sendErrorProd(error, res);
  }
};
