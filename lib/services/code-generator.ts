import { generateText } from "ai";

import { openai } from "@ai-sdk/openai";

import { systemPrompt } from "@/lib/prompts/system";

export default async function generateWebsite(prompt: string) {
    // Generate content using AI

    const { text } = await generateText({
        system: systemPrompt,
        prompt: prompt,
        temperature: 0.1,
        maxTokens: 50000,
        maxSteps: 5,
        model: openai("o4-mini-2025-04-16"),
    });

    const generatedContent = text;

    return generatedContent.trim();
}
