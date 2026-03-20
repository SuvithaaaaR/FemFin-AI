const { validationResult } = require("express-validator");

/**
 * Middleware to check validation results
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value,
      })),
    });
  }

  next();
};

/**
 * Check if required fields are present in request body
 */
exports.requireFields = (fields) => {
  return (req, res, next) => {
    const missingFields = [];

    fields.forEach((field) => {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missingFields,
      });
    }

    next();
  };
};

/**
 * Sanitize input to prevent XSS and injection attacks
 */
exports.sanitizeInput = (req, res, next) => {
  // Remove any script tags and dangerous HTML
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
          .trim();
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
};
