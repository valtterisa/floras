import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import {
  emailConfigured,
  notifyFormSubmission,
} from "@/lib/email/send";
import { userFacingError } from "@/lib/errors";
import { getSiteUrl } from "@/lib/seo";

const MAX_BODY_BYTES = 32_768;

type SubmitBody = {
  key?: unknown;
  fields?: unknown;
  pagePath?: unknown;
  _hp?: unknown;
};

function corsHeaders(origin: string | null, allow: boolean): HeadersInit {
  if (!allow || !origin) {
    return {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };
  }
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function isAllowedPreviewOrigin(origin: string): boolean {
  try {
    const host = new URL(origin).hostname;
    if (host === "localhost" || host === "127.0.0.1") return true;
    if (host.endsWith(".preview.bl.run") || host.endsWith(".bl.run")) return true;
    const sitesDomain =
      process.env.FLORAS_SITES_DOMAIN?.trim() || "floras.app";
    if (host === sitesDomain || host.endsWith(`.${sitesDomain}`)) return true;
    if (host.endsWith(".pages.dev")) return true;
    return false;
  } catch {
    return false;
  }
}

async function originAllowedForKey(
  origin: string,
  key: string
): Promise<boolean> {
  if (isAllowedPreviewOrigin(origin)) return true;

  let host: string;
  try {
    host = new URL(origin).hostname.toLowerCase();
  } catch {
    return false;
  }

  const hints = await fetchQuery(
    api.forms.getCorsHints,
    { key }
  );
  if (!hints) return false;

  if (hints.customDomain) {
    const custom = hints.customDomain.toLowerCase().replace(/^www\./, "");
    if (host === custom || host === `www.${custom}`) return true;
  }
  if (hints.publishedUrl) {
    try {
      const pubHost = new URL(hints.publishedUrl).hostname.toLowerCase();
      if (host === pubHost) return true;
    } catch {
      /* ignore */
    }
  }
  if (hints.cfSubdomain) {
    const sub = hints.cfSubdomain.toLowerCase();
    if (host === sub || host.startsWith(`${sub}.`)) return true;
  }
  return false;
}

function parseFields(raw: unknown): Record<string, string> | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v === "string") out[k] = v;
    else if (typeof v === "number" || typeof v === "boolean") out[k] = String(v);
  }
  return out;
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("Origin");
  const key = new URL(request.url).searchParams.get("key") ?? "";
  if (!origin) {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(null, false),
    });
  }
  const allow =
    isAllowedPreviewOrigin(origin) ||
    (key ? await originAllowedForKey(origin, key) : false);
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin, allow),
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("Origin");
  const contentLength = Number(request.headers.get("Content-Length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json(
      { error: "Payload too large" },
      { status: 413, headers: corsHeaders(origin, false) }
    );
  }

  let body: SubmitBody;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return Response.json(
        { error: "Payload too large" },
        { status: 413, headers: corsHeaders(origin, false) }
      );
    }
    body = JSON.parse(text) as SubmitBody;
  } catch {
    return Response.json(
      { error: "Invalid JSON" },
      { status: 400, headers: corsHeaders(origin, false) }
    );
  }

  if (typeof body._hp === "string" && body._hp.trim().length > 0) {
    return Response.json(
      { ok: true },
      { status: 200, headers: corsHeaders(origin, Boolean(origin)) }
    );
  }

  const key = typeof body.key === "string" ? body.key.trim() : "";
  if (!key) {
    return Response.json(
      { error: "Missing form key" },
      { status: 400, headers: corsHeaders(origin, false) }
    );
  }

  if (!origin) {
    return Response.json(
      { error: "Origin required" },
      { status: 403, headers: corsHeaders(null, false) }
    );
  }

  const allow = await originAllowedForKey(origin, key);
  if (!allow) {
    return Response.json(
      { error: "Origin not allowed" },
      { status: 403, headers: corsHeaders(origin, false) }
    );
  }

  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  const fields = parseFields(body.fields);
  if (!fields) {
    return Response.json(
      { error: "Invalid fields" },
      { status: 400, headers: corsHeaders(origin, allow) }
    );
  }

  const pagePath =
    typeof body.pagePath === "string" ? body.pagePath : undefined;

  try {
    const result = await fetchMutation(
      api.forms.submit,
      {
        key,
        fields,
        pagePath,
        userAgent: request.headers.get("User-Agent") ?? undefined,
        clientKey: ip,
      }
    );

    if (result.ownerEmail && emailConfigured()) {
      const inboxUrl = `${getSiteUrl()}/dashboard/inbox`;
      void notifyFormSubmission({
        to: result.ownerEmail,
        projectName: result.projectName,
        fields,
        inboxUrl,
      }).catch((err) => {
        console.error("Form notification email failed:", err);
      });
    }

    return Response.json(
      { ok: true },
      { status: 200, headers: corsHeaders(origin, allow) }
    );
  } catch (err) {
    const message = userFacingError(err, "Submit failed");
    const raw = err instanceof Error ? err.message : "";
    const status =
      raw.includes("Too many requests")
        ? 429
        : raw.includes("Unknown") ||
            raw.includes("Invalid") ||
            raw.includes("requires")
          ? 400
          : raw.includes("Unauthorized") || raw.includes("misconfigured")
            ? 503
            : 500;
    return Response.json(
      { error: message },
      { status, headers: corsHeaders(origin, allow) }
    );
  }
}
