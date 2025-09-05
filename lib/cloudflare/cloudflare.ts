"use server";

import Cloudflare from "cloudflare";
import { createServiceClient } from "@/lib/supabase/server";

const client = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_ACCOUNT_TOKEN!,
});

// Create a project
async function createProject(name: string) {
  const project = await client.pages.projects.create({
    account_id: process.env.CLOUDFLARE_ACCOUNT_ID!,
    name: name,
    production_branch: "main",
    build_config: {
      build_command: "npx @cloudflare/next-on-pages@1",
      destination_dir: ".vercel/output/static",
    },
    source: {
      type: "github",
      config: {
        owner: "builddrr-user-sites",
        repo_name: name,
      },
    },
  });

  return project;
}

// create a deployment
async function createDeployment(name: string) {
  const deployment = await client.pages.projects.deployments.create(name, {
    account_id: process.env.CLOUDFLARE_ACCOUNT_ID!,
  });

  return deployment;
}

// add subdomain
async function addSubdomain(name: string) {
  const subdomain = await client.pages.projects.domains.create(name, {
    account_id: process.env.CLOUDFLARE_ACCOUNT_ID!,
    name: `${name}.builddrr.com`,
  });

  // add dns record
  await client.dns.records.create({
    zone_id: process.env.CLOUDFLARE_ZONE_ID!,
    type: "CNAME",
    name: `${name}.builddrr.com`,
    content: `${name}.pages.dev`,
    ttl: 1,
    proxied: false,
  });

  // Poll domain status until it becomes active
  const domainName = `${name}.builddrr.com`;
  let domainStatus = subdomain?.status;

  while (domainStatus !== "active") {
    // Wait 2 seconds before next check
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const domainInfo = await client.pages.projects.domains.get(
        name,
        domainName,
        {
          account_id: process.env.CLOUDFLARE_ACCOUNT_ID!,
        }
      );
      domainStatus = domainInfo?.status;
      console.log(`Domain ${domainName} status: ${domainStatus}`);
    } catch (error) {
      console.error(`Error polling domain status for ${domainName}:`, error);
      return { ok: false, error: "Failed to add subdomain" };
    }
  }

  return subdomain;
}

// delete project
export async function deleteProject(name: string) {
  const project = await client.pages.projects.delete(name, {
    account_id: process.env.CLOUDFLARE_ACCOUNT_ID!,
  });

  return project;
}

export async function createSiteForUser(websiteId: string) {
  try {
    // First, get the website name from the database using the website ID
    const supabase = await createServiceClient();
    const { data: website, error: websiteError } = await supabase
      .from("websites")
      .select("name")
      .eq("id", websiteId)
      .single();

    if (websiteError || !website) {
      console.error("Failed to fetch website:", websiteError);
      return { ok: false, error: "Website not found" };
    }

    const name = website.name;
    const project = await createProject(name);
    const deployment = await createDeployment(name);
    const subdomain = await addSubdomain(name);

    // Check if subdomain was created successfully
    if (subdomain && typeof subdomain === "object" && "name" in subdomain) {
      const deploymentUrl = `https://${subdomain.name}`;

      // Save deployment status to Supabase using the website ID
      try {
        await supabase
          .from("websites")
          .update({
            status: "deployed",
            primary_url: deploymentUrl,
            last_deployed: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("app_name", websiteId);
      } catch (dbError) {
        console.error("Failed to save deployment status to database:", dbError);
        // Don't fail the deployment if saving status fails
      }

      return {
        ok: true,
        project,
        deployment,
        subdomain,
        deploymentUrl,
      };
    }

    return { ok: false, error: "Failed to create subdomain" };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Failed to create site" };
  }
}