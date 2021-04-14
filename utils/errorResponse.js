class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
