"use client";

import { Loader2, MonitorSmartphone } from "lucide-react";
import {
  WebPreview,
  WebPreviewBody,
  WebPreviewNavigation,
  WebPreviewUrl,
} from "@/components/ai-elements/web-preview";
import { Badge } from "@/components/ui/badge";

const STATUS_LABEL: Record<string, string> = {
  draft: "Queued",
  provisioning: "Getting ready",
  generating: "Building",
  ready: "Live",
  error: "Error",
};

export function PreviewPane({
  status,
  previewUrl,
}: {
  status?: string;
  previewUrl?: string;
}) {
  const label = STATUS_LABEL[status ?? "draft"] ?? status;
  const busy = status === "provisioning" || status === "generating" || status === "draft";

  if (!previewUrl) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-card/20 text-center">
        {busy ? (
          <Loader2 className="size-7 animate-spin text-brand" />
        ) : (
          <MonitorSmartphone className="size-7 text-muted-foreground" />
        )}
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            {busy
              ? "Your live preview will appear here in a moment."
              : "The preview is not available yet."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <WebPreview defaultUrl={previewUrl} className="h-full rounded-none border-0">
      <WebPreviewNavigation className="gap-2 px-3">
        <Badge
          variant="outline"
          className="border-brand/40 text-xs font-normal text-brand"
        >
          {label}
        </Badge>
        <WebPreviewUrl readOnly />
      </WebPreviewNavigation>
      <WebPreviewBody src={previewUrl} className="bg-white" />
    </WebPreview>
  );
}
