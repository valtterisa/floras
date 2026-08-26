import type { RedesignAnswers } from "@/lib/schema/redesign";

export type UserMe = {
  id: string;
  name: string;
  email: string;
  customInstructions: string;
  hasAnthropicKey: boolean;
};

export type WorkspaceProject = {
  _id: string;
  name: string;
  status: string;
  previewUrl?: string;
  sandboxName?: string;
  snapshotKey?: string;
  error?: string;
  modelId?: string;
  publishStatus?: string;
  publishedUrl?: string;
  publishError?: string;
  cfSubdomain?: string;
  customDomain?: string;
  customDomainStatus?: string;
  planMarkdown?: string;
  designBrief?: string;
  pendingRedesign?: { status: "awaiting_answers" };
  redesignAnswers?: RedesignAnswers;
};
