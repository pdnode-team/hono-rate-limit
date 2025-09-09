# Pdnode - Hono - Rate Limiter
A simple rate limiting middleware for [Hono](https://hono.dev) apps.

## Installation
```bash
deno add jsr:@pdnode/pdnode-hono-rate-limiter

```
```ts
import * as pdnode_hono_rate_limiter from "@pdnode/pdnode-hono-rate-limiter";
// or
import * as pdnode_hono_rate_limiter from "jsr:@pdnode/pdnode-hono-rate-limiter";
// or
import rateLimiter from "@pdnode/pdnode-hono-rate-limiter"
.....
```

## Usage
```ts
import { Hono } from "hono"
import { rateLimiter } from "jsr:@yourname/hono-rate-limit"

const app = new Hono()

// Limit to 5 requests per 10 seconds per IP
app.use("/api", rateLimiter(5, 10_000))

app.get("/api", (c) => c.text("Hello, world!"))

Deno.serve(app.fetch)

```