interface GenerateWebsiteParams {
  businessName: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export async function generateWebsite({
  businessName,
  description,
  colors,
}: GenerateWebsiteParams) {
  const prompt = `Create a professional website content for a business called "${businessName}".

Business Description: ${description}

Color Scheme:
- Primary: ${colors.primary}
- Secondary: ${colors.secondary}
- Accent: ${colors.accent}

Generate the following sections:
1. Hero section with a compelling headline and subheadline
2. About section that explains the business
3. Services/Products section
4. Contact section

For each section, provide:
- Title
- Content
- Call to action (if applicable)
- Image suggestions (describe the type of image that would work well)

Format the response as JSON with the following structure:
{
  "sections": [
    {
      "type": "hero",
      "title": "string",
      "content": "string",
      "cta": "string",
      "image": "string"
    },
    ...
  ]
}`;
}
