import Cloudflare, {
  NotFoundError,
  APIError,
} from "cloudflare";
import { AppError } from "@/lib/errors";
import type { DomainInfo, DomainStatus, DnsRecord } from "@/lib/publish/types";
import { domainStatusSchema } from "@/lib/publish/types";

export type CloudflareConfig = {
  apiToken: string;
  accountId: string;
  zoneId: string;
};

export type ProjectPublishInfo = {
  projectName: string;
  productionUrl: string;
  subdomain: string;
};

export type EnsurePagesProjectResult = {
  projectName: string;
  created: boolean;
};

export function getCloudflareConfig(): CloudflareConfig {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN?.trim();
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const zoneId = process.env.CLOUDFLARE_ZONE_ID?.trim();
  if (!apiToken || !accountId || !zoneId) {
    throw new AppError(
      "config",
      "Cloudflare publishing is not configured.",
      {
        detail:
          "CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, and CLOUDFLARE_ZONE_ID must be set in the Next.js environment",
      }
    );
  }
  return { apiToken, accountId, zoneId };
}

export function cloudflareConfigured(): boolean {
  return Boolean(
    process.env.CLOUDFLARE_API_TOKEN?.trim() &&
      process.env.CLOUDFLARE_ACCOUNT_ID?.trim() &&
      process.env.CLOUDFLARE_ZONE_ID?.trim()
  );
}

export function getCloudflareClient(): Cloudflare {
  const { apiToken } = getCloudflareConfig();
  return new Cloudflare({ apiToken });
}

function accountId(): string {
  return getCloudflareConfig().accountId;
}

function normalizeSubdomain(subdomain: string): string {
  const trimmed = subdomain.trim().replace(/^https?:\/\//, "");
  if (trimmed.endsWith(".pages.dev")) return trimmed;
  return `${trimmed}.pages.dev`;
}

function productionUrlFromSubdomain(subdomain: string): string {
  return `https://${normalizeSubdomain(subdomain)}`;
}

function mapDomainStatus(status: string): DomainStatus {
  const parsed = domainStatusSchema.safeParse(status);
  if (parsed.success) return parsed.data;
  return "error";
}

type CfDomainPayload = {
  name: string;
  status: string;
  validation_data?: {
    method?: "http" | "txt";
    status?: string;
    error_message?: string;
    txt_name?: string;
    txt_value?: string;
  };
  verification_data?: {
    status?: string;
    error_message?: string;
  };
};

function toDomainInfo(
  payload: CfDomainPayload,
  cnameTarget: string
): DomainInfo {
  const status = mapDomainStatus(payload.status);
  const records: DnsRecord[] = [
    {
      type: "CNAME",
      name: payload.name,
      value: cnameTarget,
      hint:
        payload.name.split(".").length === 2
          ? "Apex domains need ALIAS/ANAME or CNAME flattening at your DNS provider."
          : undefined,
    },
  ];

  const method = payload.validation_data?.method;
  if (
    method === "txt" &&
    payload.validation_data?.txt_name &&
    payload.validation_data?.txt_value
  ) {
    records.push({
      type: "TXT",
      name: payload.validation_data.txt_name,
      value: payload.validation_data.txt_value,
    });
  }

  const errorMessage =
    payload.verification_data?.error_message ||
    payload.validation_data?.error_message ||
    (status === "error" ? "Domain verification failed." : undefined);

  return {
    name: payload.name,
    status,
    cnameTarget,
    records,
    validationMethod: method,
    errorMessage,
  };
}

export async function ensurePagesProject(
  projectName: string
): Promise<EnsurePagesProjectResult> {
  const client = getCloudflareClient();
  const id = accountId();

  try {
    await client.pages.projects.get(projectName, { account_id: id });
    return { projectName, created: false };
  } catch (error) {
    if (!(error instanceof NotFoundError)) {
      throw mapCloudflareError(error, "Could not look up Cloudflare project.");
    }
  }

  try {
    await client.pages.projects.create({
      account_id: id,
      name: projectName,
      production_branch: "main",
    });
    return { projectName, created: true };
  } catch (error) {
    throw mapCloudflareError(error, "Could not create Cloudflare project.");
  }
}

export async function getProjectPublishInfo(
  projectName: string
): Promise<ProjectPublishInfo> {
  const client = getCloudflareClient();
  try {
    const project = await client.pages.projects.get(projectName, {
      account_id: accountId(),
    });
    const rawSubdomain = project.subdomain;
    if (!rawSubdomain || typeof rawSubdomain !== "string") {
      throw new AppError("publish", "Cloudflare project has no public URL yet.", {
        detail: `project ${projectName} missing subdomain`,
      });
    }
    const subdomain = normalizeSubdomain(rawSubdomain);
    return {
      projectName,
      subdomain,
      productionUrl: productionUrlFromSubdomain(subdomain),
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw mapCloudflareError(error, "Could not read Cloudflare project URL.");
  }
}

export async function deletePagesProject(projectName: string): Promise<void> {
  const client = getCloudflareClient();
  try {
    await client.pages.projects.delete(projectName, {
      account_id: accountId(),
    });
  } catch (error) {
    if (error instanceof NotFoundError) return;
    throw mapCloudflareError(error, "Could not delete Cloudflare project.");
  }
}

export async function addDomain(
  projectName: string,
  hostname: string
): Promise<DomainInfo> {
  const client = getCloudflareClient();
  const info = await getProjectPublishInfo(projectName);
  try {
    const domain = await client.pages.projects.domains.create(projectName, {
      account_id: accountId(),
      name: hostname,
    });
    return toDomainInfo(domain, info.subdomain);
  } catch (error) {
    if (error instanceof APIError && error.status === 409) {
      const existing = await getDomain(projectName, hostname);
      if (existing) return existing;
    }
    throw mapCloudflareError(error, "Could not add custom domain.");
  }
}

export async function getDomain(
  projectName: string,
  hostname: string
): Promise<DomainInfo | null> {
  const client = getCloudflareClient();
  const info = await getProjectPublishInfo(projectName);
  try {
    const domain = await client.pages.projects.domains.get(hostname, {
      account_id: accountId(),
      project_name: projectName,
    });
    return toDomainInfo(domain, info.subdomain);
  } catch (error) {
    if (error instanceof NotFoundError) return null;
    throw mapCloudflareError(error, "Could not read custom domain status.");
  }
}

export async function removeDomain(
  projectName: string,
  hostname: string
): Promise<void> {
  const client = getCloudflareClient();
  try {
    await client.pages.projects.domains.delete(hostname, {
      account_id: accountId(),
      project_name: projectName,
    });
  } catch (error) {
    if (error instanceof NotFoundError) return;
    throw mapCloudflareError(error, "Could not remove custom domain.");
  }
}

export function mapCloudflareError(error: unknown, fallback: string): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof APIError) {
    const status = error.status;
    if (status === 401 || status === 403) {
      return new AppError("auth", "Cloudflare authentication failed.", {
        detail: error.message,
        cause: error,
      });
    }
    if (status === 429) {
      return new AppError("rate_limit", undefined, {
        detail: error.message,
        cause: error,
      });
    }
    if (status === 400) {
      return new AppError("domain", fallback, {
        detail: error.message,
        cause: error,
      });
    }
  }
  return new AppError("publish", fallback, {
    detail: error instanceof Error ? error.message : String(error),
    cause: error,
  });
}
