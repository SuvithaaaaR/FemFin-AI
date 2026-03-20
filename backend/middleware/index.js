// Central export for all middleware
module.exports = {
  ...require("./auth"),
  ...require("./errorHandler"),
  ...require("./validation"),
  ...require("./rateLimiter"),
  ...require("./logger"),
};
