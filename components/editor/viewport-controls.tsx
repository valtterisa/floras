import React from "react";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewportControlsProps {
  viewportSize: "desktop" | "tablet" | "mobile";
  setViewportSize: (size: "desktop" | "tablet" | "mobile") => void;
  disabled?: boolean;
}

export function ViewportControls({
  viewportSize,
  setViewportSize,
  disabled = false,
}: ViewportControlsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={viewportSize === "desktop" ? "default" : "outline"}
        size="icon"
        onClick={() => setViewportSize("desktop")}
        title="Desktop view"
        disabled={disabled}
      >
        <Monitor className="h-4 w-4" />
      </Button>
      <Button
        variant={viewportSize === "tablet" ? "default" : "outline"}
        size="icon"
        onClick={() => setViewportSize("tablet")}
        title="Tablet view"
        disabled={disabled}
      >
        <Tablet className="h-4 w-4" />
      </Button>
      <Button
        variant={viewportSize === "mobile" ? "default" : "outline"}
        size="icon"
        onClick={() => setViewportSize("mobile")}
        title="Mobile view"
        disabled={disabled}
      >
        <Smartphone className="h-4 w-4" />
      </Button>
    </div>
  );
}
