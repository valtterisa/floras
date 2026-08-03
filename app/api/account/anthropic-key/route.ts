import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import {
  apiKeyLast4,
  encryptApiKey,
  looksLikeAnthropicKey,
} from "@/lib/billing/byok-crypto";
import { AppError, appErrorResponse } from "@/lib/errors";

export const runtime = "nodejs";

export async function GET() {
  const token = await convexAuthNextjsToken();
  if (!token) {
    return appErrorResponse(new AppError("auth"), 401);
  }

  const meta = await fetchQuery(api.users.getAnthropicKeyMeta, {}, { token });
  if (!meta) {
    return appErrorResponse(new AppError("auth"), 401);
  }

  return Response.json(meta);
}

export async function PUT(req: Request) {
  const token = await convexAuthNextjsToken();
  if (!token) {
    return appErrorResponse(new AppError("auth"), 401);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const key =
    typeof body === "object" &&
    body !== null &&
    "apiKey" in body &&
    typeof (body as { apiKey: unknown }).apiKey === "string"
      ? (body as { apiKey: string }).apiKey.trim()
      : "";

  if (!looksLikeAnthropicKey(key)) {
    return Response.json(
      {
        error:
          "Invalid Anthropic API key. Keys start with sk-ant- and come from console.anthropic.com.",
      },
      { status: 400 }
    );
  }

  try {
    const ciphertext = encryptApiKey(key);
    const last4 = apiKeyLast4(key);
    await fetchMutation(
      api.users.setAnthropicKey,
      { ciphertext, last4 },
      { token }
    );
    return Response.json({ configured: true, last4 });
  } catch (error) {
    console.error("[byok] failed to save key", error);
    return Response.json(
      { error: "Could not save API key. Check server configuration." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const token = await convexAuthNextjsToken();
  if (!token) {
    return appErrorResponse(new AppError("auth"), 401);
  }

  await fetchMutation(api.users.clearAnthropicKey, {}, { token });
  return Response.json({ configured: false, last4: null });
}
