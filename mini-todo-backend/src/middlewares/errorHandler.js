const errorHandler = (err, req, res, next) => {
  const statusCode =
    err.status || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode);

  res.json({
    success: false,
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message: err.message,
    },
  });
};

module.exports = errorHandler;
