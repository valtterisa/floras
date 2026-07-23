import { AppError } from "@/lib/errors";
import {
  getCloudflareClient,
  getCloudflareConfig,
  mapCloudflareError,
} from "@/lib/cloudflare/pages";
import { isFlorasHostname } from "@/lib/publish/types";

function host(value: string) {
  return value.trim().toLowerCase().replace(/\.$/, "");
}

async function findCnameId(name: string) {
  const client = getCloudflareClient();
  const { zoneId } = getCloudflareConfig();

  try {
    for await (const record of client.dns.records.list({
      zone_id: zoneId,
      type: "CNAME",
      name: { exact: name },
      per_page: 5,
    })) {
      if (record.type === "CNAME" && record.id) return record.id;
    }
  } catch (error) {
    throw mapCloudflareError(error, "Could not look up Floras DNS.");
  }
  return null;
}

export async function upsertFlorasCname(hostname: string, cnameTarget: string) {
  if (!isFlorasHostname(hostname)) {
    throw new AppError("publish", "Could not configure Floras DNS.", {
      detail: `non-Floras host: ${hostname}`,
    });
  }

  const client = getCloudflareClient();
  const { zoneId } = getCloudflareConfig();
  const body = {
    zone_id: zoneId,
    type: "CNAME" as const,
    name: host(hostname),
    content: host(cnameTarget),
    ttl: 1,
    proxied: true,
  };

  try {
    const id = await findCnameId(body.name);
    if (id) await client.dns.records.update(id, body);
    else await client.dns.records.create(body);
  } catch (error) {
    throw mapCloudflareError(error, "Could not configure Floras DNS.");
  }
}

export async function deleteFlorasCname(hostname: string) {
  if (!isFlorasHostname(hostname)) return;

  const id = await findCnameId(host(hostname));
  if (!id) return;

  try {
    await getCloudflareClient().dns.records.delete(id, {
      zone_id: getCloudflareConfig().zoneId,
    });
  } catch (error) {
    throw mapCloudflareError(error, "Could not remove Floras DNS.");
  }
}
