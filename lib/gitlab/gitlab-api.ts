// Funktiot mitä tarvitaan
// 1. Forkkaa template repo
// 2. Lisää domain repoon
// 3. Lisää files tiettyyn repoon
// 4. Remove files tietystä reposta

const GITLAB_API_URL = "https://gitlab.com/api/v4";

function headers(token: string) {
  return {
    "Content-Type": "application/json",
    "PRIVATE-TOKEN": token,
  };
}

export async function getFile(
  token: string,
  projectId: string,
  filePath: string,
  branch = "main"
) {
  const url = `${GITLAB_API_URL}/projects/${encodeURIComponent(projectId)}/repository/files/${encodeURIComponent(filePath)}?ref=${branch}`;
  const res = await fetch(url, { headers: headers(token) });
  if (!res.ok) throw new Error(`Failed to get file: ${res.statusText}`);
  return res.json();
}

export async function createOrUpdateFile(
  token: string,
  projectId: string,
  filePath: string,
  content: string,
  branch = "main",
  commitMessage = "Update via API"
) {
  // Try to get the file to see if it exists
  let method = "POST";
  let url = `${GITLAB_API_URL}/projects/${encodeURIComponent(projectId)}/repository/files/${encodeURIComponent(filePath)}`;
  try {
    await getFile(token, projectId, filePath, branch);
    method = "PUT";
  } catch (e) {
    // File does not exist, will create
  }
  const res = await fetch(url, {
    method,
    headers: headers(token),
    body: JSON.stringify({
      branch,
      content,
      commit_message: commitMessage,
      encoding: "text",
    }),
  });
  if (!res.ok)
    throw new Error(`Failed to create/update file: ${res.statusText}`);
  return res.json();
}

export async function forkTemplateRepo(
  token: string,
  templateProjectId: string,
  namespace: string,
  newRepoName: string
) {
  const url = `${GITLAB_API_URL}/projects/${encodeURIComponent(templateProjectId)}/fork`;
  const res = await fetch(url, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({
      namespace_path: namespace,
      name: newRepoName,
      path: newRepoName,
    }),
  });
  if (!res.ok) throw new Error(`Failed to fork repo: ${res.statusText}`);
  return res.json();
}

export async function addFilesToRepo(
  token: string,
  projectId: string,
  files: { path: string; content: string }[],
  branch = "main"
) {
  for (const file of files) {
    await createOrUpdateFile(
      token,
      projectId,
      file.path,
      file.content,
      branch,
      "AI-generated update"
    );
  }
}

/**
 * Create a commit with multiple files and actions using the GitLab API.
 * @param token GitLab API token
 * @param projectId Project ID or path
 * @param branch The branch to commit into
 * @param commitMessage The commit message
 * @param actions Array of actions (see GitLab API docs)
 * @param author Optional author info { name, email }
 * @param options Optional: startBranch, startSha, startProject, stats, force
 */
export async function createCommitWithActions(
  token: string,
  projectId: string,
  branch: string,
  commitMessage: string,
  actions: Array<{
    action: "create" | "delete" | "move" | "update" | "chmod";
    file_path: string;
    content?: string;
    previous_path?: string;
    encoding?: "text" | "base64";
    execute_filemode?: boolean;
  }>,
  author?: { name?: string; email?: string },
  options?: {
    startBranch?: string;
    startSha?: string;
    startProject?: string | number;
    stats?: boolean;
    force?: boolean;
  }
) {
  const url = `${GITLAB_API_URL}/projects/${encodeURIComponent(projectId)}/repository/commits`;
  const body: any = {
    branch,
    commit_message: commitMessage,
    actions,
  };
  if (author?.name) body.author_name = author.name;
  if (author?.email) body.author_email = author.email;
  if (options?.startBranch) body.start_branch = options.startBranch;
  if (options?.startSha) body.start_sha = options.startSha;
  if (options?.startProject) body.start_project = options.startProject;
  if (options?.stats !== undefined) body.stats = options.stats;
  if (options?.force !== undefined) body.force = options.force;

  const res = await fetch(url, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed to create commit: ${res.statusText}`);
  return res.json();
}
