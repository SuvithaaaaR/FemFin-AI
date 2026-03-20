const jwt = require("jsonwebtoken");
const { getSupabase } = require("../config/supabase");

const findUserById = async (id) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, phone_number, profile, credit_score")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Protect routes - Verify JWT token
 */
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route. Please login.",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await findUserById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Token is invalid.",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route. Invalid token.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Authorize roles - Check if user has required role
 * @param  {...any} roles - Array of allowed roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

/**
 * Optional auth - Adds user to req if token exists, but doesn't require it
 */
exports.optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await findUserById(decoded.id);
    } catch (error) {
      // Token invalid but continue without user
      req.user = null;
    }
  }

  next();
};

/**
 * Check if user owns the resource
 * Requires protect middleware to run first
 */
exports.checkOwnership = (Model, paramName = "id") => {
  return async (req, res, next) => {
    try {
      const resource = await Model.findById(req.params[paramName]);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: "Resource not found",
        });
      }

      // Check if user owns the resource or is admin
      if (
        resource.owner?.toString() !== req.user.id &&
        resource.creator?.toString() !== req.user.id &&
        resource.user?.toString() !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to access this resource",
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error checking resource ownership",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };
};
