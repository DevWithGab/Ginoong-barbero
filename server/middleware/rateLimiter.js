/**
 * Simple in-memory rate limiter
 * Tracks requests per IP address and blocks excessive requests
 */

const rateLimitStore = new Map();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (now - entry.windowStart > entry.windowMs * 2) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Creates a rate limiter middleware
 * @param {Object} options - Configuration options
 * @param {number} options.windowMs - Time window in milliseconds (default: 15 minutes)
 * @param {number} options.maxRequests - Max requests allowed in the window (default: 5)
 * @param {string} options.message - Error message when limit is exceeded
 */
function createRateLimiter({
  windowMs = 15 * 60 * 1000,
  maxRequests = 5,
  message = 'Too many requests. Please try again later.'
} = {}) {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    // Get or create entry for this IP
    let entry = rateLimitStore.get(clientIP);

    if (!entry || now - entry.windowStart > windowMs) {
      // Start a new window
      entry = {
        windowStart: now,
        windowMs,
        count: 0
      };
      rateLimitStore.set(clientIP, entry);
    }

    // Increment request count
    entry.count++;

    // Check if limit exceeded
    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((entry.windowStart + windowMs - now) / 1000);
      res.set('Retry-After', retryAfter);
      return res.status(429).json({
        success: false,
        message
      });
    }

    // Add rate limit headers
    res.set('X-RateLimit-Limit', maxRequests);
    res.set('X-RateLimit-Remaining', Math.max(0, maxRequests - entry.count));
    res.set('X-RateLimit-Reset', new Date(entry.windowStart + windowMs).toISOString());

    next();
  };
}

module.exports = { createRateLimiter };
