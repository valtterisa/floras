import { AppError } from "@/lib/errors";

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
};

type CloudflareEmailResponse = {
  success: boolean;
  errors?: Array<{ code?: number; message?: string }>;
  result?: unknown;
};

function emailApiToken(): string {
  const token =
    process.env.CLOUDFLARE_EMAIL_API_TOKEN?.trim() ||
    process.env.CLOUDFLARE_API_TOKEN?.trim();
  if (!token) {
    throw new AppError("config", "Cloudflare Email Sending is not configured.", {
      detail:
        "Set CLOUDFLARE_EMAIL_API_TOKEN or CLOUDFLARE_API_TOKEN with Email Sending: Edit",
    });
  }
  return token;
}

function accountId(): string {
  const id = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  if (!id) {
    throw new AppError("config", "CLOUDFLARE_ACCOUNT_ID is not set.");
  }
  return id;
}

function defaultFrom(): string {
  return (
    process.env.EMAIL_FROM?.trim() || "Floras <noreply@floras.app>"
  );
}

export function emailConfigured(): boolean {
  return Boolean(
    (process.env.CLOUDFLARE_EMAIL_API_TOKEN?.trim() ||
      process.env.CLOUDFLARE_API_TOKEN?.trim()) &&
      process.env.CLOUDFLARE_ACCOUNT_ID?.trim()
  );
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  if (!input.html && !input.text) {
    throw new AppError("unknown", "Email requires html or text body.");
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId()}/email/sending/send`;
  const body: Record<string, unknown> = {
    to: input.to,
    from: input.from ?? defaultFrom(),
    subject: input.subject,
  };
  if (input.html) body.html = input.html;
  if (input.text) body.text = input.text;
  if (input.replyTo) body.reply_to = input.replyTo;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${emailApiToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json().catch(() => null)) as CloudflareEmailResponse | null;
  if (!res.ok || !json?.success) {
    const detail =
      json?.errors?.map((e) => e.message).filter(Boolean).join("; ") ||
      `HTTP ${res.status}`;
    throw new AppError("unknown", "Failed to send email.", { detail });
  }
}

export async function notifyFormSubmission(opts: {
  to: string;
  projectName: string;
  fields: Record<string, string>;
  inboxUrl: string;
}): Promise<void> {
  const fieldLines = Object.entries(opts.fields)
    .filter(([, v]) => v.trim().length > 0)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const htmlFields = Object.entries(opts.fields)
    .filter(([, v]) => v.trim().length > 0)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">${escapeHtml(k)}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`
    )
    .join("");

  await sendEmail({
    to: opts.to,
    subject: `New message on ${opts.projectName}`,
    text: `You received a new form submission on ${opts.projectName}.\n\n${fieldLines}\n\nView inbox: ${opts.inboxUrl}`,
    html: `<p>You received a new form submission on <strong>${escapeHtml(opts.projectName)}</strong>.</p>
<table style="border-collapse:collapse;margin:16px 0">${htmlFields}</table>
<p><a href="${escapeHtml(opts.inboxUrl)}">Open inbox</a></p>`,
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
