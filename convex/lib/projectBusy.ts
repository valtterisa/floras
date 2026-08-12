export function isProjectBusy(project: {
  status: string;
  publishStatus?: string;
}): boolean {
  return (
    project.status === "provisioning" ||
    project.status === "generating" ||
    project.publishStatus === "publishing"
  );
}
