import type { Context, Next } from "hono";
type RecordValue = { count: number; reset: number };
const store = new Map<string, RecordValue>();

/**
 * Create a rate limiting middleware.
 *
 * @param window Time window in milliseconds
 * @param limit Maximum requests allowed within the window
 * @returns A Hono middleware function
 */
/* This function is a hono middleware and is responsible for rate management */
export function rateLimiter(
  window: number,
  limit: number,
): (c: Context, next: Next) => Promise<Response | void> {
  return async (c: Context, next: Next) => {
    const ip = c.req.header("x-forwarded-for") ??
      c.req.header("cf-connecting-ip") ?? "unknown";
    const route = c.req.routePath ?? c.req.path;
    const key = `${ip}:${route}`;

    const now = Date.now();
    let record = store.get(key);

    if (!record || record.reset < now) {
      // 新窗口
      record = { count: 1, reset: now + window };
      store.set(key, record);
    } else {
      record.count++;
    }

    // 设置响应头，方便客户端知道限制信息
    c.header("X-RateLimit-Limit", limit.toString());
    c.header(
      "X-RateLimit-Remaining",
      Math.max(0, limit - record.count).toString(),
    );
    c.header("X-RateLimit-Reset", record.reset.toString());

    if (record.count > limit) {
      return c.text("Too Many Requests", 429);
    }

    return await next();
  };
}
