"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthModal } from "@/components/auth-modal";
import { generateAppName } from "@/lib/utils";
import Logo from "../logo";

export default function PromptTool() {
  const [prompt, setPrompt] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  const handleSend = async () => {
    if (!prompt.trim()) return;
    // Check auth before proceeding
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      localStorage.setItem("builddrr_prompt", prompt);
      setShowAuthModal(true);
      return;
    }

    const appName = generateAppName(authData.user.id);

    console.log("appName", appName);

    // Store the prompt, appName, and clear steps in localStorage for the editor/chat
    sessionStorage.setItem("builddrr_generation_prompt", prompt);
    sessionStorage.setItem("builddrr_app_name", appName);

    // Instantly redirect to the editor
    router.push(`/dashboard/website/editor/${appName}`);
  };

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

  const promptPlaceholders = [
    "Make a landing page for my new product",
    "I need a website for my cafeteria",
    "Create a landing page for my software startup",
    "Make a cool portfolio for my photography business",
  ];

  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [isErasing, setIsErasing] = useState(false);

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

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white pb-8 pt-8 px-2 relative overflow-hidden">
      {/* Background SVG */}
      <div
        className="absolute left-0 top-0 w-full h-full min-h-[70vh] z-0 pointer-events-none select-none bg-svg-bg"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' width='100%' height='100%' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%23SvgjsMask1026)' fill='none'%3e%3crect width='100%' height='100%' x='0' y='0' fill='rgba(250%2c 242%2c 255%2c 1)'/%3e%3cpath d='M0%2c480.628C92.909%2c485.99%2c198.936%2c477.783%2c264.798%2c412.033C329.633%2c347.308%2c309.085%2c239.972%2c330.331%2c150.857C346.893%2c81.386%2c384.922%2c16.799%2c375.916%2c-54.049C366.836%2c-125.484%2c321.191%2c-183.604%2c280.284%2c-242.867C234.543%2c-309.132%2c196.289%2c-385.948%2c123.32%2c-419.989C46.001%2c-456.059%2c-43.711%2c-450.885%2c-127.118%2c-432.925C-215.012%2c-413.999%2c-313.082%2c-389.45%2c-363.674%2c-315.126C-413.583%2c-241.805%2c-380.594%2c-143.861%2c-384.206%2c-55.24C-387.399%2c23.1%2c-407.281%2c100.449%2c-383.656%2c175.21C-358.133%2c255.977%2c-312.127%2c329.806%2c-245.857%2c382.561C-175.401%2c438.649%2c-89.905%2c475.439%2c0%2c480.628' fill='%23e7c0ff'/%3e%3cpath d='M1440 982.008C1526.015 993.044 1618.17 997.4390000000001 1693.376 954.261 1769.9279999999999 910.3109999999999 1827.1100000000001 832.376 1849.394 746.9639999999999 1870.297 666.846 1828.47 587.526 1810.124 506.784 1793.41 433.223 1786.237 358.523 1746.556 294.367 1701.879 222.13299999999998 1644.713 158.051 1569.744 118.13400000000001 1483.612 72.27300000000002 1379.797 11.783999999999992 1290.741 51.670000000000016 1199.915 92.34899999999999 1192.598 218.02499999999998 1148.033 307.009 1115.104 372.759 1073.429 433.004 1063.283 505.836 1053.1680000000001 578.447 1062.341 651.92 1090.557 719.585 1119.431 788.828 1165.237 849.143 1225.227 894.194 1288.352 941.5989999999999 1361.699 971.961 1440 982.008' fill='white'/%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1026'%3e%3crect width='100%' height='100%' fill='white'/%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e")`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />
      {/* Responsive background-size: cover on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .bg-svg-bg {
            background-size: cover !important;
          }
        }
      `}</style>
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Loading overlay removed; editor/chat will show progress */}
        <h1 className="pt-4 flex items-center text-2xl md:text-5xl font-bold text-gray-900 text-center ">
          Build websites
          <span className="flex items-center">
            <Logo className="md:mx-3 mx-2 h-7 w-7 md:h-16 md:w-16" />
            Builddrr
          </span>
        </h1>
        <p className="py-2 text-base md:text-lg text-gray-500 text-center mb-4 max-w-xl">
          Chat with AI to create your website.
        </p>
        <div className="w-full max-w-xl bg-gray-100 rounded-xl shadow p-4 flex flex-col gap-2">
          <textarea
            className="w-full bg-transparent text-gray-900 text-sm md:text-base resize-none outline-none border-none min-h-[5rem] placeholder:text-gray-400"
            placeholder={displayedPlaceholder}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 px-1 h-7"
              >
                <Paperclip className="h-4 w-4 mr-1" />{" "}
                <span className="text-xs">Attach</span>
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                className="rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 shadow h-7 w-7"
                disabled={!prompt.trim()}
                onClick={handleSend}
              >
                <ArrowUpRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            setTimeout(() => handleSend(), 100); // Try again after auth
          }}
        />
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
  );
}
