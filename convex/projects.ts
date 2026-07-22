import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { projectStatus } from "./schema";
import { autumn } from "./autumn";

const GENERATION_FEATURE = "site_generations";

/** Fail-open access check: never block the app if Autumn is not configured. */
async function canGenerate(ctx: any): Promise<boolean> {
  try {
    const { data } = await autumn.check(ctx, { featureId: GENERATION_FEATURE });
    return data?.allowed ?? true;
  } catch {
    return true;
  }
}

async function trackGeneration(ctx: any): Promise<void> {
  try {
    await autumn.track(ctx, { featureId: GENERATION_FEATURE, value: 1 });
  } catch {
    // fail-open: ignore tracking errors
  }
}

export const create = mutation({
  args: {
    prompt: v.string(),
    name: v.optional(v.string()),
  },
  returns: v.id("projects"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const allowed = await canGenerate(ctx);
    if (!allowed) throw new Error("Generation limit reached. Upgrade your plan to continue.");

    const name = args.name?.trim() || deriveName(args.prompt);
    const projectId = await ctx.db.insert("projects", {
      userId,
      name,
      initialPrompt: args.prompt,
      status: "draft",
    });

    await ctx.db.insert("messages", {
      projectId,
      userId,
      role: "user",
      content: args.prompt,
      status: "complete",
    });

    await trackGeneration(ctx);
    await ctx.scheduler.runAfter(0, internal.generate.run, { projectId });
    return projectId;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== userId) return null;
    return project;
  },
});

export const remove = mutation({
  args: { projectId: v.id("projects") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== userId) throw new Error("Not found");
    const msgs = await ctx.db
      .query("messages")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
    for (const m of msgs) await ctx.db.delete(m._id);
    await ctx.db.delete(args.projectId);
    return null;
  },
});

// ---------- internal helpers used by the generation action ----------

export const getInternal = internalQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => ctx.db.get(args.projectId),
});

export const setStatus = internalMutation({
  args: { projectId: v.id("projects"), status: projectStatus },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, { status: args.status });
    return null;
  },
});

export const setBox = internalMutation({
  args: { projectId: v.id("projects"), boxId: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, { boxId: args.boxId });
    return null;
  },
});

export const setPreview = internalMutation({
  args: { projectId: v.id("projects"), previewUrl: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, { previewUrl: args.previewUrl });
    return null;
  },
});

export const setPlan = internalMutation({
  args: { projectId: v.id("projects"), plan: v.any() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, { plan: args.plan });
    return null;
  },
});

export const setError = internalMutation({
  args: { projectId: v.id("projects"), error: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, { status: "error", error: args.error });
    return null;
  },
});

function deriveName(prompt: string): string {
  const cleaned = prompt.trim().replace(/\s+/g, " ");
  const words = cleaned.split(" ").slice(0, 6).join(" ");
  return words.length > 48 ? words.slice(0, 48) + "…" : words || "Untitled site";
}
