export type RetryOptions = {
  attempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  label: string;
  retryable: (error: unknown) => boolean;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function backoffDelay(
  attemptIndex: number,
  initialDelayMs: number,
  maxDelayMs: number
): number {
  const base = Math.min(maxDelayMs, initialDelayMs * 2 ** attemptIndex);
  const jitter = 0.8 + Math.random() * 0.4;
  return Math.round(base * jitter);
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: RetryOptions
): Promise<T> {
  const attempts = Math.max(1, opts.attempts);
  let lastError: unknown;

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const isLast = i === attempts - 1;
      if (isLast || !opts.retryable(error)) {
        throw error;
      }
      const delay = backoffDelay(i, opts.initialDelayMs, opts.maxDelayMs);
      console.warn(
        `[retry] ${opts.label} attempt ${i + 1}/${attempts} failed; retrying in ${delay}ms`,
        error instanceof Error ? error.message : error
      );
      await sleep(delay);
    }
  }

  throw lastError;
}

function httpStatusFromError(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;

  if (
    "status" in error &&
    typeof (error as { status: unknown }).status === "number"
  ) {
    return (error as { status: number }).status;
  }

  if (
    "statusCode" in error &&
    typeof (error as { statusCode: unknown }).statusCode === "number"
  ) {
    return (error as { statusCode: number }).statusCode;
  }

  if (
    "response" in error &&
    typeof (error as { response: unknown }).response === "object" &&
    (error as { response: unknown }).response !== null
  ) {
    const response = (error as { response: { status?: unknown } }).response;
    if (typeof response.status === "number") return response.status;
  }

  return undefined;
}

export function isRetryableNetworkError(error: unknown): boolean {
  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : typeof error === "string"
        ? error.toLowerCase()
        : "";

  return (
    /\b(network|fetch failed|econnrefused|econnreset|enotfound|etimedout|socket|offline|eai_again)\b/.test(
      message
    ) || /\btimed?\s*out\b/.test(message)
  );
}

export function isRetryableCloudflareError(error: unknown): boolean {
  const status = httpStatusFromError(error);
  if (
    status === 408 ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  ) {
    return true;
  }
  return isRetryableNetworkError(error);
}

export function isRetryableWranglerError(error: unknown): boolean {
  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : typeof error === "string"
        ? error.toLowerCase()
        : "";

  if (
    /\b(429|rate.?limit|502|503|504|timeout|timed out|network|econnreset|fetch failed)\b/.test(
      message
    )
  ) {
    return true;
  }
  return isRetryableNetworkError(error);
}

export function isRetryableBoxError(error: unknown): boolean {
  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : typeof error === "string"
        ? error.toLowerCase()
        : "";

  if (
    /\b(timeout|timed out|provision|temporarily|unavailable|retry|box_securing)\b/.test(
      message
    )
  ) {
    return true;
  }
  return isRetryableNetworkError(error);
}
