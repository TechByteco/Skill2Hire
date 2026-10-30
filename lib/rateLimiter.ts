/**
 * lib/rateLimiter.ts
 * ------------------
 * Simple in-memory rate limiter for auth endpoints.
 * Limits to MAX_ATTEMPTS requests per WINDOW_MS per IP address.
 *
 * Design notes:
 * - Works within a single Next.js process (sufficient for demo / small prod).
 * - For multi-instance production, swap the Map for a Redis-backed counter.
 * - Auto-cleans expired entries to prevent unbounded memory growth.
 */

interface RateLimitEntry {
  attempts: number;
  windowStart: number; // epoch ms
}

// Configuration
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // clean expired entries every 5 min

const store = new Map<string, RateLimitEntry>();

// Background cleanup — prevents the map from growing indefinitely
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    store.forEach((entry, key) => {
      if (now - entry.windowStart >= WINDOW_MS) {
        store.delete(key);
      }
    });
  }, CLEANUP_INTERVAL_MS);
}

export interface RateLimitResult {
  allowed: boolean;
  /** Remaining attempts before lockout */
  remaining: number;
  /** Seconds until the window resets */
  retryAfterSeconds: number;
}

/**
 * Check and record an attempt for a given key (typically `ip:endpoint`).
 * Returns { allowed: true } when under the limit,
 * or { allowed: false, retryAfterSeconds } when the limit is exceeded.
 */
export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    // First attempt or window expired — start a fresh window
    store.set(key, { attempts: 1, windowStart: now });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, retryAfterSeconds: 0 };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil((WINDOW_MS - (now - entry.windowStart)) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  entry.attempts += 1;
  store.set(key, entry);
  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - entry.attempts,
    retryAfterSeconds: 0
  };
}

/**
 * Extract a best-effort IP address from a Next.js Request/NextRequest object.
 * Falls back to 'unknown' if no IP headers are present.
 */
export function getClientIp(request: Request): string {
  // Standard forwarded-for header (set by reverse proxies / Vercel)
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();

  // Cloudflare
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  // Vercel / edge
  const vercelIp = request.headers.get('x-real-ip');
  if (vercelIp) return vercelIp.trim();

  return 'unknown';
}
