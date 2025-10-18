import { rateLimit } from 'express-rate-limit';
import { Request, Response } from 'express';

declare global {
    namespace Express {
      interface Request {
        rateLimit?: {
          resetTime: number;
        };
      }
    }
}

// Standard overall API rate limiting configuration
// see NPM package for express-rate-limit
export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 10, // Limit each IP to 10 requests per windowMs
    message: {
      error: 'Too many requests from this IP address',
      retryAfter: '15 minutes',
      documentation: 'https://api.example.com/docs/rate-limits'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
      res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests from this IP, please try again later',
        retryAfter: Math.round(req.rateLimit?.resetTime ?? 0 / 1000) || 15
      });
    }
  });