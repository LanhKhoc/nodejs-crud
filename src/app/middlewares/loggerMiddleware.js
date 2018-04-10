const loggerMiddleware = (req, res, next) => {
  // res.end("loggerMiddleware");
  // console.log("loggerMiddleware");
  next();
}

module.exports = {
  loggerMiddleware,
};