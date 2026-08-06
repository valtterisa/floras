import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

/** Strip legacy Box fields and dead ascii.dev preview URLs after Blaxel rename. */
export const stripBoxFields = internalMutation({
  args: {},
  returns: v.object({
    scanned: v.number(),
    updated: v.number(),
  }),
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    let updated = 0;

    for (const project of projects) {
      const row = project as typeof project & {
        boxId?: string;
        boxSubdomain?: string;
      };
      const hasBox =
        row.boxId !== undefined || row.boxSubdomain !== undefined;
      const previewUrl =
        typeof row.previewUrl === "string" ? row.previewUrl : undefined;
      const asciiPreview = Boolean(
        previewUrl?.includes(".on.ascii.dev")
      );

      if (!hasBox && !asciiPreview) continue;

      await ctx.db.replace(row._id, {
        userId: row.userId,
        name: row.name,
        initialPrompt: row.initialPrompt,
        modelId: row.modelId,
        status: row.status,
        busyAt: row.busyAt,
        sandboxName: row.sandboxName,
        previewUrl: asciiPreview ? undefined : row.previewUrl,
        plan: row.plan,
        error: row.error,
        publishStatus: row.publishStatus,
        cfProjectName: row.cfProjectName,
        cfSubdomain: row.cfSubdomain,
        publishedUrl: row.publishedUrl,
        publishedAt: row.publishedAt,
        publishError: row.publishError,
        customDomain: row.customDomain,
        customDomainStatus: row.customDomainStatus,
        customDomainError: row.customDomainError,
        customDomainUpdatedAt: row.customDomainUpdatedAt,
        formPublicKey: row.formPublicKey,
      });
      updated += 1;
    }

    return { scanned: projects.length, updated };
  },
});
