import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { systemPrompt } from "@/lib/prompts/system";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const { text } = await generateText({
    model: openai("gpt-4"),
    system: systemPrompt,
    prompt: "",
  });

  return Response.json({ text });
}
