const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  console.log(err);
  // new object to get a global
  let error = {
    ...err,
  };
  error.message = err.message;

  // mongoose bad id
  if (err.name == "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // duplicate key
  if (err.code === 11000) {
    const message = `Duplicate item value found`;
    error = new ErrorResponse(message, 400);
  }

  // model field validations
  if (err.name == "ValidatorError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
