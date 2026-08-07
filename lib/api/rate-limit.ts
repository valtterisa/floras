import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { AppError } from "@/lib/errors";

export type ApiRateLimitName =
  | "generate"
  | "ask"
  | "preview"
  | "anthropicKey";

export async function assertRateLimit(opts: {
  name: ApiRateLimitName;
  key: string;
}): Promise<void> {
  const status = await fetchMutation(
    api.rateLimits.check,
    {
      name: opts.name,
      key: opts.key,
    }
  );
  if (!status.ok) {
    throw new AppError("rate_limit");
  }
}
