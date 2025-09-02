import { redis } from "./redis";
import {
  checkRepoExists,
  getRepoFileContent,
  listRepoDirectory,
} from "./github";

const CONTEXT_KEY_PREFIX = "project:ctx:";

function trimContent(content: string, max = 2000): string {
  if (content.length <= max) return content;
  return content.slice(0, max) + "\n/* ...trimmed... */";
}

export async function getProjectContext(
  appName: string
): Promise<string | null> {
  const cacheKey = `${CONTEXT_KEY_PREFIX}${appName}:v1`;

  try {
    // Serve from cache if present
    const cached = await redis.get<string>(cacheKey);
    if (cached) return cached;
  } catch (e) {
    // Non-fatal: proceed to rebuild
  }

  // Confirm repo exists; if not, skip context
  const exists = await checkRepoExists(appName);
  if (!exists) return null;

  const sections: string[] = [];

  async function addFile(path: string, label?: string) {
    const content = await getRepoFileContent(appName, path);
    if (content) {
      sections.push(`File: ${label || path}\n${trimContent(content)}\n---`);
    }
  }

  // Tailwind + CSS
  await addFile("tailwind.config.ts");
  await addFile("app/globals.css");

  // App shell
  await addFile("app/layout.tsx");
  await addFile("app/page.tsx");

  // shadcn config
  await addFile("components.json");

  // UI primitives (sample a few files if present)
  const uiFiles = await listRepoDirectory(appName, "components/ui");
  for (const name of uiFiles.slice(0, 5)) {
    await addFile(`components/ui/${name}`);
  }

  // Theme/provider
  await addFile("components/theme-provider.tsx");

  // Representative site components (sample up to 5)
  const siteFiles = await listRepoDirectory(
    appName,
    "components/site-components"
  );
  for (const name of siteFiles.slice(0, 5)) {
    await addFile(`components/site-components/${name}`);
  }

  // Dependencies snapshot (only for context; trimmed)
  await addFile("package.json");

  const context = sections.join("\n");

  try {
    // Cache for short TTL (e.g., 10 minutes)
    await redis.set(cacheKey, context, { ex: 600 });
  } catch (_) {
    // Ignore cache write errors
  }

  return context;
}

export async function invalidateProjectContext(appName: string) {
  const cacheKey = `${CONTEXT_KEY_PREFIX}${appName}:v1`;
  try {
    await redis.del(cacheKey);
  } catch (_) {}
}
