import { RateLimiter, MINUTE } from "@convex-dev/rate-limiter";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { mutation } from "./_generated/server";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  generate: { kind: "fixed window", rate: 30, period: MINUTE },
  ask: { kind: "fixed window", rate: 40, period: MINUTE },
  preview: { kind: "fixed window", rate: 20, period: MINUTE },
  anthropicKey: { kind: "fixed window", rate: 10, period: MINUTE },
  formSubmit: {
    kind: "token bucket",
    rate: 12,
    period: MINUTE,
    capacity: 12,
  },
});

export const rateLimitName = v.union(
  v.literal("generate"),
  v.literal("ask"),
  v.literal("preview"),
  v.literal("anthropicKey")
);

export const check = mutation({
  args: {
    name: rateLimitName,
    key: v.string(),
  },
  returns: v.object({
    ok: v.boolean(),
    retryAfter: v.union(v.number(), v.null()),
  }),
  handler: async (ctx, args) => {
    const key = args.key.trim().slice(0, 200);
    if (!key) throw new Error("Invalid rate limit key");
    const status = await rateLimiter.limit(ctx, args.name, { key });
    return {
      ok: status.ok,
      retryAfter: status.retryAfter ?? null,
    };
  },
});
