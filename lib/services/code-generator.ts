import { systemPrompt } from "../prompts/system";
import { lintCode, compileTsCheck, verifyAndRunCode } from "./code-quality";

// @TODO add back vercel ai sdk to generate AI code

export default async function generateWebsiteCode(prompt: string): Promise<string> {
  // Add quality enforcement layer
  const enhancedPrompt = `${systemPrompt}

Implementation Requirements:
1. Each component MUST be implemented exactly as specified
2. Generated code MUST be production-ready with NO TODOs or placeholders
3. All provided colors MUST be used exactly as specified
4. Error handling MUST be implemented for all user interactions
5. Loading states MUST be visually polished with proper animations

${prompt}

Remember: The output must be production-ready, visually stunning, and be able to win design awards.`;

  try {
    const response = await fetch("/api/generate-website", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        temperature: 0.7,
        maxTokens: 4000,
        presencePenalty: 0.6,
        frequencyPenalty: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate website code");
    }

    const data = await response.json();
    const code = data.code;

    // Validate generated code using code quality functions
    const linted = await lintCode(code);
    const compiled = compileTsCheck(code);
    const verified = await verifyAndRunCode(code);

    if (!linted || !compiled || !verified) {
      throw new Error("Generated code failed quality checks");
    }

    return code;
  } catch (error) {
    console.error("Error generating website code:", error);
    throw error;
  }
}
