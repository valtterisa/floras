import { v } from "convex/values";
import { R2 } from "@convex-dev/r2";
import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { components } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { requireOwnedProject } from "./lib/auth";
import { authedMutation } from "./lib/customFunctions";

export const r2 = new R2(components.r2);

export const MAX_SITE_SNAPSHOT_BYTES = 200 * 1024 * 1024;

export function siteSnapshotKey(projectId: Id<"projects"> | string): string {
  return `sites/${projectId}/workspace.tar.gz`;
}

export const prepareSiteSnapshotUpload = authedMutation({
  args: { projectId: v.id("projects") },
  returns: v.object({
    key: v.string(),
    url: v.string(),
  }),
  handler: async (ctx, args) => {
    await requireOwnedProject(ctx, args.projectId);
    return await r2.generateUploadUrl(siteSnapshotKey(args.projectId));
  },
});

export const finalizeSiteSnapshot = authedMutation({
  args: {
    projectId: v.id("projects"),
    key: v.string(),
    contentLength: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireOwnedProject(ctx, args.projectId);
    const expected = siteSnapshotKey(args.projectId);
    if (args.key !== expected) {
      throw new Error("Invalid snapshot key");
    }
    if (
      typeof args.contentLength === "number" &&
      (args.contentLength <= 0 || args.contentLength > MAX_SITE_SNAPSHOT_BYTES)
    ) {
      throw new Error("Snapshot exceeds size limit");
    }
    await ctx.db.patch(args.projectId, { snapshotKey: args.key });
    await ctx.scheduler.runAfter(0, components.r2.lib.syncMetadata, {
      key: args.key,
      ...r2.config,
    });
    return null;
  },
});

export const getSiteSnapshotUrl = query({
  args: { projectId: v.id("projects") },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== userId) return null;
    if (!project.snapshotKey) return null;
    return await r2.getUrl(project.snapshotKey, { expiresIn: 60 * 30 });
  },
});

export const deleteSiteSnapshot = authedMutation({
  args: { projectId: v.id("projects") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { project } = await requireOwnedProject(ctx, args.projectId);
    if (!project.snapshotKey) return null;
    await r2.deleteObject(ctx, project.snapshotKey);
    await ctx.db.patch(args.projectId, { snapshotKey: undefined });
    return null;
  },
});
