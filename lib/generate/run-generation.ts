import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { asMessageId, asProjectId } from "@/lib/convex/ids";
import { buildOrganizerAgent } from "@/lib/ai/agent";
import { resolveGenerationModel } from "@/lib/billing/resolve-generation-model";
import * as sandbox from "@/lib/sandbox/client";
import { createSandboxSession } from "@/lib/sandbox/session";
import { resolveStreamingAssistantId } from "@/lib/generate/resolve-assistant";
import { AppError } from "@/lib/errors";
import { getSiteUrl } from "@/lib/seo";
import {
  redesignAnswersSchema,
  type RedesignAnswers,
} from "@/lib/schema/redesign";

function stringField(
  value: unknown
): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function parseRedesignAnswers(value: unknown): RedesignAnswers | null {
  const parsed = redesignAnswersSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export async function runGeneration(projectId: string, token: string) {
  const pid = asProjectId(projectId);
  const project = await fetchQuery(
    api.projects.get,
    { projectId: pid },
    { token }
  );
  if (!project) return;

  const history = await fetchQuery(
    api.messages.list,
    { projectId: pid },
    { token }
  );

  const existingId = resolveStreamingAssistantId(
    history as Array<{ _id: string; role: string; status: string }>
  );
  if (!existingId) return;

  const assistantId = existingId;

  try {
    if (!sandbox.sandboxConfigured()) {
      throw new AppError("config");
    }

    const previewUrl = stringField(project.previewUrl) ?? null;

    await fetchMutation(
      api.projects.setStatus,
      { projectId: pid, status: "generating" },
      { token }
    );

    const session = createSandboxSession({
      projectId,
      projectName: stringField(project.name) || "site",
      token,
      initialSandboxName: stringField(project.sandboxName),
      initialPreviewUrl: previewUrl,
      onSandbox: async ({ sandboxName }) => {
        await fetchMutation(
          api.projects.setSandbox,
          { projectId: pid, sandboxName },
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
      modelId: stringField(project.modelId) ?? null,
    });

    const formPublicKey = await fetchMutation(
      api.forms.ensureFormPublicKey,
      { projectId: pid },
      { token }
    );
    const formsSubmitUrl = `${getSiteUrl()}/api/forms/submit`;

    let projectSnap: Doc<"projects"> | null = project;
    const loadProject = async (fresh = false) => {
      if (fresh || !projectSnap) {
        projectSnap = await fetchQuery(
          api.projects.get,
          { projectId: pid },
          { token }
        );
      }
      return projectSnap;
    };

    const agent = buildOrganizerAgent({
      sandbox: session,
      projectId,
      token,
      customerId: me.id,
      model,
      hasPreview: Boolean(previewUrl),
      previewUrl,
      projectName: stringField(project.name),
      customInstructions: stringField(me.customInstructions),
      formPublicKey,
      formsSubmitUrl,
      onStep: async (step) => {
        await fetchMutation(
          api.messages.addStep,
          { messageId: asMessageId(assistantId), step },
          { token }
        );
      },
      loadPlanMarkdown: async () =>
        stringField((await loadProject())?.planMarkdown) ?? null,
      loadDesignBrief: async () =>
        stringField((await loadProject())?.designBrief) ?? null,
      loadRedesignAnswers: async () =>
        parseRedesignAnswers((await loadProject())?.redesignAnswers),
      persistPlan: async (planMarkdown, designBrief) => {
        await fetchMutation(
          api.projects.setPlanMarkdown,
          { projectId: pid, planMarkdown, designBrief },
          { token }
        );
        await loadProject(true);
      },
      requestRedesignIntake: async () => {
        await fetchMutation(
          api.projects.requestRedesignIntake,
          { projectId: pid },
          { token }
        );
        await loadProject(true);
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

    const result = await agent.stream({ messages: convo });

    let full = "";
    let reasoning = "";
    let lastContentPatch = 0;
    let lastReasoningPatch = 0;

    for await (const part of result.stream) {
      if (part.type === "error") {
        const message =
          part.error instanceof Error
            ? part.error.message
            : typeof part.error === "string"
              ? part.error
              : "Generation stream failed";
        throw new Error(message);
      }
      if (part.type === "reasoning-delta") {
        reasoning += part.text;
        const now = Date.now();
        if (now - lastReasoningPatch >= 120) {
          lastReasoningPatch = now;
          await fetchMutation(
            api.messages.setReasoning,
            { messageId: asMessageId(assistantId), reasoning },
            { token }
          );
        }
      } else if (part.type === "text-start") {
        if (full.trim().length > 0 && !/\n\n$/.test(full)) {
          full = `${full.replace(/\s*$/, "")}\n\n`;
        }
      } else if (part.type === "text-delta") {
        full += part.text;
        const now = Date.now();
        if (now - lastContentPatch >= 120) {
          lastContentPatch = now;
          await fetchMutation(
            api.messages.setContent,
            { messageId: asMessageId(assistantId), content: full },
            { token }
          );
        }
      }
    }

    const reasoningText =
      reasoning.trim() || ((await result.reasoningText) ?? "").trim();
    if (reasoningText) {
      await fetchMutation(
        api.messages.setReasoning,
        { messageId: asMessageId(assistantId), reasoning: reasoningText },
        { token }
      );
    }

    const finalText = full || (await result.text) || "Done.";
    await fetchMutation(
      api.messages.finish,
      {
        messageId: asMessageId(assistantId),
        content: finalText,
        status: "complete",
      },
      { token }
    );
    await fetchMutation(
      api.projects.setStatus,
      { projectId: pid, status: "ready" },
      { token }
    );

    const sandboxName = session.currentSandboxName();
    if (sandboxName) {
      try {
        const { snapshotSiteToR2 } = await import(
          "@/lib/sandbox/site-persistence"
        );
        await snapshotSiteToR2(sandboxName, projectId, token);
      } catch (error) {
        console.error("[r2] post-generation snapshot failed", {
          projectId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
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
