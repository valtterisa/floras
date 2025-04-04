import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { systemPrompt } from "@/lib/prompts/system";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const { text } = await generateText({
    model: openai("o3-mini"),
    system: systemPrompt,
    prompt: prompt,
  });

  return Response.json({ text });
}
