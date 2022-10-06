//we want all error object to inherit from built in error
class AppError extends Error {
  constructor(message, statusCode) {
    //we pass message to built in error class ka constuctor.
    //It the only paramter out build in Error class accepts as seend in prev example.
    super(message); //whatever we pass to parent class becomes message property or error obejct
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    //operational error eg.user creating tour without required fields
    this.isOperational = true;
    Error.captureStackTrace(this, this.contructor); ////show us where error happened
  }
}

module.exports = AppError;
