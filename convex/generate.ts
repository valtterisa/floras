"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { buildSiteAgent } from "@/lib/ai/agent";
import * as box from "@/lib/box/client";

/**
 * Orchestrates one turn of site generation: ensure a Box sandbox exists, run the
 * AI SDK agent against the conversation, and stream tool activity + the final
 * summary back into Convex so the UI updates reactively.
 */
export const run = internalAction({
  args: { projectId: v.id("projects") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const project = await ctx.runQuery(internal.projects.getInternal, {
      projectId: args.projectId,
    });
    if (!project) return null;

    const history = await ctx.runQuery(internal.messages.listForAgent, {
      projectId: args.projectId,
    });

    const assistantId = await ctx.runMutation(internal.messages.createAssistant, {
      projectId: args.projectId,
      userId: project.userId,
    });

    try {
      if (!box.boxConfigured()) {
        throw new Error(
          "BOX_API_KEY is not configured. Add it to the Convex environment to enable sandbox previews."
        );
      }

      let boxId = project.boxId;
      if (!boxId) {
        await ctx.runMutation(internal.projects.setStatus, {
          projectId: args.projectId,
          status: "provisioning",
        });
        boxId = await box.createSandbox(project.name);
        await ctx.runMutation(internal.projects.setBox, {
          projectId: args.projectId,
          boxId,
        });
      }

      await ctx.runMutation(internal.projects.setStatus, {
        projectId: args.projectId,
        status: "generating",
      });

      const agent = buildSiteAgent({
        boxId,
        hasPreview: Boolean(project.previewUrl),
        onStep: (step) =>
          ctx.runMutation(internal.messages.addStep, {
            messageId: assistantId,
            step,
          }),
        onPlan: (plan) =>
          ctx.runMutation(internal.projects.setPlan, {
            projectId: args.projectId,
            plan,
          }),
        onPreview: (url) =>
          ctx.runMutation(internal.projects.setPreview, {
            projectId: args.projectId,
            previewUrl: url,
          }),
      });

      const convo = (history as any[])
        .filter((m) => m.content)
        .map((m) => ({
          role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
          content: m.content as string,
        }));

      const result = await agent.generate({ messages: convo });

      await ctx.runMutation(internal.messages.finish, {
        messageId: assistantId,
        content: result.text || "Done.",
        status: "complete",
      });
      await ctx.runMutation(internal.projects.setStatus, {
        projectId: args.projectId,
        status: "ready",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await ctx.runMutation(internal.messages.finish, {
        messageId: assistantId,
        content: `Something went wrong: ${message}`,
        status: "error",
      });
      await ctx.runMutation(internal.projects.setError, {
        projectId: args.projectId,
        error: message,
      });
    }
    return null;
  },
});
