const errorHandler = (err, req, res, next) => {
  console.error("========== ERROR ==========");
  console.error(err);          // Full error object
  console.error(err.stack);    // Stack trace
  console.error("===========================");

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
