import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { systemPrompt } from "@/lib/prompts/system";

export default async function generateWebsite(prompt: string) {
  // Generate content using AI
  const { text } = await generateText({
    system: systemPrompt,
    prompt: prompt,
    // temperature: 0.7, // Adjust temperature for creativity
    // maxTokens: 3000,
    model: openai("o3-mini-2025-01-31"),
  });

  // Parse the generated content
  const generatedContent = JSON.parse(text);

  return generatedContent.trim();
}
