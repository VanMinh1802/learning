const errorHandler = (err, req, res, next) => {
  const statusCode =
    err.status || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode);
/**
 * Phong Comment: Thiếu Error Code
 */
  res.json({
    success: false,
    error: {
      message: err.message,
    },
  });
};

module.exports = errorHandler;
