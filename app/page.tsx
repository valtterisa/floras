"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Loader2, Check, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Predefined prompts for the landing page
const predefinedPrompts = [
  "Generate a cafe website with modern design and a cozy feel.",
  "Generate a portfolio website for a creative professional.",
  "Generate an ecommerce website for fashion products.",
  "Generate a tech startup website with innovative design.",
];

// Since this is quick mode landing page, we'll use default values for other fields.
const initialQuickData = {
  businessName: "My Business",
  industry: "other",
  description: "",
  features: ["about", "services", "contact"],
  designStyle: "modern",
  colorScheme: "purple",
  selectedTemplate: 0,
};

export default function LandingPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [quickPrompt, setQuickPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  // Generate website sections based on provided data and variation
  const generateSections = (
    data: typeof initialQuickData,
    variation: string
  ) => {
    const sections = [];
    sections.push({
      id: `hero-${Date.now()}`,
      type: "hero",
      title:
        variation === "variation1"
          ? `Welcome to ${data.businessName}`
          : variation === "variation2"
          ? `${data.businessName} - Your Business Online`
          : `Discover ${data.businessName}`,
      subtitle:
        variation === "variation1"
          ? data.description
          : variation === "variation2"
          ? `Premium services tailored for you`
          : `${data.description.split(" ").slice(0, 10).join(" ")}...`,
      ctaText:
        variation === "variation1"
          ? "Learn More"
          : variation === "variation2"
          ? "Explore Services"
          : "Get Started",
      ctaLink: "#about",
    });
    // Additional sections (about, services, etc.) could be added here.
    return sections;
  };

  // Simulate generating templates from the provided quick data.
  const generateTemplates = async (dataOverride?: typeof initialQuickData) => {
    setIsLoading(true);
    const data = dataOverride || {
      ...initialQuickData,
      description: quickPrompt,
    };

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const generatedTemplates = [
        {
          id: 1,
          name: `${
            data.designStyle.charAt(0).toUpperCase() + data.designStyle.slice(1)
          } Design`,
          description: `A ${data.designStyle} website focused on ${data.features
            .slice(0, 2)
            .join(" and ")}.`,
          preview: `/placeholder.svg?height=300&width=500&text=Template+1`,
          sections: generateSections(data, "variation1"),
        },
        {
          id: 2,
          name: `${
            data.colorScheme.charAt(0).toUpperCase() + data.colorScheme.slice(1)
          } Accent`,
          description: `A ${data.colorScheme}-themed website for your business.`,
          preview: `/placeholder.svg?height=300&width=500&text=Template+2`,
          sections: generateSections(data, "variation2"),
        },
        {
          id: 3,
          name: "Premium Layout",
          description: `An advanced layout with premium features.`,
          preview: `/placeholder.svg?height=300&width=500&text=Template+3`,
          sections: generateSections(data, "variation3"),
        },
      ];

      setTemplates(generatedTemplates);
      setSelectedTemplate(0);
    } catch (error: any) {
      console.error("Error generating templates:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to generate templates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTemplates = async () => {
    if (!quickPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt describing your business.",
        variant: "destructive",
      });
      return;
    }
    await generateTemplates({
      ...initialQuickData,
      description: quickPrompt,
    });
  };

  const handleContinueWithTemplate = () => {
    const selected = templates[selectedTemplate];
    const websiteData = {
      ...initialQuickData,
      description: quickPrompt,
      selectedTemplate,
      source: "ai",
      createdAt: new Date().toISOString(),
      sections: selected.sections,
    };
    localStorage.setItem("websiteData", JSON.stringify(websiteData));
    router.push("/website/editor");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
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

          {/* Chat-like prompt input */}
          <div className="bg-white rounded-lg shadow p-6 mb-6 text-left">
            <Label htmlFor="quickPrompt" className="text-base font-medium mb-2">
              Your Prompt
            </Label>
            <Textarea
              id="quickPrompt"
              name="quickPrompt"
              placeholder="e.g. I run a boutique cafe offering artisanal coffee and pastries. I need a modern, clean design with easy navigation."
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              className="min-h-[150px] border-2 p-4 text-base border-gray-200"
            />
          </div>

          {/* Predefined prompt buttons */}
          <div className="mb-6 flex flex-wrap gap-3 justify-center">
            {predefinedPrompts.map((prompt, idx) => (
              <Button
                key={idx}
                variant="outline"
                onClick={() => setQuickPrompt(prompt)}
                className="text-sm"
              >
                {prompt}
              </Button>
            ))}
          </div>

          {/* Generate Templates Button */}
          {templates.length === 0 && (
            <div className="flex justify-center">
              <Button
                onClick={handleGenerateTemplates}
                disabled={isLoading}
                className="gap-2 bg-gradient-to-r from-green-500 to-green-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Templates...
                  </>
                ) : (
                  "Generate Templates"
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Template Preview Section */}
        {templates.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-6">
              Select a Template
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {templates.map((template, index) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(index)}
                  className={cn(
                    "rounded-lg border-2 cursor-pointer transition-all overflow-hidden",
                    selectedTemplate === index
                      ? "border-green-500 ring-2 ring-offset-2 ring-green-500"
                      : "border-gray-200 hover:border-green-400"
                  )}
                >
                  <div className="relative">
                    <img
                      src={template.preview || "/placeholder.svg"}
                      alt={template.name}
                      className="w-full h-48 object-cover"
                    />
                    {selectedTemplate === index && (
                      <div className="absolute top-2 right-2 bg-green-600 text-white p-1 rounded-full">
                        <Check className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {template.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleContinueWithTemplate}
                className="gap-2 bg-gradient-to-r from-green-500 to-green-700 text-white"
              >
                Continue with Template
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
