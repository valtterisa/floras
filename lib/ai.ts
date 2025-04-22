import { GenerateWebsiteParams, userPrompt } from "./prompts/user";
import { generateServerFiles } from "./server";
import queryAI from "./services/code-generator";

export async function generateWebsite({
  businessName,
  description,
  colors,
  components,
}: GenerateWebsiteParams) {

  const prompt = userPrompt({ businessName, description, colors, components })

  const generatedContent = await queryAI(prompt)

  generateServerFiles(generatedContent)

  console.log("Generated Content:", generatedContent);

  return generatedContent;
}