import rateLimit from 'express-rate-limit';
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    status: 'error',
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
export const publicFormLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    status: 'error',
    message: 'Too many submissions from this IP. Please wait a moment.'
  },
  standardHeaders: true,
  legacyHeaders: false
});