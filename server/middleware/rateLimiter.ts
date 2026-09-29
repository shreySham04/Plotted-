import { Request, Response, NextFunction } from 'express';

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, TokenBucket>();

const CAPACITY = 30; // Max requests per window
const REFILL_RATE = 10; // Tokens added per minute
const WINDOW_MS = 60 * 1000;

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown-client';
  const now = Date.now();

  let bucket = buckets.get(ip);
  if (!bucket) {
    bucket = { tokens: CAPACITY, lastRefill: now };
    buckets.set(ip, bucket);
  } else {
    // Refill tokens based on elapsed time
    const elapsed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor(elapsed / WINDOW_MS) * REFILL_RATE;
    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(CAPACITY, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }
  }

  if (bucket.tokens <= 0) {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please wait a moment before sending more requests.',
      retryAfterSeconds: 6
    });
    return;
  }

  bucket.tokens--;
  next();
}
