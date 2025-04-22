import { generateText } from "ai";

import { anthropic } from '@ai-sdk/anthropic';

import { systemPrompt } from "@/lib/prompts/system";

export default async function queryAI(prompt: string) {

    const { text } = await generateText({
        system: systemPrompt,
        prompt: prompt,
        temperature: 0,
        model: anthropic("claude-3-7-sonnet-20250219"),
        experimental_continueSteps: true,
        maxRetries: 5,
        maxTokens: 50000
    });

    const generatedContent = text;

    return generatedContent.trim();
}
