const rateLimit = require("express-rate-limit");

const normalizeIdentifier = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const authKeyGenerator = (req) => {
  const email = normalizeIdentifier(req?.body?.email);
  const username = normalizeIdentifier(req?.body?.username);
  const identifier = email || username || "anonymous";
  return `${req.ip}:${identifier}`;
};

/**
 * General API rate limiter
 */
exports.apiLimiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes default
  max: process.env.RATE_LIMIT_MAX || 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
});

/**
 * Stricter rate limiter for authentication routes
 */
exports.authLimiter = rateLimit({
  windowMs: (process.env.AUTH_RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes default
  max: process.env.AUTH_RATE_LIMIT_MAX || 20, // Default 20 attempts per window
  skipSuccessfulRequests: true, // Don't count successful requests
  keyGenerator: authKeyGenerator,
  message: {
    success: false,
    message: "Too many auth attempts, please try again in a few minutes.",
  },
});

/**
 * Registration limiter (less strict than login limiter)
 */
exports.registerLimiter = rateLimit({
  windowMs: (process.env.AUTH_RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: process.env.REGISTER_RATE_LIMIT_MAX || 60,
  skipSuccessfulRequests: true,
  keyGenerator: authKeyGenerator,
  message: {
    success: false,
    message: "Too many registration attempts, please try again shortly.",
  },
});

/**
 * Rate limiter for creating resources (campaigns, businesses)
 */
exports.createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 creates per hour
  message: {
    success: false,
    message: "Too many resources created, please try again later.",
  },
});

/**
 * Rate limiter for AI/computation intensive operations
 */
exports.aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 AI requests per hour
  message: {
    success: false,
    message: "Too many AI requests, please try again later.",
  },
});
