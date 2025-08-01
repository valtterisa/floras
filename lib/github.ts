import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

const ORG = "builddrr-user-sites";
const TEMPLATE_OWNER = "builddrr-user-sites";
const TEMPLATE_REPO = "plain-nextjs-app";

// Read more: https://github.com/orgs/community/discussions/26333
async function waitForRepoReady(octokit: Octokit, org: string, repo: string, timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await octokit.request('GET /repos/{owner}/{repo}', { owner: org, repo });
      return;
    } catch (e) {
      if (e instanceof Error && "status" in e && e.status !== 404) throw e;
      await new Promise(res => setTimeout(res, 1000));
    }
  }
  return;
}

// Set up Octokit with installation authentication
async function getOctokitAsInstallation() {
  const auth = createAppAuth({
    appId: process.env.GITHUB_APP_ID!,
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY!,
    installationId: process.env.GITHUB_APP_INSTALLATION_ID!,
  });

  // Get the installation access token (not a JWT)
  const { token } = await auth({ type: "installation" });
  return new Octokit({ auth: token });
}

export async function createRepoFromTemplate(appName: string): Promise<string> {
  console.log("Creating repo from template", TEMPLATE_REPO, appName);
  const octokit = await getOctokitAsInstallation();
  const { data } = await octokit.request(
    `POST /repos/${TEMPLATE_OWNER}/${TEMPLATE_REPO}/generate`,
    {
      owner: ORG,
      name: appName,
      private: true,
    }
  );
  await waitForRepoReady(octokit, ORG, appName);
  return data.html_url;
}

export async function uploadFilesToRepo(
  repo: string,
  files: Record<string, string> = {}
): Promise<void> {
  console.log("Uploading files to repo", repo);
  const octokit = await getOctokitAsInstallation();
  for (const [path, content] of Object.entries(files)) {
    await octokit.request(`PUT /repos/${ORG}/${repo}/contents/${path}`, {
      owner: ORG,
      repo: repo,
      path: path,
      message: `Add ${path}`,
      content: Buffer.from(content).toString("base64"),
      committer: {
        name: "Builddrr Deploy Bot",
        email: "deploy-bot@builddrr.com",
      },
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  }
}
