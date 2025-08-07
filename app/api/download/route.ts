import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import JSZip from "jszip";

// Set up Octokit with installation authentication
async function getOctokitAsInstallation() {
  const auth = createAppAuth({
    appId: process.env.GITHUB_APP_ID!,
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY!,
    installationId: process.env.GITHUB_APP_INSTALLATION_ID!,
  });

  const { token } = await auth({ type: "installation" });
  return new Octokit({ auth: token });
}

const ORG = "builddrr-user-sites";

// Helper to download a repo zip using GitHub API
async function downloadRepo({ repo }: { repo: string }) {
  const octokit = await getOctokitAsInstallation();

  try {
    const response = await octokit.request(
      `GET /repos/${ORG}/${repo}/zipball/main`,
      {
        owner: ORG,
        repo: repo,
        ref: "main",
      }
    );

    // Convert response data to Buffer
    return Buffer.from(response.data as ArrayBuffer);
  } catch (error: any) {
    console.error("GitHub API error:", error);
    if (error.status === 404) {
      throw new Error("Repository not found or access denied");
    }
    throw new Error(`Failed to download repository: ${error.message}`);
  }
}

// Default denylist for redaction
const DEFAULT_DENYLIST: RegExp[] = [
  /(^|\/)\.env(\..*)?$/i,
  /(^|\/)\.git(\/.+)?$/i,
  /(^|\/)\.github(\/.+)?$/i,
  /(^|\/)node_modules(\/.+)?$/i,
  /(^|\/)\.vscode(\/.+)?$/i,
  /(^|\/)\.DS_Store$/,
  // Added explicit infra/runtime files to redact
  /(^|\/)fly\.toml$/i,
  /(^|\/)dockerfile$/i,
  /(^|\/)docker-compose\.ya?ml$/i,
  /(^|\/)docker-entrypoint\.js$/i,
];

function buildExcludeRegexes(extraPatterns?: string[]): RegExp[] {
  const extras: RegExp[] = [];
  if (Array.isArray(extraPatterns)) {
    for (const pattern of extraPatterns) {
      try {
        extras.push(new RegExp(pattern));
      } catch {
        // ignore invalid regex patterns provided by client
      }
    }
  }
  return [...DEFAULT_DENYLIST, ...extras];
}

async function redactZip(
  zipBuffer: Buffer,
  excludeRegexes: RegExp[]
): Promise<Buffer> {
  const sourceZip = await JSZip.loadAsync(zipBuffer);
  const outZip = new JSZip();

  // Determine dynamic top-level folder prefix from GitHub zipball
  // GitHub zipball contains a single top-level folder like: owner-repo-<sha>/
  let topLevelPrefix: string | null = null;
  for (const name of Object.keys(sourceZip.files)) {
    const slashIdx = name.indexOf("/");
    if (slashIdx > 0) {
      topLevelPrefix = name.substring(0, slashIdx + 1); // include trailing slash
      break;
    }
  }

  for (const [name, entry] of Object.entries(sourceZip.files)) {
    if (entry.dir) {
      continue; // directories will be auto-created by JSZip when adding files
    }

    // Compute path relative to repo root (strip dynamic top folder if present)
    const relativePath =
      topLevelPrefix && name.startsWith(topLevelPrefix)
        ? name.substring(topLevelPrefix.length)
        : name;

    if (!relativePath) continue;

    // Check denylist
    const shouldExclude = excludeRegexes.some((re) => re.test(relativePath));
    if (shouldExclude) {
      continue;
    }

    const fileContent = await entry.async("nodebuffer");
    outZip.file(relativePath, fileContent);
  }

  return await outZip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { repo, exclude } = await req.json();
    if (!repo)
      return NextResponse.json({ error: "Missing repo" }, { status: 400 });

    console.log("Downloading repo:", repo);

    const rawZipBuffer = await downloadRepo({ repo });
    const excludeRegexes = buildExcludeRegexes(exclude);
    const zipBuffer = await redactZip(rawZipBuffer, excludeRegexes);

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=builddrr-output.zip`,
      },
    });
  } catch (e: any) {
    console.error("Download error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
