import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { asMessageId, asProjectId } from "@/lib/convex/ids";
import { buildSiteAgent } from "@/lib/ai/agent";
import { resolveGenerationModel } from "@/lib/billing/resolve-generation-model";
import * as box from "@/lib/box/client";
import { createSandboxSession } from "@/lib/box/sandbox-session";
import { resolveStreamingAssistantId } from "@/lib/generate/resolve-assistant";
import { AppError } from "@/lib/errors";
import type { SitePlan } from "@/lib/schema/site";

export async function runGeneration(projectId: string, token: string) {
  const pid = asProjectId(projectId);
  const project = await fetchQuery(
    api.projects.get,
    { projectId: pid },
    { token }
  );
  if (!project) return;

  const claimed = await fetchMutation(
    api.projects.claimGeneration,
    { projectId: pid },
    { token }
  );
  if (!claimed) return;

  const history = await fetchQuery(
    api.messages.list,
    { projectId: pid },
    { token }
  );

  const existingId = resolveStreamingAssistantId(
    history as Array<{ _id: string; role: string; status: string }>
  );
  const assistantId =
    existingId ??
    (await fetchMutation(
      api.messages.createAssistant,
      { projectId: pid },
      { token }
    ));

  try {
    if (!box.boxConfigured()) {
      throw new AppError("config");
    }

    const initialBoxId =
      typeof project.boxId === "string" ? project.boxId : undefined;
    const previewUrl =
      typeof project.previewUrl === "string" ? project.previewUrl : null;

    await fetchMutation(
      api.projects.setStatus,
      { projectId: pid, status: "generating" },
      { token }
    );

    const sandbox = createSandboxSession({
      projectName: typeof project.name === "string" ? project.name : "site",
      initialBoxId,
      initialSubdomain:
        typeof project.boxSubdomain === "string"
          ? project.boxSubdomain
          : undefined,
      initialPreviewUrl: previewUrl,
      onBox: async (boxId, subdomain) => {
        await fetchMutation(
          api.projects.setBox,
          { projectId: pid, boxId, boxSubdomain: subdomain },
          { token }
        );
      },
      onPreview: async (url) => {
        await fetchMutation(
          api.projects.setPreview,
          { projectId: pid, previewUrl: url },
          { token }
        );
      },
      onStatus: async (status) => {
        await fetchMutation(
          api.projects.setStatus,
          { projectId: pid, status },
          { token }
        );
      },
    });

    const me = await fetchQuery(api.users.me, {}, { token });
    if (!me?.id) {
      throw new AppError("auth");
    }
    const { model } = await resolveGenerationModel({
      customerId: me.id,
      token,
      modelId: typeof project.modelId === "string" ? project.modelId : null,
    });
    const sitePlan =
      project.plan && typeof project.plan === "object"
        ? (project.plan as SitePlan)
        : null;

    const agent = buildSiteAgent({
      sandbox,
      projectId,
      token,
      model,
      hasPreview: Boolean(previewUrl),
      previewUrl,
      sitePlan,
      projectName: typeof project.name === "string" ? project.name : undefined,
      customInstructions:
        typeof me.customInstructions === "string"
          ? me.customInstructions
          : undefined,
      onStep: async (step) => {
        await fetchMutation(
          api.messages.addStep,
          { messageId: asMessageId(assistantId), step },
          { token }
        );
      },
      onPlan: async (plan) => {
        await fetchMutation(
          api.projects.setPlan,
          { projectId: pid, plan },
          { token }
        );
      },
    });

    const convo = (
      history as Array<{ role: string; content: string; status: string }>
    )
      .filter(
        (m) =>
          (m.role === "user" || m.role === "assistant") &&
          m.status === "complete" &&
          m.content.trim().length > 0
      )
      .map((m) => ({
        role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: m.content,
      }));

    const result = await agent.generate({ messages: convo });

    const reasoningText =
      typeof result.reasoningText === "string" ? result.reasoningText.trim() : "";
    if (reasoningText) {
      await fetchMutation(
        api.messages.setReasoning,
        { messageId: asMessageId(assistantId), reasoning: reasoningText },
        { token }
      );
    }

    await fetchMutation(
      api.messages.finish,
      {
        messageId: asMessageId(assistantId),
        content: result.text || "Done.",
        status: "complete",
      },
      { token }
    );
    await fetchMutation(
      api.projects.setStatus,
      { projectId: pid, status: "ready" },
      { token }
    );
  } catch (err) {
    const error = AppError.from(err);
    console.error("Generation failed:", error.detail);
    await fetchMutation(
      api.messages.finish,
      {
        messageId: asMessageId(assistantId),
        content: error.message,
        status: "error",
      },
      { token }
    );
    await fetchMutation(
      api.projects.setError,
      { projectId: pid, error: error.message },
      { token }
    );
  }
}
