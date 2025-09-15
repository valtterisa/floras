"use client";

import { Preview as PreviewComponent } from "@/components/preview/preview";
import { useSandboxStore } from "../../app/state";

interface Props {
  className?: string;
}

export function Preview({ className }: Props) {
  const { status, url, urlUUID } = useSandboxStore();
  console.log(status, url, urlUUID);
  return (
    <PreviewComponent
      key={urlUUID}
      className={className}
      disabled={status === "stopped"}
      url={url}
    />
  );
}
