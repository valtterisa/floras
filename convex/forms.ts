import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { formSubmissionStatus } from "./schema";
import { requireOwnedProject } from "./lib/auth";
import { authedMutation } from "./lib/customFunctions";
import { rateLimiter } from "./rateLimits";

const MAX_FIELD_KEYS = 20;
const MAX_FIELD_VALUE_LEN = 2000;
const MAX_PAGE_PATH_LEN = 200;

function makeFormPublicKey(): string {
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const b of bytes) {
    out += alphabet[b % alphabet.length]!;
  }
  return out;
}

function sanitizeFields(
  fields: Record<string, string>
): Record<string, string> {
  const out: Record<string, string> = {};
  const entries = Object.entries(fields).slice(0, MAX_FIELD_KEYS);
  for (const [rawKey, rawVal] of entries) {
    const key = rawKey.trim().slice(0, 64);
    if (!key || key.startsWith("_")) continue;
    const val = String(rawVal).trim().slice(0, MAX_FIELD_VALUE_LEN);
    if (!val) continue;
    out[key] = val;
  }
  return out;
}

export const ensureFormPublicKey = authedMutation({
  args: { projectId: v.id("projects") },
  returns: v.string(),
  handler: async (ctx, args) => {
    const { project } = await requireOwnedProject(ctx, args.projectId);
    if (project.formPublicKey) return project.formPublicKey;
    const key = makeFormPublicKey();
    await ctx.db.patch(args.projectId, { formPublicKey: key });
    return key;
  },
});

export const submit = mutation({
  args: {
    key: v.string(),
    fields: v.record(v.string(), v.string()),
    pagePath: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    clientKey: v.optional(v.string()),
  },
  returns: v.object({
    submissionId: v.id("formSubmissions"),
    projectId: v.id("projects"),
    projectName: v.string(),
    ownerEmail: v.union(v.string(), v.null()),
  }),
  handler: async (ctx, args) => {
    const key = args.key.trim();
    if (!key || key.length > 64) {
      throw new Error("Invalid form key");
    }

    const project = await ctx.db
      .query("projects")
      .withIndex("by_form_public_key", (q) => q.eq("formPublicKey", key))
      .unique();
    if (!project) {
      throw new Error("Unknown form key");
    }

    const now = Date.now();
    const clientKey = (args.clientKey ?? "anon").trim().slice(0, 128) || "anon";
    const limited = await rateLimiter.limit(ctx, "formSubmit", {
      key: `${key}:${clientKey}`,
    });
    if (!limited.ok) {
      throw new Error("Too many requests");
    }

    const fields = sanitizeFields(args.fields);
    const hasEmail = Boolean(fields.email);
    const hasName = Boolean(fields.name);
    const hasMessage = Boolean(fields.message);
    if (!hasEmail && !(hasName && hasMessage)) {
      throw new Error("Form requires email, or name and message");
    }

    const pagePath = args.pagePath?.trim().slice(0, MAX_PAGE_PATH_LEN);
    const userAgent = args.userAgent?.trim().slice(0, 300);

    const submissionId = await ctx.db.insert("formSubmissions", {
      projectId: project._id,
      userId: project.userId,
      createdAt: now,
      fields,
      pagePath: pagePath || undefined,
      userAgent: userAgent || undefined,
      status: "new",
    });

    const owner = await ctx.db.get(project.userId);
    const ownerEmail =
      typeof owner?.email === "string" && owner.email.includes("@")
        ? owner.email
        : null;

    return {
      submissionId,
      projectId: project._id,
      projectName: project.name,
      ownerEmail,
    };
  },
});

export const listForUser = query({
  args: {
    projectId: v.optional(v.id("projects")),
    includeArchived: v.optional(v.boolean()),
  },
  returns: v.array(
    v.object({
      _id: v.id("formSubmissions"),
      _creationTime: v.number(),
      projectId: v.id("projects"),
      userId: v.id("users"),
      createdAt: v.number(),
      fields: v.record(v.string(), v.string()),
      pagePath: v.optional(v.string()),
      userAgent: v.optional(v.string()),
      status: formSubmissionStatus,
      projectName: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    if (args.projectId) {
      const project = await ctx.db.get(args.projectId);
      if (!project || project.userId !== userId) return [];
      const rows = await ctx.db
        .query("formSubmissions")
        .withIndex("by_project_created", (q) =>
          q.eq("projectId", args.projectId!)
        )
        .order("desc")
        .take(100);
      return rows
        .filter((r) => args.includeArchived || r.status !== "archived")
        .map((r) => ({
          ...r,
          projectName: project.name,
        }));
    }

    const rows = await ctx.db
      .query("formSubmissions")
      .withIndex("by_user_created", (q) => q.eq("userId", userId))
      .order("desc")
      .take(100);

    const names = new Map<string, string>();
    const out = [];
    for (const r of rows) {
      if (!args.includeArchived && r.status === "archived") continue;
      let name = names.get(r.projectId);
      if (name === undefined) {
        const p = await ctx.db.get(r.projectId);
        name = p?.name ?? "Site";
        names.set(r.projectId, name);
      }
      out.push({ ...r, projectName: name });
    }
    return out;
  },
});

export const unreadCount = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return 0;
    const rows = await ctx.db
      .query("formSubmissions")
      .withIndex("by_user_created", (q) => q.eq("userId", userId))
      .order("desc")
      .take(100);
    return rows.filter((r) => r.status === "new").length;
  },
});

export const setStatus = authedMutation({
  args: {
    submissionId: v.id("formSubmissions"),
    status: formSubmissionStatus,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.submissionId);
    if (!row || row.userId !== ctx.userId) {
      throw new Error("Not found");
    }
    await ctx.db.patch(args.submissionId, { status: args.status });
    return null;
  },
});

export const getCorsHints = query({
  args: {
    key: v.string(),
  },
  returns: v.union(
    v.object({
      cfSubdomain: v.union(v.string(), v.null()),
      customDomain: v.union(v.string(), v.null()),
      publishedUrl: v.union(v.string(), v.null()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const project = await ctx.db
      .query("projects")
      .withIndex("by_form_public_key", (q) =>
        q.eq("formPublicKey", args.key.trim())
      )
      .unique();
    if (!project) return null;
    return {
      cfSubdomain: project.cfSubdomain ?? null,
      customDomain: project.customDomain ?? null,
      publishedUrl: project.publishedUrl ?? null,
    };
  },
});
