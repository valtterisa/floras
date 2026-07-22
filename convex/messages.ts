import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { agentStep, messageStatus } from "./schema";
import { autumn } from "./autumn";

const GENERATION_FEATURE = "site_generations";

export const list = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== userId) return [];
    return await ctx.db
      .query("messages")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("asc")
      .collect();
  },
});

export const send = mutation({
  args: { projectId: v.id("projects"), content: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== userId) throw new Error("Not found");

    try {
      const { data } = await autumn.check(ctx, { featureId: GENERATION_FEATURE });
      if (data && data.allowed === false) {
        throw new Error("Generation limit reached. Upgrade your plan to continue.");
      }
    } catch (e) {
      if (e instanceof Error && e.message.includes("limit reached")) throw e;
      // otherwise fail-open
    }

    await ctx.db.insert("messages", {
      projectId: args.projectId,
      userId,
      role: "user",
      content: args.content,
      status: "complete",
    });

    try {
      await autumn.track(ctx, { featureId: GENERATION_FEATURE, value: 1 });
    } catch {
      // fail-open
    }

    await ctx.scheduler.runAfter(0, internal.generate.run, {
      projectId: args.projectId,
    });
    return null;
  },
});

// ---------- internal helpers used by the generation action ----------

export const listForAgent = internalQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("asc")
      .collect();
  },
});

export const createAssistant = internalMutation({
  args: { projectId: v.id("projects"), userId: v.id("users") },
  returns: v.id("messages"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      projectId: args.projectId,
      userId: args.userId,
      role: "assistant",
      content: "",
      steps: [],
      status: "streaming",
    });
  },
});

export const addStep = internalMutation({
  args: { messageId: v.id("messages"), step: agentStep },
  returns: v.null(),
  handler: async (ctx, args) => {
    const msg = await ctx.db.get(args.messageId);
    if (!msg) return null;
    const steps = [...(msg.steps ?? []), args.step];
    await ctx.db.patch(args.messageId, { steps });
    return null;
  },
});

export const finish = internalMutation({
  args: {
    messageId: v.id("messages"),
    content: v.string(),
    status: messageStatus,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      content: args.content,
      status: args.status,
    });
    return null;
  },
});
