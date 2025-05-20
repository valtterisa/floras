"use client";

import { Loader2 } from "lucide-react";

export default function Loading({
  message = "Loading your dashboard...",
}: {
  message?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-sidebar/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <Loader2
          className="h-14 w-14 text-purple-600 animate-spin"
          aria-hidden="true"
        />
        <span className="text-3xl font-bold text-purple-900 tracking-tight drop-shadow-lg select-none">
          SiteForge
        </span>
        <span className="text-lg text-purple-700 animate-pulse" role="status">
          {message}
        </span>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
