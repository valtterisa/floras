import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Monitor, Rocket, Smartphone } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

type ViewportSize = "desktop" | "mobile";

function EditorHeader({ id }: { id: string }) {
  const [viewportSize, setViewportSize] = useState<ViewportSize>("desktop");
  const [websiteUrl, setWebsiteUrl] = useState<string | null>(id);

  const { toast } = useToast();

  const handlePublish = async () => {
    toast({
      title: "Deploying website...",
      description: "Please wait while we deploy your website.",
      variant: "default",
    });

    try {
      const deployResult = await fetch("/api/deploy", {
        method: "POST",
        body: JSON.stringify({ appName: id }),
      });

      if (deployResult.ok) {
        toast({
          title: "Success",
          description: "Website deployed successfully.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error deploying website:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deploying.",
        variant: "destructive",
      });
    } finally {
    }
  };

  return (
    <div className="h-10 border-b flex items-center px-4 gap-2">
      <Link href="/dashboard">
        <Button variant="outline" size="icon">
          <LayoutDashboard className="h-3 w-3 mr-1" />
        </Button>
      </Link>

      <div className="flex items-center space-x-2 ml-auto">
        <Button
          variant={viewportSize === "mobile" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewportSize("mobile")}
          title="Mobile view"
        >
          <Smartphone className="h-3 w-3" />
        </Button>

        <Button
          variant={viewportSize === "desktop" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewportSize("desktop")}
          title="Desktop view"
        >
          <Monitor className="h-3 w-3" />
        </Button>

        <Button size="sm" onClick={handlePublish}>
          <Rocket className="h-3 w-3 sm:mr-1" />
          <span className="hidden sm:inline">Publish</span>
        </Button>
      </div>
    </div>
  );
}

export default EditorHeader;
