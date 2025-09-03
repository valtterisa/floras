"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { SiteHeader } from "@/components/site-header";
import { generateProjectName } from "@/lib/actions/save-project-name";
import { generateAppName } from "@/lib/utils";
import { UpgradeModal } from "@/components/upgrade-modal";
import {
  checkRemainingChatUsage,
  createWebsiteWithLimitCheck,
} from "@/lib/actions/ai-usage";

const examples = [
  {
    name: "Cafe website",
    prompt: "Make a simple website for my cafe",
  },
  {
    name: "Landing page for a software startup",
    prompt: "Make a landing page for my software startup",
  },
  {
    name: "Portfolio website for a photographer",
    prompt: "Make a portfolio website for my photography business",
  },
  {
    name: "Blog website",
    prompt: "Make a blog website for my blog",
  },
];

type CreatePromptClientProps = {
  user: User;
};

export default function CreatePromptClient({ user }: CreatePromptClientProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [usageInfo, setUsageInfo] = useState<{
    hasRemainingUsage: boolean;
    currentUsage: number;
    limit: number;
  }>({
    hasRemainingUsage: true,
    currentUsage: 0,
    limit: 0,
  });
  const router = useRouter();

  // Check usage limits on component mount
  useEffect(() => {
    const checkLimits = async () => {
      const result = await checkRemainingChatUsage();
      setUsageInfo({
        hasRemainingUsage: result.hasRemainingUsage,
        currentUsage: result.currentUsage,
        limit: result.limit,
      });
    };
    checkLimits();
  }, []);

  const promptPlaceholders = [
    "Make a landing page for my new product",
    "I need a website for my cafeteria",
    "Create a landing page for my software startup",
    "Make a cool portfolio for my photography business",
  ];
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [isErasing, setIsErasing] = useState(false);

  // Rotating placeholder effect
  useEffect(() => {
    const currentPrompt = promptPlaceholders[currentPromptIndex];
    let timeout: NodeJS.Timeout;

    if (!isErasing && displayedPlaceholder.length < currentPrompt.length) {
      // Typing
      timeout = setTimeout(() => {
        setDisplayedPlaceholder(
          currentPrompt.slice(0, displayedPlaceholder.length + 1)
        );
      }, 20);
    } else if (
      !isErasing &&
      displayedPlaceholder.length === currentPrompt.length
    ) {
      // Wait before erasing
      timeout = setTimeout(() => {
        setIsErasing(true);
      }, 2000);
    } else if (isErasing && displayedPlaceholder.length > 0) {
      // Erasing
      timeout = setTimeout(() => {
        setDisplayedPlaceholder(
          currentPrompt.slice(0, displayedPlaceholder.length - 1)
        );
      }, 10);
    } else if (isErasing && displayedPlaceholder.length === 0) {
      // Move to next prompt
      timeout = setTimeout(() => {
        setIsErasing(false);
        setCurrentPromptIndex(
          (prevIndex) => (prevIndex + 1) % promptPlaceholders.length
        );
      }, 100);
    }

    return () => clearTimeout(timeout);
  }, [displayedPlaceholder, isErasing, currentPromptIndex, promptPlaceholders]);

  const handleSend = async () => {
    if (isLoading) return;

    if (!prompt.trim()) {
      return;
    }
    if (!user) {
      localStorage.setItem("builddrr_prompt", prompt);
      return;
    }

    setIsLoading(true);
    sessionStorage.setItem("builddrr_generation_prompt", prompt);

    try {
      // Generate unique app_name (slug) and friendly display_name
      const app_name = generateAppName(user.id);
      let display_name: string;

      try {
        const generatedName = await generateProjectName(prompt);
        display_name =
          generatedName && generatedName.length > 0 ? generatedName : app_name;
      } catch (nameError) {
        console.error("Error generating project name:", nameError);
        display_name = app_name;
      }

      // Use server action to create website with usage limit check
      const result = await createWebsiteWithLimitCheck(app_name, display_name);

      if (!result.success) {
        if (result.error?.includes("usage limit exceeded")) {
          setShowUpgradeModal(true);
        } else {
          toast({
            title: "Error",
            description:
              result.error || "Something went wrong. Please try again.",
            variant: "destructive",
          });
        }
        return;
      }

      router.push(`/dashboard/website/${app_name}/editor`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SiteHeader title="Create Website" />
      <div className="h-full w-full flex flex-col items-center justify-center relative">
        <div className="relative z-10 w-full flex flex-col items-center">
          <p className="py-2 text-base md:text-lg text-gray-500 text-center mb-4 max-w-xl">
            Chat with AI to create your website.
          </p>
          <div className="w-full max-w-xl bg-gray-100 rounded-xl shadow p-4 flex flex-col gap-2">
            <textarea
              className="w-full bg-transparent text-gray-900 text-sm md:text-base resize-none outline-none border-none min-h-[5rem] placeholder:text-gray-400"
              placeholder={displayedPlaceholder}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
            />
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2"></div>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  className="rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 shadow h-7 w-7"
                  disabled={!prompt.trim() || isLoading}
                  onClick={handleSend}
                >
                  {isLoading ? (
                    <span className="h-5 w-5 flex items-center justify-center">
                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    </span>
                  ) : (
                    <ArrowUpRight className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-4">
            {examples.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setPrompt(example.prompt)}
              >
                {example.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentUsage={usageInfo.currentUsage}
        limit={usageInfo.limit}
      />
    </>
  );
}
