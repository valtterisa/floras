const SECRET_PATTERNS: RegExp[] = [
  /\b(sk-ant-api\d{2}-)[A-Za-z0-9_-]{20,}/gi,
  /\b(sk-[A-Za-z0-9]{20,})/gi,
  /\b(bl_[a-z0-9]{20,})/gi,
  /\b(am_sk_[A-Za-z0-9_]+)/gi,
  /\b(cfat_[A-Za-z0-9]+)/gi,
  /\b(ghp_[A-Za-z0-9]{20,})/gi,
  /\b(github_pat_[A-Za-z0-9_]{20,})/gi,
  /\b(xox[baprs]-[A-Za-z0-9-]{10,})/gi,
  /\b(AKIA[0-9A-Z]{16})/g,
  /\b(Bearer\s+)[A-Za-z0-9._\-+=/]{12,}/gi,
  /\b(token[=:\s]+)[A-Za-z0-9._\-+=/]{12,}/gi,
  /\b(password[=:\s]+)\S+/gi,
  /\b(secret[=:\s]+)\S+/gi,
  /\b(api[_-]?key[=:\s]+)\S+/gi,
  /https?:\/\/[^/\s]*:[^@/\s]+@[^\s]+/gi,
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g,
];

export function redactSandboxLogs(text: string): string {
  let out = text;
  for (const pattern of SECRET_PATTERNS) {
    out = out.replace(pattern, (match, prefix?: string) => {
      if (typeof prefix === "string" && match.startsWith(prefix)) {
        return `${prefix}[redacted]`;
      }
      return "[redacted]";
    });
  }
  return out;
}
