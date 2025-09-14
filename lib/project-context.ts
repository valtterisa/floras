/**
 * Project Context Management System
 *
 * This module provides essential project context building for AI responses.
 * It includes only the most critical files needed to understand a project's structure.
 *
 * ## Usage Examples
 *
 * ### Basic Usage
 * ```typescript
 * // Get essential project context
 * const context = await getProjectContext('my-app');
 * ```
 *
 * ### Context Statistics
 * ```typescript
 * const stats = await getContextStats('my-app');
 * console.log(`Files: ${stats?.fileCount}, Size: ${stats?.totalSize} bytes`);
 * ```
 *
 * ### Cache Management
 * ```typescript
 * // Invalidate cached context
 * await invalidateProjectContext('my-app');
 * ```
 *
 * ## Included Files
 * - `package.json` - Project dependencies and scripts
 * - `tailwind.config.ts` - Tailwind configuration
 * - `next.config.mjs` - Next.js configuration
 * - `tsconfig.json` - TypeScript configuration
 * - `components.json` - Component library configuration
 * - `app/layout.tsx` - Root layout component
 * - `app/page.tsx` - Home page
 * - `app/globals.css` - Global styles
 */

import { redis } from "./redis";
import {
  checkRepoExists,
  getRepoFileContent,
  listRepoDirectory,
} from "./github";

const CONTEXT_KEY_PREFIX = "project:ctx:";

interface FileInfo {
  path: string;
  content: string;
  importance: number;
  lastModified?: string;
  size: number;
}

interface ProjectContext {
  files: FileInfo[];
  lastUpdated: number;
  version: string;
}

// File importance weights
const FILE_IMPORTANCE_WEIGHTS = {
  // Essential config files
  "package.json": 10,
  "tailwind.config.ts": 9,
  "next.config.mjs": 9,
  "tsconfig.json": 8,
  "components.json": 8,

  // Core app files
  "app/layout.tsx": 10,
  "app/page.tsx": 9,
  "app/globals.css": 8,
  "middleware.ts": 7,

  // Component files
  "components/ui/": 6,
  "components/site-components/": 5,
  "components/": 4,

  // API routes
  "app/api/": 5,

  // Utils and lib
  "lib/": 6,
  "hooks/": 5,

  // Default weight
  "default": 1,
};

function getFileImportance(path: string, size: number): number {
  // Base weight from file type
  let weight = FILE_IMPORTANCE_WEIGHTS.default;

  for (const [pattern, importance] of Object.entries(FILE_IMPORTANCE_WEIGHTS)) {
    if (pattern !== "default" && path.includes(pattern)) {
      weight = importance;
      break;
    }
  }

  // Adjust for file size (smaller files are often more important)
  const sizeFactor = Math.max(0.5, 1 - size / 10000); // Normalize size impact
  weight *= sizeFactor;

  // Boost for recently modified files (if we had that data)
  // This would require additional GitHub API calls for file metadata

  return weight;
}

function smartTrimContent(content: string, maxLength: number): string {
  if (content.length <= maxLength) return content;

  // Try to trim at logical boundaries
  const boundaries = [
    /\n\s*}\s*$/m, // End of function/class
    /\n\s*\/\/.*$/m, // Comment lines
    /\n\s*\/\*[\s\S]*?\*\/\s*$/m, // Block comments
    /\n\s*$/m, // Empty lines
    /\n/m, // Any newline
  ];

  for (const boundary of boundaries) {
    const matches = [...content.matchAll(boundary)];
    for (const match of matches.reverse()) {
      // Start from the end
      const trimmedLength = match.index! + match[0].length;
      if (trimmedLength <= maxLength) {
        return content.slice(0, trimmedLength) + "\n/* ...trimmed... */";
      }
    }
  }

  // Fallback to simple trim
  return content.slice(0, maxLength) + "\n/* ...trimmed... */";
}

/**
 * Gets essential project context for AI responses
 *
 * @param appName - The name of the app/repository to get context for
 * @returns Formatted context string or null if repo doesn't exist
 *
 * @example
 * // Get essential project context
 * const context = await getProjectContext('my-app');
 */
export async function getProjectContext(
  appName: string
): Promise<string | null> {
  const cacheKey = `${CONTEXT_KEY_PREFIX}${appName}:v2`; // Increment version for new format

  try {
    // Try to get cached context
    const cached = await redis.get<ProjectContext>(cacheKey);
    if (cached) {
      // Return cached context
      return formatContextForAI(cached);
    }
  } catch (e) {
    // Non-fatal: proceed to rebuild
  }

  // Confirm repo exists; if not, skip context
  const exists = await checkRepoExists(appName);
  if (!exists) return null;

  const MAX_CONTEXT_SIZE = 50 * 1024; // 50KB max context size
  const files: FileInfo[] = [];
  let currentSize = 0;

  async function addFile(path: string, label?: string): Promise<boolean> {
    if (currentSize > MAX_CONTEXT_SIZE) return false;

    const content = await getRepoFileContent(appName, path);
    if (!content) return true; // Continue even if file doesn't exist

    const importance = getFileImportance(path, content.length);
    const trimmedContent = smartTrimContent(content, 1500); // Increased from 1000
    const section = `File: ${label || path}\n${trimmedContent}\n---`;

    if (currentSize + section.length > MAX_CONTEXT_SIZE) return false;

    files.push({
      path: label || path,
      content: trimmedContent,
      importance,
      size: content.length,
    });

    currentSize += section.length;
    return true;
  }

  // Essential files only (guaranteed inclusion)
  const essentialFiles = [
    "package.json", // Project dependencies and scripts
    "tailwind.config.ts", // Tailwind configuration
    "next.config.mjs", // Next.js configuration
    "tsconfig.json", // TypeScript configuration
    "components.json", // Component library configuration
    "app/layout.tsx", // Root layout component
    "app/page.tsx", // Home page
    "app/globals.css", // Global styles
  ];

  for (const file of essentialFiles) {
    await addFile(file);
  }

  // Sort files by importance for consistent ordering
  files.sort((a, b) => b.importance - a.importance);

  const context: ProjectContext = {
    files,
    lastUpdated: Date.now(),
    version: "v2",
  };

  try {
    // Cache for 15 minutes (increased from 10)
    await redis.set(cacheKey, context, { ex: 900 });
  } catch (_) {
    // Ignore cache write errors
  }

  return formatContextForAI(context);
}

function formatContextForAI(context: ProjectContext): string {
  return context.files
    .map((file) => `File: ${file.path}\n${file.content}\n---`)
    .join("\n");
}

/**
 * Invalidates the cached project context
 *
 * @param appName - The name of the app/repository
 *
 * @example
 * await invalidateProjectContext('my-app');
 */
export async function invalidateProjectContext(appName: string) {
  const cacheKey = `${CONTEXT_KEY_PREFIX}${appName}:v2`;
  try {
    await redis.del(cacheKey);
  } catch (_) {}
}

/**
 * Gets statistics about the cached project context
 *
 * @param appName - The name of the app/repository
 * @returns Context statistics or null if not cached
 *
 * @example
 * const stats = await getContextStats('my-app');
 * console.log(`Context has ${stats?.fileCount} files, ${stats?.totalSize} bytes`);
 */
export async function getContextStats(appName: string): Promise<{
  fileCount: number;
  totalSize: number;
  lastUpdated: number;
  version: string;
} | null> {
  const cacheKey = `${CONTEXT_KEY_PREFIX}${appName}:v2`;

  try {
    const cached = await redis.get<ProjectContext>(cacheKey);
    if (!cached) return null;

    return {
      fileCount: cached.files.length,
      totalSize: cached.files.reduce(
        (sum, file) => sum + file.content.length,
        0
      ),
      lastUpdated: cached.lastUpdated,
      version: cached.version,
    };
  } catch (_) {
    return null;
  }
}
