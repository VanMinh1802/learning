  /** Phong comment:
  Thường sẽ có 1 cái logger để server debug
  */

  const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  };

  module.exports = logger;