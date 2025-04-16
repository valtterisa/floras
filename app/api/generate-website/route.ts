import { NextRequest, NextResponse } from "next/server";
import generateValidSectionCode from "@/lib/services/code-quality";
import { generateWebsite } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const websiteData = await request.json();

    const generatedContent = await generateWebsite({
      businessName: websiteData.businessInfo.name,
      description: websiteData.businessInfo.description,
      colors: websiteData.design.colors,
      components: websiteData.components,
    });

    return NextResponse.json({ data: generatedContent });
  } catch (error) {
    console.error("Error generating website:", error);
    return NextResponse.json(
      { error: "Failed to generate website content" },
      { status: 500 }
    );
  }
}
