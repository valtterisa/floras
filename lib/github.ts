import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

const ORG = "builddrr-user-sites";
const TEMPLATE_OWNER = "builddrr-user-sites";
const TEMPLATE_REPO = "plain-nextjs-app";

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
  const octokit = await getOctokitAsInstallation();
  const repoName = `${appName}`;
  const { data } = await octokit.request(
    `POST /repos/${TEMPLATE_OWNER}/${TEMPLATE_REPO}/generate`,
    {
      owner: ORG,
      name: repoName,
      private: true,
      // Octokit will handle headers and auth automatically
    }
  );
  return data.html_url;
}

export async function uploadFilesToRepo(
  repo: string,
  files: Record<string, string> = {}
): Promise<void> {
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
