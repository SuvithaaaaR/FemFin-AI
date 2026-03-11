/**
 * Request logger middleware
 * Logs HTTP method, URL, status code, and response time
 */
exports.requestLogger = (req, res, next) => {
  const start = Date.now();

  // Override res.json to capture status code
  const originalJson = res.json;
  res.json = function (data) {
    const duration = Date.now() - start;

    // Log format: [timestamp] METHOD /path - STATUS - duration ms
    const timestamp = new Date().toISOString();
    const method = req.method;
    const path = req.originalUrl || req.url;
    const status = res.statusCode;

    // Color code based on status
    let statusColor = "\x1b[32m"; // Green for 2xx
    if (status >= 400 && status < 500) statusColor = "\x1b[33m"; // Yellow for 4xx
    if (status >= 500) statusColor = "\x1b[31m"; // Red for 5xx

    console.log(
      `\x1b[36m[${timestamp}]\x1b[0m ${method} ${path} - ${statusColor}${status}\x1b[0m - ${duration}ms`,
    );

    return originalJson.call(this, data);
  };

  next();
};

/**
 * Add request ID to each request for tracking
 */
exports.addRequestId = (req, res, next) => {
  req.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader("X-Request-Id", req.id);
  next();
};
