import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { asProjectId } from "@/lib/convex/ids";
import * as sandbox from "@/lib/sandbox/client";
import { isCanonicalSandboxName } from "@/lib/sandbox/config";
import {
  deleteFlorasCname,
  upsertFlorasCname,
} from "@/lib/cloudflare/dns";
import { deployDistArchive } from "@/lib/cloudflare/deploy-dist";
import {
  addDomain,
  cloudflareConfigured,
  deletePagesProject,
  ensurePagesProject,
  getProjectPublishInfo,
} from "@/lib/cloudflare/pages";
import { AppError } from "@/lib/errors";
import {
  isRetryableSandboxError,
  isRetryableCloudflareError,
  withRetry,
} from "@/lib/publish/retry";
import {
  generateFlorasHostname,
  isFlorasHostname,
  pagesProjectName,
} from "@/lib/publish/types";

export async function runPublish(projectId: string, token: string) {
  const project = await fetchQuery(
    api.projects.get,
    { projectId: asProjectId(projectId) },
    { token }
  );
  if (!project) return;

  const sandboxName =
    typeof project.sandboxName === "string" ? project.sandboxName : undefined;
  if (!sandboxName) {
    await fetchMutation(
      api.projects.setPublishError,
      {
        projectId: asProjectId(projectId),
        error: new AppError(
          "publish",
          "Publish requires a sandbox. Generate the site first."
        ).message,
      },
      { token }
    );
    return;
  }

  if (!isCanonicalSandboxName(projectId, sandboxName)) {
    await fetchMutation(
      api.projects.setPublishError,
      {
        projectId: asProjectId(projectId),
        error: new AppError(
          "publish",
          "Invalid sandbox binding for this project."
        ).message,
      },
      { token }
    );
    return;
  }

  if (!sandbox.sandboxConfigured()) {
    await fetchMutation(
      api.projects.setPublishError,
      { projectId: asProjectId(projectId), error: new AppError("config").message },
      { token }
    );
    return;
  }

  if (!cloudflareConfigured()) {
    await fetchMutation(
      api.projects.setPublishError,
      { projectId: asProjectId(projectId), error: new AppError("config").message },
      { token }
    );
    return;
  }

  const name = pagesProjectName(projectId);
  let createdProjectThisRun = false;
  let florasHost: string | undefined;
  let florasHostIsNew = false;
  let committed = false;

  const claimed = await fetchMutation(
    api.projects.claimPublish,
    { projectId: asProjectId(projectId) },
    { token }
  );
  if (!claimed) return;

  try {
    await withRetry(
      () =>
        sandbox.ensureSandboxReady(sandboxName, {
          projectId,
          token,
        }),
      {
        attempts: 3,
        initialDelayMs: 1000,
        maxDelayMs: 8000,
        label: "ensureSandboxReady",
        retryable: isRetryableSandboxError,
      }
    );

    const ensured = await withRetry(() => ensurePagesProject(name), {
      attempts: 3,
      initialDelayMs: 800,
      maxDelayMs: 6000,
      label: "ensurePagesProject",
      retryable: isRetryableCloudflareError,
    });
    createdProjectThisRun = ensured.created;

    await sandbox.buildSite(sandboxName);
    await sandbox.assertDistPresent(sandboxName);

    const distArchive = await withRetry(
      () => sandbox.exportDistArchive(sandboxName),
      {
        attempts: 2,
        initialDelayMs: 800,
        maxDelayMs: 4000,
        label: "exportDistArchive",
        retryable: isRetryableSandboxError,
      }
    );

    await withRetry(() => deployDistArchive(distArchive, name), {
      attempts: 3,
      initialDelayMs: 1500,
      maxDelayMs: 10000,
      label: "deployDistArchive",
      retryable: isRetryableCloudflareError,
    });

    const existingSubdomain =
      typeof project.cfSubdomain === "string" ? project.cfSubdomain : "";
    florasHostIsNew = !isFlorasHostname(existingSubdomain);
    const host = florasHostIsNew
      ? generateFlorasHostname()
      : existingSubdomain;
    florasHost = host;

    if (florasHostIsNew) {
      const publishInfo = await withRetry(() => getProjectPublishInfo(name), {
        attempts: 4,
        initialDelayMs: 500,
        maxDelayMs: 4000,
        label: "getProjectPublishInfo",
        retryable: isRetryableCloudflareError,
      });

      await withRetry(() => addDomain(name, host), {
        attempts: 3,
        initialDelayMs: 800,
        maxDelayMs: 6000,
        label: "addFlorasSubdomain",
        retryable: isRetryableCloudflareError,
      });

      await withRetry(
        () => upsertFlorasCname(host, publishInfo.subdomain),
        {
          attempts: 3,
          initialDelayMs: 800,
          maxDelayMs: 6000,
          label: "upsertFlorasCname",
          retryable: isRetryableCloudflareError,
        }
      );
    }

    await withRetry(
      () =>
        fetchMutation(
          api.projects.setPublished,
          {
            projectId: asProjectId(projectId),
            cfProjectName: name,
            cfSubdomain: host,
            publishedUrl: `https://${host}`,
            publishedAt: Date.now(),
          },
          { token }
        ),
      {
        attempts: 2,
        initialDelayMs: 300,
        maxDelayMs: 1500,
        label: "setPublished",
        retryable: () => true,
      }
    );
    committed = true;
  } catch (error) {
    if (!committed && florasHost && florasHostIsNew) {
      await withRetry(() => deleteFlorasCname(florasHost!), {
        attempts: 3,
        initialDelayMs: 500,
        maxDelayMs: 4000,
        label: "deleteFlorasCname",
        retryable: isRetryableCloudflareError,
      }).catch((rollbackError) => {
        console.error("Failed to roll back Floras DNS", rollbackError);
      });
    }

    if (createdProjectThisRun && !committed) {
      await withRetry(() => deletePagesProject(name), {
        attempts: 3,
        initialDelayMs: 500,
        maxDelayMs: 4000,
        label: "deletePagesProject",
        retryable: isRetryableCloudflareError,
      }).catch((rollbackError) => {
        console.error("Failed to roll back Cloudflare project", rollbackError);
      });
    }

    const appError = AppError.from(error);
    console.error("Publish failed", {
      projectId,
      code: appError.code,
      detail: appError.detail,
    });
    await fetchMutation(
      api.projects.setPublishError,
      { projectId: asProjectId(projectId), error: appError.message },
      { token }
    ).catch((secondary) => {
      console.error("Failed to set publish error", secondary);
    });
  }
}
