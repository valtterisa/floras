import generateWebsiteCode from "@/lib/services/code-generator";

interface GenerateWebsiteParams {
  businessName: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  components: any[];
}

export async function generateWebsite({
  businessName,
  description,
  colors,
  components,
}: GenerateWebsiteParams) {
  const prompt = `Create a professional website content for a business called "${businessName}".

Business Description: ${description}

Color Scheme:
- Primary: ${colors.primary}
- Secondary: ${colors.secondary}
- Accent: ${colors.accent}

The website should include the following components:
${components.map(
    (component: any) => `- ${component.title}: ${component.content}`
  ).join("\n")}
`;

  const generatedContent = await generateWebsiteCode(prompt);
  return generatedContent;
}
