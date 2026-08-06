export function sandboxNameForProject(projectId: string): string {
  const cleaned = projectId
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `floras-${cleaned || "site"}`;
}
