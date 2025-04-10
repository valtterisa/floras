import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a professional website content generator. Create engaging, SEO-friendly content that converts visitors into customers.",
      },
      { role: "user", content: prompt },
    ],
    model: "gpt-4-turbo-preview",
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error("Failed to generate website content");
  }

  return JSON.parse(content);
}
