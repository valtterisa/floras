export type PreviewLogIssue = {
  summary: string;
  snippet: string;
  fingerprint: string;
};

const ERROR_LINE =
  /\b(error|exception|failed to|cannot find module|module not found|syntaxerror|typeerror|referenceerror|eaddrinuse|enoent|uncaught|unhandled)\b/i;

const NOISE = /\b(0 errors?|no error|error boundary|source-map)\b/i;

export function detectPreviewLogErrors(logs: string): PreviewLogIssue | null {
  const lines = logs.split(/\r?\n/);
  const hits: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = (lines[i] ?? "").trim();
    if (line.length < 8 || NOISE.test(line) || !ERROR_LINE.test(line)) continue;
    hits.push(
      ...lines
        .slice(Math.max(0, i - 1), Math.min(lines.length, i + 3))
        .map((l) => l.trimEnd())
        .filter(Boolean)
    );
    if (hits.length >= 20) break;
  }

  if (hits.length === 0) return null;

  const snippet = [...new Set(hits)].slice(-16).join("\n").slice(0, 2_000);
  return {
    summary: snippet.split("\n")[0]!.slice(0, 120),
    snippet,
    fingerprint: snippet.slice(0, 240),
  };
}

export function buildPreviewFixPrompt(issue: PreviewLogIssue): string {
  return [
    "The Astro preview is failing. Fix the site so it boots again. Use read_preview_logs if needed.",
    "",
    "```",
    issue.snippet,
    "```",
  ].join("\n");
}

type FixListener = (prompt: string) => void;
const fixListeners = new Set<FixListener>();

export function requestPreviewFix(prompt: string): void {
  for (const listener of fixListeners) listener(prompt);
}

export function onPreviewFixRequest(listener: FixListener): () => void {
  fixListeners.add(listener);
  return () => {
    fixListeners.delete(listener);
  };
}
