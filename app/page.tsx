"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCompletion } from "@ai-sdk/react";

// Predefined prompts for the landing page
const predefinedPrompts = [
  "Generate a cafe website with modern design and a cozy feel.",
  "Generate a portfolio website for a creative professional.",
  "Generate a tech startup website with innovative design.",
  "Generate a blog website for a travel enthusiast.",
];

export default function LandingPage() {
  const router = useRouter();
  const { toast } = useToast();

  const { isLoading, handleSubmit, handleInputChange, input } = useCompletion({
    api: "/api/completion",
    // onError: (error) => {
    //   toast({
    //     title: "Error",
    //     description: error.message,
    //     variant: "destructive",
    //   });
    // },
    // onResponse: (response) => {
    //   toast({
    //     title: "Error",
    //     description: "Failed to generate website.",
    //     variant: "destructive",
    //   });
    // },
  });

  // if (isLoading) {
  //   toast({
  //     title: "Generating website...",
  //     description: "Your website is being generated. Please wait.",
  //   });
  // }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-700" />
          <span className="font-bold text-xl">SiteForge</span>
        </div>
      </header>

      {/* Hero / Landing Section */}
      <main className="container mx-auto px-4 py-10 flex-1">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            Build Your Website with AI
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Describe your business in one prompt and let our AI generate custom
            website templates for you.
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow p-6 mb-6 text-left"
          >
            <Textarea
              name="prompt"
              value={input}
              onChange={handleInputChange}
              id="input"
              placeholder="I run a boutique cafe offering artisanal coffee and pastries. I need a modern, clean design with easy navigation."
              className="min-h-[150px] border-2 p-4 text-base border-gray-200"
            />
            <div className="flex justify-center mt-2">
              <Button disabled={isLoading} className="gap-2 text-white">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating website...
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </div>
          </form>

          <div className="mb-6 flex flex-wrap gap-3 justify-center">
            {predefinedPrompts.map((prompt, idx) => (
              <Button
                key={idx}
                variant="outline"
                // onClick={() => handleGenerateWebsite(prompt)}
                className="text-sm"
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
