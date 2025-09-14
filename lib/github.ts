import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

const ORG = "builddrr-user-sites";
const TEMPLATE_OWNER = "builddrr-user-sites";
const TEMPLATE_REPO = "plain-nextjs-app";

// Read more: https://github.com/orgs/community/discussions/26333
async function waitForRepoReady(
  octokit: Octokit,
  org: string,
  repo: string,
  timeout = 60000
) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const response = await octokit.request(`GET /repos/${org}/${repo}`, {
        owner: org,
        repo,
      });
    } catch (e) {
      if (e instanceof Error && "status" in e && e.status !== 404) throw e;
      console.log(`Waiting for repository ${repo} to be ready...`);
      await new Promise((res) => setTimeout(res, 1000));
    }
  }
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

export async function checkRepoExists(appName: string): Promise<boolean> {
  try {
    const octokit = await getOctokitAsInstallation();
    await octokit.request(`GET /repos/${ORG}/${appName}`, {
      owner: ORG,
      repo: appName,
    });
    console.log(`Repository ${appName} already exists`);
    return true;
  } catch (error: any) {
    if (error.status === 404) {
      console.log(`Repository ${appName} does not exist`);
      return false;
    }
    console.error(`Error checking repository ${appName}:`, error);
    return false;
  }
}

export async function createRepoFromTemplate(appName: string): Promise<string> {
  console.log("Creating repo from template", TEMPLATE_REPO, appName);
  const octokit = await getOctokitAsInstallation();

  try {
    // Defensive: short-circuit if repo already exists
    try {
      await octokit.request(`GET /repos/${ORG}/${appName}`, {
        owner: ORG,
        repo: appName,
      });
      console.log(
        `Repository ${appName} already exists (pre-check), skipping creation`
      );
      return `https://github.com/${ORG}/${appName}`;
    } catch (preErr: any) {
      if (preErr?.status !== 404) {
        console.error(`Pre-check failed for ${appName}:`, preErr);
        throw preErr;
      }
    }

    const { data } = await octokit.request(
      `POST /repos/${TEMPLATE_OWNER}/${TEMPLATE_REPO}/generate`,
      {
        owner: ORG,
        name: appName,
        private: true,
      }
    );

    console.log(
      `Repository ${appName} created successfully, waiting for it to be ready...`
    );
    await waitForRepoReady(octokit, ORG, appName);
    console.log(`Repository ${appName} is now ready for file uploads`);

    return data.html_url;
  } catch (error: any) {
    // Gracefully handle 422 (already exists) from GitHub template generate API
    if (error?.status === 422) {
      console.log(
        `Repository ${appName} likely already exists (422). Skipping create and continuing.`
      );
      return `https://github.com/${ORG}/${appName}`;
    }
    console.error(`Failed to create repository ${appName}:`, error);
    throw error;
  }
}

// Repository is now properly initialized with template content before file uploads

export async function uploadFilesToRepo(
  repo: string,
  files: Record<string, string> = {}
): Promise<void> {
  console.log("Uploading files to repo", repo);
  const octokit = await getOctokitAsInstallation();

  // Process files one at a time to reduce memory usage
  const fileEntries = Object.entries(files);
  for (let i = 0; i < fileEntries.length; i++) {
    const [path, content] = fileEntries[i];

    try {
      // First, try to get the current file's SHA if it exists
      let currentSha: string | undefined;
      try {
        const fileResponse = await octokit.request(
          `GET /repos/${ORG}/${repo}/contents/${path}`,
          {
            owner: ORG,
            repo: repo,
            path: path,
          }
        );
        currentSha = fileResponse.data.sha;
        console.log(`File ${path} exists, current SHA: ${currentSha}`);
      } catch (fileError: any) {
        if (fileError.status === 404) {
          console.log(`File ${path} does not exist, will create new file`);
        } else {
          console.error(`Failed to get file ${path}:`, fileError);
        }
      }

      // Convert content to base64 directly without storing Buffer in memory
      const base64Content = Buffer.from(content).toString("base64");

      // Prepare the request payload
      const payload: any = {
        owner: ORG,
        repo: repo,
        path: path,
        message: currentSha ? `Update ${path}` : `Add ${path}`,
        content: base64Content,
        committer: {
          name: "Builddrr Deploy Bot",
          email: "deploy-bot@builddrr.com",
        },
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      };

      // Add SHA if file exists (required for updates)
      if (currentSha) {
        payload.sha = currentSha;
      }

      await octokit.request(
        `PUT /repos/${ORG}/${repo}/contents/${path}`,
        payload
      );
      console.log(
        `Successfully ${currentSha ? "updated" : "uploaded"} ${path} to ${repo}`
      );

      // Clear the content from memory after processing
      (fileEntries[i] as any)[1] = undefined;

      // Force garbage collection hint (if available)
      if (global.gc) {
        global.gc();
      }
    } catch (error) {
      console.error(`Failed to upload ${path} to ${repo}:`, error);
    }
  }
}

export async function getRepoFileContent(
  repo: string,
  filePath: string
): Promise<string | null> {
  const octokit = await getOctokitAsInstallation();
  try {
    const res = await octokit.request(
      `GET /repos/${ORG}/${repo}/contents/${filePath}`,
      {
        owner: ORG,
        repo,
        path: filePath,
      }
    );
    const data: any = res.data as any;
    if (data && typeof data.content === "string") {
      return Buffer.from(data.content, "base64").toString("utf8");
    }
    return null;
  } catch (error: any) {
    if (error?.status === 404) return null;
    console.error(`Failed to fetch ${filePath} from ${repo}:`, error);
    return null;
  }
}

export async function listRepoDirectory(
  repo: string,
  dirPath: string
): Promise<string[]> {
  const octokit = await getOctokitAsInstallation();
  try {
    const res = await octokit.request(
      `GET /repos/${ORG}/${repo}/contents/${dirPath}`,
      {
        owner: ORG,
        repo,
        path: dirPath,
      }
    );
    const data: any = res.data as any;
    if (Array.isArray(data)) {
      return data.map((entry: any) => String(entry.name));
    }
    return [];
  } catch (error: any) {
    if (error?.status === 404) return [];
    console.error(`Failed to list ${dirPath} in ${repo}:`, error);
    return [];
  }
}
