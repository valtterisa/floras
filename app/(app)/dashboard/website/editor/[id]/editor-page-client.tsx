"use client";

import { generateAIResponse, processChatMessage } from "@/app/actions";
import ChatInterface from "@/components/chat/chat-interface";
import { createAppAndAssignMachine } from "@/lib/fly";
import { redis } from "@/lib/redis";
import {
  generateAppName,
  getMockAIResponse,
  parseAIResponse,
} from "@/lib/utils";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import {
  ChevronLeft,
  Edit,
  Eye,
  Loader2,
  Monitor,
  Rocket,
  Smartphone,
} from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import WebsitePreview from "@/components/editor/website-preview";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { deployWebsite } from "@/lib/fly";

type ViewportSize = "desktop" | "mobile";

type GenerationStatus =
  | "idle"
  | "thinking"
  | "generating"
  | "deploying"
  | "polling"
  | "ready";

export default function EditorPageClient({
  id,
  user,
  machine,
}: {
  id: string;
  user: any;
  machine: any;
}) {
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [appName, setAppName] = useState<string>("");
  const [viewportSize, setViewportSize] = useState<ViewportSize>("desktop");
  const [isEditMode, setIsEditMode] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState<string | null>(id);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const [machineData, setMachineData] = useState<any>(machine);

  useEffect(() => {
    setMachineData(machine);
  }, [machine]);

  const handleGoLive = async () => {
    toast({
      title: "Deploying website...",
      description: "Please wait while we deploy your website.",
      variant: "default",
    });

    setIsLoading(true);

    try {
      const deployResult = await deployWebsite(id);

      if (!deployResult.success) {
        toast({
          title: "Error",
          description: deployResult.error || "Failed to deploy the website.",
          variant: "destructive",
        });
        return;
      }

      if (deployResult.data?.url) {
        setWebsiteUrl(deployResult.data.url);
      }

      toast({
        title: "Success",
        description:
          deployResult.data?.message || "Website deployed successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deploying website:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deploying.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const runGeneration = async () => {
      const prompt = sessionStorage.getItem("siteforge_generation_prompt");
      if (!prompt) {
        toast({
          title: "Error Creating Website",
          description: "No prompt found. Please try again.",
        });
        return;
      }

      const generatedAppName = generateAppName(user.user.id);
      setAppName(generatedAppName);

      const result = await generateSite(
        prompt,
        (status) => setStatus(status as GenerationStatus),
        user.user.id,
        generatedAppName
      );

      if (result?.success) {
        toast({
          title: "Website Created",
          description: "Your website has been created and is ready to use.",
        });
      } else {
        toast({
          title: "Deployment Error",
          description: "Something went wrong during deployment.",
        });
      }
    };

    // @TODO: Rewise this solution.
    // We need to check if project exists in the supabase db before creating.
    // Also we need supabase db stuff to this too
    const loadExistingWebsite = async () => {
      try {
        // Check if this website already exists in Redis
        const existingAppNames = await redis.keys(`vfs:${user.user.id}:*`);

        if (existingAppNames && existingAppNames.length > 0) {
          // Extract app name from the key
          const appNameKey = existingAppNames[0];
          const extractedAppName = appNameKey.split(":")[2];
          setAppName(extractedAppName);
          setStatus("ready");
        }
      } catch (error) {
        console.error("Error loading existing website:", error);
      }
    };

    // If we have a website ID that's not "new", try to load existing website
    if (id !== "new") {
      loadExistingWebsite();
    } else {
      runGeneration();
    }
  }, [id, user.user.id]);

  const handleSendMessage = async (message: string) => {
    try {
      // Process the message using server action
      if (appName) {
        const response = await processChatMessage(
          user.user.id,
          appName,
          message
        );
        return response;
      }
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  return (
    <div className="flex flex-row gap-4 h-full rounded-3xl">
      <div className="md:w-[500px] flex flex-col h-full">
        <ChatInterface
          status={status}
          onSendMessage={handleSendMessage}
          appName={appName}
          userId={user.user.id}
        />
      </div>
      <div className="flex-1">
        <div className="flex flex-col h-full bg-background rounded-3xl">
          <div className="h-14 border-b flex items-center px-4 gap-2">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Dashboard
              </Button>
            </Link>

            <Button
              variant={isEditMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditMode(!isEditMode)}
              title={isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
            >
              {isEditMode ? (
                <Eye className="h-4 w-4 mr-1" />
              ) : (
                <Edit className="h-4 w-4 mr-1" />
              )}
              Edit
            </Button>

            <div className="flex items-center space-x-2 ml-auto">
              <Button
                variant={viewportSize === "mobile" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewportSize("mobile")}
                title="Mobile view"
              >
                <Smartphone className="h-4 w-4" />
              </Button>

              <Button
                variant={viewportSize === "desktop" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewportSize("desktop")}
                title="Desktop view"
              >
                <Monitor className="h-4 w-4" />
              </Button>

              <Button size="sm" onClick={handleGoLive}>
                <Rocket className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Go Live</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-1 h-full">
            <div className="flex-1 min-w-0 h-full">
              <WebsitePreview
                isEditMode={isEditMode}
                initialUrl={websiteUrl || undefined}
                id={id}
                machine={machineData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateSite(
  prompt: string,
  setStatus: (status: string) => void,
  userId: string,
  appName: string
) {
  setStatus("thinking");

  setStatus("generating");
  //   const aiResponse = await generateAIResponse(prompt);
  const aiResponse = await getMockAIResponse(); // USING MOCK RESPONSE
  const files = await parseAIResponse(aiResponse);

  console.log("files: ", files);

  await redis.set(`prompt:${userId}:${appName}`, prompt);
  await redis.set(`vfs:${userId}:${appName}`, JSON.stringify(files));

  // Initialize chat history with system message
  const chatKey = `chat:${userId}:${appName}`;
  const initialMessage = {
    content: prompt,
    isUser: true,
    timestamp: new Date().toISOString(),
  };
  await redis.rpush(chatKey, JSON.stringify(initialMessage));

  setStatus("deploying");
  const result = await createAppAndAssignMachine(userId, appName, files);

  setStatus("polling");

  // Poll the app and machine
  setStatus("ready");

  return result;
}
